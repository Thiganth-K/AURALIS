import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import mongoose from "mongoose";

const AUTH_COOKIE_NAME = "auralis_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "auralis-super-secret-development-jwt-key-2026-min-32-chars"
);

export interface SessionPayload {
  userId: string;
  role: "user" | "admin";
  email: string;
  name: string;
}

export interface SessionUser {
  id: string;
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: "user" | "admin";
  status: "active" | "suspended" | "pending" | "rejected";
  avatar?: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      role: payload.role as "user" | "admin",
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export async function ensureAdminUser(): Promise<any> {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@auralis.app").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "Auralis Admin";

  await connectToDatabase();
  let admin = await User.findOne({ email: adminEmail });
  const passwordHash = await hashPassword(adminPassword);

  if (!admin) {
    admin = await User.create({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "admin",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    });
  } else {
    let needsSave = false;
    if (admin.role !== "admin") {
      admin.role = "admin";
      needsSave = true;
    }
    if (admin.status !== "active") {
      admin.status = "active";
      needsSave = true;
    }
    const isPwValid = await verifyPassword(adminPassword, admin.passwordHash);
    if (!isPwValid) {
      admin.passwordHash = passwordHash;
      needsSave = true;
    }
    if (needsSave) {
      await admin.save();
    }
  }

  return admin;
}

export async function getSessionUser(req?: NextRequest): Promise<SessionUser | null> {
  try {
    let token: string | undefined;
    if (req) {
      token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    }
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    }
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload) {
      return null;
    }

    await connectToDatabase();
    let userDoc = mongoose.Types.ObjectId.isValid(payload.userId)
      ? await User.findById(payload.userId).lean()
      : null;

    // Fallback: If database was cleaned or reseeded, resolve by email
    if (!userDoc && payload.email) {
      userDoc = await User.findOne({ email: payload.email }).lean();
    }

    if (!userDoc || userDoc.status !== "active") {
      return null;
    }

    return {
      id: userDoc._id.toString(),
      _id: userDoc._id as mongoose.Types.ObjectId,
      name: userDoc.name,
      email: userDoc.email,
      role: userDoc.role,
      status: userDoc.status,
      avatar: userDoc.avatar || "",
    };
  } catch {
    return null;
  }
}

export async function requireAuth(req?: NextRequest): Promise<SessionUser | null> {
  const user = await getSessionUser(req);
  if (!user || user.status !== "active") {
    return null;
  }
  return user;
}

export async function requireAdmin(req?: NextRequest): Promise<SessionUser | null> {
  const user = await getSessionUser(req);
  if (!user || user.role !== "admin" || user.status !== "active") {
    return null;
  }
  return user;
}

export { AUTH_COOKIE_NAME };
