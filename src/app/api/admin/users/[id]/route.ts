import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User, AdminAudit } from "@/models";
import mongoose from "mongoose";

export const instant = false;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await requireAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user id" },
        { status: 404 }
      );
    }

    await connectToDatabase();
    const user = await User.findById(id).select("-passwordHash").lean();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar || "",
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to load user",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await requireAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user id" },
        { status: 404 }
      );
    }

    // Guard: Prevent admin from suspending themselves
    if (adminUser.id === id) {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot change your own status",
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { status, role } = body;

    await connectToDatabase();
    const updateData: Record<string, unknown> = {};
    if (status && ["active", "suspended", "pending", "rejected"].includes(status)) {
      updateData.status = status;
    }
    if (role && (role === "user" || role === "admin")) {
      updateData.role = role;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true })
      .select("-passwordHash")
      .lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const auditAction =
      status === "active"
        ? "USER_APPROVED"
        : status === "rejected"
        ? "USER_REJECTED"
        : status
        ? `USER_${status.toUpperCase()}`
        : "USER_UPDATED";

    await AdminAudit.create({
      adminId: new mongoose.Types.ObjectId(adminUser.id),
      action: auditAction,
      resourceType: "user",
      resourceId: id,
      details: updateData,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        status: updatedUser.status,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update user",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminUser = await requireAdmin(request);
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid user id" },
        { status: 404 }
      );
    }

    // Guard: Prevent admin from deleting themselves
    if (adminUser.id === id) {
      return NextResponse.json(
        {
          success: false,
          error: "You cannot delete your own account",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    await AdminAudit.create({
      adminId: adminUser._id,
      action: "USER_DELETED",
      resourceType: "user",
      resourceId: id,
      details: { email: deleted.email },
    });

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete user",
      },
      { status: 500 }
    );
  }
}
