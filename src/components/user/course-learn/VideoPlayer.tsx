// components/course-learn/VideoSection.tsx
import React, { useState, useRef, useEffect } from "react";
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
  CheckCircle,
  Clock,
  BookOpen,
} from "lucide-react";

const VideoSection: React.FC<any> = ({
  chapter,
  lesson,
  onNextLesson,
  onPreviousLesson,
  onCompleteLesson,
  hasNextLesson,
  hasPreviousLesson,
  isLessonCompleted,
  // NEW: Add these props for MCQ awareness
  isLastLessonInChapter = false,
  isMCQPassed = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [contentRead, setContentRead] = useState(false);
  const [imagesViewed, setImagesViewed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Determine content type
  const hasVideo = !!lesson.video_url;
  const hasImages = lesson?.images && lesson.images.length > 0;
  const hasContent = !!lesson.content;
  const isReadingContent = hasContent && !hasVideo && !hasImages;
  const isImageContent = hasImages && !hasVideo;

  // Track content reading for text-based lessons
  useEffect(() => {
    if (isReadingContent && contentRef.current) {
      const handleScroll = () => {
        const element = contentRef.current;
        if (element) {
          const scrolled = element.scrollTop;
          const maxScroll = element.scrollHeight - element.clientHeight;
          const scrollPercentage = (scrolled / maxScroll) * 100;

          // Mark as read if scrolled 80% through content
          if (scrollPercentage >= 80 && !contentRead) {
            setContentRead(true);
            console.log("📖 [CONTENT] User read 80% of the content");
          }
        }
      };

      const contentElement = contentRef.current;
      contentElement.addEventListener("scroll", handleScroll);

      return () => {
        contentElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isReadingContent, contentRead]);

  // Auto-mark images as viewed after a few seconds
  useEffect(() => {
    if (isImageContent && !imagesViewed) {
      const timer = setTimeout(() => {
        setImagesViewed(true);
        console.log("🖼️ [IMAGES] Images marked as viewed");
      }, 5000); // 5 seconds to view images

      return () => clearTimeout(timer);
    }
  }, [isImageContent, imagesViewed]);

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
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 0;
      setCurrentTime(current);
      setDuration(total);

      // Calculate progress percentage
      if (total > 0) {
        const progress = (current / total) * 100;
        setVideoProgress(progress);

        // Auto-mark as completed if video is 95% watched
        if (progress >= 95 && !isLessonCompleted && hasVideo) {
          handleAutoComplete();
        }
      }
    }
  };

  const handleAutoComplete = () => {
    if (!isLessonCompleted) {
      console.log("🎯 [AUTO-COMPLETE] Auto-completing lesson");
      onCompleteLesson();
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

  const handleManualComplete = () => {
    console.log("🎯 [MANUAL] Manual completion requested");
    onCompleteLesson();
  };

  // Check if content can be auto-completed based on type
  const canAutoComplete = () => {
    if (hasVideo) return videoProgress >= 95;
    if (isReadingContent) return contentRead;
    if (isImageContent) return imagesViewed;
    return false;
  };

  // Get completion hint based on content type
  const getCompletionHint = () => {
    if (hasVideo) {
      return videoProgress >= 95
        ? "Video almost finished - ready to complete!"
        : `Watch video to auto-complete (${Math.round(videoProgress)}%)`;
    }
    if (isReadingContent) {
      return contentRead
        ? "Content read - ready to complete!"
        : "Scroll through the content to auto-complete";
    }
    if (isImageContent) {
      return imagesViewed
        ? "Images viewed - ready to complete!"
        : "View images to auto-complete";
    }
    return "Click below to mark as completed";
  };

  // Get navigation helper text based on current state
  const getNavigationHelperText = () => {
    if (!hasNextLesson) {
      if (isLastLessonInChapter && !isMCQPassed) {
        return "Complete the MCQ test to unlock the next chapter";
      } else if (isLastLessonInChapter && isMCQPassed) {
        return "Next chapter is available!";
      } else {
        return "Complete this lesson to continue";
      }
    }

    if (hasNextLesson && !isLessonCompleted) {
      return "Complete this lesson to unlock the next one";
    }

    return "";
  };

  // Render completion status and button
  const renderCompletionSection = () => {
    if (isLessonCompleted) {
      return (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div>
              <h4 className="font-semibold text-green-800 dark:text-green-300">
                Lesson Completed ✅
              </h4>
              <p className="text-sm text-green-600 dark:text-green-400">
                You've successfully completed this lesson
              </p>
            </div>
          </div>
        </div>
      );
    }

    const autoCompleteReady = canAutoComplete();

    return (
      <div
        className={`mt-6 rounded-lg border p-4 ${
          autoCompleteReady
            ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
            : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full p-2 ${
                autoCompleteReady
                  ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400"
                  : "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400"
              }`}
            >
              {hasVideo && <Play size={16} />}
              {isReadingContent && <BookOpen size={16} />}
              {isImageContent && <ImageIcon size={16} />}
              {!hasVideo && !isReadingContent && !isImageContent && (
                <Clock size={16} />
              )}
            </div>
            <div>
              <h4
                className={`font-semibold ${
                  autoCompleteReady
                    ? "text-green-800 dark:text-green-300"
                    : "text-blue-800 dark:text-blue-300"
                }`}
              >
                {autoCompleteReady ? "Ready to Complete!" : "Mark as Complete"}
              </h4>
              <p
                className={`text-sm ${
                  autoCompleteReady
                    ? "text-green-600 dark:text-green-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {getCompletionHint()}
              </p>
            </div>
          </div>
          <button
            onClick={handleManualComplete}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white transition-all hover:shadow-lg ${
              autoCompleteReady
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            <CheckCircle size={18} />
            {autoCompleteReady ? "Complete Now" : "Mark Complete"}
          </button>
        </div>

        {/* Progress Indicators */}
        {hasVideo && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span
                className={
                  autoCompleteReady
                    ? "text-green-700 dark:text-green-300"
                    : "text-blue-700 dark:text-blue-300"
                }
              >
                Progress: {Math.round(videoProgress)}%
              </span>
              <span
                className={
                  autoCompleteReady
                    ? "text-green-700 dark:text-green-300"
                    : "text-blue-700 dark:text-blue-300"
                }
              >
                {videoProgress >= 95
                  ? "Ready to complete!"
                  : "Watch 95% to auto-complete"}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  autoCompleteReady ? "bg-green-600" : "bg-blue-500"
                }`}
                style={{ width: `${videoProgress}%` }}
              />
            </div>
          </div>
        )}

        {isReadingContent && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span
                className={
                  autoCompleteReady
                    ? "text-green-700 dark:text-green-300"
                    : "text-blue-700 dark:text-blue-300"
                }
              >
                Reading Progress
              </span>
              <span
                className={
                  autoCompleteReady
                    ? "text-green-700 dark:text-green-300"
                    : "text-blue-700 dark:text-blue-300"
                }
              >
                {contentRead ? "Content read!" : "Scroll to read content"}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  autoCompleteReady ? "bg-green-600" : "bg-blue-500"
                }`}
                style={{ width: contentRead ? "100%" : "0%" }}
              />
            </div>
          </div>
        )}

        {isImageContent && (
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span
                className={
                  autoCompleteReady
                    ? "text-green-700 dark:text-green-300"
                    : "text-blue-700 dark:text-blue-300"
                }
              >
                Viewing Progress
              </span>
              <span
                className={
                  autoCompleteReady
                    ? "text-green-700 dark:text-green-300"
                    : "text-blue-700 dark:text-blue-300"
                }
              >
                {imagesViewed ? "Images viewed!" : "Viewing images..."}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  autoCompleteReady ? "bg-green-600" : "bg-blue-500"
                }`}
                style={{ width: imagesViewed ? "100%" : "0%" }}
              />
            </div>
          </div>
        )}
      </div>
    );
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
            onEnded={() => {
              setIsPlaying(false);
              // Auto-complete when video ends
              if (!isLessonCompleted) {
                handleAutoComplete();
              }
            }}
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
            {lesson.images.map((image: any, index: number) => (
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

    // Text content with scroll tracking
    return (
      <div
        ref={contentRef}
        className="max-h-96 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
      >
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

  const helperText = getNavigationHelperText();

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
      <div className="mb-4 flex-1">{renderContent()}</div>

      {/* Completion Section */}
      {renderCompletionSection()}

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
              ? "bg-green-600 text-white hover:bg-green-700"
              : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700"
          }`}
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Helper text */}
      {helperText && (
        <div className="mt-2 text-center">
          <p className="text-sm text-orange-600 dark:text-orange-400">
            {helperText}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoSection;
