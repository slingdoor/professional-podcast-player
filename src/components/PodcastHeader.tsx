'use client';

import React from 'react';
import { Podcast } from '@/types/podcast';

interface PodcastHeaderProps {
  podcast: Podcast;
}

export default function PodcastHeader({ podcast }: PodcastHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={podcast.thumbnail}
            alt={podcast.title}
            className="w-48 h-48 rounded-2xl shadow-2xl object-cover"
          />
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {podcast.title}
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 mb-6 leading-relaxed">
              {podcast.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-blue-200">
              <span>{podcast.episodes.length} Episodes</span>
              <span>•</span>
              <span>Updated Weekly</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}