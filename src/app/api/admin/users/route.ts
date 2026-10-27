import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, hashPassword } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User, AdminAudit } from "@/models";

export const instant = false;

export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";

    const filter: Record<string, unknown> = {};
    if (query.trim()) {
      const regex = new RegExp(query.trim(), "i");
      filter.$or = [{ name: regex }, { email: regex }];
    }
    if (role && (role === "user" || role === "admin")) {
      filter.role = role;
    }
    if (status && ["active", "suspended", "pending", "rejected"].includes(status)) {
      filter.status = status;
    }

    const [users, pendingCount] = await Promise.all([
      User.find(filter)
        .sort({ createdAt: -1 })
        .select("-passwordHash")
        .lean(),
      User.countDocuments({ status: "pending" }),
    ]);

    const formattedUsers = users.map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status,
      likedCount: u.likedSongs?.length || 0,
      avatar: u.avatar || "",
      createdAt: u.createdAt,
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers,
      data: formattedUsers,
      pendingCount,
    });
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && (error as { digest: string }).digest === "NEXT_PRERENDER_INTERRUPTED") {
      throw error;
    }
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load users",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await requireAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, and password (min 6 chars) are required",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const userRole = role === "admin" ? "admin" : "user";

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: userRole,
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    });

    await AdminAudit.create({
      adminId: adminUser._id,
      action: "USER_CREATED",
      resourceType: "user",
      resourceId: newUser._id.toString(),
      details: { email: newUser.email, role: newUser.role },
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create user",
      },
      { status: 500 }
    );
  }
}
