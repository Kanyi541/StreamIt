import { Card, CardContent } from "@/components/ui/card";
import { Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentItem {
  id: string;
  title: string;
  image: string;
  type: "movie" | "tv" | "live";
  rating?: string;
  year?: number;
}

interface ContentGridProps {
  title: string;
  items: ContentItem[];
}

const ContentGrid = ({ title, items }: ContentGridProps) => {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map((item) => (
            <ContentCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ContentCard = ({ item }: { item: ContentItem }) => {
  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-glow-primary">
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button size="sm" className="bg-primary/90 hover:bg-primary shadow-glow-primary">
            <Play className="h-4 w-4 mr-1" fill="currentColor" />
            Play
          </Button>
        </div>
        
        {/* Type Badge */}
        <div className="absolute top-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            item.type === 'live' 
              ? 'bg-red-500 text-white' 
              : item.type === 'movie' 
              ? 'bg-blue-500 text-white' 
              : 'bg-green-500 text-white'
          }`}>
            {item.type === 'live' ? 'LIVE' : item.type === 'movie' ? 'MOVIE' : 'TV'}
          </span>
        </div>
        
        {/* Add to List */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="p-3">
        <h3 className="font-medium text-sm mb-1 line-clamp-2">{item.title}</h3>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {item.year && <span>{item.year}</span>}
          {item.rating && <span className="bg-primary/20 text-primary px-1 rounded">{item.rating}</span>}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentGrid;