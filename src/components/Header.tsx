import { Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              StreamBox
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Home
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Movies
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              IPTV
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              TV Shows
            </Button>
            <Button variant="ghost" className="text-foreground hover:text-primary">
              My List
            </Button>
          </nav>

          {/* Search & User */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search movies, shows..."
                className="pl-10 w-64 bg-secondary border-border"
              />
            </div>
            <Button size="icon" variant="ghost" className="sm:hidden">
              <Search className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="ghost">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border">
            <nav className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost" className="justify-start">
                Home
              </Button>
              <Button variant="ghost" className="justify-start">
                Movies
              </Button>
              <Button variant="ghost" className="justify-start">
                IPTV
              </Button>
              <Button variant="ghost" className="justify-start">
                TV Shows
              </Button>
              <Button variant="ghost" className="justify-start">
                My List
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;