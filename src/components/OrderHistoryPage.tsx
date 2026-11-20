import React from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  Receipt,
  Repeat,
  Clock,
  Sparkles,
  Utensils
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';

export const OrderHistoryPage: React.FC = () => {
  const {
    orderHistory,
    setActiveView,
    setViewingOrder,
    setIsTrackerOpen,
    reorderItems
  } = useApp();

  const handleOpenReceipt = (order: typeof orderHistory[0]) => {
    setViewingOrder(order);
    setIsTrackerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 text-stone-900 animate-fade-in flex flex-col justify-between">
      <div>
        {/* Swiggy-Style Clean Sticky Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
            {/* Back to Menu Action */}
            <button
              type="button"
              onClick={() => setActiveView('menu')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-stone-100 text-stone-700 hover:text-stone-900 font-semibold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-stone-800" />
              <span>Back to Menu</span>
            </button>

            {/* Page Title */}
            <div className="text-center">
              <h1 className="font-serif font-bold text-base sm:text-lg text-stone-900 tracking-tight leading-tight">
                Order History
              </h1>
              <p className="text-[11px] text-stone-400 font-medium">
                {RESTAURANT_INFO.name}
              </p>
            </div>

            {/* Orders Count Badge */}
            <span className="px-2.5 py-1 rounded-full bg-stone-900 text-amber-300 text-xs font-mono font-bold shadow-2xs">
              {orderHistory.length} {orderHistory.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
        </header>

        {/* Main Orders List Container */}
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">
          {orderHistory.length === 0 ? (
            /* Clean Empty State */
            <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 text-center shadow-sm space-y-4 max-w-lg mx-auto mt-6">
              <div className="w-16 h-16 rounded-3xl bg-stone-100 border border-stone-200 text-stone-400 flex items-center justify-center mx-auto shadow-inner">
                <ShoppingBag className="w-8 h-8 text-stone-400" />
              </div>
              <div className="space-y-1">
                <h2 className="font-serif font-bold text-lg text-stone-900">
                  No Past Orders Yet
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto leading-relaxed">
                  Your ordered dining feasts and digital receipts will appear here after purchasing.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveView('menu')}
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>Browse Dining Menu</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          ) : (
            /* Swiggy-Style Past Orders Cards */
            <div className="space-y-4">
              {orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/90 hover:border-stone-300 p-4 sm:p-6 shadow-2xs transition-all duration-200 space-y-4"
                >
                  {/* Swiggy-Style Clean Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-stone-150 pb-3.5">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-stone-900 tracking-tight leading-tight">
                        {RESTAURANT_INFO.name}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {RESTAURANT_INFO.tagline}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-stone-500 mt-1.5 font-medium">
                        <span className="font-mono text-stone-800 font-semibold">#{order.id}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-stone-500">
                          <Clock className="w-3 h-3 text-stone-400" />
                          Placed at {order.placedAt}
                        </span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-wider block">
                        Total Paid
                      </span>
                      <span className="font-mono font-black text-base sm:text-lg text-stone-950">
                        {RESTAURANT_INFO.currency}{order.total}
                      </span>
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  <div className="space-y-2 py-1">
                    {order.items.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex items-start justify-between gap-3 text-xs sm:text-sm"
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          {/* Veg / Non-Veg Indicator */}
                          <div className="p-0.5 rounded-xs flex items-center justify-center flex-shrink-0 mt-1">
                            {item.menuItem.dietary === 'veg' || item.menuItem.dietary === 'vegan' ? (
                              <div className="w-3.5 h-3.5 border-[1.5px] border-emerald-600 rounded-xs flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              </div>
                            ) : (
                              <div className="w-3.5 h-3.5 border-[1.5px] border-red-700 rounded-xs flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-red-700" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-stone-800 leading-snug">
                              <strong className="text-stone-950 font-mono font-bold mr-1.5">
                                {item.quantity}×
                              </strong>
                              {item.menuItem.name}
                            </span>
                            {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                              <p className="text-[11px] text-stone-500 font-normal leading-tight mt-0.5">
                                {item.selectedModifiers.map((m) => m.optionName).join(' • ')}
                              </p>
                            )}
                          </div>
                        </div>

                        <span className="font-mono font-bold text-xs sm:text-sm text-stone-900 flex-shrink-0">
                          {RESTAURANT_INFO.currency}{item.totalPrice}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Special Kitchen Request (if entered) */}
                  {order.specialNotes && (
                    <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
                      <Utensils className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold block text-[11px]">Special Kitchen Request:</span>
                        <span className="text-stone-700">{order.specialNotes}</span>
                      </div>
                    </div>
                  )}

                  {/* Payment Info & Card Actions */}
                  <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-stone-500 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-100/90 text-stone-600 font-medium text-[11px]">
                        <span className={`w-1.5 h-1.5 rounded-full ${order.paymentMethod === 'upi' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        Payment: {order.paymentMethod === 'upi' ? 'UPI (Completed)' : 'Pay After Dining'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenReceipt(order)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-stone-300 hover:border-stone-400 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-95 cursor-pointer"
                      >
                        <Receipt className="w-3.5 h-3.5 text-stone-700" />
                        <span>View Receipt</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => reorderItems(order.items)}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer border border-stone-800"
                      >
                        <Repeat className="w-3.5 h-3.5 text-amber-300" />
                        <span>Reorder</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-stone-200/80 bg-white py-6 text-center text-xs text-stone-400">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="font-semibold text-stone-700">{RESTAURANT_INFO.name}</span>
          <span>Digital dining history stored locally in your active session</span>
        </div>
      </footer>
    </div>
  );
};
