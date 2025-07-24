import { useState, useRef, useEffect } from "react";
import { X, Pause, Play } from "lucide-react";
import Hls from "hls.js";

interface VideoPlayerProps {
  src: string;
  isOpen: boolean;
  onClose: () => void;
}

const VideoPlayer = ({ src, isOpen, onClose }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [embedSrc, setEmbedSrc] = useState("");

  // Detect if it's an iframe-embed-only source
  const isIframeSrc = /youtube\.com|youtu\.be|vidsrc\.to|1asb\.com|embed/.test(src);

  useEffect(() => {
    if (!isOpen) return;

    setIsLoading(true);
    setHasError(false);

    if (isIframeSrc) {
      // Handle YouTube links
      const youtubeMatch = src.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
      const videoId = youtubeMatch?.[1];
      const embedUrl = videoId
        ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
        : src;

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
  }, [src, isOpen]);

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
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
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

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-2 rounded-full"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
