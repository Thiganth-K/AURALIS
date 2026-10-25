"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, AlertCircle, Loader2 } from "lucide-react";

export default function AdminNewUserPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create user");
        setLoading(false);
        return;
      }

      router.push("/admin/users");
    } catch {
      setError("Network error while creating user");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-white/5">
        <Link
          href="/admin/users"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A1A1AA] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-[#D7FF3F]" />
            <span>Create New Identity</span>
          </h1>
          <p className="text-xs text-[#A1A1AA]">
            Provision listener or administrative accounts with server-side bcrypt hashing.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-[#121212] border border-white/5">
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@auralis.app"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Initial Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
              Account Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "user" | "admin")}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white text-xs focus:outline-none focus:border-[#D7FF3F]"
            >
              <option value="user">Standard User (Catalog Listener)</option>
              <option value="admin">Administrator (CMS & Operations Access)</option>
            </select>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Link
              href="/admin/users"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#A1A1AA] hover:text-white transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-xs flex items-center gap-2 transition-all shadow-md shadow-[#D7FF3F]/10 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Provisioning...</span>
                </>
              ) : (
                <span>Create User</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
