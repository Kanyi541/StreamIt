import { useState } from "react";
import Header from "@/components/Header";
import ContentGrid from "@/components/ContentGrid";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";

const Movies = () => {
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const allMovies = [
    {
      id: "1",
      title: "The Dark Knight",
      image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300&h=450&fit=crop",
      type: "movie" as const,
      rating: "9.0",
      year: 2008
    },
    {
      id: "2", 
      title: "Inception",
      image: "https://images.unsplash.com/photo-1489599456549-5d5a4dc8e4ec?w=300&h=450&fit=crop",
      type: "movie" as const,
      rating: "8.8",
      year: 2010
    },
    {
      id: "3",
      title: "Avengers: Endgame", 
      image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?w=300&h=450&fit=crop",
      type: "movie" as const,
      rating: "8.4",
      year: 2019
    },
    {
      id: "4",
      title: "Interstellar",
      image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=300&h=450&fit=crop",
      type: "movie" as const,
      rating: "8.6", 
      year: 2014
    },
    {
      id: "5",
      title: "The Matrix",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
      type: "movie" as const,
      rating: "8.7",
      year: 1999
    },
    {
      id: "6",
      title: "Spider-Man: No Way Home",
      image: "https://images.unsplash.com/photo-1635805737707-575885ab0b28?w=300&h=450&fit=crop",
      type: "movie" as const,
      rating: "8.2",
      year: 2021
    },
    {
      id: "7",
      title: "Dune",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop",
      type: "movie" as const,
      rating: "8.0",
      year: 2021
    },
    {
      id: "8",
      title: "Top Gun: Maverick",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=450&fit=crop",
      type: "movie" as const,
      rating: "8.3",
      year: 2022
    }
  ];

  const handlePlayMovie = (movie: any) => {
    setSelectedMovie(movie);
    setIsPlayerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Movies</h1>
            <p className="text-muted-foreground text-lg">
              Discover the latest blockbusters and timeless classics
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="default">All Movies</Button>
            <Button variant="outline">Action</Button>
            <Button variant="outline">Comedy</Button>
            <Button variant="outline">Drama</Button>
            <Button variant="outline">Sci-Fi</Button>
            <Button variant="outline">Horror</Button>
            <Button variant="outline">Romance</Button>
          </div>

          <ContentGrid 
            title="All Movies" 
            items={allMovies.map(movie => ({
              ...movie,
              onClick: () => handlePlayMovie(movie)
            }))} 
          />
        </div>
      </div>

      {selectedMovie && (
        <VideoPlayer
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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