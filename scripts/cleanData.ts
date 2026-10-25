import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectToDatabase } from "@/lib/mongodb";
import {
  User,
  Song,
  Artist,
  Album,
  Playlist,
  ListeningHistory,
  AdminAudit,
  FeaturedContent,
} from "@/models";
import { hashPassword } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";
import path from "path";

async function cleanCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    console.log("ℹ Skipping Cloudinary cleanup: Credentials not found in .env.local");
    return;
  }

  console.log(`\n--- Cleaning Cloudinary Assets (${cloudName}) ---`);
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  // 1. Delete image resources in folder auralis
  try {
    const imgRes = await cloudinary.api.delete_resources_by_prefix("auralis/", {
      resource_type: "image",
    });
    console.log("✓ Cloudinary images cleaned:", Object.keys(imgRes.deleted || {}).length, "files");
  } catch (err: any) {
    console.warn("Notice on Cloudinary image cleanup:", err.message || err);
  }

  // 2. Delete video/audio resources in folder auralis
  try {
    const audioRes = await cloudinary.api.delete_resources_by_prefix("auralis/", {
      resource_type: "video",
    });
    console.log("✓ Cloudinary audio/video cleaned:", Object.keys(audioRes.deleted || {}).length, "files");
  } catch (err: any) {
    console.warn("Notice on Cloudinary audio cleanup:", err.message || err);
  }

  // 3. Delete folders
  try {
    await cloudinary.api.delete_folder("auralis/artwork").catch(() => {});
    await cloudinary.api.delete_folder("auralis/audio").catch(() => {});
    await cloudinary.api.delete_folder("auralis").catch(() => {});
    console.log("✓ Cloudinary 'auralis/' folders cleaned");
  } catch (err: any) {
    // Ignore folder not empty or not existing
  }
}

async function cleanLocalUploads() {
  console.log("\n--- Cleaning Local Filesystem Uploads ---");
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  try {
    await fs.rm(uploadsDir, { recursive: true, force: true });
    // Recreate clean empty folders
    await fs.mkdir(path.join(uploadsDir, "artwork"), { recursive: true });
    await fs.mkdir(path.join(uploadsDir, "audio"), { recursive: true });
    console.log("✓ Local 'public/uploads/' directory reset and emptied");
  } catch (err) {
    console.warn("Notice on local uploads cleanup:", err);
  }
}

async function cleanMongoDB() {
  console.log("\n--- Cleaning MongoDB Atlas Database ---");
  await connectToDatabase();

  const [
    songs,
    albums,
    artists,
    playlists,
    history,
    audits,
    featured,
    users,
  ] = await Promise.all([
    Song.deleteMany({}),
    Album.deleteMany({}),
    Artist.deleteMany({}),
    Playlist.deleteMany({}),
    ListeningHistory.deleteMany({}),
    AdminAudit.deleteMany({}),
    FeaturedContent.deleteMany({}),
    User.deleteMany({}),
  ]);

  console.log("✓ Deleted Songs:", songs.deletedCount);
  console.log("✓ Deleted Albums:", albums.deletedCount);
  console.log("✓ Deleted Artists:", artists.deletedCount);
  console.log("✓ Deleted Playlists:", playlists.deletedCount);
  console.log("✓ Deleted ListeningHistory:", history.deletedCount);
  console.log("✓ Deleted AdminAudits:", audits.deletedCount);
  console.log("✓ Deleted FeaturedContent:", featured.deletedCount);
  console.log("✓ Deleted Users:", users.deletedCount);

  // Re-seed a fresh initial administrator so you can immediately log back into /admin
  console.log("\n--- Provisioning Fresh Administrator Account ---");
  const adminPasswordHash = await hashPassword("admin123");
  const adminUser = await User.create({
    name: "AURALIS Admin",
    email: "admin@auralis.app",
    passwordHash: adminPasswordHash,
    role: "admin",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300",
  });
  console.log(`✓ Admin user created: admin@auralis.app (Password: admin123)`);

  // Also create sample standard listener
  const userPasswordHash = await hashPassword("password123");
  const standardUser = await User.create({
    name: "Thiganth",
    email: "thiganth@auralis.app",
    passwordHash: userPasswordHash,
    role: "user",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300",
  });
  console.log(`✓ Standard listener created: thiganth@auralis.app (Password: password123)`);
}

async function main() {
  console.log("==================================================");
  console.log("   AURALIS FULL PURGE & REINITIALIZATION SCRIPT   ");
  console.log("==================================================");

  try {
    await cleanMongoDB();
    await cleanCloudinary();
    await cleanLocalUploads();

    console.log("\n==================================================");
    console.log("✔ ALL DATA IN MONGODB & CLOUDINARY CLEANED!");
    console.log("==================================================");
    console.log("You can now start with a 100% clean catalog.");
    console.log("Log in as Admin at http://localhost:3000/login using:");
    console.log("  Email:    admin@auralis.app");
    console.log("  Password: admin123\n");
    process.exit(0);
  } catch (err) {
    console.error("Cleanup error:", err);
    process.exit(1);
  }
}

main();
