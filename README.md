# Professional Podcast Player

A modern, responsive podcast player built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎵 **Professional Audio Player**: Full-featured audio controls with play/pause, seek, volume control, and skip functionality
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🎧 **Episode Management**: Browse episodes with detailed information and easy selection
- ⏭️ **Playlist Navigation**: Navigate between episodes with next/previous controls
- 🎨 **Beautiful UI**: Clean, modern interface with professional styling
- 🎯 **TypeScript**: Full type safety throughout the application
- ⚡ **Next.js 15**: Built with the latest Next.js features including Turbopack

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── placeholder/   # Placeholder image generator
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── AudioPlayer.tsx    # Audio player component
│   ├── EpisodeList.tsx    # Episode list component
│   └── PodcastHeader.tsx  # Podcast header component
├── contexts/              # React contexts
│   └── PlayerContext.tsx  # Player state management
├── lib/                   # Utilities and data
│   └── mock-data.ts       # Mock podcast data
└── types/                 # TypeScript type definitions
    └── podcast.ts         # Podcast-related types
```

## Key Components

### AudioPlayer
- Full audio playback controls
- Seek bar with progress indication
- Volume control with mute functionality
- Skip forward/backward (15s/30s)
- Episode navigation (previous/next)
- Responsive design

### EpisodeList
- Display all podcast episodes
- Episode selection and highlighting
- Episode metadata (duration, publish date)
- Responsive grid layout

### PlayerContext
- Global state management for playback
- Playlist management
- Episode navigation logic
- Playback state synchronization

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Adding Real Podcast Data
Replace the mock data in `src/lib/mock-data.ts` with real podcast RSS feed data or API integration.

### Styling
Customize the design by modifying Tailwind classes in components or extending the theme in `tailwind.config.js`.

### Features
Add new features like:
- Podcast search and filtering
- Playback speed control
- Download functionality
- Favorites and bookmarks
- User authentication

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).
