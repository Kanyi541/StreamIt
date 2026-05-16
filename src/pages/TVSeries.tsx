import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ContentGrid from "@/components/ContentGrid";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { tmdbService, TMDBTVShow } from "@/services/tmdb";

const TVSeries = () => {
  const [selectedShow, setSelectedShow] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [shows, setShows] = useState<TMDBTVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const genreId = searchParams.get('genre');
  const genreName = searchParams.get('name') || "All TV-Series";

  useEffect(() => {
    const fetchShows = async () => {
      setLoading(true);
      try {
        if (genreId) {
          const fetchedShows = await tmdbService.getTVShowsByGenre(genreId);
          setShows(fetchedShows);
        } else {
          const fetchedShows = await tmdbService.getPopularTVShows();
          setShows(fetchedShows);
        }
      } catch (error) {
        console.error("Error fetching TV shows:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, [genreId]);

  const handlePlayShow = (show: any) => {
    setSelectedShow({ ...show, isFromWatchlist: true, type: 'tv' });
    setIsPlayerOpen(true);
  };

  const formatShows = (showsList: TMDBTVShow[]) => showsList.map(show => ({
    id: show.id.toString(),
    title: show.name,
    type: "tv" as const,
    image: tmdbService.getImageUrl(show.poster_path),
    rating: show.vote_average.toFixed(1),
    year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'N/A',
    tmdbId: show.id,
    media_type: "tv",
    onClick: () => handlePlayShow(show)
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{genreName}</h1>
            <p className="text-muted-foreground text-lg">
              {genreId ? `Explore the best ${genreName} TV shows from newest to oldest` : "Discover the latest binge-worthy TV series"}
            </p>
          </div>

          <div className="flex flex-nowrap md:flex-wrap gap-4 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <Button variant={!genreId ? "default" : "outline"} onClick={() => navigate('/tv-series')}>All TV-Series</Button>
            <Button variant={genreId === '10759' ? "default" : "outline"} onClick={() => navigate('/tv-series?genre=10759&name=Action%20%26%20Adventure')}>Action</Button>
            <Button variant={genreId === '35' ? "default" : "outline"} onClick={() => navigate('/tv-series?genre=35&name=Comedy')}>Comedy</Button>
            <Button variant={genreId === '18' ? "default" : "outline"} onClick={() => navigate('/tv-series?genre=18&name=Drama')}>Drama</Button>
            <Button variant={genreId === '10765' ? "default" : "outline"} onClick={() => navigate('/tv-series?genre=10765&name=Sci-Fi%20%26%20Fantasy')}>Sci-Fi</Button>
            <Button variant={genreId === '80' ? "default" : "outline"} onClick={() => navigate('/tv-series?genre=80&name=Crime')}>Crime</Button>
            <Button variant={genreId === '16' ? "default" : "outline"} onClick={() => navigate('/tv-series?genre=16&name=Animation')}>Animation</Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ContentGrid 
              title="" 
              items={formatShows(shows)} 
            />
          )}
        </div>
      </div>

      {selectedShow && (
        <VideoPlayer
          src={`https://vidsrc.me/embed/tv?tmdb=${selectedShow.tmdbId || selectedShow.id}&season=1&episode=1`}
          title={selectedShow.title || selectedShow.name}
          isOpen={isPlayerOpen}
          onClose={() => {
            setIsPlayerOpen(false);
            setSelectedShow(null);
          }}
        />
      )}
    </div>
  );
};

export default TVSeries;