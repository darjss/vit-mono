import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";

interface ImageCarouselProps {
  images: string[];
  className?: string;
}

const ImageCarousel = ({ images, className = "" }: ImageCarouselProps) => {
  return (
    <Carousel className={`w-full ${className}`}>
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <div className="aspect-square relative overflow-hidden rounded-md">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                style={{ viewTransitionName: "product-image" }}
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
