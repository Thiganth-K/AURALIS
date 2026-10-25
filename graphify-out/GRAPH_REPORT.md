# Graph Report - AURALIS  (2026-10-26)

## Corpus Check
- 118 files · ~134,842 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 557 nodes · 1432 edges · 39 communities (29 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65417283`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- albumService.ts
- connectToDatabase
- auth.ts
- What You Must Do When Invoked
- lucide-react
- types/index.ts
- ExpandedPlayer.tsx
- AURALIS Architecture & Graphify Blueprint
- useAuth
- react
- AdminShell.tsx
- compilerOptions
- package.json
- dependencies
- songs/new/page.tsx
- devDependencies
- scripts
- featured/page.tsx
- middleware.ts
- next
- upload/route.ts
- graphify reference: extra exports and benchmark
- Playlist.ts
- AppShell
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
- utils.ts
- albums/new/page.tsx
- admin/page.tsx
- check_h1.js

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 97 edges
2. `next` - 62 edges
3. `requireAdmin()` - 45 edges
4. `react` - 37 edges
5. `lucide-react` - 29 edges
6. `Song` - 27 edges
7. `transformSongDocument()` - 24 edges
8. `requireAuth()` - 21 edges
9. `mongoose` - 20 edges
10. `usePlayer()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `2. Technology Stack` --references--> `PlayerProvider()`  [INFERRED]
  README.md → src/context/PlayerContext.tsx
- `6. Implementation Roadmap` --references--> `ListeningHistory`  [INFERRED]
  README.md → src/types/index.ts
- `6. Implementation Roadmap` --references--> `Song`  [INFERRED]
  README.md → src/types/index.ts
- `6. Implementation Roadmap` --references--> `Artist`  [INFERRED]
  README.md → src/types/index.ts
- `6. Implementation Roadmap` --references--> `Album`  [INFERRED]
  README.md → src/types/index.ts

## Import Cycles
- None detected.

## Communities (39 total, 10 thin omitted)

### Community 0 - "albumService.ts"
Cohesion: 0.16
Nodes (17): GET(), GET(), GET(), GET(), GET(), getAlbumById(), getAlbums(), getNewReleases() (+9 more)

### Community 1 - "connectToDatabase"
Cohesion: 0.06
Nodes (63): DELETE(), GET(), instant, PATCH(), GET(), POST(), DELETE(), GET() (+55 more)

### Community 2 - "auth.ts"
Cohesion: 0.06
Nodes (75): bcryptjs, dotenv, mongoose, ref_node_dns, ref_path, ref_readline, cleanCloudinary(), cleanLocalUploads() (+67 more)

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 4 - "lucide-react"
Cohesion: 0.28
Nodes (9): lucide-react, AppShellProps, MobileNav(), SongCard(), GlobalPlayer(), MobilePlayer(), QueueDrawer(), PlayerContext (+1 more)

### Community 5 - "types/index.ts"
Cohesion: 0.08
Nodes (48): 6. Implementation Roadmap, HistoryItem, LibraryContent(), LibraryPage(), HomePage(), instant, SearchContent(), SearchPage() (+40 more)

### Community 6 - "ExpandedPlayer.tsx"
Cohesion: 0.33
Nodes (6): AdminSongItem, AdminSongsPage(), ExpandedPlayer(), RetroAudioVisualizer(), RetroAudioVisualizerProps, formatTime()

### Community 7 - "AURALIS Architecture & Graphify Blueprint"
Cohesion: 0.11
Nodes (17): 1.1 Presentation Layer Architecture, 1. High-Level System Flow, 2. Phase 2 Layered Data Architecture, 3. Data Flow & Entity Hierarchy, 4. Playback Architecture & Audio Engine, 5. Entity Relationship Diagram (MongoDB / Mongoose), AURALIS Architecture & Graphify Blueprint, 1. Product Overview (+9 more)

### Community 8 - "useAuth"
Cohesion: 0.20
Nodes (11): AdminUserItem, AdminUsersPage(), AnimPhase, LoginPage(), RegisterPage(), TopBar(), AuthContext, AuthContextType (+3 more)

### Community 9 - "react"
Cohesion: 0.14
Nodes (6): react, AdminAlbumItem, ArtistOption, AdminArtistItem, AdminPlaylistItem, SongOption

### Community 10 - "AdminShell.tsx"
Cohesion: 0.32
Nodes (6): AdminLayout(), AdminLayoutProps, instant, AdminShell(), AdminShellProps, navItems

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "package.json"
Cohesion: 0.12
Nodes (14): name, private, version, framer-motion, pixel-retroui, react-dom, tailwindcss, @tailwindcss/turbopack (+6 more)

### Community 13 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, cloudinary, clsx, dotenv, framer-motion, jose, lucide-react (+6 more)

### Community 14 - "songs/new/page.tsx"
Cohesion: 0.40
Nodes (3): AdminNewSongPage(), AlbumOption, ArtistOption

### Community 15 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/turbopack, tsx, @types/bcryptjs, @types/node (+3 more)

### Community 16 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, clean, create-admin, dev, lint, seed, start

### Community 17 - "featured/page.tsx"
Cohesion: 0.29
Nodes (5): AdminFeaturedPage(), AlbumOpt, ArtistOpt, PlaylistOpt, SongOpt

### Community 18 - "middleware.ts"
Cohesion: 0.40
Nodes (3): jose, config, JWT_SECRET

### Community 19 - "next"
Cohesion: 0.24
Nodes (6): nextConfig, next, Logo(), LogoProps, PlaylistSummary, Sidebar()

### Community 20 - "upload/route.ts"
Cohesion: 0.25
Nodes (7): cloudinary, ref_crypto, ref_fs, ALLOWED_AUDIO_EXTENSIONS, ALLOWED_IMAGE_EXTENSIONS, instant, POST()

### Community 21 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 22 - "Playlist.ts"
Cohesion: 0.40
Nodes (4): IPlaylist, IPlaylistSong, PlaylistSchema, PlaylistSongSchema

### Community 23 - "AppShell"
Cohesion: 0.22
Nodes (8): src_app_globals, ibmPlexMono, inter, metadata, RootLayout(), spaceMono, AppShell(), PlayerProvider()

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

## Knowledge Gaps
- **207 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+202 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 238 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `albumService.ts`, `connectToDatabase`, `auth.ts`, `albums/new/page.tsx`, `admin/page.tsx`, `ExpandedPlayer.tsx`, `types/index.ts`, `useAuth`, `react`, `AdminShell.tsx`, `lucide-react`, `package.json`, `songs/new/page.tsx`, `middleware.ts`, `upload/route.ts`, `AppShell`?**
  _High betweenness centrality (0.258) - this node is a cross-community bridge._
- **Why does `connectToDatabase()` connect `connectToDatabase` to `albumService.ts`, `auth.ts`, `types/index.ts`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `albums/new/page.tsx`, `admin/page.tsx`, `ExpandedPlayer.tsx`, `types/index.ts`, `useAuth`, `lucide-react`, `AdminShell.tsx`, `package.json`, `songs/new/page.tsx`, `featured/page.tsx`, `next`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _207 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `connectToDatabase` be split into smaller, more focused modules?**
  _Cohesion score 0.05548654244306418 - nodes in this community are weakly interconnected._
- **Should `auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.060419790104947524 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._