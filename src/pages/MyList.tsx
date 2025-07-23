import { useState } from "react";
import Header from "@/components/Header";
import ContentGrid from "@/components/ContentGrid";
import VideoPlayer from "@/components/VideoPlayer";
import { useWatchlist } from "@/hooks/useWatchlist";

const MyList = () => {
  const { watchlist } = useWatchlist();
  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const handlePlayContent = (content: any) => {
    setSelectedContent(content);
    setIsPlayerOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">My List</h1>
            <p className="text-muted-foreground text-lg">
              Your saved movies, shows, and channels
            </p>
          </div>

          {watchlist.length > 0 ? (
            <ContentGrid 
              title={`My Watchlist (${watchlist.length} items)`}
              items={watchlist.map(item => ({
                ...item,
                onClick: () => handlePlayContent(item)
              }))} 
            />
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-semibold mb-4">Your list is empty</h3>
                <p className="text-muted-foreground mb-6">
                  Start adding movies, shows, and channels to your list to watch later.
                </p>
                <a href="/" className="text-primary hover:underline">
                  Browse content
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedContent && (
        <VideoPlayer
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          title={selectedContent.title}
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

export default MyList;