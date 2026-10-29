import { NextRequest, NextResponse } from "next/server";
import {
  getSessionUser,
  createSessionToken,
  AUTH_COOKIE_NAME,
  verifyPassword,
  hashPassword,
} from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      const response = NextResponse.json(
        {
          success: false,
          error: { code: "UNAUTHORIZED", message: "Not authenticated" },
        },
        { status: 401 }
      );
      response.cookies.delete(AUTH_COOKIE_NAME);
      return response;
    }

    // Refresh cookie with current user state (ensures newly seeded user IDs sync)
    const token = await createSessionToken({
      userId: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      data: user,
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("API /api/auth/me error:", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: "UNAUTHORIZED", message: "Not authenticated" },
      },
      { status: 401 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please log in to update your profile" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, avatar, currentPassword, newPassword } = body;

    await connectToDatabase();
    const userDoc = await User.findById(sessionUser.id);
    if (!userDoc) {
      return NextResponse.json(
        { success: false, error: "User profile not found" },
        { status: 404 }
      );
    }

    // If changing password, verify old password first
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }
      const isMatch = await verifyPassword(currentPassword, userDoc.passwordHash);
      if (!isMatch) {
        return NextResponse.json(
          { success: false, error: "Incorrect current password" },
          { status: 400 }
        );
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }
      userDoc.passwordHash = await hashPassword(newPassword);
    }

    if (typeof name === "string" && name.trim().length >= 2) {
      userDoc.name = name.trim();
    }

    if (typeof avatar === "string") {
      userDoc.avatar = avatar.trim();
    }

    await userDoc.save();

    const updatedUser = {
      id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      status: userDoc.status,
      avatar: userDoc.avatar || "",
    };

    // Reissue updated session cookie
    const token = await createSessionToken({
      userId: updatedUser.id,
      role: updatedUser.role,
      email: updatedUser.email,
      name: updatedUser.name,
    });

    const response = NextResponse.json({
      success: true,
      data: updatedUser,
      message: "Profile updated successfully",
    });

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("API PATCH /api/auth/me error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update profile",
      },
      { status: 500 }
    );
  }
}
