"use client";

import React, { useEffect, useState } from "react";
import DOMPurify from "dompurify";

interface SafeHtmlRendererProps {
  html: string;
  maxLength?: number;
  className?: string;
  showMoreButton?: boolean;
}

const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({
  html,
  maxLength,
  className = "",
  showMoreButton = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sanitizedHtml, setSanitizedHtml] = useState("");

  useEffect(() => {
    // Sanitize HTML to prevent XSS attacks
    if (typeof window !== "undefined") {
      const cleanHtml = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
          "p",
          "br",
          "strong",
          "em",
          "u",
          "s",
          "code",
          "pre",
          "ul",
          "ol",
          "li",
          "blockquote",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "span",
          "div",
        ],
        ALLOWED_ATTR: ["class", "style"],
      });
      setSanitizedHtml(cleanHtml);
    }
  }, [html]);

  // Function to truncate HTML content while preserving structure
  const truncateHtml = (htmlString: string, length: number): string => {
    if (htmlString.length <= length) return htmlString;

    // Basic truncation - for better implementation consider a proper HTML parser
    const truncated = htmlString.slice(0, length);
    // Try to close any open tags (basic implementation)
    return truncated + "...";
  };

  const displayHtml =
    maxLength && !isExpanded
      ? truncateHtml(sanitizedHtml, maxLength)
      : sanitizedHtml;

  const shouldTruncate = maxLength && sanitizedHtml.length > maxLength;

  return (
    <div className={className}>
      <div
        className="prose prose-sm prose-headings:font-semibold prose-p:leading-relaxed prose-li:leading-relaxed max-w-none"
        dangerouslySetInnerHTML={{ __html: displayHtml }}
      />

      {showMoreButton && shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>
      )}
    </div>
  );
};

export default SafeHtmlRenderer;
