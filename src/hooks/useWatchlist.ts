import { useState, useEffect } from 'react';

interface WatchlistItem {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'live';
  image: string;
  year?: number;
  rating?: string;
  tmdbId?: number; // Add TMDB ID for fetching full movie content
  isFromWatchlist?: boolean; // Flag to indicate it's from watchlist
}

export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('streambox-watchlist');
    if (saved) {
      setWatchlist(JSON.parse(saved));
    }
  }, []);

  const saveToStorage = (items: WatchlistItem[]) => {
    localStorage.setItem('streambox-watchlist', JSON.stringify(items));
  };

  const addToWatchlist = (item: WatchlistItem) => {
    const newWatchlist = [...watchlist, item];
    setWatchlist(newWatchlist);
    saveToStorage(newWatchlist);
  };

  const removeFromWatchlist = (id: string) => {
    const newWatchlist = watchlist.filter(item => item.id !== id);
    setWatchlist(newWatchlist);
    saveToStorage(newWatchlist);
  };

  const isInWatchlist = (id: string) => {
    return watchlist.some(item => item.id === id);
  };

  const toggleWatchlist = (item: WatchlistItem) => {
    if (isInWatchlist(item.id)) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    toggleWatchlist,
  };
};