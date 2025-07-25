const TMDB_API_KEY = '07093a6aaed5e454e20052e4ce3ebf5c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// At the top of your file or before any function
export type TVShowWithEpisodeInfo = TMDBTVShow & {
  season: number;
  episode: number;
};

// Function to fetch popular shows with episode info
export const getPopularTVShowsWithEpisodeInfo = async (): Promise<TVShowWithEpisodeInfo[]> => {
  const response = await fetch(
    `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
  );
  const data = await response.json();
  const popularShows: TMDBTVShow[] = data.results;

  const enrichedShows: TVShowWithEpisodeInfo[] = await Promise.all(
    popularShows.map(async (show) => {
      try {
        const seasonResponse = await fetch(
          `${TMDB_BASE_URL}/tv/${show.id}/season/1?api_key=${TMDB_API_KEY}&language=en-US`
        );
        const seasonData = await seasonResponse.json();
        const firstEpisode = seasonData.episodes?.[0]?.episode_number || 1;

        return {
          ...show,
          season: 1,
          episode: firstEpisode,
        };
      } catch (error) {
        return {
          ...show,
          season: 1,
          episode: 1,
        };
      }
    })
  );

  return enrichedShows;
};

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export const tmdbService = {
  // Get popular movies
  getPopularMovies: async (): Promise<TMDBMovie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
  },

  // Get trending movies
  getTrendingMovies: async (): Promise<TMDBMovie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/week?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.results;
  },

  // Get top rated movies
  getTopRatedMovies: async (): Promise<TMDBMovie[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
  },

  // Get popular TV shows
  getPopularTVShows: async (): Promise<TMDBTVShow[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    return data.results;
  },

  // Get movie videos (trailers)
  getMovieVideos: async (movieId: number): Promise<Video[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.results;
  },

  // Get TV show videos (trailers)
  getTVVideos: async (tvId: number): Promise<Video[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
    );
    const data = await response.json();
    return data.results;
  },

  // Search movies and TV shows
  search: async (query: string): Promise<(TMDBMovie | TMDBTVShow)[]> => {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
    );
    const data = await response.json();
    return data.results.filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv');
  },

  // Helper to get full image URL
  getImageUrl: (path: string) => {
    return path ? `${TMDB_IMAGE_BASE_URL}${path}` : 'https://images.unsplash.com/photo-1489599856878-f99c3ba38ebd?w=500&h=750&fit=crop';
  },

  // Helper to get YouTube trailer URL
  getTrailerUrl: (videos: Video[]) => {
    const trailer = videos.find(video => 
      video.site === 'YouTube' && 
      (video.type === 'Trailer' || video.type === 'Teaser')
    );
    return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
  }
};