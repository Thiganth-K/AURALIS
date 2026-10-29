import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireAdmin } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export const instant = false;
export const maxDuration = 120;

// Configure Cloudinary if credentials exist
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY.trim(),
    api_secret: process.env.CLOUDINARY_API_SECRET.trim(),
    secure: true,
  });
}

const ALLOWED_AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".ogg", ".flac", ".aac"];
const ALLOWED_VIDEO_EXTENSIONS = [".mp4", ".webm", ".mkv", ".mov"];
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_VIDEO_SIZE = 250 * 1024 * 1024; // 250MB
const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce authentication (any authenticated user can upload artwork/avatar)
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please log in to upload files" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const filename = file.name;
    const ext = path.extname(filename).toLowerCase();
    const size = file.size;

    // Auto-detect or sanitize media type based on extension or client request
    const rawType = (formData.get("type") as string) || (formData.get("resourceType") as string) || "";
    let type = rawType.toLowerCase().trim();

    if (!type || type === "image" || type === "video") {
      if (ALLOWED_AUDIO_EXTENSIONS.includes(ext)) {
        type = "audio";
      } else if (ALLOWED_VIDEO_EXTENSIONS.includes(ext)) {
        type = "video";
      } else if (ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
        type = "artwork";
      } else {
        type = "artwork";
      }
    }

    // Audio & Video master signal uploads require admin authorization
    if ((type === "audio" || type === "video") && user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required for master media signals" },
        { status: 403 }
      );
    }

    // 2. Validate file type and size
    if (type === "audio") {
      if (!ALLOWED_AUDIO_EXTENSIONS.includes(ext) && !ALLOWED_VIDEO_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported audio format. Allowed: ${ALLOWED_AUDIO_EXTENSIONS.join(", ")}`,
          },
          { status: 400 }
        );
      }
      if (size > MAX_AUDIO_SIZE) {
        return NextResponse.json(
          { success: false, error: "Audio file exceeds 100MB limit" },
          { status: 400 }
        );
      }
    } else if (type === "video") {
      if (!ALLOWED_VIDEO_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported video format. Allowed: ${ALLOWED_VIDEO_EXTENSIONS.join(", ")}`,
          },
          { status: 400 }
        );
      }
      if (size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          { success: false, error: "Video file exceeds 250MB limit" },
          { status: 400 }
        );
      }
    } else {
      if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported image format. Allowed: ${ALLOWED_IMAGE_EXTENSIONS.join(", ")}`,
          },
          { status: 400 }
        );
      }
      if (size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { success: false, error: "Image exceeds 15MB limit" },
          { status: 400 }
        );
      }
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET?.trim();

    // 3. Attempt Cloudinary Cloud Upload
    if (cloudName) {
      try {
        // A. If an unsigned upload preset is provided, use direct REST API
        if (uploadPreset) {
          const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${
            type === "audio" || type === "video" ? "video" : "image"
          }/upload`;

          const cloudFormData = new FormData();
          const blob = new Blob([buffer]);
          cloudFormData.append("file", blob, filename);
          cloudFormData.append("upload_preset", uploadPreset);
          cloudFormData.append("folder", `auralis/${type}`);

          const cloudRes = await fetch(endpoint, {
            method: "POST",
            body: cloudFormData,
          });

          if (cloudRes.ok) {
            const data = await cloudRes.json();
            return NextResponse.json({
              success: true,
              url: data.secure_url,
              filename,
              size,
              type,
              provider: "cloudinary",
            });
          }
        }

        // B. Otherwise try signed SDK stream upload
        const resourceType = type === "audio" || type === "video" ? "video" : "image";
        const cloudResult = await new Promise<UploadApiResponse>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `auralis/${type}`,
              resource_type: resourceType,
            },
            (error, result) => {
              if (error) reject(error);
              else if (result) resolve(result);
              else reject(new Error("Cloudinary upload produced no result"));
            }
          );
          stream.end(buffer);
        });

        if (cloudResult && cloudResult.secure_url) {
          return NextResponse.json({
            success: true,
            url: cloudResult.secure_url,
            filename,
            size,
            type,
            provider: "cloudinary",
          });
        }
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, falling back to local storage:", cloudErr);
      }
    }

    // 4. Safe fallback: Local filesystem storage
    const uniqueId = crypto.randomBytes(12).toString("hex");
    const safeFilename = `${uniqueId}${ext}`;
    const targetDir = path.join(process.cwd(), "public", "uploads", type);
    await fs.mkdir(targetDir, { recursive: true });

    const filePath = path.join(targetDir, safeFilename);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${type}/${safeFilename}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      size,
      type,
      provider: "local",
    });
  } catch (error) {
    console.error("API /api/upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Upload processing failed",
      },
      { status: 500 }
    );
  }
}
