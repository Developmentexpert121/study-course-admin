import ShareModal from "@/components/ShareModal";
import { ArrowLeft, Heart, Share2, CheckCircle } from "lucide-react";
import { useState } from "react";

interface PageHeaderProps {
  isEnrolled: boolean;
  isInWishlist?: boolean;
  onBack: () => void;
  onWishlistToggle?: () => void;
  wishlistLoading?: boolean;
  courseTitle?: string;
}

export default function PageHeader({
  isEnrolled,
  isInWishlist = false,
  onBack,
  onWishlistToggle,
  wishlistLoading = false,
  courseTitle = "Course",
}: PageHeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false);

  return (
    <>
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Courses</span>
            </button>

            <div className="flex items-center gap-4">
              {isEnrolled && (
                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-1 text-green-700 dark:bg-green-900/20 dark:text-green-300">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Enrolled</span>
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={onWishlistToggle}
                disabled={wishlistLoading}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors ${
                  isInWishlist
                    ? "border-red-300 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                } ${wishlistLoading ? "cursor-not-allowed opacity-50" : ""}`}
              >
                {wishlistLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600 dark:border-gray-500 dark:border-t-gray-300" />
                ) : (
                  <Heart
                    className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`}
                  />
                )}
                {isInWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
              </button>

              {/* Share Button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title={courseTitle}
        text={`Check out this amazing course: ${courseTitle}`}
      />
    </>
  );
}
