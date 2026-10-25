# AURALIS Architecture & Graphify Blueprint

This document details the architectural relationships, component hierarchy, entity models, data access layer, and playback lifecycle for **AURALIS**.

---

## 1. High-Level System Flow

```mermaid
graph TD
    User([User]) --> Auth[Authentication Layer]
    Auth --> Shell[Application Shell]
    Shell --> Discovery[Music Discovery Engine]
    Discovery --> Song[Track / Album / Artist Metadata]
    Song --> Player[Global Audio Player Provider]
    Player --> State[Playback State Engine]
    State --> History[Listening History Analytics]
    History --> Recommendations[Deterministic Recommendation Engine]

    classDef accent fill:#D7FF3F,stroke:#090909,stroke-width:2px,color:#000000;
    classDef dark fill:#181818,stroke:#FFFFFF22,stroke-width:1px,color:#FFFFFF;
    class Player,State accent;
    class User,Auth,Shell,Discovery,Song,History,Recommendations dark;
```

---

## 1.1 Presentation Layer Architecture

```mermaid
graph TD
    subgraph AURALIS Platform
        subgraph Presentation Layer
            RetroUI[pixel-retroui Library]
            Tailwind[Tailwind CSS v4 Engine]
            FramerMotion[Framer Motion Animations]
            DesignTokens[AURALIS Retro Design Tokens]
        end

        subgraph Application Layer
            PlayerContext[PlayerContext Audio Provider]
            Auth[Authentication & JWT Session]
            AdminCMS[Admin CMS Control Room]
            MusicServices[Music Services Layer]
        end

        subgraph API Layer
            ApiRoutes[Next.js App Router API Routes]
            UploadRoute[Upload Handlers Cloudinary / R2]
        end

        subgraph Storage & Persistence
            MongoDB[(MongoDB Atlas)]
            MediaStorage[(Cloud Storage Cloudinary / R2)]
        end
    end

    RetroUI --> PlayerContext
    Tailwind --> RetroUI
    DesignTokens --> RetroUI
    FramerMotion --> RetroUI

    PlayerContext --> ApiRoutes
    AdminCMS --> ApiRoutes
    AdminCMS --> UploadRoute

    ApiRoutes --> MusicServices
    MusicServices --> MongoDB
    UploadRoute --> MediaStorage

    classDef accent fill:#D7FF3F,stroke:#090909,stroke-width:2px,color:#000000;
    classDef dark fill:#181818,stroke:#FFFFFF22,stroke-width:1px,color:#FFFFFF;
    class RetroUI,PlayerContext,AdminCMS accent;
    class Tailwind,FramerMotion,DesignTokens,Auth,MusicServices,ApiRoutes,UploadRoute,MongoDB,MediaStorage dark;
```

---

## 2. Phase 2 Layered Data Architecture

```mermaid
graph TD
    subgraph Client UI
        HomeUI[Home Page / Music Views]
        PlayerUI[Global / Mobile Player]
    end

    subgraph Route Layer
        ServerComp[Server Components]
        ApiRoutes[Route Handlers: /api/*]
    end

    subgraph Service Layer
        SongSvc[songService]
        ArtistSvc[artistService]
        AlbumSvc[albumService]
        PlaylistSvc[playlistService]
        ListeningSvc[listeningService]
    end

    subgraph Mongoose Models
        SongModel[(Song Model)]
        ArtistModel[(Artist Model)]
        AlbumModel[(Album Model)]
        PlaylistModel[(Playlist Model)]
        UserModel[(User Model)]
        HistoryModel[(ListeningHistory Model)]
    end

    subgraph Database
        MongoDB[(MongoDB Database)]
    end

    HomeUI --> ServerComp
    HomeUI --> ApiRoutes
    PlayerUI --> ApiRoutes

    ServerComp --> SongSvc
    ServerComp --> ArtistSvc
    ServerComp --> AlbumSvc
    ServerComp --> PlaylistSvc

    ApiRoutes --> SongSvc
    ApiRoutes --> ArtistSvc
    ApiRoutes --> AlbumSvc
    ApiRoutes --> PlaylistSvc
    ApiRoutes --> ListeningSvc

    SongSvc --> SongModel
    ArtistSvc --> ArtistModel
    AlbumSvc --> AlbumModel
    PlaylistSvc --> PlaylistModel
    ListeningSvc --> HistoryModel
    ListeningSvc --> UserModel

    SongModel --> MongoDB
    ArtistModel --> MongoDB
    AlbumModel --> MongoDB
    PlaylistModel --> MongoDB
    UserModel --> MongoDB
    HistoryModel --> MongoDB
```

---

## 3. Data Flow & Entity Hierarchy

```mermaid
graph TD
    UserEntity[USER]
    PlaylistEntity[PLAYLIST]
    LikedEntity[LIKED SONGS]
    HistoryEntity[LISTENING HISTORY]
    SongEntity[SONG]
    ArtistEntity[ARTIST]
    AlbumEntity[ALBUM]

    UserEntity -->|owns| PlaylistEntity
    UserEntity -->|saves| LikedEntity
    UserEntity -->|generates| HistoryEntity

    LikedEntity -->|references| SongEntity
    PlaylistEntity -->|contains ordered| SongEntity
    HistoryEntity -->|tracks playback of| SongEntity

    SongEntity -->|performed by| ArtistEntity
    SongEntity -->|part of| AlbumEntity
    ArtistEntity -->|releases| AlbumEntity
```

---

## 4. Playback Architecture & Audio Engine

```mermaid
sequenceDiagram
    autonumber
    actor Listener as User
    participant Card as SongRow / SongCard
    participant Ctx as PlayerContext
    participant Audio as HTMLAudioElement
    participant Api as /api/songs/[id]/play
    participant Queue as Queue Manager

    Listener->>Card: Clicks Play (Track)
    Card->>Ctx: playSong(track, playlistContext)
    Ctx->>Queue: updateQueue(playlistContext, currentIndex)
    Ctx->>Audio: audio.src = track.audioUrl
    Ctx->>Audio: audio.play()
    Note over Ctx,Api: Asynchronous Play Count Increment
    Ctx--)Api: POST /api/songs/[id]/play
    Api-->>Ctx: Updated song metadata with incremented playCount
    Audio-->>Ctx: ontimeupdate (progress: seconds)
    Ctx-->>Listener: Updates scrubber, timestamps & animated equalizer
    Audio->>Ctx: onended
    Ctx->>Queue: evaluateNext(repeatMode, isShuffle)
    Queue-->>Ctx: nextTrack
    Ctx->>Audio: audio.src = nextTrack.audioUrl
```

---

## 5. Entity Relationship Diagram (MongoDB / Mongoose)

```mermaid
erDiagram
    User ||--o{ Playlist : "owns"
    User ||--o{ ListeningHistory : "generates"
    User }o--o{ Song : "likes"
    User }o--o{ Artist : "follows"

    Artist ||--o{ Album : "releases"
    Artist ||--o{ Song : "performs"

    Album ||--o{ Song : "contains"
    Playlist ||--o{ Song : "contains ordered"

    User {
        ObjectId _id PK
        string name
        string email UK
        string passwordHash
        string avatar
        ObjectId[] likedSongs FK
        ObjectId[] followedArtists FK
        string role
        date createdAt
        date updatedAt
    }

    Song {
        ObjectId _id PK
        string title
        string slug
        ObjectId artistId FK
        ObjectId albumId FK
        string audioUrl
        string artworkUrl
        int duration
        string genre
        int playCount
        boolean explicit
        date releaseDate
        date createdAt
    }

    Artist {
        ObjectId _id PK
        string name
        string slug UK
        string image
        string bio
        string[] genres
        int followerCount
        date createdAt
    }

    Album {
        ObjectId _id PK
        string title
        string slug UK
        ObjectId artistId FK
        string artworkUrl
        string[] genres
        string description
        date releaseDate
        date createdAt
    }

    Playlist {
        ObjectId _id PK
        string name
        string slug UK
        string description
        ObjectId ownerId FK
        string artworkUrl
        object[] songs
        boolean isPublic
        boolean isCurated
        date createdAt
    }

    ListeningHistory {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId songId FK
        int durationPlayed
        boolean completed
        date playedAt
    }
```

```

---

## 6. Phase 3 Dual-Role Music Platform Architecture

```mermaid
graph TD
    Auralis[AURALIS Platform] --> AdminRole[ADMIN]
    Auralis --> UserRole[USER]

    AdminRole --> AdminDash[Admin CMS Dashboard]
    UserRole --> UserDash[User Discovery Interface]

    AdminDash --> AdminUsers[User Governance]
    AdminDash --> AdminMusic[Music Catalog CMS]
    AdminDash --> AdminFeatured[Featured Showcases]

    AdminMusic --> ArtistsCMS[Artists Management]
    AdminMusic --> AlbumsCMS[Albums Management]
    AdminMusic --> SongsCMS[Songs & Master Ingestion]

    ArtistsCMS --> Mongo[(MongoDB Atlas)]
    AlbumsCMS --> Mongo
    SongsCMS --> Mongo
    AdminUsers --> Mongo
    AdminFeatured --> Mongo

    SongsCMS -.->|Upload Master Audio & Artwork| R2[(Object Storage / R2)]
    R2 -.->|Pristine Audio Stream URL| Mongo

    Mongo --> PublicAPI[Public REST Catalog APIs]
    PublicAPI --> UserDash
    UserDash --> Player[HTML5 Audio Player]
    R2 ==>|Direct Audio Stream| Player

    classDef accent fill:#D7FF3F,stroke:#090909,stroke-width:2px,color:#000000;
    classDef dark fill:#181818,stroke:#FFFFFF22,stroke-width:1px,color:#FFFFFF;
    class Auralis,Player,AdminRole accent;
    class AdminDash,UserDash,AdminUsers,AdminMusic,AdminFeatured,Mongo,R2,PublicAPI dark;
```

---

## 7. Role-Based Authorization Flow

```mermaid
sequenceDiagram
    autonumber
    actor Client as User / Admin Client
    participant Auth as Auth & Middleware Layer
    participant Session as JWT Cookie Verification
    participant RBAC as Role Check Guard
    participant API as Protected / Public Route

    Client->>Auth: HTTP Request + Cookie (auralis_session)
    Auth->>Session: verifySessionToken(token)
    alt Invalid or Expired Token
        Session-->>Client: 401 Unauthorized
    else Valid Token
        Session->>RBAC: Extract SessionUser (role, status)
        alt Account Suspended
            RBAC-->>Client: 403 Forbidden (Account Suspended)
        else Role != Admin on /api/admin/*
            RBAC-->>Client: 403 Forbidden (Admin Access Required)
        else Authorized
            RBAC->>API: Execute Business Logic with connectDB()
            API-->>Client: 200 OK + JSON Response
        end
    end
```

---

## 8. Development Phases Roadmap

```text
Phase 1: Foundation, Design System, AppShell, Global Player Shell, Mock Music Catalog  <-- [COMPLETED]
Phase 2: Database Layer, Mongoose Models, Service Layer, Seed System, APIs              <-- [COMPLETED]
Phase 3: Admin CMS + Authentication + Real Music Management                           <-- [COMPLETED]
Phase 4: Music Catalog Dynamic API routes & Search UI integration
Phase 5: Audio Streaming Engine & Object Storage (Cloudflare R2 Integration)
Phase 6: Personal Library (Liked Songs, Custom Playlists, History)
Phase 7: Search & Discovery Engine (Debounced search, Genre exploration)
Phase 8: Polish, Framer Motion transitions, Accessibility & Micro-interactions
Phase 9: Listening Analytics (Top tracks, genres, duration calculations)
Phase 10: Recommendation Intelligence
```
