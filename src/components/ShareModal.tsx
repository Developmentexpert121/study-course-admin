// components/sharing/ShareModal.tsx
import {
  X,
  Copy,
  Check,
  Share2,
  Twitter,
  Linkedin,
  Facebook,
  MessageCircle,
  Mail,
  Link2,
} from "lucide-react";
import { useState } from "react";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url?: string;
  text?: string;
}

export default function ShareModal({
  isOpen,
  onClose,
  title,
  url,
  text = "Check out this amazing course!",
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl =
    url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = `${text} - ${title}`;

  const handleCopyLink = async () => {
    try {
      await navigator?.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnPlatform = (platform: string) => {
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + currentUrl)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + "\n\n" + currentUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
    onClose();
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: currentUrl,
        });
        onClose();
      } catch (err) {
        console.log("Error sharing:", err);
      }
    }
  };

  const shareOptions = [
    {
      name: "Copy Link",
      icon: copied ? Check : Copy,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: handleCopyLink,
      description: copied ? "Link copied!" : "Copy course link to clipboard",
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-[#1DA1F2] hover:bg-[#1a8cd8]",
      onClick: () => shareOnPlatform("twitter"),
      description: "Share on Twitter",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-[#0A66C2] hover:bg-[#0959a8]",
      onClick: () => shareOnPlatform("linkedin"),
      description: "Share on LinkedIn",
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-[#1877F2] hover:bg-[#1669d9]",
      onClick: () => shareOnPlatform("facebook"),
      description: "Share on Facebook",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-[#25D366] hover:bg-[#22c15e]",
      onClick: () => shareOnPlatform("whatsapp"),
      description: "Share on WhatsApp",
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-gray-600 hover:bg-gray-700",
      onClick: () => shareOnPlatform("email"),
      description: "Share via email",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-99 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-99 flex items-center justify-center p-4">
        <div
          className="relative w-full max-w-md rounded-2xl bg-white shadow-xl dark:bg-gray-800"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
                <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Share this course
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Spread the knowledge with others
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Native Share Button (for mobile) */}
           {typeof navigator.share === 'function'&& (
              <button
                onClick={handleNativeShare}
                className="mb-6 flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 text-white transition-all hover:from-blue-600 hover:to-purple-700"
              >
                <Share2 className="h-5 w-5" />
                <span className="font-medium">Share via...</span>
              </button>
            )}

            {/* Share Options Grid */}
            <div className="grid grid-cols-3 gap-4">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.onClick}
                  className="group flex flex-col items-center gap-3 rounded-xl p-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/50"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full text-white transition-transform group-hover:scale-110 ${option.color}`}
                  >
                    <option.icon className="h-5 w-5" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {option.name}
                    </div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {option.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Current URL Display */}
            <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Course Link
                  </p>
                  <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-400">
                    {currentUrl}
                  </p>
                </div>
                <button
                  onClick={handleCopyLink}
                  className="ml-3 flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <div className="flex justify-center">
              <button
                onClick={onClose}
                className="rounded-lg px-6 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
