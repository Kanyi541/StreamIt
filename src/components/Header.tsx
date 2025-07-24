import { Search, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import SearchModal from "./SearchModal";

interface HeaderProps {
  onSearch?: () => void;
}

const Header = ({ onSearch }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
            <a href="/">
              <Button 
                variant="ghost" 
                className={`${isActive('/') ? 'text-primary' : 'text-foreground'} hover:text-primary`}
              >
                Home
              </Button>
            </a>
            <a href="/live-tv">
              <Button 
                variant="ghost" 
                className={`${isActive('/live-tv') ? 'text-primary' : 'text-foreground'} hover:text-primary`}
              >
                IPTV-LIVE TV
              </Button>
            </a>
            <a href="/my-list">
              <Button 
                variant="ghost" 
                className={`${isActive('/my-list') ? 'text-primary' : 'text-foreground'} hover:text-primary`}
              >
                My List
              </Button>
            </a>
          </nav>

          {/* Search & User */}
          <div className="flex items-center space-x-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search movies, shows..."
                className="pl-10 w-64 bg-secondary border-border cursor-pointer"
                onClick={() => {
                  setIsSearchOpen(true);
                  onSearch?.();
                }}
                readOnly
              />
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="sm:hidden"
              onClick={() => {
                setIsSearchOpen(true);
                onSearch?.();
              }}
            >
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
              <a href="/">
                <Button variant="ghost" className="justify-start w-full">Home</Button>
              </a>
              <a href="/movies">
                <Button variant="ghost" className="justify-start w-full">Movies</Button>
              </a>
              <a href="/live-tv">
                <Button variant="ghost" className="justify-start w-full">IPTV</Button>
              </a>
              <Button variant="ghost" className="justify-start w-full">TV Shows</Button>
              <a href="/my-list">
                <Button variant="ghost" className="justify-start w-full">My List</Button>
              </a>
            </nav>
          </div>
        )}
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectContent={(content) => {
          console.log('Selected content:', content);
          // Handle content selection
        }}
      />
    </header>
  );
};

export default Header;