# Vercel Deployment Guide

This guide will help you deploy the Professional Podcast Player to Vercel.

## Prerequisites

- GitHub account with the repository
- Vercel account (free tier available)
- Basic knowledge of environment variables

## Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/slingdoor/professional-podcast-player)

## Manual Deployment Steps

### 1. Fork or Clone the Repository

```bash
git clone https://github.com/slingdoor/professional-podcast-player.git
cd professional-podcast-player
```

### 2. Install Vercel CLI (Optional)

```bash
npm i -g vercel
```

### 3. Deploy to Vercel

#### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

#### Option B: Using Vercel CLI

```bash
vercel --prod
```

### 4. Environment Variables (Optional)

In your Vercel dashboard, go to Project Settings > Environment Variables and add:

```
RSS_TIMEOUT=25000
RSS_MAX_FEEDS_PER_USER=50
DEBUG=false
```

### 5. Domain Configuration

- Vercel provides a default domain (e.g., `professional-podcast-player.vercel.app`)
- You can add a custom domain in Project Settings > Domains

## Vercel-Specific Optimizations

This application has been optimized for Vercel with:

- **Serverless Functions**: API routes are optimized for Vercel's serverless environment
- **Edge Runtime**: Fast global content delivery
- **Automatic HTTPS**: SSL certificates provided automatically
- **Performance**: Optimized bundle size and caching
- **Timeout Handling**: API routes respect Vercel's 30-second timeout limit

## Configuration Files

- `vercel.json`: Vercel deployment configuration
- `next.config.ts`: Next.js optimizations for Vercel
- `.env.example`: Template for environment variables

## Performance Features

- **RSS Parser Optimization**: Limited to 50 episodes per feed for performance
- **Timeout Management**: 25-second timeout for RSS parsing
- **CORS Headers**: Properly configured for cross-origin requests
- **Error Handling**: User-friendly error messages for common issues
- **Bundle Optimization**: Webpack configuration for smaller bundles

## Troubleshooting

### Common Issues

1. **RSS Parsing Timeout**
   - Solution: Some RSS feeds are slow. The app handles this gracefully with user feedback.

2. **CORS Errors**
   - Solution: API routes include proper CORS headers. Check `src/app/api/parse-rss/route.ts`

3. **Build Errors**
   - Solution: Ensure all dependencies are in `package.json`. Run `npm install` locally first.

4. **Environment Variables Not Working**
   - Solution: Check Vercel dashboard Environment Variables section

### Logs and Debugging

- View function logs in Vercel Dashboard > Functions tab
- Enable debug mode by setting `DEBUG=true` in environment variables
- Check browser console for client-side errors

## Support

If you encounter issues:

1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review the application logs in Vercel Dashboard
3. Open an issue on the GitHub repository

## Production Checklist

Before going live:

- [ ] Test RSS feed parsing with multiple podcasts
- [ ] Verify audio playback on different devices
- [ ] Check responsive design on mobile/tablet
- [ ] Test error handling with invalid RSS feeds
- [ ] Verify HTTPS is working correctly
- [ ] Test localStorage persistence
- [ ] Confirm all environment variables are set

## Performance Monitoring

Monitor your deployment:

- Vercel Analytics (available in dashboard)
- Core Web Vitals metrics
- Function execution times
- Error rates and types

Your Professional Podcast Player is now ready for production on Vercel! 🚀