// components/course-learn/VideoSection.tsx
import React, { useState, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  ChevronLeft,
  ChevronRight,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const VideoSection: React.FC<any> = ({
  chapter,
  lesson,
  onNextLesson,
  onPreviousLesson,
  hasNextLesson,
  hasPreviousLesson,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine content type
  const hasVideo = !!lesson.video_url;
  const hasImages = lesson?.images && lesson?.images.length > 0;
  const hasContent = !!lesson.content;

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  // Render content based on availability
  const renderContent = () => {
    if (hasVideo) {
      return (
        <div
          ref={containerRef}
          className="relative w-full overflow-hidden rounded-lg bg-black"
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        >
          <video
            ref={videoRef}
            className="h-full w-full"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
          >
            <source src={lesson.video_url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Controls */}
          {showControls && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300">
              {/* Progress Bar */}
              <div
                className="mb-4 h-2 w-full cursor-pointer rounded-full bg-gray-600"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-100"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="text-white transition-colors hover:text-blue-300"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleVolumeToggle}
                      className="text-white transition-colors hover:text-blue-300"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={20} />
                      ) : (
                        <Volume2 size={20} />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="w-20 accent-blue-500"
                    />
                  </div>

                  <div className="text-sm text-white">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>

                <button
                  onClick={handleFullscreen}
                  className="text-white transition-colors hover:text-blue-300"
                >
                  <Maximize size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Play/Pause overlay */}
          {!isPlaying && (
            <div
              className="absolute inset-0 flex cursor-pointer items-center justify-center"
              onClick={handlePlayPause}
            >
              <div className="rounded-full bg-black/50 p-4">
                <Play size={48} className="text-white" />
              </div>
            </div>
          )}
        </div>
      );
    }

    if (hasImages) {
      return (
        <div className="w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
            {lesson.images!.map((image: any, index: any) => (
              <div key={index} className="flex flex-col items-center">
                <div className="rounded-lg bg-white p-2 shadow-sm dark:bg-gray-700">
                  <img
                    src={image.url}
                    alt={image.alt || `Lesson image ${index + 1}`}
                    className="h-48 w-full rounded-md object-cover"
                  />
                </div>
                {image.caption && (
                  <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Fallback to lesson content
    return (
      <div className="w-full rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="p-6">
          <div className="mb-4 flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <FileText size={20} />
            <span className="font-medium">Lesson Content</span>
          </div>
          <div
            className="prose prose-gray dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                lesson.content ||
                "<p>No content available for this lesson.</p>",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {lesson.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Chapter {chapter.order} • {chapter.title}
          </p>
        </div>

        {/* Content Type Badge */}
        <div className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 dark:bg-blue-900/30">
          {hasVideo ? (
            <>
              <Play size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Video
              </span>
            </>
          ) : hasImages ? (
            <>
              <ImageIcon
                size={16}
                className="text-green-600 dark:text-green-400"
              />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Images
              </span>
            </>
          ) : (
            <>
              <FileText
                size={16}
                className="text-purple-600 dark:text-purple-400"
              />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Reading
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-6 flex-1">{renderContent()}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          onClick={onPreviousLesson}
          disabled={!hasPreviousLesson}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            hasPreviousLesson
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700"
          }`}
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <button
          onClick={onNextLesson}
          disabled={!hasNextLesson}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${
            hasNextLesson
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700"
          }`}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default VideoSection;
