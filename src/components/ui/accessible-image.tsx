"use client";

import Image, { ImageProps } from "next/image";
import { useState, useCallback } from "react";
import { getImageAltText } from "@/lib/accessibility-utils";
import { cn } from "@/lib/utils";
import { performanceMonitor } from "@/lib/performance";

interface AccessibleImageProps extends Omit<ImageProps, "alt"> {
  alt: string;
  isDecorative?: boolean;
  context?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  performanceTracking?: boolean;
}

export function AccessibleImage({
  alt,
  isDecorative = false,
  context,
  className,
  priority = false,
  quality = 85,
  performanceTracking = false,
  ...props
}: AccessibleImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const altText = getImageAltText(alt, isDecorative, context);

  const handleLoadStart = useCallback(() => {
    if (performanceTracking) {
      performanceMonitor.mark(`image-load-start-${props.src}`);
    }
    setIsLoading(true);
    setHasError(false);
  }, [performanceTracking, props.src]);

  const handleLoad = useCallback(() => {
    if (performanceTracking) {
      performanceMonitor.mark(`image-load-end-${props.src}`);
      performanceMonitor.measure(
        `image-load-${props.src}`,
        `image-load-start-${props.src}`,
        `image-load-end-${props.src}`
      );
    }
    setIsLoading(false);
  }, [performanceTracking, props.src]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    if (performanceTracking) {
      console.warn(`Failed to load image: ${props.src}`);
    }
  }, [performanceTracking, props.src]);

  return (
    <div className={cn("relative", className)}>
      <Image
        {...props}
        alt={altText}
        priority={priority}
        quality={quality}
        className={cn(
          // Ensure images don't break layout
          "max-w-full h-auto",
          // Smooth loading transition
          "transition-opacity duration-300",
          isLoading && !hasError ? "opacity-0" : "opacity-100",
          // Prevent layout shift
          "block"
        )}
        // Performance optimizations
        sizes={
          props.sizes ||
          "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        }
        placeholder={props.placeholder || "blur"}
        blurDataURL={
          props.blurDataURL ||
          "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        }
        onLoadingComplete={handleLoad}
        onLoadStart={handleLoadStart}
        onError={handleError}
      />

      {/* Loading state for screen readers */}
      {isLoading && !hasError && (
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Loading image: {altText}
        </div>
      )}

      {/* Error state for screen readers */}
      {hasError && (
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          Failed to load image: {altText}
        </div>
      )}
    </div>
  );
}
