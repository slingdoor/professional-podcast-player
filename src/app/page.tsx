'use client';

import React, { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import AudioPlayer from '@/components/AudioPlayer';
import EpisodeList from '@/components/EpisodeList';
import PodcastHeader from '@/components/PodcastHeader';
import FeedManager from '@/components/FeedManager';
import { mockPodcast } from '@/lib/mock-data';
import { usePlayer } from '@/contexts/PlayerContext';
import { Episode } from '@/types/podcast';

export default function Home() {
  const [currentView, setCurrentView] = useState<'player' | 'feeds'>('player');
  
  const {
    currentEpisode,
    currentPodcast,
    podcasts,
    setCurrentEpisode,
    setPlaylist,
    addPodcast,
  } = usePlayer();

  // Initialize with mock data if no podcasts are loaded
  useEffect(() => {
    if (podcasts.length === 0) {
      addPodcast(mockPodcast);
    }
  }, [podcasts.length, addPodcast]);

  // Update playlist when current podcast changes
  useEffect(() => {
    if (currentPodcast) {
      setPlaylist(currentPodcast.episodes);
    }
  }, [currentPodcast, setPlaylist]);

  const handleEpisodeSelect = (episode: Episode) => {
    setCurrentEpisode(episode);
  };

  // Show feed manager if no podcasts available or feeds view is selected
  if (podcasts.length === 0 || currentView === 'feeds') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <FeedManager />
        </div>
      </div>
    );
  }

  // Show main player interface
  const displayPodcast = currentPodcast || podcasts[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentView={currentView} onViewChange={setCurrentView} />
      <PodcastHeader podcast={displayPodcast} />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <EpisodeList
              episodes={displayPodcast.episodes}
              currentEpisode={currentEpisode}
              onEpisodeSelect={handleEpisodeSelect}
            />
          </div>
          
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AudioPlayer
                episode={currentEpisode}
              />
              
              {podcasts.length > 1 && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Access</h3>
                  <button
                    onClick={() => setCurrentView('feeds')}
                    className="text-sm text-blue-600 hover:text-blue-700 underline"
                  >
                    Manage {podcasts.length} podcast feeds →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
