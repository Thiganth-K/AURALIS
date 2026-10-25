"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Music2, ArrowRight, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const res = await login(email, password);
    if (!res.success) {
      setError(res.error || "Failed to sign in");
      setIsSubmitting(false);
      return;
    }

    const searchParams = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const redirectParam = searchParams?.get("redirect");

    // Check user role from session
    try {
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      const isAdmin = meData.success && meData.data?.role === "admin";

      if (redirectParam && redirectParam.startsWith("/")) {
        router.push(redirectParam);
      } else if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090909] flex flex-col justify-center items-center px-4 relative overflow-hidden select-none">
      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-9 h-9 bg-[#D7FF3F] border border-black flex items-center justify-center text-black shadow-[2px_2px_0px_#000]">
              <Music2 className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-pixel tracking-wider text-white">
              AURALIS
            </span>
          </Link>
          <h1 className="text-base font-pixel text-white tracking-wide">
            // ACCESS TERMINAL
          </h1>
          <p className="text-xs font-sans text-[#A1A1AA] mt-1">
            Sign in to access your acoustic library & stream controls.
          </p>
        </div>

        {/* Retro Card Form */}
        <div className="bg-[#111111] border-2 border-[#262626] p-6 sm:p-8 shadow-[5px_5px_0px_#000]">
          {error && (
            <div className="mb-5 p-3 bg-red-950/40 border-2 border-red-500/40 text-red-400 text-xs font-pixel flex items-center gap-2.5 shadow-[2px_2px_0px_#000]">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-pixel text-[#A1A1AA] mb-1.5">
                IDENTITY (EMAIL)
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-pixel text-[#A1A1AA]">
                  PASSPHRASE
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#71717A] hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-2.5 px-4 retro-btn-primary text-xs font-pixel flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>[ AUTHENTICATING... ]</span>
                </>
              ) : (
                <>
                  <span>[ ACCESS SYSTEM ]</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Tip */}
          <div className="mt-6 pt-5 border-t-2 border-[#242424]">
            <p className="text-[10px] font-pixel text-[#71717A] text-center mb-2">
              // QUICK LOGIN PRESETS
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setEmail("admin@auralis.app");
                  setPassword("admin123");
                }}
                className="p-2 bg-[#141414] hover:bg-[#181818] border border-[#2e2e2e] hover:border-[#D7FF3F] text-left transition-colors shadow-[1px_1px_0px_#000]"
              >
                <div className="font-pixel text-[10px] text-[#D7FF3F]">[ ADMIN ]</div>
                <div className="truncate text-[10px] text-[#71717A]">admin@auralis.app</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail("thiganth@auralis.app");
                  setPassword("password123");
                }}
                className="p-2 bg-[#141414] hover:bg-[#181818] border border-[#2e2e2e] hover:border-[#D7FF3F] text-left transition-colors shadow-[1px_1px_0px_#000]"
              >
                <div className="font-pixel text-[10px] text-white">[ LISTENER ]</div>
                <div className="truncate text-[10px] text-[#71717A]">thiganth@auralis.app</div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Switch */}
        <p className="text-center text-xs font-pixel text-[#71717A] mt-6">
          DON&apos;T HAVE AN ACCOUNT?{" "}
          <Link
            href="/register"
            className="text-[#D7FF3F] hover:underline transition-colors ml-1"
          >
            [ REGISTER ]
          </Link>
        </p>
      </div>
    </div>
  );
}
