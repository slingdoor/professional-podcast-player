'use client';

import React, { useState } from 'react';
import { X, Plus, AlertCircle, CheckCircle, Loader } from 'lucide-react';
// RSS parsing now happens via API routes to avoid CORS issues
import { usePlayer } from '@/contexts/PlayerContext';

interface AddFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddFeedModal({ isOpen, onClose }: AddFeedModalProps) {
  const [feedUrl, setFeedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { addPodcast } = usePlayer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedUrl.trim()) {
      setError('Please enter a valid RSS feed URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // First validate the feed via API
      const validateResponse = await fetch('/api/parse-rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedUrl: feedUrl.trim(), action: 'validate' })
      });
      
      const validateResult = await validateResponse.json();
      
      if (!validateResponse.ok || !validateResult.isValid) {
        throw new Error('Invalid RSS feed URL or feed is not accessible');
      }

      // Parse the feed via API
      const parseResponse = await fetch('/api/parse-rss', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedUrl: feedUrl.trim(), action: 'parse' })
      });
      
      if (!parseResponse.ok) {
        const errorResult = await parseResponse.json();
        throw new Error(errorResult.error || 'Failed to parse RSS feed');
      }
      
      const podcast = await parseResponse.json();
      
      if (podcast.episodes.length === 0) {
        throw new Error('No episodes found in this podcast feed');
      }

      // Add to context
      addPodcast(podcast);
      
      setSuccess(`Successfully added "${podcast.title}" with ${podcast.episodes.length} episodes!`);
      setFeedUrl('');
      
      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSuccess('');
      }, 2000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add podcast feed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFeedUrl('');
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Add RSS Feed</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="feedUrl" className="block text-sm font-medium text-gray-700 mb-2">
              RSS Feed URL
            </label>
            <input
              type="url"
              id="feedUrl"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              placeholder="https://example.com/podcast.rss"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start space-x-2">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-start space-x-2">
              <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-green-700">{success}</span>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !feedUrl.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Add Feed</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-blue-700">
            <strong>Tip:</strong> You can find RSS feed URLs on most podcast websites, 
            or try popular feeds like NPR, BBC, or search for your favorite podcasts.
          </p>
        </div>
      </div>
    </div>
  );
}