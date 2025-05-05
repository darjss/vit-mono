import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@workspace/ui/components/carousel";
import { useState, useEffect, useRef } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface ImageCarouselProps {
  images: string[];
  className?: string;
  productId?: string;
}

const ImageCarousel = ({
  images,
  productId,
}: ImageCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const mainImageRef = useRef<HTMLDivElement>(null);
  const [carouselApi, setCarouselApi] = useState<any>(null);

  useEffect(() => {
    if (carouselApi) {
      carouselApi.on("select", () => {
        setSelectedIndex(carouselApi.selectedScrollSnap());
      });
    }
  }, [carouselApi]);

  useEffect(() => {
    // Apply styles for view transition after component mounts
    if (mainImageRef.current) {
      const viewTransitionAttribute = productId
        ? `product-image-${productId}`
        : "product-image";

      // Set the view transition name directly on the DOM element to ensure it works with Astro
      if ("startViewTransition" in document) {
        mainImageRef.current.style.viewTransitionName = viewTransitionAttribute;
      }
    }
  }, [productId]);

  const handleThumbnailClick = (index: number) => {
    if (carouselApi) {
      carouselApi.scrollTo(index);
      setSelectedIndex(index);
    }
  };

  // Display just the current image based on selectedIndex
  const currentImage = images[selectedIndex] || images[0];

  return (
    <div className="w-full">
      {/* Main image with border */}
      <div className="border-4 border-border rounded-none bg-background shadow-[var(--shadow)]">
        <div
          className="w-full h-[300px] sm:h-[350px] md:h-[450px] flex items-center justify-center p-0 relative"
          ref={mainImageRef}
        >
          <img
            src={currentImage}
            alt={`Product image ${selectedIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-300 hover:scale-105"
          />

          {/* Custom navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={() =>
                  handleThumbnailClick(
                    selectedIndex > 0 ? selectedIndex - 1 : images.length - 1
                  )
                }
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border-2 border-border rounded-none p-1 z-10"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              <button
                onClick={() =>
                  handleThumbnailClick(
                    selectedIndex < images.length - 1 ? selectedIndex + 1 : 0
                  )
                }
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background border-2 border-border rounded-none p-1 z-10"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hidden carousel to handle selection state */}
      <div className="hidden">
        <Carousel
          setApi={setCarouselApi}
          opts={{
            loop: true,
            startIndex: selectedIndex,
          }}
        >
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} />
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* Thumbnail previews */}
      {images.length > 1 && (
        <div className="flex justify-start mt-4 gap-3 overflow-x-auto pb-2 scrollbar-none">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "h-20 w-20 border-2 transition-all duration-200 flex-shrink-0",
                selectedIndex === index
                  ? "border-primary shadow-[3px_3px_0_0_var(--border)]"
                  : "border-border hover:border-primary/50"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}

      {/* Dots indicator for mobile/small screens */}
      {images.length > 1 && (
        <div className="flex justify-center mt-2 sm:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={cn(
                "w-2 h-2 mx-1 rounded-full transition-all",
                selectedIndex === index
                  ? "bg-primary w-4"
                  : "bg-border hover:bg-primary/50"
              )}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
