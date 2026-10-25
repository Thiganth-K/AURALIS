# Graph Report - AURALIS  (2026-10-26)

## Corpus Check
- 117 files · ~134,759 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .ico 1, .css 1)

## Summary
- 554 nodes · 1430 edges · 36 communities (28 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 18 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `65417283`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- songService.ts
- connectToDatabase
- auth.ts
- What You Must Do When Invoked
- AppShell.tsx
- HomeClient.tsx
- utils.ts
- AURALIS Architecture & Graphify Blueprint
- react
- albums/page.tsx
- types/index.ts
- compilerOptions
- package.json
- dependencies
- library/page.tsx
- devDependencies
- scripts
- featured/page.tsx
- middleware.ts
- next
- upload/route.ts
- graphify reference: extra exports and benchmark
- getPublicPlaylists
- app/layout.tsx
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- playlists/page.tsx
- AGENTS.md
- rules/graphify.md
- extraction-spec.md
- workflows/graphify.md
- FeaturedContent.ts

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
- `6. Implementation Roadmap` --references--> `User`  [INFERRED]
  README.md → src/types/index.ts
- `6. Implementation Roadmap` --references--> `Artist`  [INFERRED]
  README.md → src/types/index.ts

## Import Cycles
- None detected.

## Communities (36 total, 8 thin omitted)

### Community 0 - "songService.ts"
Cohesion: 0.11
Nodes (28): GET(), GET(), GET(), GET(), GET(), GET(), instant, GET() (+20 more)

### Community 1 - "connectToDatabase"
Cohesion: 0.07
Nodes (78): cleanCloudinary(), cleanLocalUploads(), cleanMongoDB(), main(), DELETE(), GET(), instant, PATCH() (+70 more)

### Community 2 - "auth.ts"
Cohesion: 0.06
Nodes (45): bcryptjs, dotenv, mongoose, ref_node_dns, ref_path, ref_readline, ask(), run() (+37 more)

### Community 3 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 4 - "AppShell.tsx"
Cohesion: 0.20
Nodes (15): AppShell(), AppShellProps, MobileNav(), Sidebar(), TopBar(), ExpandedPlayer(), GlobalPlayer(), MobilePlayer() (+7 more)

### Community 5 - "HomeClient.tsx"
Cohesion: 0.18
Nodes (21): 6. Implementation Roadmap, HomePage(), instant, SearchContent(), SearchPage(), HomeClient(), HomeClientProps, SynthwaveHeroIllustration() (+13 more)

### Community 6 - "utils.ts"
Cohesion: 0.32
Nodes (5): clsx, tailwind-merge, AdminSongItem, AdminSongsPage(), formatTime()

### Community 7 - "AURALIS Architecture & Graphify Blueprint"
Cohesion: 0.11
Nodes (17): 1.1 Presentation Layer Architecture, 1. High-Level System Flow, 2. Phase 2 Layered Data Architecture, 3. Data Flow & Entity Hierarchy, 4. Playback Architecture & Audio Engine, 5. Entity Relationship Diagram (MongoDB / Mongoose), AURALIS Architecture & Graphify Blueprint, 1. Product Overview (+9 more)

### Community 8 - "react"
Cohesion: 0.14
Nodes (18): react, AdminLayout(), AdminLayoutProps, instant, AdminUserItem, AdminUsersPage(), AnimPhase, LoginPage() (+10 more)

### Community 10 - "types/index.ts"
Cohesion: 0.13
Nodes (19): currentUser, mockAlbums, mockArtists, mockPlaylists, mockSongs, ListeningHistory, PlayerState, PlaylistSong (+11 more)

### Community 11 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 12 - "package.json"
Cohesion: 0.12
Nodes (16): eslintConfig, name, private, version, eslint, eslint-config-next, framer-motion, react-dom (+8 more)

### Community 13 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, bcryptjs, cloudinary, clsx, dotenv, framer-motion, jose, lucide-react (+6 more)

### Community 14 - "library/page.tsx"
Cohesion: 0.27
Nodes (7): HistoryItem, LibraryContent(), LibraryPage(), SongCard(), SongCardProps, SongRowProps, Song

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
Cohesion: 0.09
Nodes (14): nextConfig, lucide-react, next, AdminNewAlbumPage(), ArtistOption, AdminArtistItem, AdminDashboardPage(), DashboardData (+6 more)

### Community 20 - "upload/route.ts"
Cohesion: 0.25
Nodes (7): cloudinary, ref_crypto, ref_fs, ALLOWED_AUDIO_EXTENSIONS, ALLOWED_IMAGE_EXTENSIONS, instant, POST()

### Community 21 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 22 - "getPublicPlaylists"
Cohesion: 0.38
Nodes (5): GET(), GET(), getPlaylistById(), getPublicPlaylists(), transformPlaylistDocument()

### Community 23 - "app/layout.tsx"
Cohesion: 0.22
Nodes (7): pixel-retroui, src_app_globals, ibmPlexMono, inter, metadata, RootLayout(), spaceMono

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

### Community 35 - "FeaturedContent.ts"
Cohesion: 0.50
Nodes (3): FeaturedContent, FeaturedContentSchema, IFeaturedContent

## Knowledge Gaps
- **206 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+201 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 236 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `songService.ts`, `connectToDatabase`, `auth.ts`, `AppShell.tsx`, `HomeClient.tsx`, `utils.ts`, `react`, `package.json`, `library/page.tsx`, `middleware.ts`, `upload/route.ts`, `getPublicPlaylists`, `app/layout.tsx`?**
  _High betweenness centrality (0.261) - this node is a cross-community bridge._
- **Why does `connectToDatabase()` connect `connectToDatabase` to `songService.ts`, `auth.ts`, `HomeClient.tsx`, `getPublicPlaylists`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `AppShell.tsx`, `HomeClient.tsx`, `utils.ts`, `albums/page.tsx`, `package.json`, `library/page.tsx`, `featured/page.tsx`, `next`, `playlists/page.tsx`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _206 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `songService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `connectToDatabase` be split into smaller, more focused modules?**
  _Cohesion score 0.07232323232323232 - nodes in this community are weakly interconnected._
- **Should `auth.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05961538461538462 - nodes in this community are weakly interconnected._