"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, Music2, ArrowRight, AlertCircle, Loader2, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    const res = await register(name, email, password);
    if (!res.success) {
      setError(res.error || "Registration failed");
      setIsSubmitting(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen w-full bg-[#090909] flex flex-col justify-center items-center px-4 relative overflow-hidden py-12">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D7FF3F]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D7FF3F] to-emerald-500 flex items-center justify-center text-black shadow-lg shadow-[#D7FF3F]/20">
              <Music2 className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-black tracking-wider text-white">
              AURALIS
            </span>
          </Link>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Join the next-generation high-fidelity music network
          </p>
        </div>

        <div className="bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
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
                placeholder="Jane Doe"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white placeholder-[#71717A] text-sm focus:outline-none focus:border-[#D7FF3F] transition-colors"
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
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white placeholder-[#71717A] text-sm focus:outline-none focus:border-[#D7FF3F] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white placeholder-[#71717A] text-sm focus:outline-none focus:border-[#D7FF3F] transition-colors pr-10"
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

            <div>
              <label className="block text-xs font-medium text-[#A1A1AA] mb-1.5">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#181818] border border-white/10 text-white placeholder-[#71717A] text-sm focus:outline-none focus:border-[#D7FF3F] transition-colors"
              />
            </div>

            <div className="pt-1">
              <div className="flex items-center gap-2 text-[11px] text-[#71717A]">
                <div className="w-3.5 h-3.5 rounded-full bg-[#D7FF3F]/20 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-[#D7FF3F]" />
                </div>
                <span>Standard Listener Tier (FLAC playback & catalog access)</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#D7FF3F] hover:bg-[#cbf531] text-black font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#D7FF3F]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#71717A] mt-6">
          Already registered?{" "}
          <Link
            href="/login"
            className="text-white hover:text-[#D7FF3F] underline underline-offset-4 transition-colors font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
