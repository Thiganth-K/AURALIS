# Graph Report - AURALIS  (2026-10-25)

## Corpus Check
- 114 files · ~66,182 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 545 nodes · 1403 edges · 35 communities (28 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `46c39f10`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/page.tsx
- connectToDatabase
- mongoose
- What You Must Do When Invoked
- AppShell.tsx
- HomeClient.tsx
- login/route.ts
- AURALIS Architecture & Graphify Blueprint
- AuthContext.tsx
- react
- types/index.ts
- compilerOptions
- package.json
- dependencies
- lucide-react
- devDependencies
- scripts
- featured/page.tsx
- middleware.ts
- next
- eslint.config.mjs
- graphify reference: extra exports and benchmark
- upload/route.ts
- app/layout.tsx
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- getSongById
- AGENTS.md
- rules/graphify.md
- extraction-spec.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 97 edges
2. `next` - 62 edges
3. `requireAdmin()` - 45 edges
4. `react` - 34 edges
5. `lucide-react` - 28 edges
6. `Song` - 27 edges
7. `transformSongDocument()` - 24 edges
8. `requireAuth()` - 21 edges
9. `mongoose` - 20 edges
10. `User` - 17 edges

## Surprising Connections (you probably didn't know these)
- `6. Implementation Roadmap` --references--> `ListeningHistory`  [INFERRED]
  README.md → src/types/index.ts
- `2. Technology Stack` --references--> `PlayerProvider()`  [INFERRED]
  README.md → src/context/PlayerContext.tsx
- `6. Implementation Roadmap` --references--> `Song`  [INFERRED]
  README.md → src/types/index.ts
- `6. Implementation Roadmap` --references--> `User`  [INFERRED]
  README.md → src/types/index.ts
- `6. Implementation Roadmap` --references--> `Artist`  [INFERRED]
  README.md → src/types/index.ts

## Import Cycles
- None detected.

## Communities (35 total, 7 thin omitted)

### Community 0 - "app/page.tsx"
Cohesion: 0.08
Nodes (34): GET(), GET(), GET(), GET(), GET(), GET(), GET(), GET() (+26 more)

### Community 1 - "connectToDatabase"
Cohesion: 0.07
Nodes (88): DELETE(), GET(), instant, PATCH(), GET(), instant, POST(), DELETE() (+80 more)

### Community 2 - "mongoose"
Cohesion: 0.08
Nodes (25): bcryptjs, dotenv, mongoose, ref_node_dns, ref_path, ref_readline, ask(), run() (+17 more)

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 4 - "AppShell.tsx"
Cohesion: 0.18
Nodes (14): 2. Technology Stack, AdminSongItem, AdminSongsPage(), AppShell(), AppShellProps, MobileNav(), TopBar(), GlobalPlayer() (+6 more)

### Community 5 - "HomeClient.tsx"
Cohesion: 0.24
Nodes (17): 6. Implementation Roadmap, SearchContent(), SearchPage(), HomeClient(), HomeClientProps, AlbumCard(), AlbumCardProps, ArtistCard() (+9 more)

### Community 6 - "login/route.ts"
Cohesion: 0.15
Nodes (14): cleanCloudinary(), cleanLocalUploads(), cleanMongoDB(), main(), verifyEndToEnd(), POST(), GET(), POST() (+6 more)

### Community 7 - "AURALIS Architecture & Graphify Blueprint"
Cohesion: 0.11
Nodes (16): 1.1 Presentation Layer Architecture, 1. High-Level System Flow, 2. Phase 2 Layered Data Architecture, 3. Data Flow & Entity Hierarchy, 4. Playback Architecture & Audio Engine, 5. Entity Relationship Diagram (MongoDB / Mongoose), AURALIS Architecture & Graphify Blueprint, 1. Product Overview (+8 more)

### Community 8 - "AuthContext.tsx"
Cohesion: 0.15
Nodes (14): AdminLayout(), AdminLayoutProps, instant, AdminUserItem, AdminUsersPage(), LoginPage(), RegisterPage(), AdminShell() (+6 more)

### Community 9 - "react"
Cohesion: 0.13
Nodes (10): react, AdminAlbumItem, ArtistOption, AdminArtistItem, AdminPlaylistItem, SongOption, Logo(), LogoProps (+2 more)

### Community 10 - "types/index.ts"
Cohesion: 0.13
Nodes (19): currentUser, mockAlbums, mockArtists, mockPlaylists, mockSongs, ListeningHistory, PlayerState, PlaylistSong (+11 more)

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "package.json"
Cohesion: 0.12
Nodes (15): name, private, version, clsx, framer-motion, react-dom, tailwind-merge, tailwindcss (+7 more)

### Community 13 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, cloudinary, clsx, dotenv, framer-motion, jose, lucide-react (+6 more)

### Community 14 - "lucide-react"
Cohesion: 0.25
Nodes (10): lucide-react, HistoryItem, LibraryContent(), LibraryPage(), SongCardProps, SongRowProps, PlayerContext, PlayerContextType (+2 more)

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
Cohesion: 0.10
Nodes (9): nextConfig, next, AdminNewAlbumPage(), ArtistOption, AdminDashboardPage(), DashboardData, AdminNewSongPage(), AlbumOption (+1 more)

### Community 20 - "eslint.config.mjs"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 21 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 22 - "upload/route.ts"
Cohesion: 0.25
Nodes (7): cloudinary, ref_crypto, ref_fs, ALLOWED_AUDIO_EXTENSIONS, ALLOWED_IMAGE_EXTENSIONS, instant, POST()

### Community 23 - "app/layout.tsx"
Cohesion: 0.25
Nodes (6): pixel-retroui, src_app_globals, geistMono, geistSans, metadata, RootLayout()

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

## Knowledge Gaps
- **203 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+198 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 233 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `app/page.tsx`, `connectToDatabase`, `AppShell.tsx`, `HomeClient.tsx`, `login/route.ts`, `AuthContext.tsx`, `react`, `package.json`, `lucide-react`, `middleware.ts`, `upload/route.ts`, `app/layout.tsx`, `getSongById`?**
  _High betweenness centrality (0.260) - this node is a cross-community bridge._
- **Why does `connectToDatabase()` connect `connectToDatabase` to `app/page.tsx`, `login/route.ts`, `getSongById`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `AppShell.tsx`, `HomeClient.tsx`, `AuthContext.tsx`, `package.json`, `lucide-react`, `featured/page.tsx`, `next`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _203 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07632850241545894 - nodes in this community are weakly interconnected._
- **Should `connectToDatabase` be split into smaller, more focused modules?**
  _Cohesion score 0.07264957264957266 - nodes in this community are weakly interconnected._
- **Should `mongoose` be split into smaller, more focused modules?**
  _Cohesion score 0.0773109243697479 - nodes in this community are weakly interconnected._