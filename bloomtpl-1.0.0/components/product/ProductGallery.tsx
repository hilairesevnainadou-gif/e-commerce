"use client";

import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export default function ProductGallery({
  images,
  fallbackImage,
  alt,
}: {
  images: ProductImage[];
  fallbackImage?: string;
  alt: string;
}) {
  const gallery = images.length > 0
    ? images
    : fallbackImage
      ? [{ id: 0, url: fallbackImage, position: 0 }]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const hasMultiple = gallery.length > 1;

  const goTo = (index: number) => {
    setActiveIndex(((index % gallery.length) + gallery.length) % gallery.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      goTo(activeIndex + (delta < 0 ? 1 : -1));
    }
    touchStartX.current = null;
  };

  if (gallery.length === 0) {
    return (
      <div className="w-full max-w-[500px] mx-auto aspect-square rounded-xl bg-muted flex items-center justify-center text-muted-foreground text-sm">
        Image indisponible
      </div>
    );
  }

  return (
    <div className="w-full max-w-[500px] mx-auto flex flex-col items-center px-4">
      <div
        className="relative w-full rounded-xl shadow-lg overflow-hidden mb-4 aspect-square bg-muted"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          key={gallery[activeIndex].id}
          src={gallery[activeIndex].url}
          alt={alt}
          fill
          priority
          fetchPriority="high"
          sizes="(min-width: 1024px) 500px, 100vw"
          className="object-cover"
        />

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Image précédente"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Image suivante"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gallery.map((img, index) => (
                <span
                  key={img.id}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    index === activeIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/60"
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto w-full pb-1 justify-center">
          {gallery.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Voir l'image ${index + 1}`}
              className={cn(
                "relative shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-colors",
                index === activeIndex
                  ? "border-primary"
                  : "border-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
