import { NextResponse } from "next/server";
import { getSessionUser, createSessionToken, AUTH_COOKIE_NAME } from "@/lib/auth";

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
