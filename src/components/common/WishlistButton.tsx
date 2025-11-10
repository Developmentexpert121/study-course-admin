// components/common/WishlistButton.tsx
import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

interface WishlistButtonProps {
  courseId: number;
  size?: number;
  className?: string;
  showText?: boolean;
  onToggle?: (isInWishlist: boolean) => void;
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  courseId,
  size = 20,
  className = "",
  showText = false,
  onToggle,
}) => {
  const { toggleWishlist, checkWishlistStatus, loading } = useWishlist();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check initial wishlist status
  useEffect(() => {
    const checkStatus = async () => {
      setIsChecking(true);
      const status = await checkWishlistStatus(courseId);
      setIsInWishlist(status);
      setIsChecking(false);
    };

    checkStatus();
  }, [courseId, checkWishlistStatus]);

  const handleToggle = async () => {
    if (loading || isChecking) return;

    const result = await toggleWishlist(courseId, isInWishlist);

    if (result.success) {
      setIsInWishlist(!isInWishlist);
      onToggle?.(!isInWishlist);
    }
  };

  if (isChecking) {
    return (
      <button
        className={`flex items-center gap-2 text-gray-400 ${className}`}
        disabled
      >
        <Heart size={size} />
        {showText && <span>Loading...</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 transition-colors ${
        isInWishlist
          ? "text-red-500 hover:text-red-600"
          : "text-gray-400 hover:text-red-500"
      } ${className}`}
      title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart size={size} fill={isInWishlist ? "currentColor" : "none"} />
      {showText && (
        <span>{isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>
      )}
    </button>
  );
};

export default WishlistButton;
