import React, { useState } from 'react';
import {
  X,
  Banknote,
  ArrowRight,
  CreditCard
} from 'lucide-react';
import { PaymentMethod } from '../types';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';
import { ConfirmationSheet } from './ConfirmationSheet';

// Authentic Official Brand Icons for UPI & Payment Providers
const GooglePayIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.94 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const PhonePeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect width="24" height="24" rx="5" fill="#5F259F" />
    <path
      d="M17.2 10.1c-.3-.4-.8-.7-1.5-.7h-2.5l.7-3.4c.1-.3 0-.7-.2-.9-.2-.2-.6-.3-.9-.2l-1.4.3c-.4.1-.7.4-.8.9l-.2 3.3h-2.1c-.5 0-.9.4-.9.9s.4.9.9.9h1.6l-.7 4.3h-1.4c-.5 0-.9.4-.9.9s.4.9.9.9h1.4l-.3 1.6c-.1.4.2.8.6.9.4.1.8-.1 1-.5l.4-2h3c2.2 0 3.8-1.5 4.1-3.7.1-1.3-.3-2.5-1.1-3.3zm-2.7 4.1h-3.2l.7-4.3h2.5c.4 0 .7.1.9.4.2.2.3.6.2 1.2-.2 1.3-1.1 2.7-1.1 2.7z"
      fill="#FFFFFF"
    />
  </svg>
);

const PaytmIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect width="24" height="24" rx="5" fill="#002E6E" />
    <path d="M4 14.5L7.5 7h3L8 14.5H4z" fill="#00BAF2" />
    <path d="M11 7h3l-2.5 7.5h-3L11 7z" fill="#00BAF2" />
    <path
      d="M15.5 11.5c0-2.3 1.6-4.2 3.7-4.2v2.8c-.6 0-1.1.6-1.1 1.4s.5 1.4 1.1 1.4v2.8c-2.1 0-3.7-1.9-3.7-4.2z"
      fill="#FFFFFF"
    />
  </svg>
);

const UpiIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    <rect width="24" height="24" rx="5" fill="#F4F4F5" />
    <path d="M8 6l5.5 6L8 18h3.5L17 12 11.5 6H8z" fill="#097939" />
    <path d="M12 6l5.5 6L12 18h3.5L21 12 15.5 6H12z" fill="#ED7823" />
  </svg>
);

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cartSummary,
    tableNumber,
    user,
    startAuthFlow,
    placeOrder,
    showToast
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDiscardConfirmOpen, setIsDiscardConfirmOpen] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleCloseRequest = () => {
    if (specialNotes.trim().length > 0) {
      setIsDiscardConfirmOpen(true);
    } else {
      setIsCheckoutOpen(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!user?.isVerified) {
      startAuthFlow();
      return;
    }
    setIsSubmitting(true);
    setTimeout(async () => {
      await placeOrder(paymentMethod, specialNotes);
      setIsSubmitting(false);
      showToast('Order confirmed and sent to kitchen!');
    }, 900);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseRequest();
        }
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/65 backdrop-blur-xs animate-fade-in"
    >
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full flex flex-col shadow-2xl border border-stone-200/80 animate-slide-up overflow-hidden">
        {/* Mobile Drag Indicator */}
        <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mt-2 sm:hidden flex-shrink-0" />

        {/* Compact Clean Header */}
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-stone-100 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-tight">
              Select Payment Method
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 font-mono font-bold text-xs shadow-2xs">
              {tableNumber}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCloseRequest}
            className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
            title="Close checkout"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Body Content */}
        <div className="p-4 sm:p-5 space-y-3.5">
          {/* Payment Options List (Swiggy style) */}
          <div className="space-y-2">
            {/* Option 1: UPI & Online Apps */}
            <div
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                paymentMethod === 'upi'
                  ? 'border-stone-900 bg-stone-50/80 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Radio Indicator */}
                  <div className="w-4 h-4 rounded-full border-2 border-stone-900 flex items-center justify-center bg-white flex-shrink-0">
                    {paymentMethod === 'upi' && (
                      <div className="w-2 h-2 rounded-full bg-stone-900" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-semibold text-xs sm:text-sm text-stone-900">
                        UPI & Online Apps
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200/70">
                        Fastest
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate">
                      Google Pay, PhonePe, Paytm, QR
                    </p>
                  </div>
                </div>

                {/* Compact Logos */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200/70 shadow-2xs flex-shrink-0">
                  <div className="p-0.5" title="Google Pay">
                    <GooglePayIcon className="w-4 h-4" />
                  </div>
                  <div className="p-0.5" title="PhonePe">
                    <PhonePeIcon className="w-4 h-4" />
                  </div>
                  <div className="p-0.5" title="Paytm">
                    <PaytmIcon className="w-4 h-4" />
                  </div>
                  <div className="p-0.5" title="UPI">
                    <UpiIcon className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Option 2: Pay After Dining */}
            <div
              onClick={() => setPaymentMethod('cash')}
              className={`p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                paymentMethod === 'cash'
                  ? 'border-stone-900 bg-stone-50/80 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Radio Indicator */}
                  <div className="w-4 h-4 rounded-full border-2 border-stone-900 flex items-center justify-center bg-white flex-shrink-0">
                    {paymentMethod === 'cash' && (
                      <div className="w-2 h-2 rounded-full bg-stone-900" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="font-semibold text-xs sm:text-sm text-stone-900 block">
                      Pay After Dining
                    </span>
                    <p className="text-[11px] text-stone-500 truncate">
                      Cash or Card at table / counter
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-stone-200/70 text-stone-700 shadow-2xs flex-shrink-0">
                  <div className="p-0.5" title="Cash">
                    <Banknote className="w-4 h-4" />
                  </div>
                  <div className="p-0.5" title="Card">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Kitchen Request (Optional) */}
          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-stone-700 uppercase tracking-wider">
              Special Request for Kitchen (Optional)
            </label>
            <input
              type="text"
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder="e.g. Serve starters first, less spicy..."
              className="w-full px-3 py-2 rounded-xl bg-stone-50/70 border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all"
            />
          </div>
        </div>

        {/* Compact Footer Action matching app theme */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-stone-100 flex items-center justify-between gap-3 shadow-lg">
          <div className="text-left">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-semibold block">Total to Pay</span>
            <span className="font-extrabold text-lg sm:text-xl font-mono text-stone-950">
              {RESTAURANT_INFO.currency}{cartSummary.total}
            </span>
          </div>

          <button
            type="button"
            onClick={handleConfirmOrder}
            disabled={isSubmitting}
            className="py-3 px-5 sm:px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-75 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending to Kitchen...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Place Order Now</span>
                <span className="text-amber-300 font-mono font-extrabold text-sm border-l border-stone-700 pl-2">
                  {RESTAURANT_INFO.currency}{cartSummary.total}
                </span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Discard Checkout Confirmation Dialog */}
      <ConfirmationSheet
        isOpen={isDiscardConfirmOpen}
        onClose={() => setIsDiscardConfirmOpen(false)}
        onConfirm={() => {
          setIsDiscardConfirmOpen(false);
          setIsCheckoutOpen(false);
        }}
        title="Leave checkout?"
        description="Your table order is still safely preserved in your cart, but your dining notes will not be saved."
        confirmLabel="Leave Checkout"
        cancelLabel="Keep Reviewing"
        variant="warning"
        isCenterDialog={true}
        icon={<X className="w-5 h-5 text-amber-600" />}
      />
    </div>
  );
};
