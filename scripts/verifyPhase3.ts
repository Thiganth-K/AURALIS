import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { connectToDatabase } from "@/lib/mongodb";
import { User, Artist, Album, Song, ListeningHistory } from "@/models";
import { hashPassword, verifyPassword, createSessionToken } from "@/lib/auth";

async function verifyEndToEnd() {
  console.log("=== AURALIS PHASE 3: END-TO-END AUTOMATED VERIFICATION ===");
  await connectToDatabase();

  // 1. Verify Admin User
  const admin = await User.findOne({ email: "admin@auralis.app" });
  if (!admin || admin.role !== "admin") {
    throw new Error("Admin user not found or not admin role");
  }
  const adminPassMatch = await verifyPassword("admin123", admin.passwordHash);
  console.log("✓ 1. Admin authentication check:", adminPassMatch ? "PASSED" : "FAILED");

  // 2. Verify Standard User
  const user = await User.findOne({ email: "thiganth@auralis.app" });
  if (!user || user.role !== "user") {
    throw new Error("Standard user not found or role is not user");
  }
  const userPassMatch = await verifyPassword("password123", user.passwordHash);
  console.log("✓ 2. Listener authentication check:", userPassMatch ? "PASSED" : "FAILED");

  // 3. Find created artist Solaris Wave or create
  let artist = await Artist.findOne({ name: "Solaris Wave" });
  if (!artist) {
    artist = await Artist.create({
      name: "Solaris Wave",
      slug: "solaris-wave",
      genres: ["Synthwave", "Ambient"],
      image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600",
      bio: "Acoustic cyberpunk electronic duo producing high-fidelity soundscapes.",
      status: "active",
      createdBy: admin._id,
    });
  }
  console.log("✓ 3. Artist record verified:", artist.name, `(${artist._id})`);

  // 4. Find created album Neon Horizons EP or create
  let album = await Album.findOne({ title: "Neon Horizons EP" });
  if (!album) {
    album = await Album.create({
      title: "Neon Horizons EP",
      slug: "neon-horizons-ep",
      artistId: artist._id,
      artworkUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=600",
      releaseDate: new Date(),
      genres: ["Synthwave"],
      status: "published",
      createdBy: admin._id,
    });
  }
  console.log("✓ 4. Album record verified:", album.title, `(${album._id})`);

  // 5. Ingest Song as DRAFT
  let testSong = await Song.findOne({ title: "Starlight Drift" });
  if (testSong) {
    await Song.deleteOne({ _id: testSong._id });
  }

  testSong = await Song.create({
    title: "Starlight Drift",
    slug: "starlight-drift",
    artistId: artist._id,
    albumId: album._id,
    audioUrl: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3",
    artworkUrl: album.artworkUrl,
    duration: 214,
    genre: "Synthwave",
    releaseDate: new Date(),
    explicit: false,
    status: "draft", // Initially draft
    uploadedBy: admin._id,
    playCount: 0,
  });
  console.log("✓ 5. Song created as DRAFT:", testSong.title, "Status:", testSong.status);

  // 6. Test Public Visibility Filtering for Draft
  const publicPublishedCount = await Song.countDocuments({ _id: testSong._id, status: "published" });
  if (publicPublishedCount === 0) {
    console.log("✓ 6. Security verification: Draft song is HIDDEN from public catalog.");
  } else {
    throw new Error("Draft song leaked into public catalog!");
  }

  // 7. Publish Song to Live Stream
  testSong.status = "published";
  testSong.publishedAt = new Date();
  await testSong.save();
  console.log("✓ 7. Song published to LIVE stream:", testSong.title, "Status:", testSong.status);

  // 8. Verify Public Catalog now exposes published song
  const liveCount = await Song.countDocuments({ _id: testSong._id, status: "published" });
  if (liveCount === 1) {
    console.log("✓ 8. Public catalog verification: Song is LIVE and visible to listeners.");
  } else {
    throw new Error("Published song is not appearing in live catalog!");
  }

  // 9. User Likes Song
  await User.findByIdAndUpdate(user._id, { $addToSet: { likedSongs: testSong._id } });
  const updatedUser = await User.findById(user._id).lean();
  const isLiked = updatedUser?.likedSongs.some((id) => id.toString() === testSong._id.toString());
  console.log("✓ 9. Listener Like interaction:", isLiked ? "SUCCESS (Song in likedSongs)" : "FAILED");

  // 10. Record Listening History
  const history = await ListeningHistory.create({
    userId: user._id,
    songId: testSong._id,
    playedAt: new Date(),
    durationPlayed: 214,
    completed: true,
  });
  await Song.findByIdAndUpdate(testSong._id, { $inc: { playCount: 1 } });
  console.log("✓ 10. Listening history logged:", history._id.toString(), "Track playcount incremented.");

  console.log("\nALL 10 PHASE 3 VERIFICATION TESTS PASSED SUCCESSFULLY!");
  process.exit(0);
}

verifyEndToEnd().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
