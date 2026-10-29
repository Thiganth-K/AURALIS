"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutGrid,
  Music,
  Mic2,
  Disc3,
  ListMusic,
  Star,
  Users,
  HardDrive,
  Upload,
  Radio,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  HelpCircle,
  FileText,
  Play,
  RefreshCw,
  Terminal,
  ShieldAlert,
} from "lucide-react";

const WIDE_SOUNDWAVE_BARS = [
  8, 12, 17, 24, 30, 38, 46, 54, 60, 65, 70, 74, 76, 74, 70, 65, 60, 54, 46, 38, 30, 24, 17, 12, 8,
];

interface GuideSection {
  id: string;
  category: string;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  actionHref: string;
  actionLabel: string;
  overview: string;
  steps: Array<{
    title: string;
    details: string;
    highlight?: string;
  }>;
  proTips: string[];
  systemNotes?: string;
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "dashboard",
    category: "TELEMETRY",
    title: "01. CONTROL ROOM & DASHBOARD TELEMETRY",
    badge: "REAL-TIME TELEMETRY",
    icon: LayoutGrid,
    actionHref: "/admin",
    actionLabel: "[ OPEN CONTROL ROOM ]",
    overview:
      "The primary mission control center for monitoring live Atlas database records, listener activity, and system health status in real time.",
    steps: [
      {
        title: "Reading the 6 KPI Stat Cards",
        details:
          "Monitor live document counts for Users, Songs, Artists, Albums, Playlists, and Media Storage. Top-right folded badges display weekly delta growth and pending reviews.",
        highlight: "All figures represent genuine live documents fetched directly from MongoDB Atlas.",
      },
      {
        title: "Manual Real-Time Sync",
        details:
          "Click the '[ SYNC DATA ]' button in the hero banner to immediately trigger an un-cached telemetry poll against the database and refresh all counters.",
        highlight: "Use this after completing batch uploads or modifying publish statuses.",
      },
      {
        title: "Auditing System Health",
        details:
          "Inspect the four system telemetry panels: MongoDB Atlas latency (ping in milliseconds and document count), Node.js Audio Pipeline active stream count, Next.js API route status (12/12 active routes), and Cloudinary Vault storage.",
      },
      {
        title: "Navigating Activity Feed with Pagination",
        details:
          "Review chronological activity events (plays, registrations, uploads, creations). Use the retro '[ PREV ]' and '[ NEXT ]' controls at the bottom of the feed to page through historical actions.",
      },
    ],
    proTips: [
      "The top streamed track widget automatically tracks the #1 streamed audio signal across all active listeners.",
      "A ping under 120ms indicates optimal database connection to the primary Atlas cluster.",
    ],
    systemNotes: "Route: /admin • Telemetry updates on load and via manual sync.",
  },
  {
    id: "songs",
    category: "INGESTION",
    title: "02. TRACK INGESTION & AUDIO PIPELINE",
    badge: "FLAC / MP3 INGEST",
    icon: Music,
    actionHref: "/admin/songs",
    actionLabel: "[ OPEN SONG INGESTION ]",
    overview:
      "Upload, encode, publish, and moderate high-fidelity audio tracks. Control track visibility between draft status and the public stream catalog.",
    steps: [
      {
        title: "Step 1: Initiate New Track Ingest",
        details:
          "Navigate to '/admin/songs' and click the orange '[ + INGEST TRACK ]' CTA button, or jump directly to '/admin/songs/new'.",
      },
      {
        title: "Step 2: Upload Audio & Sleeve Artwork Files",
        details:
          "Upload your audio asset (supports lossless FLAC, WAV, and high-bitrate MP3 up to 100MB). Then upload square album sleeve artwork (JPG, PNG, WebP up to 10MB). Assets are securely stored in the Cloudinary media vault.",
        highlight: "Ensure audio is cleanly tagged and normalized to avoid clipping.",
      },
      {
        title: "Step 3: Assign Metadata & Identity Links",
        details:
          "Provide the official Track Title, assign the verified Artist from the dropdown, link the corresponding Album release, specify Duration (in seconds), and set primary/secondary Genres.",
      },
      {
        title: "Step 4: Configure Advanced Acoustic Data (Optional)",
        details:
          "Input the International Standard Recording Code (ISRC), Tempo (BPM), Musical Key (e.g. F Minor, C Major), Explicit content flag, and synchronized/plain lyrics.",
      },
      {
        title: "Step 5: Publish vs. Draft Lifecycle",
        details:
          "Select 'DRAFT' to hold the track in private staging for internal review, or 'PUBLISHED' to immediately dispatch the audio signal to the public search catalog and listening feeds.",
        highlight: "You can toggle publish/unpublish status at any time with one click from the directory table.",
      },
      {
        title: "Step 6: Live Interactive Audio Cueing",
        details:
          "Click the '[ ▶ CUE ]' button next to any track in the directory table to preview the high-fidelity audio stream directly in your browser without leaving the admin panel.",
      },
    ],
    proTips: [
      "Always preview newly ingested audio using the inline CUE player before switching status to PUBLISHED.",
      "Unpublishing a track immediately hides it from community feeds while preserving stream counts and metadata.",
    ],
    systemNotes: "Routes: /admin/songs, /admin/songs/new • Storage: Cloudinary Audio Vault.",
  },
  {
    id: "artists",
    category: "IDENTITIES",
    title: "03. VERIFIED ARTIST ROSTER & PROFILES",
    badge: "IDENTITY ROSTER",
    icon: Mic2,
    actionHref: "/admin/artists",
    actionLabel: "[ OPEN ARTIST ROSTER ]",
    overview:
      "Register and curate authoritative artist identities. Manage biography statements, profile photographs, genre taxonomies, and discography linkages.",
    steps: [
      {
        title: "Registering an Artist Identity",
        details:
          "Click '[ + REGISTER ARTIST ]' from the top right of the Artists page. Enter the official Artist Name, unique URL slug, and a biographical overview.",
      },
      {
        title: "Uploading Identity Avatar Photo",
        details:
          "Select a high-resolution square portrait. The photo will automatically receive the AURALIS orange ambient drop-glow on artist directory cards.",
      },
      {
        title: "Setting Genre Taxonomy",
        details:
          "Specify comma-separated musical genres (e.g. 'Synthwave, Electronic, Ambient, Lo-Fi'). These tags drive search filters and recommendation engines.",
      },
      {
        title: "Connecting Discography & Releases",
        details:
          "Once registered, an artist can be assigned to multiple album releases and individual ingested songs. The discography counter updates automatically.",
      },
    ],
    proTips: [
      "Use clean alphanumeric slugs without spaces for optimal SEO and URL sharing.",
      "Artists can be edited at any time using the tactical '[ EDIT ]' command button.",
    ],
    systemNotes: "Routes: /admin/artists, /admin/artists/new • Tied to albums and track credits.",
  },
  {
    id: "albums",
    category: "DISCOGRAPHY",
    title: "04. ALBUM RELEASES & SLEEVE ARTWORK",
    badge: "LONG-PLAY CATALOG",
    icon: Disc3,
    actionHref: "/admin/albums",
    actionLabel: "[ OPEN ALBUM RELEASES ]",
    overview:
      "Manage full-length LPs, EPs, and singles. Organize track listings, release dates, and high-fidelity cover sleeve artwork.",
    steps: [
      {
        title: "Creating a New Release",
        details:
          "Click '[ + NEW ALBUM ]' on the Albums page. Input the release title and link the verified artist from the dynamic artist dropdown.",
      },
      {
        title: "Setting Release Dates & Editorial Description",
        details:
          "Select the official release calendar date and provide release notes, sleeve liner notes, or concept descriptions for the catalog.",
      },
      {
        title: "Cover Sleeve Artwork Upload",
        details:
          "Upload high-resolution square sleeve art (minimum 500x500px recommended). The sleeve art is showcased in the player and home discover carousels.",
      },
      {
        title: "Assigning Ingested Tracks to Releases",
        details:
          "When uploading songs via the Song Ingestion workflow, select this album from the album dropdown to automatically populate its tracklist.",
      },
    ],
    proTips: [
      "Filter the album catalog by artist to review discography completeness before launching marketing campaigns.",
    ],
    systemNotes: "Routes: /admin/albums, /admin/albums/new • Automatic track count aggregation.",
  },
  {
    id: "playlists",
    category: "CURATION",
    title: "05. EDITORIAL PLAYLISTS & RADIO CHANNELS",
    badge: "CURATION DESK",
    icon: ListMusic,
    actionHref: "/admin/playlists",
    actionLabel: "[ OPEN PLAYLIST CATALOG ]",
    overview:
      "Curate official AURALIS editorial playlists, mood stations, and public channel mixes for listeners worldwide.",
    steps: [
      {
        title: "Curating a New Editorial Channel",
        details:
          "Click '[ + CURATE PLAYLIST ]' to open the compilation drawer. Provide a distinctive title (e.g. 'Midnight High-Fi', 'Warm Analog Waves').",
      },
      {
        title: "Defining Vibe & Mood Description",
        details:
          "Write a descriptive mood summary explaining the sonic profile and acoustic character of the playlist.",
      },
      {
        title: "Multi-Track Selection Drawer",
        details:
          "Browse published songs and toggle inclusions with the retro checkmark badges. Track counts update in real time as songs are added.",
      },
      {
        title: "Setting Curated Editorial & Public Flags",
        details:
          "Toggle 'CURATED EDITORIAL' to display the sparkling orange badge and 'PUBLIC CATALOG' to broadcast the playlist on community explore pages.",
      },
    ],
    proTips: [
      "Curated editorial playlists can be selected directly in the Featured Showcase Controller to feature on the home hero banner.",
    ],
    systemNotes: "Route: /admin/playlists • Supports multi-track arrangement.",
  },
  {
    id: "featured",
    category: "BROADCAST",
    title: "06. FEATURED SHOWCASE & HOME BROADCAST",
    badge: "SPOTLIGHT CONTROLLER",
    icon: Star,
    actionHref: "/admin/featured",
    actionLabel: "[ OPEN FEATURED CONTROLLER ]",
    overview:
      "The master spotlight switchboard. Directly controls the hero banner headline, subheadline, and curated spotlight items broadcast on the public home page.",
    steps: [
      {
        title: "Writing Hero Banner Headlines",
        details:
          "Input the primary Spotlight Banner Headline (e.g. 'EDITORIAL RADIO • FLAC 24-BIT') and secondary Subheadline.",
      },
      {
        title: "Live Home Hero Simulation Deck",
        details:
          "Review the interactive preview card on the left panel. It simulates the real-time appearance of the home page banner as you type.",
      },
      {
        title: "Selecting Curated Showcase Channels",
        details:
          "Use the four tactical dropdowns to assign the Hero Featured Track, Featured Album, Featured Artist, and Featured Editorial Playlist.",
        highlight: "Leaving a selector on 'NONE' causes the system to automatically calculate top trending signals.",
      },
      {
        title: "Committing the Broadcast Configuration",
        details:
          "Click '[ 💾 SAVE SHOWCASE CONFIGURATION ]' at the bottom of the page. Changes are immediately published live across the streaming network.",
      },
    ],
    proTips: [
      "Rotate featured content weekly to keep community engagement high and highlight emerging artists.",
    ],
    systemNotes: "Route: /admin/featured • Live updates across all listener client sessions.",
  },
  {
    id: "users",
    category: "MODERATION",
    title: "07. USER ACCOUNTS & COMMUNITY MODERATION",
    badge: "ACCESS & ROLES",
    icon: Users,
    actionHref: "/admin/users",
    actionLabel: "[ OPEN USER DIRECTORY ]",
    overview:
      "Audit registered listeners, elevate staff to administrator status, and enforce platform safety through user account moderation.",
    steps: [
      {
        title: "Searching & Filtering Accounts",
        details:
          "Use the search bar to locate accounts by full name, email handle, or user ID. Filter by role ('USER' vs 'ADMIN') and status ('ACTIVE', 'PENDING', 'SUSPENDED').",
      },
      {
        title: "Reviewing User Information & Glowing Avatars",
        details:
          "Inspect registration timestamps, liked track counts, and system role badges. Current logged-in admin accounts display a distinct '[ YOU ]' badge.",
      },
      {
        title: "Account Commands & Role Elevation",
        details:
          "Click the '[ ⋮ ]' action trigger on any account row to access moderation commands: promote to Admin, revoke permissions, suspend account access, or delete records.",
      },
    ],
    proTips: [
      "Only promote trusted team members to Admin role, as admins have full catalog write permissions.",
    ],
    systemNotes: "Route: /admin/users • Protected by requireAdmin authentication guard.",
  },
  {
    id: "pipeline",
    category: "INFRASTRUCTURE",
    title: "08. AUDIO PIPELINE & STORAGE GUIDELINES",
    badge: "SYSTEM INFRASTRUCTURE",
    icon: HardDrive,
    actionHref: "/admin",
    actionLabel: "[ CHECK SYSTEM HEALTH ]",
    overview:
      "Technical specifications, encoding benchmarks, and vault storage limits for maintaining studio-grade audio delivery.",
    steps: [
      {
        title: "Recommended Audio Encoding Specifications",
        details:
          "Preferred: FLAC 24-bit / 96kHz or 48kHz for lossless audiophile playback. Minimum: MP3 320kbps CBR or AAC 256kbps for bandwidth optimization.",
      },
      {
        title: "Media Vault Storage Limits",
        details:
          "The media storage counter aggregates total asset file size and cumulative playtime hours. Monitor storage growth regularly via the Storage KPI card.",
      },
      {
        title: "Stream Buffer & Pipeline Latency",
        details:
          "The Node.js audio pipeline buffers audio chunks to ensure gapless streaming even under variable network conditions. Monitor stream sessions on the dashboard.",
      },
    ],
    proTips: [
      "Always verify file metadata before uploading to ensure clean tag parsing in the database.",
    ],
    systemNotes: "Backend: Next.js 16 App Router • MongoDB Atlas Mongoose • Cloudinary CDN.",
  },
];

export default function AdminInstructionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const categories = ["ALL", "TELEMETRY", "INGESTION", "IDENTITIES", "DISCOGRAPHY", "CURATION", "BROADCAST", "MODERATION", "INFRASTRUCTURE"];

  const filteredSections = GUIDE_SECTIONS.filter((sec) => {
    const matchesSearch =
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.overview.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.steps.some(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.details.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory = activeCategory === "ALL" || sec.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 pb-12 select-none font-mono">
      {/* ── 1. HERO BANNER ─────────────────────────────────── */}
      <div
        className="relative p-6 sm:p-7 overflow-hidden"
        style={{
          backgroundColor: "#FAF7EE",
          border: "2px solid #111111",
          boxShadow: "4px 4px 0px #111111",
        }}
      >
        {/* Technical Corner Crop Ticks */}
        <span
          className="absolute top-1.5 left-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┌
        </span>
        <span
          className="absolute top-1.5 right-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┐
        </span>
        <span
          className="absolute bottom-1.5 left-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          └
        </span>
        <span
          className="absolute bottom-1.5 right-2 text-sm font-bold font-mono select-none"
          style={{ color: "#F05A28" }}
        >
          ┘
        </span>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            {/* Tagline */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2 h-2 inline-block shrink-0"
                style={{ backgroundColor: "#F05A28" }}
              />
              <span
                className="text-[10px] font-bold tracking-[0.22em] uppercase"
                style={{ color: "#F05A28" }}
              >
                AURALIS // OPERATOR SOP & MANUAL
              </span>
            </div>

            {/* Heavy Bold Title */}
            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#111111] uppercase leading-tight select-text"
              style={{ fontWeight: 900 }}
            >
              ADMIN INSTRUCTIONS // MANUAL
            </h1>

            {/* Sub-text */}
            <p className="text-xs sm:text-[13px] text-[#7A7166] mt-2 font-mono leading-relaxed">
              Standard operating procedures (SOP), workflow instructions, and tactical guidelines
              <br className="hidden sm:inline" />
              {" "}for managing catalog ingestion, verified artists, broadcasts, and system telemetry.
            </p>
          </div>

          {/* Right Side: Retro Soundwave Graphics & Editorial Slogan */}
          <div className="hidden sm:flex items-center gap-4 sm:gap-5 shrink-0">
            {/* Inline Keyframes to guarantee instant rendering */}
            <style>{`
              @keyframes auralisWaveDance {
                0%, 100% {
                  transform: scaleY(0.18);
                  opacity: 0.6;
                }
                50% {
                  transform: scaleY(1.08);
                  opacity: 1;
                }
              }
            `}</style>

            {/* Wide Soundwave bars with smooth up-and-down wave animation */}
            <div
              className="flex items-center gap-1 sm:gap-1.5 h-20 px-2 select-none"
              title="Auralis Live Audio Equalizer Spectrum"
            >
              {WIDE_SOUNDWAVE_BARS.map((height, idx) => (
                <span
                  key={idx}
                  className="bg-[#F05A28]"
                  style={{
                    display: "inline-block",
                    width: "5px",
                    height: `${height}px`,
                    borderRadius: "1.5px",
                    transformOrigin: "center",
                    animation: "auralisWaveDance 1.35s ease-in-out infinite",
                    animationDelay: `${(idx * 0.055).toFixed(3)}s`,
                    willChange: "transform",
                  }}
                />
              ))}
            </div>

            {/* Editorial Stacked Tagline */}
            <div
              className="text-left text-[10px] font-bold tracking-widest text-[#111111] uppercase leading-tight font-mono pl-4 sm:pl-5 shrink-0"
              style={{ borderLeft: "1.5px solid rgba(17, 17, 17, 0.2)" }}
            >
              <p>BETTER MUSIC</p>
              <p className="my-0.5">BETTER PEOPLE</p>
              <p className="text-[#F05A28]">AURALIS</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. QUICK SEARCH & TOPIC SELECTOR BAR ─────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div
            className="flex-1 max-w-lg flex items-center gap-3 px-3.5 py-2.5 text-xs"
            style={{
              backgroundColor: "#FAF7EE",
              border: "2px solid #111111",
              boxShadow: "2.5px 2.5px 0px #111111",
            }}
          >
            <Search className="w-4 h-4 shrink-0" style={{ color: "#F05A28" }} />
            <input
              type="text"
              placeholder="SEARCH INSTRUCTIONS, KEYWORDS, OR WORKFLOWS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-[#111111] placeholder-[#7A7166] focus:outline-none font-mono text-xs uppercase"
              style={{ caretColor: "#F05A28" }}
            />
          </div>

          {/* Quick Count Badge */}
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-bold text-[#7A7166] uppercase">
            <span>[ {filteredSections.length} INSTRUCTION MODULES READY ]</span>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-0.5 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap shrink-0"
                style={{
                  backgroundColor: isActive ? "#F05A28" : "#FAF7EE",
                  color: isActive ? "#111111" : "#111111",
                  border: "1.5px solid #111111",
                  boxShadow: isActive ? "2px 2px 0px #111111" : "1px 1px 0px #111111",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 3. INSTRUCTION MODULES LIST ─────────────────────── */}
      <div className="space-y-6">
        {filteredSections.map((sec) => {
          const Icon = sec.icon;

          return (
            <div
              key={sec.id}
              id={sec.id}
              className="relative p-6 sm:p-7 space-y-5"
              style={{
                backgroundColor: "#FAF7EE",
                border: "2px solid #111111",
                boxShadow: "3px 3px 0px #111111",
              }}
            >
              {/* Corner ticks */}
              <span
                className="absolute top-1.5 left-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                ┌
              </span>
              <span
                className="absolute top-1.5 right-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                ┐
              </span>
              <span
                className="absolute bottom-1.5 left-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                └
              </span>
              <span
                className="absolute bottom-1.5 right-2 text-xs font-mono select-none"
                style={{ color: "#F05A28" }}
              >
                ┘
              </span>

              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#111111]/15">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: "#F05A28",
                      border: "1.5px solid #111111",
                      boxShadow: "2px 2px 0px #111111",
                    }}
                  >
                    <Icon className="w-5 h-5 text-[#111111]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#FFF0ED] text-[#F05A28] border border-[#F05A28]/40 uppercase tracking-widest">
                        {sec.badge}
                      </span>
                      <span className="text-[10px] text-[#7A7166] uppercase font-bold tracking-wider">
                        // {sec.category}
                      </span>
                    </div>
                    <h2
                      className="text-base sm:text-lg font-black tracking-tight text-[#111111] uppercase"
                      style={{ fontWeight: 900 }}
                    >
                      {sec.title}
                    </h2>
                  </div>
                </div>

                <Link
                  href={sec.actionHref}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto cursor-pointer"
                  style={{
                    backgroundColor: "#F05A28",
                    color: "#111111",
                    border: "2px solid #111111",
                    boxShadow: "2.5px 2.5px 0px #111111",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e84e1d";
                    e.currentTarget.style.transform = "translate(-1px,-1px)";
                    e.currentTarget.style.boxShadow = "3.5px 3.5px 0px #111111";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#F05A28";
                    e.currentTarget.style.transform = "translate(0,0)";
                    e.currentTarget.style.boxShadow = "2.5px 2.5px 0px #111111";
                  }}
                >
                  <span>{sec.actionLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Overview Paragraph */}
              <p className="text-xs sm:text-[13px] text-[#111111] font-mono leading-relaxed bg-[#F6EEDE] p-3 border border-[#111111]/20">
                {sec.overview}
              </p>

              {/* Step by Step Breakdown */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 inline-block shrink-0 bg-[#F05A28]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
                    TACTICAL WORKFLOW & ACTIONS:
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {sec.steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 space-y-1.5 transition-all"
                      style={{
                        backgroundColor: "#FAF7EE",
                        border: "1.5px solid #111111",
                        boxShadow: "2px 2px 0px #111111",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 flex items-center justify-center text-[10px] font-black bg-[#111111] text-[#FAF7EE] shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="text-xs font-bold uppercase tracking-wide text-[#111111]">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-xs text-[#7A7166] leading-relaxed pl-7">
                        {step.details}
                      </p>
                      {step.highlight && (
                        <div className="mt-1 ml-7 p-1.5 text-[11px] font-bold bg-[#FFF0ED] text-[#D62828] border-l-2 border-[#D62828]">
                          {step.highlight}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pro Tips Box */}
              {sec.proTips && sec.proTips.length > 0 && (
                <div
                  className="p-3.5 space-y-1.5"
                  style={{
                    backgroundColor: "#FFF0ED",
                    border: "1.5px solid #F05A28",
                  }}
                >
                  <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#F05A28]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>OPERATOR PRO-TIPS:</span>
                  </div>
                  <ul className="list-disc list-inside text-xs text-[#111111] space-y-1">
                    {sec.proTips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="leading-relaxed">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* System Footer Note */}
              {sec.systemNotes && (
                <div className="pt-1 flex items-center justify-between text-[10px] text-[#7A7166] font-mono border-t border-[#111111]/10">
                  <span>{sec.systemNotes}</span>
                  <span className="uppercase text-[#F05A28] font-bold">AURALIS // STANDARD OPERATING PROCEDURE</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── 4. QUICK HELP & KEYBOARD SHORTCUTS ───────────────── */}
      <div
        className="p-6 relative space-y-4"
        style={{
          backgroundColor: "#111111",
          border: "2px solid #111111",
          boxShadow: "3px 3px 0px #111111",
          color: "#FAF7EE",
        }}
      >
        <div className="flex items-center justify-between border-b border-white/20 pb-3">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-[#F05A28]" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">
              ADMIN CONTROL SHORTCUTS & EMERGENCY PROTOCOLS
            </h2>
          </div>
          <span className="text-[10px] text-[#A8A29E] uppercase font-mono">
            [ OPERATOR TERMINAL ]
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 bg-white/5 border border-white/10 space-y-1">
            <span className="text-[#F05A28] font-bold block">[ 1. IMMEDIATE AUDIO CUE ]</span>
            <p className="text-[#A8A29E] text-[11px] leading-relaxed">
              Navigate to Track Catalog and hit '[ ▶ CUE ]' on any signal to instantly audition stream audio without opening external tools.
            </p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 space-y-1">
            <span className="text-[#F05A28] font-bold block">[ 2. INSTANT UNPUBLISH ]</span>
            <p className="text-[#A8A29E] text-[11px] leading-relaxed">
              Toggle publish status to DRAFT with a single click if copyright disputes or audio flaws require immediate suppression.
            </p>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 space-y-1">
            <span className="text-[#F05A28] font-bold block">[ 3. ATLAS TELEMETRY SYNC ]</span>
            <p className="text-[#A8A29E] text-[11px] leading-relaxed">
              Click '[ SYNC DATA ]' in the Control Room hero banner to refresh all live database counts and latency stats in 150ms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
