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

  // Detect if it's an iframe-embed-only source
  const isIframeSrc = /youtube\.com|youtu\.be|vidsrc|1asb\.com|embed/.test(src);
  const isTV = src.includes('vsembed.su/embed/tv');

  useEffect(() => {
    if (!isOpen) {
      setSeason(1);
      setEpisode(1);
      setIsMaximized(false);
      return;
    }

    if (analytics) {
      logEvent(analytics, 'select_content', {
        content_type: isTV ? 'tv_show' : 'movie',
        content_id: src,
        item_name: title || 'Unknown Content',
        season: isTV ? season : undefined,
        episode: isTV ? episode : undefined,
      });
    }

    setIsLoading(true);
    setHasError(false);

    if (isIframeSrc) {
      // Handle YouTube links
      const youtubeMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      const videoId = youtubeMatch?.[1];
      let embedUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : src;

      if (embedUrl.includes('vsembed.su/embed/tv')) {
        embedUrl = embedUrl.replace(/&season=\d+&episode=\d+/, `&season=${season}&episode=${episode}`);
      }

      setEmbedSrc(embedUrl);
      setIsLoading(false);
      return;
    }

    if (!videoRef.current) return;

    const video = videoRef.current;

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      video.oncanplay = () => setIsLoading(false);
    } else if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
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
  }, [src, isOpen, season, episode]);

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
              value={season} 
              onChange={(e) => setSeason(Number(e.target.value))}
              className="bg-black/80 text-white px-3 py-1.5 rounded border border-white/20 focus:outline-none focus:border-primary text-sm backdrop-blur-sm"
            >
              {[...Array(20)].map((_, i) => (
                <option key={i+1} value={i+1}>Season {i+1}</option>
              ))}
            </select>
            <select 
              value={episode} 
              onChange={(e) => setEpisode(Number(e.target.value))}
              className="bg-black/80 text-white px-3 py-1.5 rounded border border-white/20 focus:outline-none focus:border-primary text-sm backdrop-blur-sm"
            >
              {[...Array(50)].map((_, i) => (
                <option key={i+1} value={i+1}>Episode {i+1}</option>
              ))}
            </select>
          </div>
        )}

        {!hasError && isIframeSrc && (
          <iframe
            src={embedSrc}
            title="Embedded Stream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
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
