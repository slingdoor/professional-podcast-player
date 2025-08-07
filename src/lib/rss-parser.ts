import Parser from 'rss-parser';
import { Podcast, Episode } from '@/types/podcast';

interface RSSItem {
  title?: string;
  contentSnippet?: string;
  content?: string;
  link?: string;
  pubDate?: string;
  enclosure?: {
    url: string;
    type: string;
  };
  itunes?: {
    duration?: string;
    image?: string;
    summary?: string;
  };
  guid?: string;
}

interface RSSFeed {
  title?: string;
  description?: string;
  image?: {
    url?: string;
  };
  itunes?: {
    image?: string;
  };
  items?: RSSItem[];
}

const parser = new Parser({
  customFields: {
    feed: ['itunes:image', 'image'],
    item: [
      'itunes:duration',
      'itunes:image', 
      'itunes:summary',
      'enclosure',
      'guid'
    ]
  }
});

export async function parseRSSFeed(feedUrl: string): Promise<Podcast> {
  try {
    const feed = await parser.parseURL(feedUrl) as RSSFeed;
    
    const episodes: Episode[] = (feed.items || []).map((item, index) => {
      const duration = parseDuration(item.itunes?.duration);
      
      return {
        id: item.guid || `episode-${index}`,
        title: item.title || 'Untitled Episode',
        description: item.itunes?.summary || item.contentSnippet || item.content || '',
        audioUrl: item.enclosure?.url || '',
        duration,
        publishedAt: item.pubDate || new Date().toISOString(),
        thumbnail: item.itunes?.image || undefined,
      };
    }).filter(episode => episode.audioUrl); // Only include episodes with audio

    const podcastId = generatePodcastId(feedUrl);
    
    return {
      id: podcastId,
      title: feed.title || 'Untitled Podcast',
      description: feed.description || '',
      thumbnail: feed.itunes?.image || feed.image?.url || '/api/placeholder/300/300',
      episodes,
      feedUrl,
    };
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    throw new Error(`Failed to parse RSS feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function parseDuration(duration?: string): number {
  if (!duration) return 0;
  
  // Handle formats like "1:23:45" or "23:45" or just seconds
  const parts = duration.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 1) {
    // Just seconds
    return parts[0] || 0;
  } else if (parts.length === 2) {
    // MM:SS
    return (parts[0] || 0) * 60 + (parts[1] || 0);
  } else if (parts.length === 3) {
    // HH:MM:SS
    return (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0);
  }
  
  return 0;
}

function generatePodcastId(feedUrl: string): string {
  return `podcast-${btoa(feedUrl).replace(/[^a-zA-Z0-9]/g, '').substring(0, 12)}`;
}

export async function validateRSSFeed(feedUrl: string): Promise<boolean> {
  try {
    await parser.parseURL(feedUrl);
    return true;
  } catch {
    return false;
  }
}