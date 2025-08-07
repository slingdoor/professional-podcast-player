export interface Episode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  duration: number;
  publishedAt: string;
  thumbnail?: string;
  showNotes?: string;
}

export interface Podcast {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  episodes: Episode[];
  feedUrl?: string;
}

export interface PlaybackState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  currentEpisode: Episode | null;
}