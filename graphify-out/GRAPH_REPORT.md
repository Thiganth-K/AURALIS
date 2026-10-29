# Graph Report - AURALIS  (2026-10-29)

## Corpus Check
- 119 files · ~153,079 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 576 nodes · 1463 edges · 39 communities (31 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `800fb089`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/page.tsx
- seed.ts
- PlayerContext.tsx
- What You Must Do When Invoked
- AdminShell.tsx
- HomeClient.tsx
- app/layout.tsx
- AURALIS Architecture & Graphify Blueprint
- useAuth
- react
- albums/page.tsx
- compilerOptions
- package.json
- dependencies
- utils.ts
- devDependencies
- scripts
- featured/page.tsx
- proxy.ts
- AppShell.tsx
- auth.ts
- graphify reference: extra exports and benchmark
- playlists/page.tsx
- next
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- eslint.config.mjs
- AGENTS.md
- rules/graphify.md
- extraction-spec.md
- workflows/graphify.md
- types/index.ts
- songs/page.tsx
- check_h1.js
- connectToDatabase

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 98 edges
2. `next` - 63 edges
3. `requireAdmin()` - 45 edges
4. `react` - 38 edges
5. `lucide-react` - 30 edges
6. `Song` - 27 edges
7. `transformSongDocument()` - 24 edges
8. `useAuth()` - 21 edges
9. `requireAuth()` - 21 edges
10. `mongoose` - 20 edges

## Surprising Connections (you probably didn't know these)
- `2. Technology Stack` --references--> `PlayerProvider()`  [INFERRED]
  README.md → src/context/PlayerContext.tsx
- `6. Implementation Roadmap` --references--> `ListeningHistory`  [INFERRED]
  README.md → src/types/index.ts
- `6. Implementation Roadmap` --references--> `Song`  [INFERRED]
  README.md → src/types/index.ts
- `6. Implementation Roadmap` --references--> `User`  [INFERRED]
  README.md → src/types/index.ts
- `6. Implementation Roadmap` --references--> `Artist`  [INFERRED]
  README.md → src/types/index.ts

## Import Cycles
- None detected.

## Communities (39 total, 8 thin omitted)

### Community 0 - "app/page.tsx"
Cohesion: 0.08
Nodes (30): GET(), GET(), GET(), GET(), GET(), GET(), GET(), HomePage() (+22 more)

### Community 1 - "seed.ts"
Cohesion: 0.06
Nodes (27): bcryptjs, cloudinary, ref_crypto, dotenv, ref_fs, ref_node_dns, ref_path, ref_readline (+19 more)

### Community 2 - "PlayerContext.tsx"
Cohesion: 0.33
Nodes (7): HistoryItem, SongCardProps, SongRowProps, PlayerContext, PlayerContextType, RepeatMode, Song

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 4 - "AdminShell.tsx"
Cohesion: 0.32
Nodes (6): AdminLayout(), AdminLayoutProps, instant, AdminShell(), AdminShellProps, navItems

### Community 5 - "HomeClient.tsx"
Cohesion: 0.19
Nodes (19): 6. Implementation Roadmap, LibraryContent(), LibraryPage(), SearchContent(), SearchPage(), HomeClient(), HomeClientProps, SynthwaveHeroIllustration() (+11 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.22
Nodes (7): pixel-retroui, src_app_globals, ibmPlexMono, inter, metadata, RootLayout(), spaceMono

### Community 7 - "AURALIS Architecture & Graphify Blueprint"
Cohesion: 0.11
Nodes (17): 1.1 Presentation Layer Architecture, 1. High-Level System Flow, 2. Phase 2 Layered Data Architecture, 3. Data Flow & Entity Hierarchy, 4. Playback Architecture & Audio Engine, 5. Entity Relationship Diagram (MongoDB / Mongoose), AURALIS Architecture & Graphify Blueprint, 1. Product Overview (+9 more)

### Community 8 - "useAuth"
Cohesion: 0.15
Nodes (15): AdminDashboardPage(), DashboardData, formatDuration(), formatRelativeTime(), AdminUserItem, AdminUsersPage(), WIDE_SOUNDWAVE_BARS, AnimPhase (+7 more)

### Community 9 - "react"
Cohesion: 0.10
Nodes (12): lucide-react, react, AdminNewAlbumPage(), ArtistOption, AdminArtistItem, WIDE_SOUNDWAVE_BARS, GUIDE_SECTIONS, GuideSection (+4 more)

### Community 10 - "albums/page.tsx"
Cohesion: 0.40
Nodes (3): AdminAlbumItem, ArtistOption, WIDE_SOUNDWAVE_BARS

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "package.json"
Cohesion: 0.14
Nodes (13): name, private, version, framer-motion, react-dom, tailwindcss, @tailwindcss/turbopack, tsx (+5 more)

### Community 13 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, cloudinary, clsx, dotenv, framer-motion, jose, lucide-react (+6 more)

### Community 15 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, tsx, @types/bcryptjs, @types/node (+3 more)

### Community 16 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, create-admin, dev, lint, seed, start

### Community 17 - "featured/page.tsx"
Cohesion: 0.25
Nodes (6): AdminFeaturedPage(), AlbumOpt, ArtistOpt, PlaylistOpt, SongOpt, WIDE_SOUNDWAVE_BARS

### Community 18 - "proxy.ts"
Cohesion: 0.40
Nodes (3): jose, config, JWT_SECRET

### Community 19 - "AppShell.tsx"
Cohesion: 0.18
Nodes (15): AppShell(), AppShellProps, MobileNav(), TopBar(), SongCard(), ExpandedPlayer(), GlobalPlayer(), MobilePlayer() (+7 more)

### Community 20 - "auth.ts"
Cohesion: 0.09
Nodes (57): mongoose, cleanCloudinary(), cleanLocalUploads(), cleanMongoDB(), main(), verifyEndToEnd(), instant, instant (+49 more)

### Community 21 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 22 - "playlists/page.tsx"
Cohesion: 0.40
Nodes (3): AdminPlaylistItem, SongOption, WIDE_SOUNDWAVE_BARS

### Community 23 - "next"
Cohesion: 0.31
Nodes (6): nextConfig, next, Logo(), LogoProps, PlaylistSummary, Sidebar()

### Community 24 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 25 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 26 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 27 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 30 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 36 - "types/index.ts"
Cohesion: 0.13
Nodes (19): currentUser, mockAlbums, mockArtists, mockPlaylists, mockSongs, ListeningHistory, PlayerState, PlaylistSong (+11 more)

### Community 37 - "songs/page.tsx"
Cohesion: 0.29
Nodes (6): AdminSongItem, AdminSongsPage(), AlbumOption, ArtistOption, formatDuration(), WIDE_SOUNDWAVE_BARS

### Community 39 - "connectToDatabase"
Cohesion: 0.06
Nodes (57): DELETE(), GET(), PATCH(), GET(), POST(), DELETE(), GET(), PATCH() (+49 more)

## Knowledge Gaps
- **219 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+214 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 252 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `app/page.tsx`, `seed.ts`, `AdminShell.tsx`, `songs/page.tsx`, `app/layout.tsx`, `connectToDatabase`, `useAuth`, `react`, `HomeClient.tsx`, `package.json`, `proxy.ts`, `AppShell.tsx`, `auth.ts`?**
  _High betweenness centrality (0.267) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `PlayerContext.tsx`, `AdminShell.tsx`, `songs/page.tsx`, `HomeClient.tsx`, `useAuth`, `albums/page.tsx`, `package.json`, `featured/page.tsx`, `AppShell.tsx`, `playlists/page.tsx`, `next`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `connectToDatabase()` connect `connectToDatabase` to `app/page.tsx`, `auth.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08205128205128205 - nodes in this community are weakly interconnected._
- **Should `seed.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06190476190476191 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._