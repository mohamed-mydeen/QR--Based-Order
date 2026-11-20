import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Clock,
  ChefHat,
  Flame,
  UtensilsCrossed,
  Bell,
  Receipt,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';
import { ConfirmationSheet } from './ConfirmationSheet';

export const OrderTracker: React.FC = () => {
  const {
    activeOrder,
    isTrackerOpen,
    setIsTrackerOpen,
    tableNumber,
    callWaiter,
    waiterCalled,
    cancelActiveOrder
  } = useApp();

  const [showReceipt, setShowReceipt] = useState(false);
  const [isCancelOrderConfirmOpen, setIsCancelOrderConfirmOpen] = useState(false);

  if (!isTrackerOpen || !activeOrder) return null;

  const steps = activeOrder.statusHistory;

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Clock className="w-4 h-4" />;
      case 'confirmed':
        return <ChefHat className="w-4 h-4" />;
      case 'cooking':
        return <Flame className="w-4 h-4" />;
      case 'ready':
        return <Sparkles className="w-4 h-4" />;
      case 'served':
        return <UtensilsCrossed className="w-4 h-4" />;
      default:
        return <CheckCircle2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/65 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] sm:max-h-[88vh] flex flex-col shadow-2xl border border-stone-200 animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <h2 className="text-lg font-bold font-serif text-stone-900">
                Live Kitchen Tracker
              </h2>
            </div>
            <p className="text-xs text-stone-500">
              Order #{activeOrder.id} • Assigned to <span className="font-bold text-stone-800">{activeOrder.tableNumber}</span>
            </p>
          </div>
          <button
            onClick={() => setIsTrackerOpen(false)}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Estimated Preparation Time Card */}
          <div className="p-4 rounded-2xl bg-stone-900 text-white flex items-center justify-between shadow-soft">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                Estimated Table Arrival
              </span>
              <div className="text-2xl font-extrabold font-mono tracking-tight flex items-baseline gap-1.5">
                <span>12 – 18</span>
                <span className="text-xs font-sans text-stone-300 font-normal">mins</span>
              </div>
              <p className="text-[11px] text-stone-400">
                Order placed at {activeOrder.placedAt} • Live sync
              </p>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-inner">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          {/* Real-time Status Timeline */}
          <div>
            <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-4">
              Preparation Progress
            </h3>

            <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {steps.map((step) => {
                const isCompleted = step.isCompleted;
                const isCurrent = step.isCurrent;

                return (
                  <div key={step.status} className="relative flex items-start gap-3.5">
                    {/* Step Icon Node */}
                    <div
                      className={`absolute -left-6 w-5 h-5 rounded-full flex items-center justify-center text-xs transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white ring-4 ring-white'
                          : isCurrent
                          ? 'bg-orange-600 text-white ring-4 ring-orange-100 animate-pulse'
                          : 'bg-stone-200 text-stone-400 ring-4 ring-white'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />
                      ) : (
                        getStepIcon(step.status)
                      )}
                    </div>

                    {/* Step Text */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`text-xs sm:text-sm font-bold ${
                            isCurrent
                              ? 'text-orange-600'
                              : isCompleted
                              ? 'text-stone-900'
                              : 'text-stone-400'
                          }`}
                        >
                          {step.label}
                        </h4>
                        {step.time && (
                          <span className="text-[10px] font-mono text-stone-400">
                            {step.time}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Table Service Controls */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800">
                Need table assistance?
              </span>
              <span className="text-[10px] text-stone-500">
                Staff response ~2 mins
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={callWaiter}
                disabled={waiterCalled}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  waiterCalled
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 shadow-2xs'
                }`}
              >
                <Bell className={`w-3.5 h-3.5 ${waiterCalled ? 'text-amber-600 animate-bounce' : 'text-stone-500'}`} />
                <span>{waiterCalled ? 'Staff Alerted' : 'Call Server'}</span>
              </button>

              <button
                onClick={() => setShowReceipt(!showReceipt)}
                className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Receipt className="w-3.5 h-3.5 text-stone-500" />
                <span>{showReceipt ? 'Hide Receipt' : 'View Bill'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Digital Receipt */}
          {showReceipt && (
            <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50/60 text-xs space-y-2 animate-fade-in font-sans">
              <div className="flex justify-between font-bold text-stone-900 border-b border-stone-200 pb-2">
                <span>Receipt #{activeOrder.id}</span>
                <span className="capitalize">{activeOrder.paymentMethod} Payment ({activeOrder.paymentStatus})</span>
              </div>
              <div className="space-y-1.5 pt-1">
                {activeOrder.items.map(item => (
                  <div key={item.cartItemId} className="flex justify-between">
                    <span className="text-stone-700 truncate max-w-[220px]">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="font-mono text-stone-900">
                      {RESTAURANT_INFO.currency}{item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-stone-200 pt-2 space-y-1 text-stone-500 text-[11px]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono">{RESTAURANT_INFO.currency}{activeOrder.subtotal}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono">-{RESTAURANT_INFO.currency}{activeOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Taxes (5%)</span>
                  <span className="font-mono">+{RESTAURANT_INFO.currency}{activeOrder.tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service (2.5%)</span>
                  <span className="font-mono">+{RESTAURANT_INFO.currency}{activeOrder.serviceCharge}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-900 text-xs border-t border-stone-200 pt-1">
                  <span>Total Paid / Payable</span>
                  <span className="font-mono">{RESTAURANT_INFO.currency}{activeOrder.total}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between gap-3">
          {(activeOrder.status === 'placed' || activeOrder.status === 'confirmed') && (
            <button
              type="button"
              onClick={() => setIsCancelOrderConfirmOpen(true)}
              className="py-3 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs sm:text-sm transition-colors cursor-pointer select-none"
            >
              Cancel Order
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsTrackerOpen(false)}
            className="flex-1 py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm text-center transition-colors shadow-2xs cursor-pointer select-none"
          >
            Order More Food for {tableNumber}
          </button>
        </div>
      </div>

      {/* iOS-Style Cancel Order Confirmation Dialog */}
      <ConfirmationSheet
        isOpen={isCancelOrderConfirmOpen}
        onClose={() => setIsCancelOrderConfirmOpen(false)}
        onConfirm={() => {
          cancelActiveOrder();
          setIsCancelOrderConfirmOpen(false);
        }}
        title="Cancel this order?"
        description={`Are you sure you want to cancel Order #${activeOrder.id} for ${tableNumber}? This will inform the kitchen staff to stop preparation.`}
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        variant="destructive"
        isCenterDialog={true}
        icon={<X className="w-5 h-5 text-amber-400" />}
      />
    </div>
  );
};
