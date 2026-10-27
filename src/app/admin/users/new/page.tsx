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
    <div className="max-w-2xl mx-auto space-y-6 select-none font-mono">
      {/* Return to Directory Link */}
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all"
          style={{
            backgroundColor: "#FAF7EE",
            color: "#111111",
            border: "1.5px solid #111111",
            boxShadow: "2px 2px 0px #111111",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#F6EEDE";
            e.currentTarget.style.transform = "translate(-1px,-1px)";
            e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#FAF7EE";
            e.currentTarget.style.transform = "translate(0,0)";
            e.currentTarget.style.boxShadow = "2px 2px 0px #111111";
          }}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>[ RETURN TO DIRECTORY ]</span>
        </Link>
      </div>

      {/* Form Container */}
      <div
        className="relative p-6 sm:p-7"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "4px 4px 0px #111111",
        }}
      >
        {/* Technical corner ticks */}
        <span className="absolute top-1.5 left-2 text-xs font-mono text-[#7A7166]">┌</span>
        <span className="absolute top-1.5 right-2 text-xs font-mono text-[#7A7166]">┐</span>
        <span className="absolute bottom-1.5 left-2 text-xs font-mono text-[#7A7166]">└</span>
        <span className="absolute bottom-1.5 right-2 text-xs font-mono text-[#7A7166]">┘</span>

        {/* Header */}
        <div className="pb-4 mb-5 border-b border-[#111111]/20">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2 h-2 inline-block shrink-0"
              style={{ backgroundColor: "#F05A28" }}
            />
            <span
              className="text-[10px] font-bold tracking-[0.22em] uppercase"
              style={{ color: "#F05A28" }}
            >
              AURALIS // PROVISIONING
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-[#111111] uppercase">
            CREATE NEW IDENTITY
          </h1>
          <p className="text-xs text-[#7A7166] mt-1 tracking-wide">
            Provision listener or administrative accounts with server-side security.
          </p>
        </div>

        {error && (
          <div
            className="mb-5 p-3 flex items-center gap-2 text-xs font-bold uppercase"
            style={{
              backgroundColor: "#FFF0ED",
              border: "1.5px solid #D62828",
              color: "#D62828",
              boxShadow: "2px 2px 0px #111111",
            }}
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
              <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
              <span>FULL NAME</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Elena Rostova"
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none uppercase"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                color: "#111111",
                caretColor: "#F05A28",
              }}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
              <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
              <span>EMAIL ADDRESS</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elena@auralis.app"
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                color: "#111111",
                caretColor: "#F05A28",
              }}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
              <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
              <span>INITIAL PASSWORD</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full px-3.5 py-2.5 text-xs font-mono bg-transparent focus:outline-none"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                color: "#111111",
                caretColor: "#F05A28",
              }}
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1.5 text-[#111111]">
              <span className="w-1.5 h-1.5 inline-block" style={{ backgroundColor: "#F05A28" }} />
              <span>ACCOUNT ROLE</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as "user" | "admin")}
              className="w-full px-3.5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                color: "#111111",
              }}
            >
              <option value="user">STANDARD USER (CATALOG LISTENER)</option>
              <option value="admin">ADMINISTRATOR (CONTROL ROOM ACCESS)</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-[#111111]/15">
            <Link
              href="/admin/users"
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all"
              style={{
                backgroundColor: "#FAF7EE",
                border: "1.5px solid #111111",
                color: "#7A7166",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#111111";
                e.currentTarget.style.backgroundColor = "#F6EEDE";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#7A7166";
                e.currentTarget.style.backgroundColor = "#FAF7EE";
              }}
            >
              [ CANCEL ]
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: "#F05A28",
                color: "#111111",
                border: "2px solid #111111",
                boxShadow: "3px 3px 0px #111111",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e84e1d";
                e.currentTarget.style.transform = "translate(-1px,-1px)";
                e.currentTarget.style.boxShadow = "4px 4px 0px #111111";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#F05A28";
                e.currentTarget.style.transform = "translate(0,0)";
                e.currentTarget.style.boxShadow = "3px 3px 0px #111111";
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PROVISIONING...</span>
                </>
              ) : (
                <span>[ CREATE USER ]</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
