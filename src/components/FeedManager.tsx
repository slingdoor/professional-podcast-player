'use client';

import React, { useState } from 'react';
import { Plus, Settings, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { usePlayer } from '@/contexts/PlayerContext';
// RSS parsing now happens via API routes to avoid CORS issues
import AddFeedModal from './AddFeedModal';

export default function FeedManager() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [refreshingIds, setRefreshingIds] = useState<Set<string>>(new Set());
  
  const { 
    podcasts, 
    currentPodcast, 
    setCurrentPodcast, 
    removePodcast, 
    updatePodcast,
    setCurrentEpisode,
    setPlaylist 
  } = usePlayer();

  const handleSelectPodcast = (podcast: typeof podcasts[0]) => {
    setCurrentPodcast(podcast);
    setPlaylist(podcast.episodes);
    setCurrentEpisode(null);
  };

  const handleRefreshFeed = async (podcast: typeof podcasts[0]) => {
    if (!podcast.feedUrl) return;
    
    setRefreshingIds(prev => new Set(prev.add(podcast.id)));
    
    try {
      const response = await fetch('/api/parse-rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedUrl: podcast.feedUrl, action: 'parse' })
      });
      
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.error || 'Failed to refresh feed');
      }
      
      const updatedPodcast = await response.json();
      updatePodcast(podcast.id, updatedPodcast);
    } catch (error) {
      console.error('Failed to refresh feed:', error);
      // Could add toast notification here
    } finally {
      setRefreshingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(podcast.id);
        return newSet;
      });
    }
  };

  const handleRemoveFeed = (podcastId: string) => {
    if (confirm('Are you sure you want to remove this podcast feed?')) {
      removePodcast(podcastId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Settings size={20} className="text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Podcast Feeds</h2>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
        >
          <Plus size={16} />
          <span>Add Feed</span>
        </button>
      </div>

      {podcasts.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <Settings size={48} className="mx-auto text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Podcast Feeds</h3>
          <p className="text-gray-600 mb-4">
            Add your first RSS feed to start listening to podcasts
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <Plus size={16} />
            <span>Add Your First Feed</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {podcasts.map((podcast) => (
            <div
              key={podcast.id}
              className={`p-4 border rounded-lg transition-all cursor-pointer ${
                currentPodcast?.id === podcast.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleSelectPodcast(podcast)}
            >
              <div className="flex items-start space-x-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={podcast.thumbnail}
                  alt={podcast.title}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {podcast.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {podcast.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>{podcast.episodes.length} episodes</span>
                    {podcast.feedUrl && (
                      <div className="flex items-center space-x-1">
                        <ExternalLink size={12} />
                        <span className="truncate max-w-32">
                          {new URL(podcast.feedUrl).hostname}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {podcast.feedUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRefreshFeed(podcast);
                      }}
                      disabled={refreshingIds.has(podcast.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
                      title="Refresh feed"
                    >
                      <RefreshCw 
                        size={16} 
                        className={refreshingIds.has(podcast.id) ? 'animate-spin' : ''} 
                      />
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFeed(podcast.id);
                    }}
                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Remove feed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddFeedModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}