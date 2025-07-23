import { useState } from "react";
import Header from "@/components/Header";
import ContentGrid from "@/components/ContentGrid";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LiveTV = () => {
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const liveChannels = [
    {
      id: "live1",
      title: "CNN News",
      image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=450&fit=crop",
      type: "live" as const,
      category: "News"
    },
    {
      id: "live2", 
      title: "ESPN Sports",
      image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=300&h=450&fit=crop",
      type: "live" as const,
      category: "Sports"
    },
    {
      id: "live3",
      title: "Discovery Channel",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=300&h=450&fit=crop", 
      type: "live" as const,
      category: "Documentary"
    },
    {
      id: "live4",
      title: "National Geographic",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=450&fit=crop",
      type: "live" as const,
      category: "Documentary"
    },
    {
      id: "live5",
      title: "BBC World",
      image: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=300&h=450&fit=crop",
      type: "live" as const,
      category: "News"
    },
    {
      id: "live6",
      title: "HBO Max",
      image: "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=300&h=450&fit=crop",
      type: "live" as const,
      category: "Entertainment"
    },
    {
      id: "live7",
      title: "Fox Sports",
      image: "https://images.unsplash.com/photo-1552168465-239ed1e9bb0a?w=300&h=450&fit=crop",
      type: "live" as const,
      category: "Sports"
    },
    {
      id: "live8",
      title: "Comedy Central",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=450&fit=crop",
      type: "live" as const,
      category: "Entertainment"
    }
  ];

  const handlePlayChannel = (channel: any) => {
    setSelectedChannel(channel);
    setIsPlayerOpen(true);
  };

  const categories = ["All", "News", "Sports", "Entertainment", "Documentary"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Live TV</h1>
            <p className="text-muted-foreground text-lg">
              Watch live television channels from around the world
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
              <span className="text-sm text-muted-foreground">Broadcasting now</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-8">
            {categories.map(category => (
              <Button key={category} variant="outline">
                {category}
              </Button>
            ))}
          </div>

          <ContentGrid 
            title="Live Channels" 
            items={liveChannels.map(channel => ({
              ...channel,
              onClick: () => handlePlayChannel(channel)
            }))} 
          />
        </div>
      </div>

      {selectedChannel && (
        <VideoPlayer
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          title={selectedChannel.title}
          isOpen={isPlayerOpen}
          onClose={() => {
            setIsPlayerOpen(false);
            setSelectedChannel(null);
          }}
        />
      )}
    </div>
  );
};

export default LiveTV;