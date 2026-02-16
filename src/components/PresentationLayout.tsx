import { useState, useEffect, useCallback } from "react";
import { PresentationContext } from "./PresentationContext";

interface PresentationLayoutProps {
  children: React.ReactNode[];
}

export function PresentationLayout({ children }: PresentationLayoutProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = children.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const nextIndex = prev < totalSlides - 1 ? prev + 1 : prev;
      const nextSlideElement = document.querySelector(`[data-slide-index="${nextIndex}"]`);
      if (nextSlideElement) {
        nextSlideElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return nextIndex;
    });
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const prevIndex = prev > 0 ? prev - 1 : prev;
      const prevSlideElement = document.querySelector(`[data-slide-index="${prevIndex}"]`);
      if (prevSlideElement) {
        prevSlideElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return prevIndex;
    });
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
    const slideElement = document.querySelector(`[data-slide-index="${index}"]`);
    if (slideElement) {
      slideElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Track scroll position for all devices
  useEffect(() => {
    const handleScroll = () => {
      const slides = document.querySelectorAll('[data-slide-index]');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const slideTop = rect.top + window.scrollY;
        const slideBottom = slideTop + rect.height;

        if (scrollPosition >= slideTop && scrollPosition < slideBottom) {
          setCurrentSlide(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scrollable layout for all devices
  return (
    <PresentationContext.Provider value={{ nextSlide, prevSlide, goToSlide, currentSlide, totalSlides }}>
      <div 
        className="w-full min-h-screen overflow-y-auto"
        style={{
          backgroundColor: '#d4ff00',
          backgroundImage: 'none'
        }}
      >
        {children.map((child, index) => (
          <div key={index} data-slide-index={index} className="w-full min-h-screen">
            {child}
          </div>
        ))}

      {/* Slide indicators */}
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 md:gap-4">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              const slideElement = document.querySelector(`[data-slide-index="${index}"]`);
              if (slideElement) {
                slideElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            className="group relative"
          >
            <div
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-black transition-all ${
                index === currentSlide
                  ? "bg-[#cc0000] scale-125"
                  : "bg-white hover:bg-[#ffcc00]"
              }`}
            />
          </button>
        ))}
      </div>
      </div>
    </PresentationContext.Provider>
  );
}