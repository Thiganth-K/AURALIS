"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  Check,
} from "lucide-react";

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

  const chamferPolygon =
    "polygon(18px 0, calc(100% - 18px) 0, 100% 18px, 100% calc(100% - 18px), calc(100% - 18px) 100%, 18px 100%, 0 calc(100% - 18px), 0 18px)";

  return (
    <div className="min-h-screen w-full bg-[#F6EEDE] text-[#111111] flex flex-col justify-between p-4 sm:p-6 lg:p-8 select-none font-mono relative overflow-x-hidden">
      {/* 1. TOP HEADER LINE */}
      <header className="w-full flex items-center justify-between pb-3 text-[10px] sm:text-[11px] tracking-widest text-[#111111]">
        <span className="uppercase font-medium shrink-0">
          HIGH FIDELITY MUSIC PLATFORM
        </span>
        <div className="flex-1 mx-3 sm:mx-6 h-[1px] bg-[#111111]/30" />
        <div className="flex items-center gap-2 shrink-0">
          <span className="uppercase font-medium">AURALIS // v1.0</span>
          <span className="text-[#F05A28] font-bold text-sm tracking-tighter ml-1">
            ///
          </span>
        </div>
      </header>

      {/* 2. MAIN CENTER STAGE */}
      <main className="relative flex-1 flex flex-col items-center justify-center py-6 sm:py-8 z-10 w-full max-w-xl mx-auto my-auto">
        {/* LOGO */}
        <div className="flex flex-col items-center mb-5">
          <Link href="/" className="inline-block hover:opacity-95 transition-opacity mb-4">
            <Image
              src="/logov1.png"
              alt="AURALIS Music System"
              width={420}
              height={120}
              className="h-16 sm:h-20 w-auto object-contain mx-auto"
              priority
            />
          </Link>

          <h1 className="text-xs sm:text-sm font-bold text-[#111111] tracking-widest uppercase flex items-center gap-1.5">
            <span className="text-[#F05A28] font-bold">//</span>
            <span>INITIALIZE ACCOUNT</span>
          </h1>
          <p className="text-[11px] sm:text-xs text-[#756F65] mt-1 font-sans text-center">
            Register to access master audio broadcasts &amp; curated archives.
          </p>
        </div>

        {/* 3. TERMINAL REGISTER CARD (4-corner Chamfer with 3D Orange Extrusion Shadow) */}
        <div className="w-full relative">
          {/* Orange 3D Extrusion Shadow Plate */}
          <div
            className="absolute inset-0 translate-x-3 translate-y-3 bg-[#111111] p-[2px] pointer-events-none"
            style={{ clipPath: chamferPolygon }}
          >
            <div
              className="w-full h-full bg-[#F05A28]"
              style={{ clipPath: chamferPolygon }}
            />
          </div>

          {/* Card Outer Black Border Layer */}
          <div
            className="relative bg-[#111111] p-[2.5px] w-full"
            style={{ clipPath: chamferPolygon }}
          >
            {/* Card Face Layer */}
            <div
              className="w-full bg-[#FAF7EE] p-6 sm:p-8 sm:py-9"
              style={{ clipPath: chamferPolygon }}
            >
              {error && (
                <div className="mb-4 p-2.5 bg-[#FFF0ED] border-2 border-[#D62828] text-[#D62828] text-xs font-mono flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#D62828]" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-[#111111] mb-1.5 tracking-wider">
                    <span className="w-2 h-2 bg-[#F05A28] inline-block shrink-0" />
                    <span>FULL NAME</span>
                  </label>
                  <div className="relative flex items-center bg-[#FAF5EB] border-[1.5px] border-[#111111] focus-within:border-2 focus-within:border-[#F05A28] transition-all">
                    <span className="pl-3.5 pr-2 text-[#111111]">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full py-2.5 pr-3 bg-transparent text-[#111111] text-xs font-mono placeholder-[#756F65] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-[#111111] mb-1.5 tracking-wider">
                    <span className="w-2 h-2 bg-[#F05A28] inline-block shrink-0" />
                    <span>IDENTITY (EMAIL)</span>
                  </label>
                  <div className="relative flex items-center bg-[#FAF5EB] border-[1.5px] border-[#111111] focus-within:border-2 focus-within:border-[#F05A28] transition-all">
                    <span className="pl-3.5 pr-2 text-[#111111]">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full py-2.5 pr-3 bg-transparent text-[#111111] text-xs font-mono placeholder-[#756F65] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Passphrase */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-[#111111] mb-1.5 tracking-wider">
                    <span className="w-2 h-2 bg-[#F05A28] inline-block shrink-0" />
                    <span>PASSPHRASE</span>
                  </label>
                  <div className="relative flex items-center bg-[#FAF5EB] border-[1.5px] border-[#111111] focus-within:border-2 focus-within:border-[#F05A28] transition-all">
                    <span className="pl-3.5 pr-2 text-[#111111]">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full py-2.5 pr-10 bg-transparent text-[#111111] text-xs font-mono placeholder-[#756F65] focus:outline-none tracking-widest"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#756F65] hover:text-[#111111] transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Passphrase */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-bold text-[#111111] mb-1.5 tracking-wider">
                    <span className="w-2 h-2 bg-[#F05A28] inline-block shrink-0" />
                    <span>CONFIRM PASSPHRASE</span>
                  </label>
                  <div className="relative flex items-center bg-[#FAF5EB] border-[1.5px] border-[#111111] focus-within:border-2 focus-within:border-[#F05A28] transition-all">
                    <span className="pl-3.5 pr-2 text-[#111111]">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat passphrase"
                      className="w-full py-2.5 pr-3 bg-transparent text-[#111111] text-xs font-mono placeholder-[#756F65] focus:outline-none tracking-widest"
                    />
                  </div>
                </div>

                <div className="pt-1">
                  <div className="flex items-center gap-2 text-[10px] text-[#756F65]">
                    <div className="w-3.5 h-3.5 bg-[#F05A28]/15 border border-[#F05A28] flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-[#F05A28]" />
                    </div>
                    <span>[ TIER: STANDARD LISTENER • FLAC 24-BIT ]</span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2.5 py-3 px-4 bg-[#F05A28] text-[#111111] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] text-xs sm:text-sm font-bold tracking-widest flex items-center justify-center gap-2.5 hover:bg-[#f26f42] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#111111] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#111111]" />
                      <span>[ INITIALIZING... ]</span>
                    </>
                  ) : (
                    <>
                      <span>[ CREATE ACCOUNT ]</span>
                      <ArrowRight className="w-4 h-4 text-[#111111]" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Switch */}
        <p className="text-center text-xs font-mono text-[#756F65] mt-6 tracking-wide">
          ALREADY REGISTERED?{" "}
          <Link
            href="/login"
            className="text-[#F05A28] font-bold hover:underline transition-colors ml-1"
          >
            [ SIGN IN ]
          </Link>
        </p>
      </main>

      {/* 4. BOTTOM FOOTER BORDER LINE */}
      <footer className="w-full flex items-center justify-between pt-3 border-t border-[#111111]/25 text-[10px] sm:text-[11px] tracking-widest text-[#111111]">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border border-[#111111] flex items-center justify-center text-[9px] font-bold">
            A
          </span>
          <span className="uppercase">AURALIS MUSIC SYSTEM</span>
        </div>
        <div className="flex-1 mx-4 sm:mx-6 h-[1px] bg-[#111111]/20 hidden sm:block" />
        <div className="flex items-center gap-2 uppercase">
          <span>HIGH FIDELITY</span>
          <span className="text-[#111111]/40">/</span>
          <span>24-BIT</span>
          <span className="text-[#111111]/40">/</span>
          <span className="text-[#F05A28] font-bold">96kHz</span>
        </div>
      </footer>
    </div>
  );
}
