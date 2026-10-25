import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import dns from "node:dns";
import bcrypt from "bcryptjs";

try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {}

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { User } from "../src/models/User";
import { Artist } from "../src/models/Artist";
import { Album } from "../src/models/Album";
import { Song } from "../src/models/Song";
import { Playlist } from "../src/models/Playlist";
import { ListeningHistory } from "../src/models/ListeningHistory";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ Error: MONGODB_URI environment variable is not set.");
  console.error("Please define MONGODB_URI in .env.local before running seed.");
  process.exit(1);
}

// Sample royalty-free audio tracks for development
const AUDIO_SAMPLES = [
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
];

async function seed() {
  console.log("🌌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB database.");

  console.log("🧹 Clearing existing development music catalog (idempotent seed)...");
  await Promise.all([
    Artist.deleteMany({}),
    Album.deleteMany({}),
    Song.deleteMany({}),
    Playlist.deleteMany({}),
    ListeningHistory.deleteMany({}),
    User.deleteMany({ email: { $in: ["thiganth@auralis.app", "admin@auralis.app"] } }),
  ]);

  // 1. CREATE DEMO USER & ADMIN
  console.log("👤 Creating primary user & administrator...");
  const salt = await bcrypt.genSalt(10);
  const userPasswordHash = await bcrypt.hash("password123", salt);
  const adminPasswordHash = await bcrypt.hash("admin123", salt);

  const user = await User.create({
    name: "Thiganth",
    email: "thiganth@auralis.app",
    passwordHash: userPasswordHash,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    role: "user",
    status: "active",
    likedSongs: [],
    followedArtists: [],
    recentlyPlayed: [],
  });

  const admin = await User.create({
    name: "Auralis Administrator",
    email: "admin@auralis.app",
    passwordHash: adminPasswordHash,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    role: "admin",
    status: "active",
    likedSongs: [],
    followedArtists: [],
    recentlyPlayed: [],
  });

  // 2. CREATE 8 ARTISTS
  console.log("🎨 Creating 8 artists...");
  const artistsData = [
    {
      name: "Komorebi Echoes",
      slug: "komorebi-echoes",
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      bio: "Tokyo-born ambient electronic duo weaving granular synthesizers with warm tape loops and field recordings.",
      genres: ["Ambient", "Chillwave", "IDM"],
      followerCount: 482910,
    },
    {
      name: "Sienna Vance",
      slug: "sienna-vance",
      image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
      bio: "London neo-soul vocalist combining intimate acoustic piano with sub-heavy UK garage rhythms.",
      genres: ["Neo-Soul", "R&B", "Future Garage"],
      followerCount: 1240000,
    },
    {
      name: "CYBERPULSE",
      slug: "cyberpulse",
      image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
      bio: "Berlin-based synthwave and dark electro architect known for cinematic arpeggios and punchy analog drums.",
      genres: ["Synthwave", "Cyberpunk", "Electro"],
      followerCount: 890450,
    },
    {
      name: "Elysian Drift",
      slug: "elysian-drift",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
      bio: "Progressive house producer crafting sun-drenched melodies and hypnotic club progressions.",
      genres: ["Melodic House", "Deep Techno"],
      followerCount: 673200,
    },
    {
      name: "Aetheria Strings",
      slug: "aetheria-strings",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
      bio: "Contemporary neoclassical ensemble bridging orchestral violins and minimalist modular synths.",
      genres: ["Neoclassical", "Cinematic", "Minimalist"],
      followerCount: 341800,
    },
    {
      name: "Velvet Frequency",
      slug: "velvet-frequency",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
      bio: "Downtempo and lo-fi jazz collective blending muted brass with nostalgic vinyl crackle.",
      genres: ["Lo-Fi", "Jazzhop", "Downtempo"],
      followerCount: 955200,
    },
    {
      name: "Nova Mirage",
      slug: "nova-mirage",
      image: "https://images.unsplash.com/photo-1520523839898-50712825e3a7?auto=format&fit=crop&w=600&q=80",
      bio: "Ethereal dream-pop songwriter with reverb-drenched guitars and melancholic vocal harmonies.",
      genres: ["Dream Pop", "Shoegaze", "Indie"],
      followerCount: 512300,
    },
    {
      name: "Solaris Unit",
      slug: "solaris-unit",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80",
      bio: "Futuristic drum & bass project delivering razor-sharp basslines and liquid atmospheric textures.",
      genres: ["Liquid DnB", "Bass Music"],
      followerCount: 419800,
    },
  ];

  const createdArtists = await Artist.insertMany(artistsData);
  const artistMap = new Map<string, mongoose.Types.ObjectId>();
  createdArtists.forEach((a) => artistMap.set(a.slug, a._id as mongoose.Types.ObjectId));

  // 3. CREATE 6 ALBUMS
  console.log("💿 Creating 6 albums...");
  const albumsData = [
    {
      title: "Nocturne Continuum",
      slug: "nocturne-continuum",
      artistId: artistMap.get("komorebi-echoes"),
      artworkUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      releaseDate: new Date("2025-11-14"),
      genres: ["Ambient", "Chillwave"],
      description: "A meditative auditory journey through twilight soundscapes and analog delay.",
    },
    {
      title: "Midnight Glasshouse",
      slug: "midnight-glasshouse",
      artistId: artistMap.get("sienna-vance"),
      artworkUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",
      releaseDate: new Date("2026-02-08"),
      genres: ["Neo-Soul", "R&B"],
      description: "Intimate vocals, rhodes textures, and sub-heavy London garage percussion.",
    },
    {
      title: "Neon Horizon 2099",
      slug: "neon-horizon-2099",
      artistId: artistMap.get("cyberpulse"),
      artworkUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
      releaseDate: new Date("2025-08-20"),
      genres: ["Synthwave", "Cyberpunk"],
      description: "High-octane analog synthesizers inspired by dystopian cybernetic horizons.",
    },
    {
      title: "Sunfall Mirage",
      slug: "sunfall-mirage",
      artistId: artistMap.get("elysian-drift"),
      artworkUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
      releaseDate: new Date("2026-01-15"),
      genres: ["Melodic House", "Deep Techno"],
      description: "Euphoric festival progressions and deep bass grooves designed for golden hour.",
    },
    {
      title: "Chronicles in Resonance",
      slug: "chronicles-in-resonance",
      artistId: artistMap.get("aetheria-strings"),
      artworkUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      releaseDate: new Date("2025-10-02"),
      genres: ["Neoclassical", "Cinematic"],
      description: "Expansive acoustic cello and violin motifs interwoven with modular synth patches.",
    },
    {
      title: "Static & Silk",
      slug: "static-and-silk",
      artistId: artistMap.get("velvet-frequency"),
      artworkUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
      releaseDate: new Date("2026-03-01"),
      genres: ["Lo-Fi", "Jazzhop"],
      description: "Warm tape distortion, mellow muted trumpet melodies, and dusty vinyl crackle.",
    },
  ];

  const createdAlbums = await Album.insertMany(albumsData);
  const albumMap = new Map<string, mongoose.Types.ObjectId>();
  createdAlbums.forEach((alb) => albumMap.set(alb.slug, alb._id as mongoose.Types.ObjectId));

  // 4. CREATE 30 COHERENT SONGS
  console.log("🎵 Creating 30 coherent songs...");
  const rawSongs = [
    // Album 1: Nocturne Continuum (Komorebi Echoes) - 5 tracks
    {
      title: "Fragments of Aurora",
      slug: "fragments-of-aurora",
      artistSlug: "komorebi-echoes",
      albumSlug: "nocturne-continuum",
      duration: 228,
      genre: "Ambient",
      artworkUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[0],
      playCount: 1420900,
      releaseDate: new Date("2025-11-14"),
    },
    {
      title: "Subtle Luminescence",
      slug: "subtle-luminescence",
      artistSlug: "komorebi-echoes",
      albumSlug: "nocturne-continuum",
      duration: 245,
      genre: "Ambient",
      artworkUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[1],
      playCount: 910400,
      releaseDate: new Date("2025-11-14"),
    },
    {
      title: "Granular Raindrops",
      slug: "granular-raindrops",
      artistSlug: "komorebi-echoes",
      albumSlug: "nocturne-continuum",
      duration: 210,
      genre: "Chillwave",
      artworkUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[2],
      playCount: 520100,
      releaseDate: new Date("2025-11-14"),
    },
    {
      title: "Komorebi Skyline",
      slug: "komorebi-skyline",
      artistSlug: "komorebi-echoes",
      albumSlug: "nocturne-continuum",
      duration: 260,
      genre: "Ambient",
      artworkUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[3],
      playCount: 380500,
      releaseDate: new Date("2025-11-14"),
    },
    {
      title: "Tape Loop Memory",
      slug: "tape-loop-memory",
      artistSlug: "komorebi-echoes",
      albumSlug: "nocturne-continuum",
      duration: 195,
      genre: "IDM",
      artworkUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[4],
      playCount: 710000,
      releaseDate: new Date("2025-11-14"),
    },

    // Album 2: Midnight Glasshouse (Sienna Vance) - 5 tracks
    {
      title: "Velvet Daylight",
      slug: "velvet-daylight",
      artistSlug: "sienna-vance",
      albumSlug: "midnight-glasshouse",
      duration: 252,
      genre: "Neo-Soul",
      artworkUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[1],
      playCount: 3840200,
      releaseDate: new Date("2026-02-08"),
    },
    {
      title: "Warm Analog Dreams",
      slug: "warm-analog-dreams",
      artistSlug: "sienna-vance",
      albumSlug: "midnight-glasshouse",
      duration: 205,
      genre: "Neo-Soul",
      artworkUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[2],
      playCount: 1450000,
      releaseDate: new Date("2026-02-08"),
    },
    {
      title: "Glasshouse Silhouette",
      slug: "glasshouse-silhouette",
      artistSlug: "sienna-vance",
      albumSlug: "midnight-glasshouse",
      duration: 230,
      genre: "R&B",
      artworkUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[3],
      playCount: 920000,
      releaseDate: new Date("2026-02-08"),
    },
    {
      title: "East London Rain",
      slug: "east-london-rain",
      artistSlug: "sienna-vance",
      albumSlug: "midnight-glasshouse",
      duration: 218,
      genre: "Future Garage",
      artworkUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[0],
      playCount: 680000,
      releaseDate: new Date("2026-02-08"),
    },
    {
      title: "Subtle Resonance",
      slug: "subtle-resonance",
      artistSlug: "sienna-vance",
      albumSlug: "midnight-glasshouse",
      duration: 240,
      genre: "Neo-Soul",
      artworkUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[4],
      playCount: 1120000,
      releaseDate: new Date("2026-02-08"),
    },

    // Album 3: Neon Horizon 2099 (CYBERPULSE) - 5 tracks
    {
      title: "Overdrive Velocity",
      slug: "overdrive-velocity",
      artistSlug: "cyberpulse",
      albumSlug: "neon-horizon-2099",
      duration: 195,
      genre: "Synthwave",
      artworkUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[2],
      playCount: 2150000,
      releaseDate: new Date("2025-08-20"),
    },
    {
      title: "Laser Grid Expressway",
      slug: "laser-grid-expressway",
      artistSlug: "cyberpulse",
      albumSlug: "neon-horizon-2099",
      duration: 220,
      genre: "Cyberpunk",
      artworkUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[3],
      playCount: 1670000,
      releaseDate: new Date("2025-08-20"),
    },
    {
      title: "Chasing Chrome",
      slug: "chasing-chrome",
      artistSlug: "cyberpulse",
      albumSlug: "neon-horizon-2099",
      duration: 188,
      genre: "Synthwave",
      artworkUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[0],
      playCount: 890400,
      releaseDate: new Date("2025-08-20"),
    },
    {
      title: "Analog Protocol",
      slug: "analog-protocol",
      artistSlug: "cyberpulse",
      albumSlug: "neon-horizon-2099",
      duration: 204,
      genre: "Electro",
      artworkUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[1],
      playCount: 760200,
      releaseDate: new Date("2025-08-20"),
    },
    {
      title: "Midnight Transmission",
      slug: "midnight-transmission",
      artistSlug: "cyberpulse",
      albumSlug: "neon-horizon-2099",
      duration: 242,
      genre: "Synthwave",
      artworkUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[4],
      playCount: 1320000,
      releaseDate: new Date("2025-08-20"),
    },

    // Album 4: Sunfall Mirage (Elysian Drift) - 5 tracks
    {
      title: "Golden Hour Mirage",
      slug: "golden-hour-mirage",
      artistSlug: "elysian-drift",
      albumSlug: "sunfall-mirage",
      duration: 310,
      genre: "Melodic House",
      artworkUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[3],
      playCount: 980400,
      releaseDate: new Date("2026-01-15"),
    },
    {
      title: "Ibiza Reverie",
      slug: "ibiza-reverie",
      artistSlug: "elysian-drift",
      albumSlug: "sunfall-mirage",
      duration: 295,
      genre: "Melodic House",
      artworkUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[0],
      playCount: 740000,
      releaseDate: new Date("2026-01-15"),
    },
    {
      title: "Oceanic Frequency",
      slug: "oceanic-frequency",
      artistSlug: "elysian-drift",
      albumSlug: "sunfall-mirage",
      duration: 325,
      genre: "Deep Techno",
      artworkUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[2],
      playCount: 560000,
      releaseDate: new Date("2026-01-15"),
    },
    {
      title: "Elysian Ascent",
      slug: "elysian-ascent",
      artistSlug: "elysian-drift",
      albumSlug: "sunfall-mirage",
      duration: 280,
      genre: "Melodic House",
      artworkUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[4],
      playCount: 610000,
      releaseDate: new Date("2026-01-15"),
    },
    {
      title: "Dusk Progression",
      slug: "dusk-progression",
      artistSlug: "elysian-drift",
      albumSlug: "sunfall-mirage",
      duration: 340,
      genre: "Deep Techno",
      artworkUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[1],
      playCount: 490000,
      releaseDate: new Date("2026-01-15"),
    },

    // Album 5: Chronicles in Resonance (Aetheria Strings) - 5 tracks
    {
      title: "Celestial Architecture",
      slug: "celestial-architecture",
      artistSlug: "aetheria-strings",
      albumSlug: "chronicles-in-resonance",
      duration: 264,
      genre: "Neoclassical",
      artworkUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[4],
      playCount: 750100,
      releaseDate: new Date("2025-10-02"),
    },
    {
      title: "Adagio for Modular Synth",
      slug: "adagio-for-modular-synth",
      artistSlug: "aetheria-strings",
      albumSlug: "chronicles-in-resonance",
      duration: 275,
      genre: "Neoclassical",
      artworkUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[0],
      playCount: 420000,
      releaseDate: new Date("2025-10-02"),
    },
    {
      title: "Oscillations in D Minor",
      slug: "oscillations-in-d-minor",
      artistSlug: "aetheria-strings",
      albumSlug: "chronicles-in-resonance",
      duration: 248,
      genre: "Cinematic",
      artworkUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[1],
      playCount: 310000,
      releaseDate: new Date("2025-10-02"),
    },
    {
      title: "Echoes of Antiquity",
      slug: "echoes-of-antiquity",
      artistSlug: "aetheria-strings",
      albumSlug: "chronicles-in-resonance",
      duration: 290,
      genre: "Minimalist",
      artworkUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[2],
      playCount: 290000,
      releaseDate: new Date("2025-10-02"),
    },
    {
      title: "Symphonic Pulse",
      slug: "symphonic-pulse",
      artistSlug: "aetheria-strings",
      albumSlug: "chronicles-in-resonance",
      duration: 235,
      genre: "Cinematic",
      artworkUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[3],
      playCount: 510000,
      releaseDate: new Date("2025-10-02"),
    },

    // Album 6: Static & Silk (Velvet Frequency) - 5 tracks
    {
      title: "Muted Raincoat",
      slug: "muted-raincoat",
      artistSlug: "velvet-frequency",
      albumSlug: "static-and-silk",
      duration: 168,
      genre: "Lo-Fi",
      artworkUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[0],
      playCount: 1640000,
      releaseDate: new Date("2026-03-01"),
    },
    {
      title: "Coffee Steam & Vinyl",
      slug: "coffee-steam-and-vinyl",
      artistSlug: "velvet-frequency",
      albumSlug: "static-and-silk",
      duration: 154,
      genre: "Jazzhop",
      artworkUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[1],
      playCount: 1210000,
      releaseDate: new Date("2026-03-01"),
    },
    {
      title: "Saturday Slumber",
      slug: "saturday-slumber",
      artistSlug: "velvet-frequency",
      albumSlug: "static-and-silk",
      duration: 182,
      genre: "Downtempo",
      artworkUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[2],
      playCount: 940000,
      releaseDate: new Date("2026-03-01"),
    },
    {
      title: "Midnight Bookstore",
      slug: "midnight-bookstore",
      artistSlug: "velvet-frequency",
      albumSlug: "static-and-silk",
      duration: 176,
      genre: "Lo-Fi",
      artworkUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[3],
      playCount: 880000,
      releaseDate: new Date("2026-03-01"),
    },
    {
      title: "Dusty Rhodes",
      slug: "dusty-rhodes",
      artistSlug: "velvet-frequency",
      albumSlug: "static-and-silk",
      duration: 165,
      genre: "Jazzhop",
      artworkUrl: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80",
      audioUrl: AUDIO_SAMPLES[4],
      playCount: 1410000,
      releaseDate: new Date("2026-03-01"),
    },
  ];

  const songsData = rawSongs.map((s) => ({
    title: s.title,
    slug: s.slug,
    artistId: artistMap.get(s.artistSlug),
    albumId: albumMap.get(s.albumSlug),
    duration: s.duration,
    genre: s.genre,
    artworkUrl: s.artworkUrl,
    audioUrl: s.audioUrl,
    playCount: s.playCount,
    releaseDate: s.releaseDate,
    explicit: false,
  }));

  const createdSongs = await Song.insertMany(songsData);
  console.log(`Successfully inserted ${createdSongs.length} songs.`);

  // Update demo user with liked songs
  const likedSongIds = createdSongs.slice(0, 5).map((s) => s._id);
  await User.findByIdAndUpdate(user._id, {
    likedSongs: likedSongIds,
    followedArtists: [createdArtists[0]._id, createdArtists[1]._id],
  });

  // 5. CREATE 5 CURATED PLAYLISTS
  console.log("📑 Creating 5 playlists...");
  const playlistsData = [
    {
      name: "Night Drive Synth",
      slug: "night-drive-synth",
      description: "Deep analog arpeggios, retrowave pulses, and midnight cruising rhythms.",
      artworkUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80",
      ownerId: user._id,
      isPublic: true,
      isCurated: true,
      songs: [
        { songId: createdSongs[10]._id, position: 1 },
        { songId: createdSongs[11]._id, position: 2 },
        { songId: createdSongs[12]._id, position: 3 },
        { songId: createdSongs[13]._id, position: 4 },
        { songId: createdSongs[14]._id, position: 5 },
        { songId: createdSongs[0]._id, position: 6 },
      ],
    },
    {
      name: "Deep Focus & Granular Flow",
      slug: "deep-focus-granular-flow",
      description: "Zero vocal distraction. Ambient tape loops, modular synthesis, and generative frequencies.",
      artworkUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
      ownerId: user._id,
      isPublic: true,
      isCurated: true,
      songs: [
        { songId: createdSongs[0]._id, position: 1 },
        { songId: createdSongs[1]._id, position: 2 },
        { songId: createdSongs[2]._id, position: 3 },
        { songId: createdSongs[3]._id, position: 4 },
        { songId: createdSongs[20]._id, position: 5 },
        { songId: createdSongs[21]._id, position: 6 },
      ],
    },
    {
      name: "Velvet Neo-Soul Atelier",
      slug: "velvet-neo-soul-atelier",
      description: "Warm rhodes chords, intimate vocals, and effortless modern groove.",
      artworkUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=600&q=80",
      ownerId: user._id,
      isPublic: true,
      isCurated: true,
      songs: [
        { songId: createdSongs[5]._id, position: 1 },
        { songId: createdSongs[6]._id, position: 2 },
        { songId: createdSongs[7]._id, position: 3 },
        { songId: createdSongs[8]._id, position: 4 },
        { songId: createdSongs[9]._id, position: 5 },
        { songId: createdSongs[25]._id, position: 6 },
      ],
    },
    {
      name: "Pulse & Bassline",
      slug: "pulse-and-bassline",
      description: "Peak-hour melodic techno and future garage for late nights.",
      artworkUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
      ownerId: user._id,
      isPublic: true,
      isCurated: true,
      songs: [
        { songId: createdSongs[15]._id, position: 1 },
        { songId: createdSongs[16]._id, position: 2 },
        { songId: createdSongs[17]._id, position: 3 },
        { songId: createdSongs[18]._id, position: 4 },
        { songId: createdSongs[19]._id, position: 5 },
        { songId: createdSongs[10]._id, position: 6 },
      ],
    },
    {
      name: "Auralis Weekly Discovery",
      slug: "auralis-weekly-discovery",
      description: "Your personalized acoustic signature curated every Monday morning.",
      artworkUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80",
      ownerId: user._id,
      isPublic: true,
      isCurated: true,
      songs: [
        { songId: createdSongs[0]._id, position: 1 },
        { songId: createdSongs[5]._id, position: 2 },
        { songId: createdSongs[10]._id, position: 3 },
        { songId: createdSongs[15]._id, position: 4 },
        { songId: createdSongs[20]._id, position: 5 },
        { songId: createdSongs[25]._id, position: 6 },
      ],
    },
  ];

  await Playlist.insertMany(playlistsData);
  console.log("Successfully created 5 curated playlists.");

  // Summary statistics
  const [artistCount, albumCount, songCount, playlistCount] = await Promise.all([
    Artist.countDocuments(),
    Album.countDocuments(),
    Song.countDocuments(),
    Playlist.countDocuments(),
  ]);

  console.log("\n=========================================");
  console.log("🎉 AURALIS DATABASE SEED COMPLETE!");
  console.log(`- Artists:   ${artistCount} (expected 8)`);
  console.log(`- Albums:    ${albumCount} (expected 6)`);
  console.log(`- Songs:     ${songCount} (expected 30)`);
  console.log(`- Playlists: ${playlistCount} (expected 5)`);
  console.log("=========================================\n");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
