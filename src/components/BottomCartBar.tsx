import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';

export const BottomCartBar: React.FC = () => {
  const { cartSummary, setIsCartOpen, isCartOpen, isCheckoutOpen, isTrackerOpen } = useApp();

  // Hide on desktop (since desktop has side panel or header), or if cart is empty, or when modals are active
  if (cartSummary.count === 0 || isCartOpen || isCheckoutOpen || isTrackerOpen) {
    return null;
  }

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 animate-slide-up">
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-stone-900 text-white rounded-2xl p-3.5 shadow-float flex items-center justify-between border border-stone-800 active:scale-[0.98] transition-all duration-150 cursor-pointer select-none"
      >
        {/* Left Count & Items preview */}
        <div className="flex items-center gap-3">
          <div
            key={cartSummary.count}
            className="relative w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center font-bold text-white shadow-xs animate-cart-bounce"
          >
            <ShoppingBag className="w-5 h-5" />
            <span
              key={`badge-${cartSummary.count}`}
              className="absolute -top-1.5 -right-1.5 bg-white text-stone-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-stone-900 animate-badge-pop"
            >
              {cartSummary.count}
            </span>
          </div>

          <div className="text-left">
            <div className="text-xs text-stone-300 font-medium">
              {cartSummary.count} {cartSummary.count === 1 ? 'dish' : 'dishes'} in table order
            </div>
            <div className="text-base font-extrabold text-white font-mono tracking-tight flex items-center gap-1.5">
              <span>{RESTAURANT_INFO.currency}{cartSummary.total}</span>
              <span className="text-[10px] text-stone-400 font-sans font-normal">• Inclusive</span>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-stone-800/90 px-3 py-2 rounded-xl border border-stone-700/60 shadow-2xs">
          <span>View Order</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </div>
      </button>
    </div>
  );
};
