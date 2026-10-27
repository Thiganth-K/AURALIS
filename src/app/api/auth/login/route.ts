import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { verifyPassword, createSessionToken, AUTH_COOKIE_NAME, ensureAdminUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_CREDENTIALS", message: "Email and password are required" },
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedEmail = email.toLowerCase().trim();
    const envAdminEmail = (process.env.ADMIN_EMAIL || "admin@auralis.app").toLowerCase().trim();
    const envAdminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // 1. Direct env-based Admin authentication check
    if (normalizedEmail === envAdminEmail && password === envAdminPassword) {
      const adminUser = await ensureAdminUser();
      if (adminUser) {
        const token = await createSessionToken({
          userId: adminUser._id.toString(),
          role: "admin",
          email: adminUser.email,
          name: adminUser.name,
        });

        const response = NextResponse.json({
          success: true,
          data: {
            id: adminUser._id.toString(),
            name: adminUser.name,
            email: adminUser.email,
            role: "admin",
            status: "active",
            avatar: adminUser.avatar,
          },
        });

        response.cookies.set(AUTH_COOKIE_NAME, token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
      }
    }

    // 2. Database user lookup
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
        },
        { status: 401 }
      );
    }

    // 3. Status checks (pending, rejected, suspended)
    if (user.status === "pending") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCOUNT_PENDING",
            message: "Your registration is awaiting admin approval. Please check back later.",
          },
        },
        { status: 403 }
      );
    }

    if (user.status === "rejected") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCOUNT_REJECTED",
            message: "Your registration request has been rejected by an administrator.",
          },
        },
        { status: 403 }
      );
    }

    if (user.status === "suspended") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCOUNT_SUSPENDED",
            message: "Your account has been suspended. Please contact support.",
          },
        },
        { status: 403 }
      );
    }

    if (user.status !== "active") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "ACCOUNT_INACTIVE",
            message: "Your account is not active.",
          },
        },
        { status: 403 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
        },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("API /api/auth/login error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Failed to log in",
        },
      },
      { status: 500 }
    );
  }
}
