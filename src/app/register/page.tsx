"use client";

import React, { useState, useEffect, useRef } from "react";
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

type AnimPhase = "start" | "fadeLogo" | "reveal" | "ready";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTier, setAgreedToTier] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Startup animation states matching login page
  const [animPhase, setAnimPhase] = useState<AnimPhase>("start");
  const [logoDeltaY, setLogoDeltaY] = useState(0);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Measure resting logo center relative to viewport center
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      const naturalCenterY = rect.top + rect.height / 2;
      const viewportCenterY = window.innerHeight / 2;
      setLogoDeltaY(viewportCenterY - naturalCenterY);
    }

    // 2. Fade in logo at viewport center
    const t1 = setTimeout(() => {
      setAnimPhase("fadeLogo");
    }, 60);

    // 3. Move logo to natural position while revealing frame & card
    const t2 = setTimeout(() => {
      setAnimPhase("reveal");
    }, 1150);

    // 4. Mark animation as completed
    const t3 = setTimeout(() => {
      setAnimPhase("ready");
    }, 2250);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

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
    if (!agreedToTier) {
      setError("Please confirm the audio tier agreement [STANDARD LISTENER • FLAC 24-BIT] to proceed");
      return;
    }

    setIsSubmitting(true);
    const res = await register(name, email, password);
    if (!res.success) {
      setError(res.error || "Registration failed");
      setIsSubmitting(false);
      return;
    }

    if (res.pendingApproval) {
      setIsSubmitted(true);
      setIsSubmitting(false);
      return;
    }

    router.push("/home");
  };

  const chamfer =
    "polygon(20px 0%, calc(100% - 20px) 0%, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0% calc(100% - 20px), 0% 20px)";
  const chamferInner =
    "polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)";

  return (
    <div
      className="h-screen w-full flex flex-col overflow-hidden select-none font-mono"
      style={{ backgroundColor: "#F6EEDE", color: "#111111" }}
    >
      {/* ── TOP BAR ─────────────────────────────────────────── */}
      <header
        className="shrink-0 flex items-center justify-between px-5 py-2 border-b"
        style={{
          borderColor: "#111111",
          borderBottomWidth: "1px",
          opacity: animPhase === "ready" || animPhase === "reveal" ? 1 : 0,
          transform:
            animPhase === "ready"
              ? "none"
              : animPhase === "reveal"
              ? "translateY(0)"
              : "translateY(-16px)",
          transition:
            animPhase === "ready"
              ? "none"
              : "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <span
          className="text-[10px] tracking-[0.25em] font-bold uppercase"
          style={{ color: "#111111" }}
        >
          HIGH FIDELITY MUSIC PLATFORM
        </span>
        <div className="flex-1 mx-4 h-[1px]" style={{ backgroundColor: "#111111", opacity: 0.2 }} />
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] tracking-[0.2em] font-bold uppercase" style={{ color: "#111111" }}>
            AURALIS // v1.0
          </span>
          <span className="text-[13px] font-bold" style={{ color: "#F05A28" }}>///</span>
        </div>
      </header>

      {/* ── BODY (left sidebar + center + right sidebar) ─── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside
          className="shrink-0 w-[56px] flex flex-col items-center justify-between py-5 relative overflow-hidden"
          style={{
            opacity: animPhase === "ready" || animPhase === "reveal" ? 1 : 0,
            transform:
              animPhase === "ready"
                ? "none"
                : animPhase === "reveal"
                ? "translateX(0)"
                : "translateX(-20px)",
            transition:
              animPhase === "ready"
                ? "none"
                : "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Top-left corner bracket & equalizer bars */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div
              style={{
                width: 18,
                height: 18,
                borderTop: "2.5px solid #F05A28",
                borderLeft: "2.5px solid #F05A28",
              }}
            />
            <div className="flex items-end gap-[2px]">
              <span className="w-[3px] rounded-sm" style={{ height: 8, backgroundColor: "#F05A28" }} />
              <span className="w-[3px] rounded-sm" style={{ height: 16, backgroundColor: "#F05A28" }} />
              <span className="w-[3px] rounded-sm" style={{ height: 12, backgroundColor: "#F05A28" }} />
              <span className="w-[3px] rounded-sm" style={{ height: 6, backgroundColor: "#F05A28" }} />
            </div>
          </div>

          {/* Vinyl circle decoration */}
          <div className="absolute left-[-110px] top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="rounded-full border-[1.5px]" style={{ width: 260, height: 260, borderColor: "#111111", opacity: 0.1 }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px]" style={{ width: 200, height: 200, borderColor: "#111111", opacity: 0.1 }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px]" style={{ width: 140, height: 140, borderColor: "#111111", opacity: 0.1 }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px]" style={{ width: 80, height: 80, borderColor: "#111111", opacity: 0.1 }} />
          </div>

          {/* Left caption box — uniform size */}
          <div
            className="z-10 flex flex-col items-center justify-center gap-2.5"
            style={{
              border: "1.5px solid #111111",
              backgroundColor: "#F6EEDE",
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 6,
              paddingRight: 6,
              width: 34,
            }}
          >
            {["MIX", "ARTISTS", "ALBUMS", "PLAYLISTS", "YOU"].map((label, idx) => (
              <React.Fragment key={label}>
                {idx > 0 && (
                  <span className="font-bold" style={{ color: "#F05A28", writingMode: "vertical-rl", fontSize: 9 }}>/</span>
                )}
                <span
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: "#111111",
                    opacity: 0.7,
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Bottom-left orange bracket corner */}
          <div
            className="z-10"
            style={{
              width: 18,
              height: 18,
              borderBottom: "2.5px solid #F05A28",
              borderLeft: "2.5px solid #F05A28",
            }}
          />
        </aside>

        {/* CENTER CONTENT */}
        <main
          className={`flex-1 flex flex-col items-center justify-center pt-2 pb-5 px-4 relative ${
            animPhase === "ready" ? "overflow-y-auto" : "overflow-hidden"
          }`}
        >
          {/* LOGO */}
          <div
            ref={logoRef}
            className="inline-block select-none pointer-events-none"
            style={{
              opacity: animPhase === "start" ? 0 : 1,
              transform:
                animPhase === "ready"
                  ? "none"
                  : animPhase === "reveal"
                  ? "translateY(0px) scale(1)"
                  : animPhase === "fadeLogo"
                  ? `translateY(${logoDeltaY}px) scale(1)`
                  : `translateY(${logoDeltaY}px) scale(0.95)`,
              transition:
                animPhase === "ready"
                  ? "none"
                  : animPhase === "reveal"
                  ? "transform 0.95s cubic-bezier(0.16, 1, 0.3, 1)"
                  : "opacity 0.85s ease-out, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
              willChange: animPhase === "ready" ? "auto" : "transform, opacity",
            }}
          >
            <Image
              src="/logov1.png"
              alt="AURALIS Music System"
              width={750}
              height={300}
              className="w-auto object-contain max-w-[90vw] md:max-w-[420px]"
              style={{ height: 110 }}
              priority
            />
          </div>

          {/* REVEALING CARD CONTAINER */}
          <div
            className="flex flex-col items-center w-full"
            style={{
              opacity: animPhase === "ready" || animPhase === "reveal" ? 1 : 0,
              transform:
                animPhase === "ready"
                  ? "none"
                  : animPhase === "reveal"
                  ? "translateY(0px)"
                  : "translateY(28px)",
              transition:
                animPhase === "ready"
                  ? "none"
                  : "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.08s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.08s",
              pointerEvents: animPhase === "ready" || animPhase === "reveal" ? "auto" : "none",
            }}
          >
            {/* INITIALIZE ACCOUNT TITLE */}
            <div className="flex flex-col items-center mt-1 mb-3.5 relative z-20 text-center">
              <h1 className="flex items-center justify-center gap-2 text-sm font-bold tracking-[0.28em] uppercase" style={{ color: "#111111" }}>
                <span className="font-black" style={{ color: "#F05A28" }}>//</span>
                INITIALIZE ACCOUNT
              </h1>
              <p className="text-[11px] mt-1 tracking-wide" style={{ color: "#7A7166" }}>
                Register to access master audio broadcasts &amp; curated archives.
              </p>
            </div>

            {/* CARD WRAPPER */}
            <div className="relative mb-3" style={{ width: "100%", maxWidth: 540 }}>
              {/* ORANGE BACKING CARD (offset behind) */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: 10,
                  left: 10,
                  right: -10,
                  bottom: -10,
                  clipPath: chamfer,
                  backgroundColor: "#111111",
                  zIndex: 0,
                }}
              />
              <div
                className="absolute pointer-events-none"
                style={{
                  top: 11,
                  left: 11,
                  right: -9,
                  bottom: -9,
                  clipPath: chamferInner,
                  backgroundColor: "#F05A28",
                  zIndex: 0,
                }}
              />

              {/* MAIN CARD FACE */}
              <div
                className="relative z-10"
                style={{
                  clipPath: chamfer,
                  backgroundColor: "#111111",
                  padding: "2.5px",
                }}
              >
                <div
                  style={{
                    clipPath: chamferInner,
                    backgroundColor: "#F5F0E8",
                    padding: "32px 30px 28px",
                  }}
                >
                  {isSubmitted ? (
                    <div className="py-4 text-center space-y-5">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFF0ED] border border-[#F05A28] text-[#F05A28] text-xs font-bold tracking-widest uppercase">
                        <span className="w-2 h-2 rounded-full bg-[#F05A28] animate-pulse" />
                        <span>[ ACCESS REQUEST TRANSMITTED ]</span>
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-base font-bold tracking-wider text-[#111111] uppercase">
                          AWAITING ADMIN APPROVAL
                        </h2>
                        <p className="text-xs text-[#7A7166] leading-relaxed max-w-sm mx-auto">
                          Registration request for <strong className="text-[#111111] font-mono">{email}</strong> has been logged in the system and queued for administrative review.
                        </p>
                        <p className="text-[11px] text-[#7A7166] font-mono">
                          Once an administrator approves your account, you will be able to access the terminal.
                        </p>
                      </div>

                      <div className="pt-2">
                        <Link
                          href="/login"
                          className="w-full flex items-center justify-center gap-3 font-bold tracking-[0.22em] text-sm uppercase transition-all cursor-pointer"
                          style={{
                            backgroundColor: "#F05A28",
                            color: "#111111",
                            border: "2px solid #111111",
                            boxShadow: "5px 5px 0px #111111",
                            padding: "16px 24px",
                          }}
                        >
                          <span>[ RETURN TO SIGN IN ]</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Error message */}
                      {error && (
                        <div
                          className="mb-4 p-2.5 flex items-center gap-2 text-[11px] font-mono"
                          style={{
                            backgroundColor: "#FFF0ED",
                            border: "1.5px solid #D62828",
                            color: "#D62828",
                          }}
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{error}</span>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                          <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "#111111" }}>
                            <span className="w-2 h-2 shrink-0 inline-block" style={{ backgroundColor: "#F05A28" }} />
                            FULL NAME
                          </label>
                      <div
                        className="flex items-center"
                        style={{
                          backgroundColor: "#FAF7EE",
                          border: "1.5px solid #111111",
                          minHeight: 58,
                        }}
                      >
                        <span className="pl-4 pr-3 flex items-center shrink-0" style={{ color: "#111111" }}>
                          <User className="w-[18px] h-[18px]" />
                        </span>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Jane Doe"
                          className="w-full py-4 pr-4 text-xs font-mono bg-transparent focus:outline-none"
                          style={{ color: "#111111", caretColor: "#F05A28" }}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "#111111" }}>
                        <span className="w-2 h-2 shrink-0 inline-block" style={{ backgroundColor: "#F05A28" }} />
                        IDENTITY (EMAIL)
                      </label>
                      <div
                        className="flex items-center"
                        style={{
                          backgroundColor: "#FAF7EE",
                          border: "1.5px solid #111111",
                          minHeight: 58,
                        }}
                      >
                        <span className="pl-4 pr-3 flex items-center shrink-0" style={{ color: "#111111" }}>
                          <Mail className="w-[18px] h-[18px]" />
                        </span>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full py-4 pr-4 text-xs font-mono bg-transparent focus:outline-none"
                          style={{ color: "#111111", caretColor: "#F05A28" }}
                        />
                      </div>
                    </div>

                    {/* Passphrase & Confirm Passphrase Side-by-Side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Passphrase */}
                      <div>
                        <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "#111111" }}>
                          <span className="w-2 h-2 shrink-0 inline-block" style={{ backgroundColor: "#F05A28" }} />
                          PASSPHRASE
                        </label>
                        <div
                          className="relative flex items-center"
                          style={{
                            backgroundColor: "#FAF7EE",
                            border: "1.5px solid #111111",
                            minHeight: 58,
                          }}
                        >
                          <span className="pl-3.5 pr-2.5 flex items-center shrink-0" style={{ color: "#111111" }}>
                            <Lock className="w-[18px] h-[18px]" />
                          </span>
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full py-4 pr-10 text-xs font-mono bg-transparent focus:outline-none tracking-widest"
                            style={{ color: "#111111", caretColor: "#F05A28" }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 flex items-center justify-center transition-colors p-1"
                            style={{ color: "#7A7166" }}
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
                        <label className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "#111111" }}>
                          <span className="w-2 h-2 shrink-0 inline-block" style={{ backgroundColor: "#F05A28" }} />
                          CONFIRM
                        </label>
                        <div
                          className="relative flex items-center"
                          style={{
                            backgroundColor: "#FAF7EE",
                            border: "1.5px solid #111111",
                            minHeight: 58,
                          }}
                        >
                          <span className="pl-3.5 pr-2.5 flex items-center shrink-0" style={{ color: "#111111" }}>
                            <Lock className="w-[18px] h-[18px]" />
                          </span>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full py-4 pr-10 text-xs font-mono bg-transparent focus:outline-none tracking-widest"
                            style={{ color: "#111111", caretColor: "#F05A28" }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 flex items-center justify-center transition-colors p-1"
                            style={{ color: "#7A7166" }}
                            aria-label="Toggle confirm password visibility"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Tier selection / agreement checkbox */}
                    <label
                      htmlFor="tier-agreement"
                      className="pt-1 flex items-center gap-2 text-[10px] tracking-wider cursor-pointer select-none group"
                      style={{ color: agreedToTier ? "#111111" : "#7A7166" }}
                    >
                      <input
                        type="checkbox"
                        id="tier-agreement"
                        required
                        checked={agreedToTier}
                        onChange={(e) => {
                          setAgreedToTier(e.target.checked);
                          if (error) setError(null);
                        }}
                        className="sr-only"
                      />
                      <div
                        className="w-4 h-4 flex items-center justify-center shrink-0 transition-all duration-150"
                        style={{
                          backgroundColor: agreedToTier ? "#FFF0ED" : "#FAF7EE",
                          border: agreedToTier ? "1.5px solid #F05A28" : "1.5px solid #7A7166",
                        }}
                      >
                        {agreedToTier && (
                          <Check className="w-2.5 h-2.5" style={{ color: "#F05A28" }} />
                        )}
                      </div>
                      <span className="font-mono group-hover:text-[#F05A28] transition-colors">
                        [ TIER: STANDARD LISTENER • FLAC 24-BIT ]
                      </span>
                      <span className="text-[#F05A28] font-bold ml-[-2px]">*</span>
                    </label>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-3 font-bold tracking-[0.22em] text-sm uppercase transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                      style={{
                        backgroundColor: "#F05A28",
                        color: "#111111",
                        border: "2px solid #111111",
                        boxShadow: "5px 5px 0px #111111",
                        padding: "16px 24px",
                        marginTop: 18,
                      }}
                      onMouseEnter={(e) => {
                        if (!isSubmitting) {
                          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#e84e1d";
                          (e.currentTarget as HTMLButtonElement).style.transform = "translate(-1px,-1px)";
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = "6px 6px 0px #111111";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#F05A28";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translate(0,0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "5px 5px 0px #111111";
                      }}
                      onMouseDown={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translate(2px,2px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "2px 2px 0px #111111";
                      }}
                      onMouseUp={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translate(-1px,-1px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "6px 6px 0px #111111";
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>[ INITIALIZING... ]</span>
                        </>
                      ) : (
                        <>
                          <span>[ CREATE ACCOUNT ]</span>
                          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
                </div>
              </div>
            </div>

            {/* Login switch link */}
            <div className="mt-2 shrink-0 relative z-20 text-center pb-2">
              <p className="text-[10px] tracking-[0.18em] font-mono" style={{ color: "#111111" }}>
                ALREADY REGISTERED?{" "}
                <Link
                  href="/login"
                  className="font-bold hover:underline transition-colors ml-1"
                  style={{ color: "#F05A28" }}
                >
                  [ SIGN IN ]
                </Link>
              </p>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside
          className="shrink-0 w-[56px] flex flex-col items-center justify-between py-5 relative overflow-hidden"
          style={{
            opacity: animPhase === "ready" || animPhase === "reveal" ? 1 : 0,
            transform:
              animPhase === "ready"
                ? "none"
                : animPhase === "reveal"
                ? "translateX(0)"
                : "translateX(20px)",
            transition:
              animPhase === "ready"
                ? "none"
                : "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {/* Top-right bracket corner */}
          <div
            className="z-10"
            style={{
              width: 18,
              height: 18,
              borderTop: "2.5px solid #F05A28",
              borderRight: "2.5px solid #F05A28",
            }}
          />

          {/* Vinyl circle decoration */}
          <div className="absolute right-[-110px] top-1/2 -translate-y-1/2 pointer-events-none">
            <div className="rounded-full border-[1.5px]" style={{ width: 260, height: 260, borderColor: "#111111", opacity: 0.1 }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px]" style={{ width: 200, height: 200, borderColor: "#111111", opacity: 0.1 }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px]" style={{ width: 140, height: 140, borderColor: "#111111", opacity: 0.1 }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px]" style={{ width: 80, height: 80, borderColor: "#111111", opacity: 0.1 }} />
          </div>

          {/* Right caption box — uniform size */}
          <div
            className="z-10 flex flex-col items-center justify-center gap-2.5"
            style={{
              border: "1.5px solid #111111",
              backgroundColor: "#F6EEDE",
              paddingTop: 14,
              paddingBottom: 14,
              paddingLeft: 6,
              paddingRight: 6,
              width: 34,
            }}
          >
            {["LISTEN", "EXPLORE", "RECORD", "MIX", "BELONG"].map((label, idx) => (
              <React.Fragment key={label}>
                {idx > 0 && (
                  <span className="font-bold" style={{ color: "#F05A28", writingMode: "vertical-rl", fontSize: 9 }}>/</span>
                )}
                <span
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: "#111111",
                    opacity: 0.7,
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </span>
              </React.Fragment>
            ))}
          </div>

          {/* Bottom-right equalizer bars & corner bracket */}
          <div className="flex flex-col items-center gap-2 z-10">
            <div className="flex items-end gap-[2px]">
              <span className="w-[3px] rounded-sm" style={{ height: 6, backgroundColor: "#F05A28" }} />
              <span className="w-[3px] rounded-sm" style={{ height: 12, backgroundColor: "#F05A28" }} />
              <span className="w-[3px] rounded-sm" style={{ height: 8, backgroundColor: "#F05A28" }} />
              <span className="w-[3px] rounded-sm" style={{ height: 16, backgroundColor: "#F05A28" }} />
            </div>
            <div
              style={{
                width: 18,
                height: 18,
                borderBottom: "2.5px solid #F05A28",
                borderRight: "2.5px solid #F05A28",
              }}
            />
          </div>
        </aside>
      </div>

      {/* ── BOTTOM BAR ───────────────────────────────────────── */}
      <footer
        className="shrink-0 flex items-center justify-between px-5 py-2 border-t"
        style={{
          borderColor: "#111111",
          borderTopWidth: "1px",
          opacity: animPhase === "ready" || animPhase === "reveal" ? 1 : 0,
          transform:
            animPhase === "ready"
              ? "none"
              : animPhase === "reveal"
              ? "translateY(0)"
              : "translateY(16px)",
          transition:
            animPhase === "ready"
              ? "none"
              : "opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1), transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <Image
            src="/app-icon.jpg"
            alt="Auralis Icon"
            width={24}
            height={24}
            className="shrink-0 select-none pointer-events-none rounded-[4px]"
            style={{ objectFit: "contain" }}
          />
          <span className="text-[10px] tracking-[0.2em] font-bold uppercase" style={{ color: "#111111" }}>
            AURALIS MUSIC SYSTEM
          </span>
          <div className="w-20 h-[1px] ml-2" style={{ backgroundColor: "#111111", opacity: 0.2 }} />
        </div>
        <div className="flex-1 mx-4 h-[1px]" style={{ backgroundColor: "#111111", opacity: 0.15 }} />
        <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] font-bold uppercase" style={{ color: "#111111" }}>
          <span>HIGH FIDELITY</span>
          <span style={{ opacity: 0.3 }}>/</span>
          <span>24-BIT</span>
          <span style={{ opacity: 0.3 }}>/</span>
          <span style={{ color: "#F05A28" }}>96kHz</span>
        </div>
      </footer>
    </div>
  );
}
