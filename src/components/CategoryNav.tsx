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
  const { selectedCategory, setSelectedCategory } = useApp();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCategorySelect = (id: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setSelectedCategory(id);
    e.currentTarget.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
  };

  return (
    <div className="border-t border-stone-200/60 py-2 sm:py-2.5 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scroll-smooth py-0.5 px-0.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={(e) => handleCategorySelect(cat.id, e)}
                className={`group relative whitespace-nowrap px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center gap-1.5 sm:gap-2 active:scale-95 cursor-pointer select-none ${
                  isActive
                    ? 'bg-stone-900 text-amber-300 shadow-md scale-[1.03] ring-2 ring-stone-900/15 border border-stone-800'
                    : 'bg-stone-100/90 hover:bg-stone-200/80 text-stone-700 hover:text-stone-900 border border-stone-200/70'
                }`}
              >
                <span
                  className={`flex-shrink-0 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-amber-300' : 'text-stone-500 group-hover:scale-110'
                  }`}
                >
                  {getCategoryIcon(cat.id, 'w-3.5 h-3.5')}
                </span>
                <span>{cat.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
