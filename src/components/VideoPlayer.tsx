import { useState, useRef, useEffect } from "react";
import { X, Pause, Play, Maximize2, Minimize2 } from "lucide-react";
import Hls from "hls.js";
import { analytics } from "@/firebase";
import { logEvent } from "firebase/analytics";

interface VideoPlayerProps {
  src: string;
  title?: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ src, title, isOpen, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [embedSrc, setEmbedSrc] = useState("");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [isMaximized, setIsMaximized] = useState(false);
  const [seasonsData, setSeasonsData] = useState<any[]>([]);
  const [maxSeasons, setMaxSeasons] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(1);
  const [selectedServer, setSelectedServer] = useState(0);

  // Detect if it's an iframe-embed-only source
  const isIframeSrc = /youtube\.com|youtu\.be|vidsrc|1asb\.com|embed/.test(src);
  const isTV = src.includes('vidsrc.me/embed/tv');

  const idMatch = src.match(/[?&](?:tmdb|id)=([^&]+)/) || src.match(/embed\/(?:movie|tv)\/([^/?&#]+)/);
  const contentId = idMatch ? idMatch[1] : null;
  const tvShowId = contentId ? Number(contentId) : null;

  const tvSources = contentId 
    ? [
        `https://vidsrc.me/embed/tv?tmdb=${contentId}&season=${season}&episode=${episode}`,
        `https://multiembed.mov/directstream.php?video_id=${contentId}&tmdb=1&s=${season}&e=${episode}`,
        `https://www.2embed.to/embed/tmdb/tv?id=${contentId}&s=${season}&e=${episode}`,
        `https://embed.smashystream.xyz/tv?tmdb=${contentId}&season=${season}&episode=${episode}`,
      ]
    : [];

  const movieSources = contentId
    ? [
        `https://vidsrc.me/embed/movie?tmdb=${contentId}`,
        `https://multiembed.mov/directstream.php?video_id=${contentId}&tmdb=1`,
        `https://www.2embed.to/embed/tmdb/movie?id=${contentId}`,
        `https://embed.smashystream.xyz/movie?tmdb=${contentId}`,
      ]
    : [src];

  const sources = isTV ? tvSources : movieSources;
  const activeStreamUrl = sources.length > 0 ? (sources[selectedServer] || sources[0]) : src;

  useEffect(() => {
    if (!isOpen) {
      setSeason(1);
      setEpisode(1);
      setIsMaximized(false);
      setSeasonsData([]);
      setMaxSeasons(1);
      setMaxEpisodes(1);
      setSelectedServer(0);
      return;
    }

    if (analytics) {
      logEvent(analytics, 'select_content', {
        content_type: isTV ? 'tv_show' : 'movie',
        content_id: activeStreamUrl,
        item_name: title || 'Unknown Content',
        season: isTV ? season : undefined,
        episode: isTV ? episode : undefined,
      });
    }

    setIsLoading(true);
    setHasError(false);

    if (isIframeSrc) {
      // Handle YouTube links
      const youtubeMatch = activeStreamUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      const videoId = youtubeMatch?.[1];
      const embedUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : activeStreamUrl;

      setEmbedSrc(embedUrl);
      setIsLoading(false);
      return;
    }

    if (!videoRef.current) return;

    const video = videoRef.current;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = activeStreamUrl;
      video.oncanplay = () => setIsLoading(false);
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(activeStreamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
        setIsPlaying(true);
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error("HLS error:", data);
        setHasError(true);
      });

      return () => {
        hls.destroy();
      };
    } else {
      console.error("HLS not supported in this browser");
      setHasError(true);
    }
  }, [activeStreamUrl, isOpen]);

  useEffect(() => {
    if (!isOpen || !tvShowId || !isTV) return;

    const fetchTVDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${tvShowId}?api_key=07093a6aaed5e454e20052e4ce3ebf5c&language=en-US`
        );
        const data = await response.json();
        if (data.seasons && data.seasons.length > 0) {
          const validSeasons = data.seasons.filter((s: any) => s.season_number > 0);
          setSeasonsData(validSeasons);
          setMaxSeasons(validSeasons.length);
          
          const s1 = validSeasons.find((s: any) => s.season_number === 1) || validSeasons[0];
          setMaxEpisodes(s1?.episode_count || 1);
        }
      } catch (err) {
        console.error("Error fetching TV details:", err);
      }
    };

    fetchTVDetails();
  }, [tvShowId, isOpen]);

  useEffect(() => {
    if (seasonsData.length > 0) {
      const currentSeasonInfo = seasonsData.find((s: any) => s.season_number === season);
      const epCount = currentSeasonInfo?.episode_count || 1;
      setMaxEpisodes(epCount);
      if (episode > epCount) {
        setEpisode(1);
      }
    }
  }, [season, seasonsData]);

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  // Conditionally configure sandbox parameters.
  // Server 1 (Vidsrc) requires allow-top-navigation & allow-popups, otherwise it displays "Media unavailable".
  // Servers 2, 3, and 4 work beautifully under a strict sandbox, blocking all popups and redirects 100%!
  const getSandboxString = () => {
    if (selectedServer === 0) {
      return "allow-scripts allow-same-origin allow-presentation allow-forms allow-top-navigation allow-popups";
    }
    return "allow-scripts allow-same-origin allow-presentation allow-forms";
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center transition-all duration-300 ${isMaximized ? "p-0" : "p-4"}`}>
      <div className={`relative bg-black transition-all duration-300 overflow-hidden ${
        isMaximized 
          ? "w-full h-full max-w-none rounded-none" 
          : "w-full max-w-4xl aspect-video rounded-lg"
      }`}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center text-white text-lg">
            Loading stream...
          </div>
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-red-500 text-center p-4">
            ⚠️ Failed to load stream. This could be a CORS or unsupported format issue.
          </div>
        )}

        {isTV && !hasError && (
          <div className="absolute top-4 left-4 z-50 flex gap-2">
            <select 
              value={selectedServer} 
              onChange={(e) => setSelectedServer(Number(e.target.value))}
              className="bg-black/80 text-white px-3 py-1.5 rounded border border-white/20 focus:outline-none focus:border-primary text-sm backdrop-blur-sm"
              title="Switch Server Source"
            >
              <option value={0}>Server 1 (VidSrc)</option>
              <option value={1}>Server 2 (MultiEmbed)</option>
              <option value={2}>Server 3 (2Embed)</option>
              <option value={3}>Server 4 (SmashyStream)</option>
            </select>
            <select 
              value={season} 
              onChange={(e) => setSeason(Number(e.target.value))}
              className="bg-black/80 text-white px-3 py-1.5 rounded border border-white/20 focus:outline-none focus:border-primary text-sm backdrop-blur-sm"
            >
              {seasonsData.length > 0 ? (
                seasonsData.map((s) => (
                  <option key={s.season_number} value={s.season_number}>
                    Season {s.season_number}
                  </option>
                ))
              ) : (
                [...Array(maxSeasons)].map((_, i) => (
                  <option key={i+1} value={i+1}>Season {i+1}</option>
                ))
              )}
            </select>
            <select 
              value={episode} 
              onChange={(e) => setEpisode(Number(e.target.value))}
              className="bg-black/80 text-white px-3 py-1.5 rounded border border-white/20 focus:outline-none focus:border-primary text-sm backdrop-blur-sm"
            >
              {[...Array(maxEpisodes)].map((_, i) => (
                <option key={i+1} value={i+1}>Episode {i+1}</option>
              ))}
            </select>
          </div>
        )}

        {!isTV && !hasError && isIframeSrc && contentId && (
          <div className="absolute top-4 left-4 z-50 flex gap-2">
            <select 
              value={selectedServer} 
              onChange={(e) => setSelectedServer(Number(e.target.value))}
              className="bg-black/80 text-white px-3 py-1.5 rounded border border-white/20 focus:outline-none focus:border-primary text-sm backdrop-blur-sm"
              title="Switch Server Source"
            >
              <option value={0}>Server 1 (VidSrc)</option>
              <option value={1}>Server 2 (MultiEmbed)</option>
              <option value={2}>Server 3 (2Embed)</option>
              <option value={3}>Server 4 (SmashyStream)</option>
            </select>
          </div>
        )}

        {!hasError && isIframeSrc && (
          <iframe
            src={embedSrc}
            title="Embedded Stream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            sandbox={getSandboxString()}
            className="w-full h-full border-none"
          />
        )}

        {!hasError && !isIframeSrc && (
          <video
            ref={videoRef}
            controls={false}
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}

        {/* Play / Pause Button */}
        {!hasError && !isIframeSrc && (
          <button
            onClick={handlePlayPause}
            className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white p-2 rounded-full"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        )}

        {/* Maximize Button */}
        <button
          onClick={() => setIsMaximized(!isMaximized)}
          className="absolute top-4 right-16 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition-colors"
          title={isMaximized ? "Minimize Player" : "Maximize Player"}
        >
          {isMaximized ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
        </button>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-2 rounded-full hover:bg-opacity-80 transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
