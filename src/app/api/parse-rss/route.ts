import { NextRequest, NextResponse } from 'next/server';
import { parseRSSFeed, validateRSSFeed } from '@/lib/rss-parser';

// Add CORS headers for Vercel
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Add timeout for Vercel serverless functions
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 25000); // 25s limit
    });
    
    const requestPromise = async () => {
      const body = await request.json();
      const { feedUrl, action } = body;

      if (!feedUrl || typeof feedUrl !== 'string') {
        return NextResponse.json(
          { error: 'Feed URL is required' },
          { status: 400, headers: corsHeaders }
        );
      }

      // Basic URL validation
      try {
        new URL(feedUrl);
      } catch {
        return NextResponse.json(
          { error: 'Invalid URL format' },
          { status: 400, headers: corsHeaders }
        );
      }

      if (action === 'validate') {
        const isValid = await validateRSSFeed(feedUrl);
        return NextResponse.json({ isValid }, { headers: corsHeaders });
      }

      if (action === 'parse') {
        const podcast = await parseRSSFeed(feedUrl);
        return NextResponse.json(podcast, { headers: corsHeaders });
      }

      return NextResponse.json(
        { error: 'Invalid action. Use "validate" or "parse"' },
        { status: 400, headers: corsHeaders }
      );
    };

    // Race between the request and timeout
    const result = await Promise.race([requestPromise(), timeoutPromise]);
    return result;

  } catch (error) {
    console.error('RSS parsing error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to process RSS feed';
    
    const statusCode = errorMessage.includes('timeout') ? 408 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode, headers: corsHeaders }
    );
  }
}