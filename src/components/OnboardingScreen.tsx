import React, { useState } from 'react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

interface Slide {
  id: number;
  headline: string;
  subtitle: string;
  image: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    headline: 'Build your Flavor, Step by Step',
    subtitle: 'Stack fresh ingredients for meals made your way',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=1920&q=100'
  },
  {
    id: 2,
    headline: 'Artisanal Taste, Made to Order',
    subtitle: 'From wok-tossed bowls to steamed dim sums, customized to your taste',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=1920&q=100'
  },
  {
    id: 3,
    headline: 'Express Table-Side QR Ordering',
    subtitle: 'Order directly from your seat with instant kitchen dispatch',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1920&q=100'
  }
];

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < SLIDES.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('selarasa_onboarding_completed', 'true');
    } catch {
      // ignore storage errors
    }
    onComplete();
  };

  const slide = SLIDES[currentStep];

  return (
    <div className="min-h-screen w-full bg-stone-100 flex items-center justify-center p-0 sm:p-4 md:p-8">
      {/* Centered Mobile/Tablet viewport container */}
      <div className="w-full max-w-sm sm:max-w-md bg-white min-h-screen sm:min-h-[740px] sm:max-h-[860px] sm:rounded-[36px] sm:shadow-2xl sm:border sm:border-stone-200/80 flex flex-col justify-between overflow-hidden relative">
        {/* Top Header Bar: Progress Indicators & Skip */}
        <div className="absolute top-0 inset-x-0 z-20 pt-4 pb-2 px-5 sm:px-6 flex items-center justify-between">
          {/* Subtle Segmented Progress Indicator */}
          <div className="flex items-center gap-1.5 flex-1 max-w-[180px] sm:max-w-[200px]">
            {SLIDES.map((s, idx) => (
              <div
                key={s.id}
                className={`h-1 rounded-full transition-all duration-300 flex-1 ${
                  idx === currentStep
                    ? 'bg-stone-800'
                    : idx < currentStep
                    ? 'bg-stone-500'
                    : 'bg-stone-300/80'
                }`}
              />
            ))}
          </div>

          {/* Skip Button */}
          <button
            type="button"
            onClick={handleComplete}
            className="text-stone-700 hover:text-stone-900 font-semibold text-xs sm:text-sm px-2.5 py-1 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            Skip
          </button>
        </div>

        {/* Hero Food Visual Section (Occupies majority of upper screen) */}
        <div className="relative w-full flex-1 flex items-center justify-center pt-10 sm:pt-12 overflow-hidden bg-stone-50/50">
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full max-h-[460px] object-cover sm:object-contain transition-all duration-500 ease-out"
          />

          {/* Smooth white gradient fade at bottom to blend into text area */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
        </div>

        {/* Bottom Content Area */}
        <div className="px-6 pb-8 pt-2 sm:px-8 sm:pb-10 bg-white flex flex-col items-center text-center z-10">
          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug tracking-tight max-w-xs sm:max-w-sm">
            {slide.headline}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-stone-500 mt-2 sm:mt-2.5 max-w-xs sm:max-w-sm leading-relaxed">
            {slide.subtitle}
          </p>

          {/* Wide Dark Next Button */}
          <div className="w-full mt-7 sm:mt-8">
            <button
              type="button"
              onClick={handleNext}
              className="w-full py-4 px-6 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm sm:text-base tracking-wide shadow-md active:scale-[0.99] transition-all flex items-center justify-center cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
