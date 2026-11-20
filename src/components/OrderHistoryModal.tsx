import React from 'react';
import {
  X,
  Clock,
  Receipt,
  Repeat,
  ArrowRight,
  ShoppingBag,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';

export const OrderHistoryModal: React.FC = () => {
  const {
    orderHistory,
    isOrderHistoryOpen,
    setIsOrderHistoryOpen,
    setIsTrackerOpen,
    setViewingOrder,
    reorderItems
  } = useApp();

  if (!isOrderHistoryOpen) return null;

  const handleViewReceipt = (order: typeof orderHistory[0]) => {
    setViewingOrder(order);
    setIsOrderHistoryOpen(false);
    setIsTrackerOpen(true);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsOrderHistoryOpen(false);
        }
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/65 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-stone-200/80 animate-slide-up overflow-hidden">
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mt-2 sm:hidden flex-shrink-0" />

        {/* Compact Clean Header */}
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-stone-100 bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center shadow-2xs">
              <Clock className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
                Order History
              </h2>
              <p className="text-[11px] text-stone-500 font-medium">
                {orderHistory.length} {orderHistory.length === 1 ? 'order' : 'orders'} placed this session
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOrderHistoryOpen(false)}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            title="Close order history"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Order History Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {orderHistory.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-stone-100 border border-stone-200 text-stone-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6 text-stone-400" />
              </div>
              <h3 className="font-serif font-bold text-base text-stone-800">
                No Orders Placed Yet
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                When you place orders, your digital receipts and item details will be neatly saved here.
              </p>
            </div>
          ) : (
            orderHistory.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-200/90 hover:border-stone-300 p-4 shadow-2xs transition-all space-y-3"
              >
                {/* Order Header */}
                <div className="flex items-start justify-between gap-3 border-b border-stone-100 pb-2.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm sm:text-base text-stone-900">
                        Order #{order.id}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider border border-emerald-200/80 flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        Placed
                      </span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-medium block mt-0.5">
                      Placed at {order.placedAt}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-medium">Total Paid</span>
                    <span className="font-mono font-extrabold text-sm sm:text-base text-stone-900">
                      {RESTAURANT_INFO.currency}{order.total}
                    </span>
                  </div>
                </div>

                {/* Items Summary Preview */}
                <div className="space-y-1 text-xs">
                  {order.items.map((ci) => (
                    <div key={ci.cartItemId} className="flex items-center justify-between text-stone-700">
                      <span className="truncate max-w-[240px]">
                        <strong className="text-stone-900 font-mono">{ci.quantity}×</strong> {ci.menuItem.name}
                      </span>
                      <span className="font-mono text-stone-800 text-[11px]">
                        {RESTAURANT_INFO.currency}{ci.totalPrice}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons: View Receipt & Reorder */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleViewReceipt(order)}
                    className="flex-1 py-2 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-800 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5 text-stone-600" />
                    <span>View Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => reorderItems(order.items)}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.99] cursor-pointer"
                  >
                    <Repeat className="w-3.5 h-3.5 text-amber-300" />
                    <span>Reorder All</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-stone-100 flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsOrderHistoryOpen(false)}
            className="w-full py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Back to Menu</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
