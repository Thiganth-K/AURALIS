export interface SongDTO {
  id: string;
  title: string;
  slug?: string;
  artistId: string;
  artistName: string;
  albumId?: string;
  albumTitle?: string;
  audioUrl: string;
  videoUrl?: string;
  artworkUrl: string;
  duration: number; // in seconds
  durationFormatted: string;
  genre: string;
  releaseDate: string;
  playCount: number;
  explicit?: boolean;
  isLiked?: boolean;
}

export interface ArtistDTO {
  id: string;
  name: string;
  slug?: string;
  image: string;
  bio: string;
  genres: string[];
  followerCount?: number;
  followers?: number;
  followersFormatted: string;
  popularSongs?: SongDTO[];
}

export interface AlbumDTO {
  id: string;
  title: string;
  slug?: string;
  artistId: string;
  artistName: string;
  artworkUrl: string;
  releaseDate: string;
  releaseYear: number;
  genres?: string[];
  description?: string;
  songCount: number;
  songs?: SongDTO[];
}

export interface PlaylistSongItem {
  songId: string;
  position: number;
  song?: SongDTO;
}

export interface PlaylistDTO {
  id: string;
  name: string;
  slug?: string;
  description: string;
  ownerId?: string;
  ownerName?: string;
  artworkUrl: string;
  songCount: number;
  durationFormatted?: string;
  isPublic?: boolean;
  isCurated?: boolean;
  songs?: PlaylistSongItem[];
}

export interface ListeningHistoryDTO {
  id: string;
  userId: string;
  songId: string;
  playedAt: string;
  durationPlayed: number;
  completed: boolean;
  song?: SongDTO;
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  avatarUrl?: string;
  role?: "user" | "admin";
  likedSongs?: string[];
  followedArtists?: string[];
  tier?: "Free" | "Pro" | "Hifi";
}

export interface SearchResultsDTO {
  songs: SongDTO[];
  artists: ArtistDTO[];
  albums: AlbumDTO[];
  playlists: PlaylistDTO[];
}

export type ApiResponse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        code: string;
        message: string;
      };
    };
