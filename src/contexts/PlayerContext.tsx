'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Episode, PlaybackState, Podcast } from '@/types/podcast';

interface PlayerContextType {
  currentEpisode: Episode | null;
  playbackState: PlaybackState;
  playlist: Episode[];
  podcasts: Podcast[];
  currentPodcast: Podcast | null;
  setCurrentEpisode: (episode: Episode | null) => void;
  setPlaybackState: (state: PlaybackState) => void;
  setPlaylist: (episodes: Episode[]) => void;
  setPodcasts: (podcasts: Podcast[]) => void;
  setCurrentPodcast: (podcast: Podcast) => void;
  addPodcast: (podcast: Podcast) => void;
  removePodcast: (podcastId: string) => void;
  updatePodcast: (podcastId: string, podcast: Podcast) => void;
  playNext: () => void;
  playPrevious: () => void;
  addToPlaylist: (episode: Episode) => void;
  removeFromPlaylist: (episodeId: string) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    currentEpisode: null,
  });
  const [playlist, setPlaylist] = useState<Episode[]>([]);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>(null);

  // Load podcasts from localStorage on mount
  useEffect(() => {
    const savedPodcasts = localStorage.getItem('podcast-player-feeds');
    if (savedPodcasts) {
      try {
        const parsed = JSON.parse(savedPodcasts);
        setPodcasts(parsed);
        if (parsed.length > 0) {
          setCurrentPodcast(parsed[0]);
        }
      } catch (error) {
        console.error('Error loading saved podcasts:', error);
      }
    }
  }, []);

  // Save podcasts to localStorage when they change
  useEffect(() => {
    if (podcasts.length > 0) {
      localStorage.setItem('podcast-player-feeds', JSON.stringify(podcasts));
    }
  }, [podcasts]);

  const playNext = () => {
    if (!currentEpisode || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex < playlist.length - 1) {
      setCurrentEpisode(playlist[currentIndex + 1]);
    }
  };

  const playPrevious = () => {
    if (!currentEpisode || playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(ep => ep.id === currentEpisode.id);
    if (currentIndex > 0) {
      setCurrentEpisode(playlist[currentIndex - 1]);
    }
  };

  const addToPlaylist = (episode: Episode) => {
    setPlaylist(prev => {
      if (prev.find(ep => ep.id === episode.id)) return prev;
      return [...prev, episode];
    });
  };

  const removeFromPlaylist = (episodeId: string) => {
    setPlaylist(prev => prev.filter(ep => ep.id !== episodeId));
  };

  const addPodcast = (podcast: Podcast) => {
    setPodcasts(prev => {
      const existingIndex = prev.findIndex(p => p.id === podcast.id);
      if (existingIndex >= 0) {
        // Replace existing podcast
        const updated = [...prev];
        updated[existingIndex] = podcast;
        return updated;
      }
      // Add new podcast
      return [...prev, podcast];
    });
    
    // Set as current if it's the first one
    if (podcasts.length === 0) {
      setCurrentPodcast(podcast);
    }
  };

  const removePodcast = (podcastId: string) => {
    setPodcasts(prev => {
      const filtered = prev.filter(p => p.id !== podcastId);
      
      // If we removed the current podcast, set a new current
      if (currentPodcast?.id === podcastId) {
        setCurrentPodcast(filtered.length > 0 ? filtered[0] : null);
        setCurrentEpisode(null);
        setPlaylist([]);
      }
      
      return filtered;
    });
  };

  const updatePodcast = (podcastId: string, updatedPodcast: Podcast) => {
    setPodcasts(prev => 
      prev.map(p => p.id === podcastId ? updatedPodcast : p)
    );
    
    if (currentPodcast?.id === podcastId) {
      setCurrentPodcast(updatedPodcast);
    }
  };

  return (
    <PlayerContext.Provider value={{
      currentEpisode,
      playbackState,
      playlist,
      podcasts,
      currentPodcast,
      setCurrentEpisode,
      setPlaybackState,
      setPlaylist,
      setPodcasts,
      setCurrentPodcast,
      addPodcast,
      removePodcast,
      updatePodcast,
      playNext,
      playPrevious,
      addToPlaylist,
      removeFromPlaylist,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}