import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';

export const BottomCartBar: React.FC = () => {
  const {
    cartSummary,
    setIsCartOpen,
    isCartOpen,
    isCheckoutOpen,
    isTrackerOpen,
    isOrderHistoryOpen
  } = useApp();

  // Bottom cart bar ONLY displays when there are items actively selected in the cart
  // and no modals/drawers are currently active.
  if (cartSummary.count === 0 || isCartOpen || isCheckoutOpen || isTrackerOpen || isOrderHistoryOpen) {
      return null;
  }

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <button
        type="button"
        onClick={() => setIsCartOpen(true)}
        className="w-full bg-stone-900 text-white rounded-2xl p-3.5 shadow-float flex items-center justify-between border border-stone-800 active:scale-[0.98] transition-all duration-150 cursor-pointer select-none"
      >
        {/* Left Count & Items preview */}
        <div className="flex items-center gap-3">
          <div
            key={cartSummary.count}
            className="relative w-10 h-10 rounded-xl bg-stone-800 border border-stone-700/80 flex items-center justify-center font-bold text-amber-300 shadow-xs animate-cart-pulse"
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
              {cartSummary.count} {cartSummary.count === 1 ? 'dish' : 'dishes'} in your order
            </div>
            <div className="text-base font-extrabold text-white font-mono tracking-tight flex items-center gap-1.5">
              <span key={cartSummary.total} className="animate-number-pop">
                {RESTAURANT_INFO.currency}{cartSummary.total}
              </span>
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
