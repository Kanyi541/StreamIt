import { useState } from "react";
import Header from "@/components/Header";
import ContentGrid from "@/components/ContentGrid";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { liveChannels } from "@/data/channels";

const LiveTV = () => {
  const [selectedChannel, setSelectedChannel] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [customChannels, setCustomChannels] = useState<any[]>([]);
  const [iptvUrl, setIptvUrl] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const allChannels = [...liveChannels, ...customChannels];

  const categories = ["All", ...new Set(allChannels.map(channel => channel.category))];

  const filteredChannels =
    selectedCategory === "All"
      ? allChannels
      : allChannels.filter(channel => channel.category === selectedCategory);

  const handlePlayChannel = (channel: any) => {
    setSelectedChannel(channel);
    setIsPlayerOpen(true);
  };

  const handleUpload = () => {
    if (iptvUrl.trim() !== "") {
      const newChannel = {
        id: Date.now().toString(),
        title: `Custom Stream`,
        image: "https://placehold.co/300x450?text=IPTV",
        type: "live",
        category: "Custom",
        streamUrl: iptvUrl.trim()
      };
      setCustomChannels([...customChannels, newChannel]);
      setIptvUrl("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Live TV</h1>
            <p className="text-muted-foreground text-lg">
              Watch live television channels from around the world or stream your custom IPTV.
            </p>
            <div className="flex items-center space-x-2 mt-4">
              <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
              <span className="text-sm text-muted-foreground">Broadcasting now</span>
            </div>

            {/* IPTV Upload */}
            <div className="mt-6 flex gap-2">
              <Input
                placeholder="Paste your M3U8 or IPTV stream URL"
                value={iptvUrl}
                onChange={e => setIptvUrl(e.target.value)}
              />
              <Button onClick={handleUpload}>Add</Button>
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Filtered Channels Grid */}
          <ContentGrid
            title={`${selectedCategory} Channels`}
            items={filteredChannels.map(channel => ({
              ...channel,
              onClick: () => handlePlayChannel(channel)
            }))}
          />
        </div>
      </div>

      {selectedChannel && (
        <VideoPlayer
          src={selectedChannel.streamUrl}
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
