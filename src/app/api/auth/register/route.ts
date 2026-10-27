import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword, createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Name is required" } },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "A valid email is required" } },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "VALIDATION_ERROR", message: "Password must be at least 6 characters" },
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@auralis.app").toLowerCase().trim();

    if (normalizedEmail === envAdminEmail) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RESERVED_EMAIL",
            message: "This is a reserved administrative email address. Please sign in.",
          },
        },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "DUPLICATE_EMAIL", message: "An account with this email already exists" },
        },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    // New registrations are created with status: "pending" awaiting admin approval
    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: "user",
      status: "pending",
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80`,
    });

    return NextResponse.json({
      success: true,
      pendingApproval: true,
      message: "Registration request submitted. Awaiting administrator approval.",
      data: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        status: newUser.status,
        avatar: newUser.avatar,
      },
    });
  } catch (error) {
    console.error("API /api/auth/register error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Failed to register",
        },
      },
      { status: 500 }
    );
  }
}
