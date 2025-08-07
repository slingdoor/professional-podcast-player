import { NextRequest, NextResponse } from 'next/server';
import { parseRSSFeed, validateRSSFeed } from '@/lib/rss-parser';

export async function POST(request: NextRequest) {
  try {
    const { feedUrl, action } = await request.json();

    if (!feedUrl || typeof feedUrl !== 'string') {
      return NextResponse.json(
        { error: 'Feed URL is required' },
        { status: 400 }
      );
    }

    if (action === 'validate') {
      const isValid = await validateRSSFeed(feedUrl);
      return NextResponse.json({ isValid });
    }

    if (action === 'parse') {
      const podcast = await parseRSSFeed(feedUrl);
      return NextResponse.json(podcast);
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('RSS parsing error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process RSS feed'
      },
      { status: 500 }
    );
  }
}