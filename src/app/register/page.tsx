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
    <div className="min-h-screen w-full bg-[#090909] flex flex-col justify-center items-center px-4 relative overflow-hidden py-12 select-none">
      <div className="w-full max-w-md z-10">
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
            // INITIALIZE ACCOUNT
          </h1>
          <p className="text-xs font-sans text-[#A1A1AA] mt-1">
            Join the high-fidelity acoustic streaming network
          </p>
        </div>

        <div className="bg-[#111111] border-2 border-[#262626] p-6 sm:p-8 shadow-[5px_5px_0px_#000]">
          {error && (
            <div className="mb-5 p-3 bg-red-950/40 border-2 border-red-500/40 text-red-400 text-xs font-pixel flex items-center gap-2 shadow-[2px_2px_0px_#000]">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-pixel text-[#A1A1AA] mb-1.5">
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>

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
              <label className="block text-xs font-pixel text-[#A1A1AA] mb-1.5">
                PASSPHRASE
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
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

            <div>
              <label className="block text-xs font-pixel text-[#A1A1AA] mb-1.5">
                CONFIRM PASSPHRASE
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat passphrase"
                className="w-full px-3 py-2 bg-[#181818] border-2 border-[#2e2e2e] text-white text-xs font-sans focus:outline-none focus:border-[#D7FF3F]"
              />
            </div>

            <div className="pt-1">
              <div className="flex items-center gap-2 text-[10px] font-pixel text-[#71717A]">
                <div className="w-3.5 h-3.5 bg-[#D7FF3F]/20 border border-[#D7FF3F]/50 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-[#D7FF3F]" />
                </div>
                <span>[ TIER: STANDARD LISTENER • FLAC 24-BIT ]</span>
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
                  <span>[ INITIALIZING... ]</span>
                </>
              ) : (
                <>
                  <span>[ CREATE ACCOUNT ]</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs font-pixel text-[#71717A] mt-6">
          ALREADY REGISTERED?{" "}
          <Link
            href="/login"
            className="text-[#D7FF3F] hover:underline transition-colors ml-1"
          >
            [ SIGN IN ]
          </Link>
        </p>
      </div>
    </div>
  );
}
