'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward, Rewind, FastForward } from 'lucide-react';
import { Episode } from '@/types/podcast';
import type { PlaybackState } from '@/types/podcast';
import { formatDuration } from '@/lib/mock-data';
import { usePlayer } from '@/contexts/PlayerContext';

interface AudioPlayerProps {
  episode: Episode | null;
}

export default function AudioPlayer({ episode }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  const { playNext, playPrevious, playlist, setPlaybackState } = usePlayer();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [episode]);

  useEffect(() => {
    setPlaybackState({
      isPlaying,
      currentTime,
      duration,
      volume,
      currentEpisode: episode,
    });
  }, [isPlaying, currentTime, duration, volume, episode, setPlaybackState]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || !episode) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const newVolume = parseFloat(e.target.value) / 100;
    
    if (audio) {
      audio.volume = newVolume;
    }
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!episode) {
    return (
      <div className="bg-gray-100 p-6 rounded-lg">
        <p className="text-gray-500 text-center">Select an episode to start playing</p>
      </div>
    );
  }

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 border">
      <audio
        ref={audioRef}
        src={episode.audioUrl}
        preload="metadata"
      />
      
      <div className="flex items-start space-x-4 mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={episode.thumbnail || '/api/placeholder/80/80'}
          alt={episode.title}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{episode.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{episode.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="w-full">
          <input
            type="range"
            min="0"
            max="100"
            value={progressPercentage}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${progressPercentage}%, #E5E7EB ${progressPercentage}%, #E5E7EB 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{formatDuration(Math.floor(currentTime))}</span>
            <span>{formatDuration(Math.floor(duration))}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={playPrevious}
              disabled={!episode || playlist.length <= 1}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous episode"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={() => skip(-15)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Skip back 15s"
            >
              <Rewind size={18} />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
            
            <button
              onClick={() => skip(30)}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              title="Skip forward 30s"
            >
              <FastForward size={18} />
            </button>
            
            <button
              onClick={playNext}
              disabled={!episode || playlist.length <= 1}
              className="p-2 text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next episode"
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume * 100}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}