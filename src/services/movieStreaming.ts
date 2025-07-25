// Movie streaming service integration
// Note: These are demo endpoints. In production, you'd need proper licensing agreements.

export const movieStreamingService = {
  // Get streaming URL for movies
  getMovieStreamUrl: (tmdbId: number | string) => {
    // VidSrc.to is a popular free streaming embed service
    return `https://vidsrc.to/embed/movie/${tmdbId}`;
  },

  // Get streaming URLs for TV shows (episodes)
getTVStreamUrls: (tmdbId: number | string, season: number = 1, episode: number = 1) => {
  const sources = [
    // ✅ Vidsrc (known to work for episodes)
    `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`,

    // ✅ Multiembed (correct episode support)
    `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,

    // ✅ 2Embed (supports seasons/episodes)
    `https://www.2embed.to/embed/tmdb/tv?id=${tmdbId}&s=${season}&e=${episode}`,

    // ✅ SmashyStream with query params
    `https://embed.smashystream.xyz/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`,

    // ⚠️ Vidsrc clone (some may not support episodes)
    `https://vidsrc.xyz/embed/tv/${tmdbId}/${season}/${episode}`,
  ];

  return sources;
},


  // Alternative streaming sources (you can add more)
getAlternativeStreamUrls: (tmdbId: number | string, type: 'movie' | 'tv') => {
  const sources = [
    `https://vidsrc.to/embed/${type}/${tmdbId}`,
    `https://www.2embed.to/embed/tmdb/${type}?id=${tmdbId}`,
    `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`,
    `https://embed.smashystream.xyz/${type}?tmdb=${tmdbId}`,
    `https://www.cineb.rs/embed/${type}/${tmdbId}`,
    `https://vidsrc.xyz/embed/${type}/${tmdbId}`,
    `https://v2.vidsrc.me/embed/${type}/${tmdbId}`,
    `https://watchsomuch.tv/Embed/?tmdb=${tmdbId}&type=${type}`,
    `https://streamtape.com/e/${tmdbId}`, // if using StreamTape ids
  ];

  return sources;
},


  // Check if content is available for streaming
  isContentAvailable: async (tmdbId: number | string, type: 'movie' | 'tv'): Promise<boolean> => {
    try {
      // Simple availability check - in production you'd want more robust checking
      const url = `https://vidsrc.to/embed/${type}/${tmdbId}`;
      const response = await fetch(url, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false; // Assume available if check fails
    }
  }
};

// Note: For production use, you should:
// 1. Implement proper content licensing
// 2. Use legitimate streaming APIs (like Netflix API, Disney+ API, etc.)
// 3. Add proper error handling and fallbacks
// 4. Implement user authentication and subscription checks
// 5. Add content geo-restrictions if needed