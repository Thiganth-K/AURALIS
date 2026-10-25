import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

export const instant = false;

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

const ALLOWED_AUDIO_EXTENSIONS = [".mp3", ".wav", ".m4a", ".ogg"];
const ALLOWED_IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce admin authorization
    const admin = await requireAdmin(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "artwork";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const filename = file.name;
    const ext = path.extname(filename).toLowerCase();
    const size = file.size;

    // 2. Validate file type and size
    if (type === "audio") {
      if (!ALLOWED_AUDIO_EXTENSIONS.includes(ext)) {
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
            type === "audio" ? "video" : "image"
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
        const resourceType = type === "audio" ? "video" : "image";
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
