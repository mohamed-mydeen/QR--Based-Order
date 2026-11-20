import React, { useRef } from 'react';
import {
  LayoutGrid,
  Flame,
  Salad,
  ChefHat,
  Soup,
  GlassWater,
  Cake
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { useApp } from '../context/AppContext';

const getCategoryIcon = (id: string, className = 'w-3.5 h-3.5') => {
  switch (id) {
    case 'all':
      return <LayoutGrid className={className} />;
    case 'bestsellers':
      return <Flame className={className} />;
    case 'starters':
      return <Salad className={className} />;
    case 'mains':
      return <ChefHat className={className} />;
    case 'noodles-rice':
      return <Soup className={className} />;
    case 'beverages':
      return <GlassWater className={className} />;
    case 'desserts':
      return <Cake className={className} />;
    default:
      return <LayoutGrid className={className} />;
  }
};

export const CategoryNav: React.FC = () => {
  const { selectedCategory, setSelectedCategory, dietaryFilter } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCategory(id);
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  };

  // Dynamic Theme Styling matching dietary filter with buttery-smooth transition
  const getActivePillClasses = () => {
    switch (dietaryFilter) {
      case 'veg':
        return {
          pill: 'bg-emerald-900 text-emerald-200 shadow-md shadow-emerald-950/25 scale-[1.03] ring-2 ring-emerald-800/50 border border-emerald-700/60',
          icon: 'text-emerald-300',
          dot: 'bg-emerald-400'
        };
      case 'non-veg':
        return {
          pill: 'bg-red-950 text-red-200 shadow-md shadow-red-950/25 scale-[1.03] ring-2 ring-red-900/50 border border-red-800/60',
          icon: 'text-red-300',
          dot: 'bg-red-400'
        };
      case 'all':
      default:
        return {
          pill: 'bg-stone-900 text-amber-300 shadow-md scale-[1.03] ring-2 ring-stone-900/15 border border-stone-800',
          icon: 'text-amber-300',
          dot: 'bg-amber-400'
        };
    }
  };

  const activeStyles = getActivePillClasses();

  return (
    <div
      className={`sticky top-[118px] sm:top-[132px] z-20 backdrop-blur-md py-2.5 border-b transition-colors duration-300 ease-out shadow-2xs ${
        dietaryFilter === 'veg'
          ? 'bg-emerald-50/40 border-emerald-200/60'
          : dietaryFilter === 'non-veg'
          ? 'bg-red-50/30 border-red-200/60'
          : 'bg-white/90 border-stone-200/70'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={(e) => handleCategorySelect(cat.id, e)}
                className={`group relative whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-2 active:scale-95 cursor-pointer select-none ${
                  isActive
                    ? activeStyles.pill
                    : dietaryFilter === 'veg'
                    ? 'bg-white/90 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200/70 hover:border-emerald-300'
                    : dietaryFilter === 'non-veg'
                    ? 'bg-white/90 hover:bg-red-50 text-stone-700 hover:text-red-900 border border-stone-200/70 hover:border-red-300'
                    : 'bg-stone-100/80 hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200/60 hover:border-stone-300/80'
                }`}
              >
                <span
                  className={`flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                    isActive
                      ? activeStyles.icon
                      : dietaryFilter === 'veg'
                      ? 'text-stone-500 group-hover:text-emerald-700'
                      : dietaryFilter === 'non-veg'
                      ? 'text-stone-500 group-hover:text-red-700'
                      : 'text-stone-500 group-hover:text-stone-900'
                  }`}
                >
                  {getCategoryIcon(cat.id, 'w-3.5 h-3.5')}
                </span>
                <span>{cat.name}</span>
                {isActive && (
                  <span className={`w-1.5 h-1.5 rounded-full ${activeStyles.dot} animate-pulse ml-0.5`} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
