import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import { useEffect, useRef } from "react";

interface ImageCarouselProps {
  images: string[];
  className?: string;
  productId?: string;
}

const ImageCarousel = ({
  images,
  className = "",
  productId,
}: ImageCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply styles for view transition after component mounts
    if (carouselRef.current) {
      const viewTransitionAttribute = productId
        ? `product-image-${productId}`
        : "product-image";

      // Set the view transition name directly on the DOM element to ensure it works with Astro
      if ("startViewTransition" in document) {
        carouselRef.current.style.viewTransitionName = viewTransitionAttribute;
      }
    }
  }, [productId]);

  return (
    <Carousel className={`w-full ${className}`} ref={carouselRef}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="aspect-square relative overflow-hidden rounded-md">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                // Note: The inline style viewTransitionName is a fallback,
                // the useEffect hook above handles this more reliably for React components
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 bg-background/80 hover:bg-background" />
      <CarouselNext className="right-2 bg-background/80 hover:bg-background" />
    </Carousel>
  );
};

export default ImageCarousel;
