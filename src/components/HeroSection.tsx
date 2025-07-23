import { Play, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Stream Your
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Favorite Content
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-lg">
            Discover thousands of movies, TV shows, and live IPTV channels. 
            Your entertainment universe awaits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 shadow-glow-primary transition-all duration-300 hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" fill="currentColor" />
              Watch Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-border hover:bg-secondary"
            >
              <Plus className="mr-2 h-5 w-5" />
              My List
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="hover:bg-secondary"
            >
              <Info className="mr-2 h-5 w-5" />
              More Info
            </Button>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>4K Ultra HD</span>
            <span>•</span>
            <span>Dolby Atmos</span>
            <span>•</span>
            <span>Multiple Languages</span>
          </div>
        </div>
      </div>
      
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;