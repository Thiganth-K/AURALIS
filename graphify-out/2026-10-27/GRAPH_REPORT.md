# Graph Report - AURALIS  (2026-10-27)

## Corpus Check
- 118 files · ~144,879 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 562 nodes · 1447 edges · 40 communities (32 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 19 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `13b7d93f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- app/page.tsx
- mongoose
- auth.ts
- What You Must Do When Invoked
- AdminShell.tsx
- types/index.ts
- ExpandedPlayer.tsx
- AURALIS Architecture & Graphify Blueprint
- useAuth
- react
- songs/new/page.tsx
- compilerOptions
- package.json
- dependencies
- utils.ts
- devDependencies
- scripts
- featured/page.tsx
- proxy.ts
- AppShell.tsx
- connectToDatabase
- graphify reference: extra exports and benchmark
- models/index.ts
- mongodb.ts
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
- next
- upload/route.ts
- featured/route.ts
- check_h1.js
- songs/page.tsx

## God Nodes (most connected - your core abstractions)
1. `connectToDatabase()` - 98 edges
2. `next` - 62 edges
3. `requireAdmin()` - 45 edges
4. `react` - 37 edges
5. `lucide-react` - 29 edges
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
- `6. Implementation Roadmap` --references--> `Artist`  [INFERRED]
  README.md → src/types/index.ts
- `6. Implementation Roadmap` --references--> `Album`  [INFERRED]
  README.md → src/types/index.ts

## Import Cycles
- None detected.

## Communities (40 total, 8 thin omitted)

### Community 0 - "app/page.tsx"
Cohesion: 0.08
Nodes (33): GET(), GET(), GET(), GET(), GET(), GET(), GET(), GET() (+25 more)

### Community 1 - "mongoose"
Cohesion: 0.08
Nodes (23): bcryptjs, dotenv, mongoose, ref_node_dns, ref_path, ref_readline, ask(), run() (+15 more)

### Community 2 - "auth.ts"
Cohesion: 0.20
Nodes (14): POST(), GET(), POST(), src_lib_auth_auth_cookie_name, createSessionToken(), ensureAdminUser(), getSessionUser(), hashPassword() (+6 more)

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 4 - "AdminShell.tsx"
Cohesion: 0.32
Nodes (6): AdminLayout(), AdminLayoutProps, instant, AdminShell(), AdminShellProps, navItems

### Community 5 - "types/index.ts"
Cohesion: 0.09
Nodes (47): 6. Implementation Roadmap, HistoryItem, LibraryContent(), LibraryPage(), SearchContent(), SearchPage(), HomeClient(), HomeClientProps (+39 more)

### Community 6 - "ExpandedPlayer.tsx"
Cohesion: 0.39
Nodes (5): ExpandedPlayer(), GlobalPlayer(), RetroAudioVisualizer(), RetroAudioVisualizerProps, formatTime()

### Community 7 - "AURALIS Architecture & Graphify Blueprint"
Cohesion: 0.11
Nodes (17): 1.1 Presentation Layer Architecture, 1. High-Level System Flow, 2. Phase 2 Layered Data Architecture, 3. Data Flow & Entity Hierarchy, 4. Playback Architecture & Audio Engine, 5. Entity Relationship Diagram (MongoDB / Mongoose), AURALIS Architecture & Graphify Blueprint, 1. Product Overview (+9 more)

### Community 8 - "useAuth"
Cohesion: 0.14
Nodes (16): AdminDashboardPage(), DashboardData, formatDuration(), formatRelativeTime(), AdminUserItem, AdminUsersPage(), AnimPhase, LoginPage() (+8 more)

### Community 9 - "react"
Cohesion: 0.12
Nodes (9): lucide-react, react, AdminNewAlbumPage(), ArtistOption, AdminAlbumItem, ArtistOption, AdminArtistItem, AdminPlaylistItem (+1 more)

### Community 10 - "songs/new/page.tsx"
Cohesion: 0.40
Nodes (3): AdminNewSongPage(), AlbumOption, ArtistOption

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "package.json"
Cohesion: 0.12
Nodes (14): name, private, version, framer-motion, pixel-retroui, react-dom, tailwindcss, @tailwindcss/turbopack (+6 more)

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
Cohesion: 0.29
Nodes (5): AdminFeaturedPage(), AlbumOpt, ArtistOpt, PlaylistOpt, SongOpt

### Community 18 - "proxy.ts"
Cohesion: 0.40
Nodes (3): jose, config, JWT_SECRET

### Community 19 - "AppShell.tsx"
Cohesion: 0.17
Nodes (12): src_app_globals, ibmPlexMono, inter, metadata, RootLayout(), spaceMono, AppShell(), AppShellProps (+4 more)

### Community 20 - "connectToDatabase"
Cohesion: 0.09
Nodes (43): verifyEndToEnd(), DELETE(), GET(), instant, PATCH(), GET(), instant, POST() (+35 more)

### Community 21 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 22 - "models/index.ts"
Cohesion: 0.22
Nodes (22): cleanCloudinary(), cleanLocalUploads(), cleanMongoDB(), main(), instant, instant, instant, instant (+14 more)

### Community 23 - "mongodb.ts"
Cohesion: 0.13
Nodes (23): GET(), POST(), GET(), instant, DELETE(), instant, POST(), DELETE() (+15 more)

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

### Community 35 - "next"
Cohesion: 0.23
Nodes (8): nextConfig, next, GET(), Logo(), LogoProps, PlaylistSummary, Sidebar(), getSongById()

### Community 36 - "upload/route.ts"
Cohesion: 0.25
Nodes (7): cloudinary, ref_crypto, ref_fs, ALLOWED_AUDIO_EXTENSIONS, ALLOWED_IMAGE_EXTENSIONS, instant, POST()

### Community 37 - "featured/route.ts"
Cohesion: 0.40
Nodes (4): GET(), instant, POST(), src_models_index_featuredcontent

### Community 39 - "songs/page.tsx"
Cohesion: 0.67
Nodes (3): AdminSongItem, AdminSongsPage(), formatDuration()

## Knowledge Gaps
- **208 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+203 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 239 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `app/page.tsx`, `auth.ts`, `upload/route.ts`, `featured/route.ts`, `types/index.ts`, `songs/page.tsx`, `useAuth`, `react`, `songs/new/page.tsx`, `AdminShell.tsx`, `package.json`, `proxy.ts`, `AppShell.tsx`, `connectToDatabase`, `models/index.ts`, `mongodb.ts`?**
  _High betweenness centrality (0.259) - this node is a cross-community bridge._
- **Why does `connectToDatabase()` connect `connectToDatabase` to `app/page.tsx`, `auth.ts`, `next`, `featured/route.ts`, `models/index.ts`, `mongodb.ts`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `next`, `AdminShell.tsx`, `types/index.ts`, `ExpandedPlayer.tsx`, `songs/page.tsx`, `useAuth`, `songs/new/page.tsx`, `package.json`, `featured/page.tsx`, `AppShell.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _208 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `app/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07878787878787878 - nodes in this community are weakly interconnected._
- **Should `mongoose` be split into smaller, more focused modules?**
  _Cohesion score 0.08266129032258064 - nodes in this community are weakly interconnected._
- **Should `What You Must Do When Invoked` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._