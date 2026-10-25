import {
  SongDTO,
  ArtistDTO,
  AlbumDTO,
  PlaylistDTO,
  PlaylistSongItem,
  ListeningHistoryDTO,
  UserDTO,
  SearchResultsDTO,
  ApiResponse,
} from "./music";

export type Song = SongDTO;
export type Artist = ArtistDTO;
export type Album = AlbumDTO;
export type Playlist = PlaylistDTO;
export type PlaylistSong = PlaylistSongItem;
export type ListeningHistory = ListeningHistoryDTO;
export type User = UserDTO;
export type SearchResults = SearchResultsDTO;
export type { ApiResponse };

export type RepeatMode = "off" | "all" | "one";

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  progress: number; // in seconds
  duration: number; // in seconds
  volume: number; // 0 to 1
  isMuted: boolean;
  queue: Song[];
  queueIndex: number;
  isShuffle: boolean;
  repeatMode: RepeatMode;
}
