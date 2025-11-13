// components/course-learn/VideoSection.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
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
  Video,
  X,
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
  const [imagesViewed, setImagesViewed] = useState<Set<number>>(new Set());
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Embla Carousel for stories-like slider
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    skipSnaps: false,
    duration: 20,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Determine content type based on API response structure
  const hasContent = !!lesson?.content;
  const hasImages = lesson?.images && lesson.images.length > 0;
  const hasVideos = lesson?.videos && lesson.videos.length > 0;
  const hasVideoUrls = lesson?.video_urls && lesson.video_urls.length > 0;

  // Create slides array based on available content
  // Now each image gets its own slide
  const slides: any[] = [];



  // Add video slides
  if (hasVideos) {
    lesson.videos.forEach((video: string, index: number) => {
      slides.push({
        type: "video",
        title: `Video ${index + 1}`,
        icon: Video,
        color: "blue",
        data: video,
        videoIndex: index,
      });
    });
  }

  // Add video URL slides
  if (hasVideoUrls) {
    lesson.video_urls.forEach((videoUrl: string, index: number) => {
      slides.push({
        type: "video_url",
        title: `Video ${index + 1}`,
        icon: Video,
        color: "blue",
        data: videoUrl,
        videoIndex: index,
      });
    });
  }

  // Add individual image slides
  if (hasImages) {
    lesson.images.forEach((image: string, index: number) => {
      slides.push({
        type: "image",
        title: `Image ${index + 1}`,
        icon: ImageIcon,
        color: "green",
        data: image,
        imageIndex: index,
      });
    });
  }


  // Add content slide if available
  if (hasContent) {
    slides.push({
      type: "content",
      title: "Lesson Content",
      icon: FileText,
      color: "purple",
      data: lesson.content,
    });
  }


  const totalSlides = slides.length;

  // Update selected slide index
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());

    // Mark image as viewed when it becomes active
    const currentSlide = slides[emblaApi.selectedScrollSnap()];
    if (currentSlide?.type === "image") {
      setImagesViewed((prev) => {
        const newSet = new Set(prev);
        newSet.add(currentSlide.imageIndex);
        return newSet;
      });
    }
  }, [emblaApi, slides]);

  // Initialize scroll snaps
  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Reset when lesson changes
  useEffect(() => {
    setSelectedIndex(0);
    setActiveVideoIndex(0);
    setContentRead(false);
    setImagesViewed(new Set());
    setVideoProgress(0);
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [lesson.id, emblaApi]);

  // Track content reading
  useEffect(() => {
    if (hasContent && contentRef.current && selectedIndex === 0) {
      const handleScroll = () => {
        const element = contentRef.current;
        if (element) {
          const scrolled = element.scrollTop;
          const maxScroll = element.scrollHeight - element.clientHeight;
          const scrollPercentage = (scrolled / maxScroll) * 100;

          if (scrollPercentage >= 80 && !contentRead) {
            setContentRead(true);
          }
        }
      };

      const contentElement = contentRef.current;
      contentElement.addEventListener("scroll", handleScroll);

      return () => {
        contentElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, [hasContent, contentRead, selectedIndex]);

  // Auto-mark images as viewed after 3 seconds on their slide
  useEffect(() => {
    const currentSlide = slides[selectedIndex];
    if (
      currentSlide?.type === "image" &&
      !imagesViewed.has(currentSlide.imageIndex)
    ) {
      const timer = setTimeout(() => {
        setImagesViewed((prev) => {
          const newSet = new Set(prev);
          newSet.add(currentSlide.imageIndex);
          return newSet;
        });
      }, 3000); // 3 seconds to view each image

      return () => clearTimeout(timer);
    }
  }, [selectedIndex, slides, imagesViewed]);

  // Video controls
  const handlePlayPause = () => {
    if (videoRef.current && hasVideos) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeToggle = () => {
    if (videoRef.current && hasVideos) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current && hasVideos) {
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && hasVideos) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 0;
      setCurrentTime(current);


      if (total > 0) {
        const progress = (current / total) * 100;
        setVideoProgress(progress);

        if (progress >= 95 && !isLessonCompleted && hasVideos) {
          handleAutoComplete();
        }
      }
    }
  };

  const handleAutoComplete = () => {
    if (!isLessonCompleted) {
      onCompleteLesson();
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && duration > 0 && hasVideos) {
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
    onCompleteLesson();
  };

  // Navigation between slides
  const scrollNext = () => {
    emblaApi?.scrollNext();
  };

  const scrollPrev = () => {
    emblaApi?.scrollPrev();
  };

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };
  // Get embed URL for video preview
  const getEmbedUrl = (url: string): string | null => {
    if (!url.trim()) return null;
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes('youtube.com') || parsedUrl.hostname.includes('youtu.be')) {
        const videoId = parsedUrl.searchParams.get('v') || parsedUrl.pathname.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (parsedUrl.hostname.includes('vimeo.com')) {
        const videoId = parsedUrl.pathname.split('/').pop();
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return url; // for direct video
    } catch {
      return null;
    }
  };
  // Check completion
  const canAutoComplete = () => {
    const currentSlideType = slides[selectedIndex]?.type;

    if (currentSlideType === "video") return videoProgress >= 95;
    if (currentSlideType === "video_url") return videoProgress >= 95;
    if (currentSlideType === "content") return contentRead;
    if (currentSlideType === "image")
      return imagesViewed.has(slides[selectedIndex]?.imageIndex);
    return false;
  };

  // Check if all content is completed
  const allContentCompleted = () => {
    // Check content
    if (hasContent && !contentRead) return false;

    // Check all images
    if (hasImages) {
      const imageSlides = slides.filter((slide) => slide.type === "image");
      for (const slide of imageSlides) {
        if (!imagesViewed.has(slide.imageIndex)) return false;
      }
    }

    // Check videos
    if (hasVideos && videoProgress < 95) return false;

    return true;
  };

  // Render progress bars for stories
  const renderProgressBars = () => {
    if (totalSlides <= 1) return null;

    return (
      <div className="absolute left-4 right-4 top-4 z-10 flex gap-1">
        {slides.map((_, index) => (
          <div
            key={index}
            className="h-1 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <div
              className={`h-full transition-all duration-300 ${index < selectedIndex
                ? "bg-white"
                : index === selectedIndex
                  ? "animate-pulse bg-white"
                  : "bg-white/30"
                }`}
              style={{
                width:
                  index < selectedIndex
                    ? "100%"
                    : index === selectedIndex
                      ? "50%"
                      : "0%",
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  // Render video player
  const renderVideoPlayer = (videoUrl: string) => {
    return (
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-hidden rounded-lg bg-black"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <video
          ref={videoRef}
          className="h-full w-full object-contain"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleTimeUpdate}
          onEnded={() => {
            setIsPlaying(false);
            if (!isLessonCompleted) {
              handleAutoComplete();
            }
          }}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {showControls && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300">
            <div
              className="mb-4 h-2 w-full cursor-pointer rounded-full bg-gray-600"
              onClick={handleProgressClick}
            >
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-100"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

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

        {!isPlaying && (
          <div
            className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20"
            onClick={handlePlayPause}
          >
            <div className="rounded-full bg-black/50 p-6 backdrop-blur-sm">
              <Play size={48} className="text-white" />
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render embedded video player (e.g., YouTube, Vimeo)
  const renderEmbedVideoPlayer = (videoUrl: string) => {
    return (
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
        <iframe
          src={getEmbedUrl(videoUrl)}
          title="Embedded Video"
          className="h-full w-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };



  // Render single image
  const renderSingleImage = (imageUrl: string, imageIndex: number) => {
    const isViewed = imagesViewed.has(imageIndex);

    return (
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
        <div className="flex h-full items-center justify-center">
          <img
            src={imageUrl}
            alt={`Lesson image ${imageIndex + 1}`}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Viewed indicator */}
        {isViewed && (
          <div className="absolute left-4 top-4 z-10">
            <div className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
              <CheckCircle className="h-3 w-3" />
              <span>Viewed</span>
            </div>
          </div>
        )}

        {/* Image counter */}
        <div className="absolute right-4 top-4 z-10 rounded-full bg-black/50 px-2 py-1 text-xs text-white backdrop-blur-sm">
          {imageIndex + 1} / {lesson.images.length}
        </div>
      </div>
    );
  };

  // Render text content
  const renderTextContent = (content: string) => {
    return (
      <div
        ref={contentRef}
        className="h-full w-full overflow-hidden rounded-lg bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-sm"
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="mx-auto max-w-2xl">
            <div
              className="prose prose-invert prose-lg max-w-none"
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </div>
        </div>
      </div>
    );
  };

  // Render current slide
  const renderSlide = (slide: any, index: number) => {
    switch (slide.type) {
      case "content":
        return renderTextContent(slide.data);
      case "image":
        return renderSingleImage(slide.data, slide.imageIndex);
      case "video":
        return renderVideoPlayer(slide.data);
      case "video_url":
        return renderEmbedVideoPlayer(slide.data);
      default:
        return (
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-900">
            <p className="text-lg text-white">No content available</p>
          </div>
        );
    }
  };

  // Render slide icon
  const renderSlideIcon = (slide: any) => {
    switch (slide.type) {
      case "content":
        return <FileText size={20} />;
      case "image":
        return <ImageIcon size={20} />;
      case "video":
        return <Video size={20} />;
      default:
        return <FileText size={20} />;
    }
  };

  const autoCompleteReady = allContentCompleted();
  const currentSlide = slides[selectedIndex];

  // Get completion hint based on current slide type
  const getCompletionHint = () => {
    const currentSlideType = currentSlide?.type;

    switch (currentSlideType) {
      case "video":
        return videoProgress >= 95
          ? "Video almost finished - ready to complete!"
          : `Watch video to auto-complete (${Math.round(videoProgress)}%)`;
      case "content":
        return contentRead
          ? "Content read - ready to complete!"
          : "Scroll through the content to auto-complete";
      case "image":
        return imagesViewed.has(currentSlide.imageIndex)
          ? "Image viewed - ready to complete!"
          : "View this image to continue";
      default:
        return "Click below to mark as completed";
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4">
        <div
          className={`mb-4 rounded-lg p-4 transition-all duration-500 ${isLessonCompleted
            ? "border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 dark:border-green-800 dark:from-green-900/20 dark:to-emerald-900/20"
            : "border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:border-blue-800 dark:from-blue-900/20 dark:to-indigo-900/20"
            }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {lesson.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Chapter {chapter.order} • {chapter.title}
              </p>
            </div>
            <div
              className={`rounded-full px-3 py-1 text-sm font-medium ${isLessonCompleted
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-300"
                }`}
            >
              {isLessonCompleted ? "Completed" : "In Progress"}
            </div>
          </div>
        </div>
      </div>

      {/* Instagram Stories-like Slider */}
      <div className="mb-6 flex-1">
        <div className="relative overflow-hidden rounded-xl bg-gray-900 shadow-2xl">
          {/* Progress Bars */}
          {renderProgressBars()}

          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={scrollPrev}
                disabled={selectedIndex === 0}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-30"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={scrollNext}
                disabled={selectedIndex === totalSlides - 1}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-black/50 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/70 disabled:opacity-30"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Slide Counter */}
          <div className="absolute right-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1 text-sm text-white backdrop-blur-sm">
            {selectedIndex + 1} / {totalSlides}
          </div>

          {/* Carousel Container */}
          <div className="embla overflow-hidden rounded-xl" ref={emblaRef}>
            <div className="embla__container flex">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className="embla__slide min-w-0 flex-[0_0_100%]"
                >
                  <div className="flex h-96 items-center justify-center p-2 md:h-[480px]">
                    {renderSlide(slide, index)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          {totalSlides > 1 && (
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 transform gap-2">
              {slides.map((slide, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`h-3 w-3 rounded-full transition-all ${index === selectedIndex
                    ? slide.color === "blue"
                      ? "bg-blue-500"
                      : slide.color === "green"
                        ? "bg-green-500"
                        : "bg-purple-500"
                    : "bg-white/30"
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Current Slide Info */}
        {currentSlide && (
          <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 backdrop-blur-sm dark:bg-gray-800/80">
              <div
                className={`rounded p-1 ${currentSlide.color === "blue"
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : currentSlide.color === "green"
                    ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                  }`}
              >
                {renderSlideIcon(currentSlide)}
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                {currentSlide.title}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Completion Section */}
      {!isLessonCompleted && (
        <div className="mb-6">
          <div
            className={`rounded-lg border p-4 ${autoCompleteReady
              ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
              : "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`rounded-full p-2 ${autoCompleteReady
                    ? "bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400"
                    : "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400"
                    }`}
                >
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h4
                    className={`font-semibold ${autoCompleteReady
                      ? "text-green-800 dark:text-green-300"
                      : "text-blue-800 dark:text-blue-300"
                      }`}
                  >
                    {autoCompleteReady
                      ? "Ready to Complete!"
                      : "Continue Learning"}
                  </h4>
                  <p
                    className={`text-sm ${autoCompleteReady
                      ? "text-green-600 dark:text-green-400"
                      : "text-blue-600 dark:text-blue-400"
                      }`}
                  >
                    {autoCompleteReady
                      ? "You've viewed all content in this lesson"
                      : getCompletionHint()}
                  </p>
                </div>
              </div>
              <button
                onClick={handleManualComplete}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-semibold text-white transition-all hover:shadow-lg ${autoCompleteReady
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                <CheckCircle size={18} />
                {autoCompleteReady ? "Complete Lesson" : "Mark Complete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          onClick={onPreviousLesson}
          disabled={!hasPreviousLesson}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${hasPreviousLesson
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700"
            }`}
        >
          <ChevronLeft size={20} />
          Previous Lesson
        </button>

        <button
          onClick={onNextLesson}
          disabled={!hasNextLesson}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-colors ${hasNextLesson
            ? "bg-green-600 text-white hover:bg-green-700"
            : "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700"
            }`}
        >
          Next Lesson
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default VideoSection;
