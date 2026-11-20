import React, { useState } from 'react';
import { Plus, Minus, Star, Sparkles, Check } from 'lucide-react';
import { MenuItem } from '../types';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';

interface FoodCardProps {
  item: MenuItem;
}

export const FoodCard: React.FC<FoodCardProps> = ({ item }) => {
  const { cart, addToCart, updateQuantity, openCustomization } = useApp();
  const [isImgLoaded, setIsImgLoaded] = useState(false);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  // Find occurrences of this menuItem in the cart
  const cartEntries = cart.filter(ci => ci.menuItem.id === item.id);
  const totalQuantityInCart = cartEntries.reduce((acc, ci) => acc + ci.quantity, 0);

  const handleAddClick = () => {
    if (!item.isAvailable) return;
    addToCart(item);
    setShowAddSuccess(true);
    setTimeout(() => setShowAddSuccess(false), 800);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartEntries.length > 0) {
      updateQuantity(cartEntries[0].cartItemId, 1);
    } else {
      addToCart(item);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartEntries.length > 0) {
      const lastEntry = cartEntries[cartEntries.length - 1];
      updateQuantity(lastEntry.cartItemId, -1);
    }
  };

  return (
    <div
      onClick={() => {
        if (item.isAvailable) {
          openCustomization(item);
        }
      }}
      className={`group relative bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-md hover:border-stone-300 active:scale-[0.985] cursor-pointer ${
        !item.isAvailable ? 'opacity-60 grayscale' : ''
      }`}
    >
      <div>
        {/* Food Image Container with Skeleton Loading */}
        <div className="relative w-full aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 mb-2.5 sm:mb-3">
          {/* Skeleton Shimmer until loaded */}
          {!isImgLoaded && (
            <div className="absolute inset-0 skeleton-shimmer z-0" />
          )}

          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
            onLoad={() => setIsImgLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ease-out ${
              isImgLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Badges Overlay */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {/* Veg / Non-Veg Indicator */}
            <div className="bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-xs flex items-center justify-center">
              {item.dietary === 'veg' || item.dietary === 'vegan' ? (
                <div
                  className="w-3.5 h-3.5 border-[1.5px] border-emerald-600 rounded-sm flex items-center justify-center"
                  title="Vegetarian"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                </div>
              ) : item.dietary === 'egg' ? (
                <div
                  className="w-3.5 h-3.5 border-[1.5px] border-amber-600 rounded-sm flex items-center justify-center"
                  title="Contains Egg"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                </div>
              ) : (
                <div
                  className="w-3.5 h-3.5 border-[1.5px] border-red-700 rounded-sm flex items-center justify-center"
                  title="Non-Vegetarian"
                >
                  <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-red-700" />
                </div>
              )}
            </div>

            {/* Chef Special Badge */}
            {item.isChefSpecial && (
              <span className="bg-stone-900/90 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-0.5 shadow-2xs">
                <Sparkles className="w-2.5 h-2.5" />
                Chef's
              </span>
            )}
          </div>

          {/* Rating Pill */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-2xs">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span>{item.rating || 4.8}</span>
          </div>

          {!item.isAvailable && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center text-white font-bold text-xs tracking-wider uppercase">
              Sold Out
            </div>
          )}
        </div>

        {/* Title and Short Description */}
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-xs sm:text-sm text-stone-900 line-clamp-1 leading-snug group-hover:text-amber-800 transition-colors">
            {item.name}
          </h3>
          <p className="text-[11px] sm:text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>
      </div>

      {/* Pricing & Add to Cart Controls */}
      <div className="pt-2 sm:pt-3 mt-1.5 sm:mt-2 flex items-center justify-between border-t border-stone-100 gap-2">
        <div>
          <div className="font-mono font-bold text-sm sm:text-base text-stone-900">
            {RESTAURANT_INFO.currency}{item.price}
          </div>
        </div>

        {/* Action Button: All items use unified [+ Add] and Stepper when added */}
        {totalQuantityInCart === 0 ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleAddClick();
            }}
            disabled={!item.isAvailable}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all duration-200 active:scale-95 shadow-2xs cursor-pointer select-none ${
              showAddSuccess
                ? 'bg-emerald-600 text-white scale-105'
                : 'bg-stone-900 hover:bg-stone-800 text-white'
            }`}
          >
            {showAddSuccess ? (
              <span className="flex items-center gap-1 animate-pop-in">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </span>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 transition-transform group-hover:scale-125" />
                <span>Add</span>
              </>
            )}
          </button>
        ) : (
          <div className="flex items-center gap-1 bg-stone-900 text-white rounded-xl p-0.5 shadow-2xs animate-pop-in select-none">
            <button
              type="button"
              onClick={handleDecrement}
              className="w-6 h-6 rounded-lg hover:bg-stone-800 flex items-center justify-center transition-transform active:scale-75 cursor-pointer"
              title="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span
              key={totalQuantityInCart}
              className="w-5 text-center text-xs font-mono font-bold animate-number-pop"
            >
              {totalQuantityInCart}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              className="w-6 h-6 rounded-lg hover:bg-stone-800 flex items-center justify-center transition-transform active:scale-75 cursor-pointer"
              title="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
