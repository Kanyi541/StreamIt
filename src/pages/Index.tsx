import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ContentGrid from "@/components/ContentGrid";

// Mock data - replace with real API data
const featuredMovies = [
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
  }
];

const liveChannels = [
  {
    id: "live1",
    title: "CNN News",
    image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=450&fit=crop",
    type: "live" as const
  },
  {
    id: "live2", 
    title: "ESPN Sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=450&fit=crop",
    type: "live" as const
  },
  {
    id: "live3",
    title: "Discovery Channel",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop", 
    type: "live" as const
  },
  {
    id: "live4",
    title: "National Geographic",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=450&fit=crop",
    type: "live" as const
  },
  {
    id: "live5",
    title: "BBC World",
    image: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=300&h=450&fit=crop",
    type: "live" as const
  },
  {
    id: "live6",
    title: "HBO Max",
    image: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=300&h=450&fit=crop",
    type: "live" as const
  }
];

const tvShows = [
  {
    id: "tv1",
    title: "Stranger Things",
    image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop",
    type: "tv" as const,
    rating: "8.7",
    year: 2016
  },
  {
    id: "tv2",
    title: "The Mandalorian", 
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=450&fit=crop",
    type: "tv" as const,
    rating: "8.6",
    year: 2019
  },
  {
    id: "tv3",
    title: "Game of Thrones",
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=300&h=450&fit=crop",
    type: "tv" as const,
    rating: "9.2", 
    year: 2011
  },
  {
    id: "tv4",
    title: "Breaking Bad",
    image: "https://images.unsplash.com/photo-1549012443-07b4b0ee3ac8?w=300&h=450&fit=crop",
    type: "tv" as const,
    rating: "9.5",
    year: 2008
  },
  {
    id: "tv5", 
    title: "The Witcher",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=450&fit=crop",
    type: "tv" as const,
    rating: "8.2",
    year: 2019
  },
  {
    id: "tv6",
    title: "House of the Dragon",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=450&fit=crop",
    type: "tv" as const,
    rating: "8.4",
    year: 2022
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      
      <div className="space-y-8 pb-16">
        <ContentGrid title="Featured Movies" items={featuredMovies} />
        <ContentGrid title="Live TV Channels" items={liveChannels} />
        <ContentGrid title="Popular TV Shows" items={tvShows} />
      </div>
    </div>
  );
};

export default Index;