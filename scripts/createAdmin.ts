import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import dns from "node:dns";
import bcrypt from "bcryptjs";
import readline from "readline";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { User } from "../src/models/User";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function run() {
  const args = process.argv.slice(2);
  let name = args[0];
  let email = args[1];
  let password = args[2];

  if (!name || !email || !password) {
    console.log("\n🛡️  AURALIS ADMIN BOOTSTRAP WIZARD");
    console.log("-----------------------------------");
    name = name || (await ask("Enter Admin Full Name: "));
    email = email || (await ask("Enter Admin Email: "));
    password = password || (await ask("Enter Admin Password (min 6 chars): "));
  }

  if (!name || !email || !password || password.length < 6) {
    console.error("❌ Invalid input. Name, Email, and Password (>= 6 chars) are required.");
    process.exit(1);
  }

  console.log("\nConnecting to MongoDB...");
  await mongoose.connect(MONGODB_URI as string);

  const normalizedEmail = email.toLowerCase().trim();
  const existing = await User.findOne({ email: normalizedEmail });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  if (existing) {
    existing.role = "admin";
    existing.status = "active";
    existing.passwordHash = passwordHash;
    existing.name = name;
    await existing.save();
    console.log(`✅ Existing user ${existing.email} has been promoted to ADMIN!`);
  } else {
    const admin = await User.create({
      name,
      email: normalizedEmail,
      passwordHash,
      role: "admin",
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    });
    console.log(`✅ New Admin user created: ${admin.email} (ID: ${admin._id})`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error("Create admin failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
