import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import ContentGrid from "@/components/ContentGrid";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { tmdbService, TMDBMovie } from "@/services/tmdb";

const Movies = () => {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const genreId = searchParams.get('genre');
  const genreName = searchParams.get('name') || "All Movies";

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        if (genreId) {
          const fetchedMovies = await tmdbService.getMoviesByGenre(genreId);
          setMovies(fetchedMovies);
        } else {
          const fetchedMovies = await tmdbService.getPopularMovies();
          setMovies(fetchedMovies);
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, [genreId]);

  const handlePlayMovie = (movie: any) => {
    setSelectedMovie({ ...movie, isFromWatchlist: true, type: 'movie' });
    setIsPlayerOpen(true);
  };

  const formatMovies = (moviesList: TMDBMovie[]) => moviesList.map(movie => ({
    id: movie.id.toString(),
    title: movie.title,
    type: "movie" as const,
    image: tmdbService.getImageUrl(movie.poster_path),
    rating: movie.vote_average.toFixed(1),
    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
    tmdbId: movie.id,
    onClick: () => handlePlayMovie(movie)
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{genreName}</h1>
            <p className="text-muted-foreground text-lg">
              {genreId ? `Explore the best ${genreName} movies from newest to oldest` : "Discover the latest blockbusters and timeless classics"}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant={!genreId ? "default" : "outline"} onClick={() => navigate('/movies')}>All Movies</Button>
            <Button variant={genreId === '28' ? "default" : "outline"} onClick={() => navigate('/movies?genre=28&name=Action')}>Action</Button>
            <Button variant={genreId === '35' ? "default" : "outline"} onClick={() => navigate('/movies?genre=35&name=Comedy')}>Comedy</Button>
            <Button variant={genreId === '18' ? "default" : "outline"} onClick={() => navigate('/movies?genre=18&name=Drama')}>Drama</Button>
            <Button variant={genreId === '878' ? "default" : "outline"} onClick={() => navigate('/movies?genre=878&name=Sci-Fi')}>Sci-Fi</Button>
            <Button variant={genreId === '27' ? "default" : "outline"} onClick={() => navigate('/movies?genre=27&name=Horror')}>Horror</Button>
            <Button variant={genreId === '10749' ? "default" : "outline"} onClick={() => navigate('/movies?genre=10749&name=Romance')}>Romance</Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ContentGrid 
              title="" 
              items={formatMovies(movies)} 
            />
          )}
        </div>
      </div>

      {selectedMovie && (
        <VideoPlayer
          src={`https://vidsrc.me/embed/movie?tmdb=${selectedMovie.tmdbId || selectedMovie.id}`}
          title={selectedMovie.title}
          isOpen={isPlayerOpen}
          onClose={() => {
            setIsPlayerOpen(false);
            setSelectedMovie(null);
          }}
        />
      )}
    </div>
  );
};

export default Movies;