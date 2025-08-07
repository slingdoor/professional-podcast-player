'use client';

import React from 'react';
import { Radio, Settings, Home } from 'lucide-react';

interface NavigationProps {
  currentView: 'player' | 'feeds';
  onViewChange: (view: 'player' | 'feeds') => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Radio size={24} className="text-blue-600" />
            <span className="text-xl font-semibold text-gray-900">Podcast Player</span>
          </div>
          
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => onViewChange('player')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                currentView === 'player'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Home size={16} />
              <span>Player</span>
            </button>
            
            <button
              onClick={() => onViewChange('feeds')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                currentView === 'feeds'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings size={16} />
              <span>Feeds</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}