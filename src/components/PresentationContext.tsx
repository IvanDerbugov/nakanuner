import { createContext, useContext } from 'react';

interface PresentationContextType {
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  currentSlide: number;
  totalSlides: number;
}

export const PresentationContext = createContext<PresentationContextType | null>(null);

export function usePresentationContext() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentationContext must be used within PresentationLayout');
  }
  return context;
}
