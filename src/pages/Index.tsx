import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContentGrid from "@/components/ContentGrid";
import VideoPlayer from "@/components/VideoPlayer";
import SearchModal from "@/components/SearchModal";
import { tmdbService, TMDBMovie, TMDBTVShow } from "@/services/tmdb";

const Index = () => {
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState<TMDBMovie[]>([]);
  const [popularMovies, setPopularMovies] = useState<TMDBMovie[]>([]);
  const [popularTVShows, setPopularTVShows] = useState<TMDBTVShow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const [trending, popular, tvShows] = await Promise.all([
          tmdbService.getTrendingMovies(),
          tmdbService.getPopularMovies(),
          tmdbService.getPopularTVShows()
        ]);
        
        setTrendingMovies(trending.slice(0, 12));
        setPopularMovies(popular.slice(0, 12));
        setPopularTVShows(tvShows.slice(0, 12));
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handlePlayContent = async (content: any) => {
    try {
      const videos = content.title 
        ? await tmdbService.getMovieVideos(content.id)
        : await tmdbService.getTVVideos(content.id);
      
      const trailerUrl = tmdbService.getTrailerUrl(videos);
      setSelectedContent({
        ...content,
        trailerUrl
      });
      setIsPlayerOpen(true);
    } catch (error) {
      console.error('Error fetching trailer:', error);
      setSelectedContent(content);
      setIsPlayerOpen(true);
    }
  };

  const handleSearch = () => {
    setIsSearchOpen(true);
  };

  const handleSelectContent = (content: any) => {
    handlePlayContent(content);
  };

  // Convert TMDB data to ContentGrid format
  const formatMovies = (movies: TMDBMovie[]) => movies.map(movie => ({
    id: movie.id.toString(),
    title: movie.title,
    type: "movie" as const,
    image: tmdbService.getImageUrl(movie.poster_path),
    rating: movie.vote_average.toFixed(1),
    year: new Date(movie.release_date).getFullYear(),
    tmdbId: movie.id, // Store TMDB ID for watchlist
    onClick: () => handlePlayContent(movie)
  }));

  const formatTVShows = (shows: TMDBTVShow[]) => shows.map(show => ({
    id: show.id.toString(),
    title: show.name,
    type: "tv" as const,
    image: tmdbService.getImageUrl(show.poster_path),
    rating: show.vote_average.toFixed(1),
    year: new Date(show.first_air_date).getFullYear(),
    tmdbId: show.id, // Store TMDB ID for watchlist
    onClick: () => handlePlayContent(show)
  }));

  // Mock live channels data
  const liveChannels = [
    {
      id: "live1",
      title: "CNN News",
      image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=450&fit=crop",
      type: "live" as const,
      onClick: () => handlePlayContent({id: "live1", title: "CNN News"})
    },
    {
      id: "live2", 
      title: "ESPN Sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=450&fit=crop",
      type: "live" as const,
      onClick: () => handlePlayContent({id: "live2", title: "ESPN Sports"})
    },
    {
      id: "live3",
      title: "Discovery Channel",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop", 
      type: "live" as const,
      onClick: () => handlePlayContent({id: "live3", title: "Discovery Channel"})
    },
    {
      id: "live4",
      title: "National Geographic",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=450&fit=crop",
      type: "live" as const,
      onClick: () => handlePlayContent({id: "live4", title: "National Geographic"})
    },
    {
      id: "live5",
      title: "BBC World",
      image: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=300&h=450&fit=crop",
      type: "live" as const,
      onClick: () => handlePlayContent({id: "live5", title: "BBC World"})
    },
    {
      id: "live6",
      title: "HBO Max",
      image: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=300&h=450&fit=crop",
      type: "live" as const,
      onClick: () => handlePlayContent({id: "live6", title: "HBO Max"})
    }
  ];
  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <main className="relative">
        {loading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading content...</p>
            </div>
          </div>
        ) : (
          <>
            <HeroSection 
              title={trendingMovies[0]?.title || "StreamBox"} 
              description={trendingMovies[0]?.overview || "Discover the latest movies and TV shows"}
              backgroundImage={trendingMovies[0] ? tmdbService.getImageUrl(trendingMovies[0].backdrop_path) : "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920&h=1080&fit=crop"}
              onPlay={() => trendingMovies[0] && handlePlayContent(trendingMovies[0])}
            />
            
            <div className="space-y-12 pb-12">
              <ContentGrid title="Trending Now" items={formatMovies(trendingMovies)} />
              <ContentGrid title="Popular Movies" items={formatMovies(popularMovies)} />
              <ContentGrid title="Live TV Channels" items={liveChannels} />
              <ContentGrid title="Popular TV Shows" items={formatTVShows(popularTVShows)} />
            </div>
          </>
        )}
      </main>

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectContent={handleSelectContent}
      />

      {selectedContent && (
        <VideoPlayer
          src={selectedContent.isFromWatchlist 
            ? (selectedContent.type === 'movie' 
                ? `https://vidsrc.to/embed/movie/${selectedContent.tmdbId || selectedContent.id}`
                : `https://vidsrc.to/embed/tv/${selectedContent.tmdbId || selectedContent.id}`)
            : (selectedContent.trailerUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4")
          }
          title={selectedContent.title || selectedContent.name}
          isOpen={isPlayerOpen}
          onClose={() => {
            setIsPlayerOpen(false);
            setSelectedContent(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;