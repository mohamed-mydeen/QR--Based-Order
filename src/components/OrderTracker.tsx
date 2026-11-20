import React, { useState } from 'react';
import {
  X,
  Receipt,
  Clock,
  ArrowRight,
  CreditCard,
  Banknote,
  Utensils
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';
import { ConfirmationSheet } from './ConfirmationSheet';

export const OrderTracker: React.FC = () => {
  const {
    activeOrder,
    viewingOrder,
    orderHistory,
    isTrackerOpen,
    setIsTrackerOpen,
    setIsOrderHistoryOpen,
    cancelActiveOrder
  } = useApp();

  const [isCancelOrderConfirmOpen, setIsCancelOrderConfirmOpen] = useState(false);

  const order = viewingOrder || activeOrder;
  if (!isTrackerOpen || !order) return null;

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsTrackerOpen(false);
        }
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/65 backdrop-blur-xs overscroll-none animate-fade-in select-none"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-stone-200/80 animate-slide-up overflow-hidden">
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mt-2 sm:hidden flex-shrink-0" />

        {/* Compact Clean Header */}
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-stone-100 bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-300 flex items-center justify-center shadow-2xs">
              <Receipt className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
                Order Details
              </h2>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                Order #{order.id} • Placed at {order.placedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {orderHistory.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsTrackerOpen(false);
                  setIsOrderHistoryOpen(true);
                }}
                className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                title="View past orders"
              >
                History ({orderHistory.length})
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsTrackerOpen(false)}
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
              title="Close view order"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Order Summary & Receipt Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4">
          {/* Order Info Bar */}
          <div className="bg-stone-50 rounded-2xl p-3 sm:p-3.5 border border-stone-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-700">
              <Clock className="w-4 h-4 text-stone-500" />
              <span>Status: <strong className="text-stone-900">Preparing Fresh</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-700">
              {order.paymentMethod === 'upi' ? (
                <>
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">UPI (Paid)</span>
                </>
              ) : (
                <>
                  <Banknote className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-stone-800 font-medium">Pay After Dining</span>
                </>
              )}
            </div>
          </div>

          {/* Ordered Dishes List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider">
              <span>Items Ordered</span>
              <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} Items</span>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/90 divide-y divide-stone-100 overflow-hidden shadow-2xs">
              {order.items.map((item) => (
                <div key={item.cartItemId} className="p-3 sm:p-3.5 flex items-start justify-between gap-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-md bg-stone-100 border border-stone-200/70 text-stone-900 font-mono font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.quantity}×
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-stone-900 leading-snug">
                        {item.menuItem.name}
                      </div>
                      {item.selectedModifiers && item.selectedModifiers.length > 0 && (
                        <div className="text-[11px] text-stone-500 flex flex-wrap gap-1 mt-1">
                          {item.selectedModifiers.map((m) => (
                            <span key={m.optionId} className="inline-block bg-stone-50 border border-stone-200/60 px-1.5 py-0.5 rounded text-[10px] text-stone-600">
                              {m.optionName}
                            </span>
                          ))}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <p className="text-[11px] text-stone-400 italic mt-0.5">
                          Note: "{item.specialInstructions}"
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
          </div>

          {/* Special Kitchen Request (if entered) */}
          {order.specialNotes && (
            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
              <Utensils className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Special Request for Kitchen:</span>
                <span className="text-stone-700">{order.specialNotes}</span>
              </div>
            </div>
          )}

          {/* Bill Receipt Breakdown */}
          <div className="p-4 rounded-2xl bg-stone-50/70 border border-stone-200/80 text-xs space-y-2">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-mono font-semibold text-stone-800">
                {RESTAURANT_INFO.currency}{order.subtotal}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span className="font-mono font-semibold">
                  -{RESTAURANT_INFO.currency}{order.discount}
                </span>
              </div>
            )}
            <div className="flex justify-between text-stone-500 text-[11px]">
              <span>Taxes (5%)</span>
              <span className="font-mono">+{RESTAURANT_INFO.currency}{order.tax}</span>
            </div>
            <div className="flex justify-between text-stone-500 text-[11px]">
              <span>Service Charge (2.5%)</span>
              <span className="font-mono">+{RESTAURANT_INFO.currency}{order.serviceCharge}</span>
            </div>
            <div className="border-t border-stone-200 pt-2 flex justify-between font-bold text-stone-950 text-sm">
              <span>Total Paid</span>
              <span className="font-mono text-base font-extrabold text-stone-950">
                {RESTAURANT_INFO.currency}{order.total}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-stone-200/80 flex items-center justify-between gap-3 shadow-lg flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsCancelOrderConfirmOpen(true)}
            className="py-3 px-3.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-900 font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel Order
          </button>

          <button
            type="button"
            onClick={() => setIsTrackerOpen(false)}
            className="flex-1 py-3 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
          >
            <span>Back to Menu</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Cancel Order Confirmation Dialog */}
      <ConfirmationSheet
        isOpen={isCancelOrderConfirmOpen}
        onClose={() => setIsCancelOrderConfirmOpen(false)}
        onConfirm={() => {
          cancelActiveOrder();
          setIsCancelOrderConfirmOpen(false);
        }}
        title="Cancel this order?"
        description={`Are you sure you want to cancel Order #${order.id}? This will inform the kitchen staff to stop preparation.`}
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        variant="destructive"
        isCenterDialog={true}
        icon={<X className="w-5 h-5 text-amber-400" />}
      />
    </div>
  );
};
