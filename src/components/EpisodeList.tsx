'use client';

import React from 'react';
import { Play, Clock, Calendar } from 'lucide-react';
import { Episode } from '@/types/podcast';
import { formatDuration } from '@/lib/mock-data';

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisode: Episode | null;
  onEpisodeSelect: (episode: Episode) => void;
}

export default function EpisodeList({ episodes, currentEpisode, onEpisodeSelect }: EpisodeListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Episodes</h2>
      
      <div className="space-y-3">
        {episodes.map((episode) => {
          const isCurrentEpisode = currentEpisode?.id === episode.id;
          
          return (
            <div
              key={episode.id}
              className={`p-4 rounded-lg border transition-all cursor-pointer ${
                isCurrentEpisode
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onEpisodeSelect(episode)}
            >
              <div className="flex items-start space-x-4">
                <div className="relative flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={episode.thumbnail || '/api/placeholder/60/60'}
                    alt={episode.title}
                    className="w-15 h-15 rounded-lg object-cover"
                  />
                  <div className={`absolute inset-0 flex items-center justify-center rounded-lg transition-opacity ${
                    isCurrentEpisode ? 'bg-blue-600 bg-opacity-80' : 'bg-black bg-opacity-0 hover:bg-opacity-60'
                  }`}>
                    <Play 
                      size={20} 
                      className={`text-white transition-opacity ${
                        isCurrentEpisode ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`} 
                    />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold mb-2 line-clamp-2 ${
                    isCurrentEpisode ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {episode.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {episode.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>{formatDate(episode.publishedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={12} />
                      <span>{formatDuration(episode.duration)}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEpisodeSelect(episode);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    isCurrentEpisode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  <Play size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}