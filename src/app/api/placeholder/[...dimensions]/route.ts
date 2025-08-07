import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ dimensions: string[] }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { dimensions } = await params;
  const [width, height] = dimensions;
  
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#E5E7EB"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" 
            fill="#9CA3AF" text-anchor="middle" dy=".3em">
        ${width}×${height}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
}