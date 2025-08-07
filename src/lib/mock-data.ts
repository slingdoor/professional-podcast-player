import { Podcast } from '@/types/podcast';

export const mockPodcast: Podcast = {
  id: '1',
  title: 'Tech Insights Podcast',
  description: 'Deep dives into the latest technology trends and innovations.',
  thumbnail: '/api/placeholder/300/300',
  episodes: [
    {
      id: '1',
      title: 'The Future of AI in Software Development',
      description: 'Exploring how artificial intelligence is transforming the way we build software.',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 2340,
      publishedAt: '2024-01-15',
      thumbnail: '/api/placeholder/300/300',
    },
    {
      id: '2',
      title: 'Building Scalable Web Applications',
      description: 'Best practices and patterns for creating applications that scale.',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 3120,
      publishedAt: '2024-01-08',
      thumbnail: '/api/placeholder/300/300',
    },
    {
      id: '3',
      title: 'The Rise of TypeScript in Modern Development',
      description: 'Why TypeScript has become essential for large-scale JavaScript applications.',
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      duration: 2880,
      publishedAt: '2024-01-01',
      thumbnail: '/api/placeholder/300/300',
    },
  ],
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};