import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface SearchResult {
  id: string;
  title: string;
  type: "movie" | "tv" | "live";
  image: string;
  year?: number;
  rating?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContent: (content: SearchResult) => void;
}

const SearchModal = ({ isOpen, onClose, onSelectContent }: SearchModalProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);

  // Mock search data - replace with real API
  const mockData: SearchResult[] = [
    { id: "1", title: "The Dark Knight", type: "movie", image: "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=300&h=450&fit=crop", year: 2008, rating: "9.0" },
    { id: "2", title: "Inception", type: "movie", image: "https://images.unsplash.com/photo-1489599456549-5d5a4dc8e4ec?w=300&h=450&fit=crop", year: 2010, rating: "8.8" },
    { id: "3", title: "Breaking Bad", type: "tv", image: "https://images.unsplash.com/photo-1549012443-07b4b0ee3ac8?w=300&h=450&fit=crop", year: 2008, rating: "9.5" },
    { id: "4", title: "CNN News", type: "live", image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=300&h=450&fit=crop" },
    { id: "5", title: "Stranger Things", type: "tv", image: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=300&h=450&fit=crop", year: 2016, rating: "8.7" },
  ];

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      const filtered = mockData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Search Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search movies, shows, channels..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 text-lg h-12"
                autoFocus
              />
            </div>
            <Button size="icon" variant="ghost" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Results */}
        <div className="overflow-y-auto max-h-96">
          {query && results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No results found for "{query}"
            </div>
          ) : results.length > 0 ? (
            <div className="p-4 space-y-2">
              {results.map((result) => (
                <Card
                  key={result.id}
                  className="cursor-pointer hover:bg-secondary transition-colors"
                  onClick={() => {
                    onSelectContent(result);
                    onClose();
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={result.image}
                        alt={result.title}
                        className="w-16 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{result.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 text-xs font-medium rounded ${
                            result.type === 'live' 
                              ? 'bg-red-500 text-white' 
                              : result.type === 'movie' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-green-500 text-white'
                          }`}>
                            {result.type === 'live' ? 'LIVE' : result.type === 'movie' ? 'MOVIE' : 'TV'}
                          </span>
                          {result.year && (
                            <span className="text-muted-foreground">{result.year}</span>
                          )}
                          {result.rating && (
                            <span className="bg-primary/20 text-primary px-2 py-1 text-xs rounded">
                              {result.rating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Start typing to search for content...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;