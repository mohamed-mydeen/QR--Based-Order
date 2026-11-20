import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, Utensils } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';
import { CartItem } from '../types';
import { DeleteConfirmationSheet } from './DeleteConfirmationSheet';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartSummary,
    setIsCheckoutOpen,
    startAuthFlow,
    user
  } = useApp();

  // Confirmation state for deleting an item
  const [itemToDelete, setItemToDelete] = useState<CartItem | null>(null);
  // Confirmation state for clearing all items
  const [isClearAllConfirmOpen, setIsClearAllConfirmOpen] = useState(false);

  if (!isCartOpen) return null;

  const handleProceedCheckout = () => {
    if (!user?.isVerified) {
      startAuthFlow(() => {
        setIsCartOpen(false);
        setIsCheckoutOpen(true);
      });
    } else {
      setIsCartOpen(false);
      setIsCheckoutOpen(true);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end">
        {/* Click outside backdrop */}
        <div className="flex-1" onClick={() => setIsCartOpen(false)} />

        {/* Immediate View Order Drawer Container (Instant navigation without slow slide/fade transitions) */}
        <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-stone-200">
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 bg-white flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
                Your Order
              </h2>
              <p className="text-xs text-stone-500 font-medium mt-0.5">
                {cartSummary.count} {cartSummary.count === 1 ? 'dish' : 'dishes'} ready for kitchen
              </p>
            </div>

            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsClearAllConfirmOpen(true)}
                  className="text-xs font-semibold text-stone-500 hover:text-red-600 transition-colors px-2 py-1 cursor-pointer"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors cursor-pointer"
                title="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-white border border-stone-200 text-stone-400 flex items-center justify-center mx-auto shadow-sm">
                  <Utensils className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Your table order is empty
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Explore our signature dishes, dim sums, and drinks to add items to your table feast.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 px-5 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
                >
                  Browse Menu
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-4 rounded-2xl sm:rounded-3xl border border-stone-200/90 bg-white hover:border-stone-300 transition-all shadow-sm space-y-3"
                >
                  {/* Top: Thumbnail, Title, Price, Delete */}
                  <div className="flex items-start gap-3">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-20 h-20 rounded-2xl object-cover flex-shrink-0 bg-stone-100 border border-stone-100 shadow-2xs"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-snug line-clamp-2">
                          {item.menuItem.name}
                        </h4>

                        <button
                          type="button"
                          onClick={() => setItemToDelete(item)}
                          className="text-stone-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs font-mono font-semibold text-stone-500 mt-1">
                        {RESTAURANT_INFO.currency}{item.unitPrice} each
                      </div>
                    </div>
                  </div>

                  {/* Selected Modifiers & Add-ons (High Contrast & Clear) */}
                  {item.selectedModifiers.length > 0 && (
                    <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-xl p-2.5 space-y-1">
                      {item.selectedModifiers.map((mod) => (
                        <div key={mod.optionId} className="flex items-center justify-between text-xs text-stone-800">
                          <span className="font-medium flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                            <span className="truncate">{mod.optionName}</span>
                          </span>
                          {mod.price > 0 && (
                            <span className="font-mono font-bold text-stone-900 ml-2">
                              +{RESTAURANT_INFO.currency}{mod.price}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Special Instructions Note */}
                  {item.specialInstructions && (
                    <div className="text-xs text-amber-950 bg-amber-50 border border-amber-200/70 rounded-xl px-2.5 py-1.5 font-medium leading-relaxed">
                      <strong className="text-amber-900 font-bold">Kitchen Request:</strong> "{item.specialInstructions}"
                    </div>
                  )}

                  {/* Bottom: Stepper and Item Subtotal */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                    <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1 border border-stone-200/60">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity === 1) {
                            setItemToDelete(item);
                          } else {
                            updateQuantity(item.cartItemId, -1);
                          }
                        }}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center transition-colors active:scale-95 shadow-2xs cursor-pointer"
                        title={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-7 text-center font-mono font-extrabold text-sm text-stone-950">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="w-7 h-7 rounded-lg bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center transition-colors active:scale-95 shadow-2xs cursor-pointer"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block font-medium uppercase tracking-wider">Item Total</span>
                      <span className="font-mono font-extrabold text-base sm:text-lg text-stone-950">
                        {RESTAURANT_INFO.currency}{item.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer: Clean Transparent Bill & Checkout CTA (No Coupon, No GST) */}
          {cart.length > 0 && (
            <div className="border-t border-stone-200 p-4 sm:p-5 bg-white space-y-4 shadow-lg">
              {/* Clean Bill Breakdown */}
              <div className="space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between items-center text-stone-600">
                  <span className="font-medium">Items Subtotal ({cartSummary.count} {cartSummary.count === 1 ? 'dish' : 'dishes'})</span>
                  <span className="font-mono font-bold text-stone-900 text-base">
                    {RESTAURANT_INFO.currency}{cartSummary.subtotal}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-stone-500">
                  <span>Table Service & Taxes</span>
                  <span className="font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70">
                    Inclusive • No Extra Fees
                  </span>
                </div>
                <div className="border-t border-stone-200 pt-3 flex justify-between items-center">
                  <div>
                    <span className="font-serif font-bold text-lg sm:text-xl text-stone-900 block leading-tight">
                      To Pay
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium">Inclusive of all taxes</span>
                  </div>
                  <span className="font-mono font-black text-2xl sm:text-3xl text-stone-950">
                    {RESTAURANT_INFO.currency}{cartSummary.total}
                  </span>
                </div>
              </div>

              {/* Checkout Action Button matching consistent Charcoal & Gold Amber theme */}
              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full py-4 px-5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm sm:text-base shadow-lg shadow-stone-950/20 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer border border-stone-800"
              >
                <div className="flex items-center gap-2">
                  <span>Proceed to Checkout</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono font-extrabold text-amber-300">
                  <span>{RESTAURANT_INFO.currency}{cartSummary.total}</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Premium iOS-Style Delete Confirmation Bottom Sheet */}
      <DeleteConfirmationSheet
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={() => {
          if (itemToDelete) {
            removeFromCart(itemToDelete.cartItemId);
            setItemToDelete(null);
          }
        }}
        title="Remove this item?"
        description={
          itemToDelete
            ? `Are you sure you want to remove ${itemToDelete.menuItem.name} from your cart?`
            : undefined
        }
        item={itemToDelete}
        confirmLabel="Remove Item"
        cancelLabel="Cancel"
      />

      {/* iOS-Style Confirmation Sheet: Clear All Order */}
      <DeleteConfirmationSheet
        isOpen={isClearAllConfirmOpen}
        onClose={() => setIsClearAllConfirmOpen(false)}
        onConfirm={() => {
          clearCart();
          setIsClearAllConfirmOpen(false);
        }}
        title="Clear entire order?"
        description={`Are you sure you want to remove all ${cartSummary.count} dishes from your table order?`}
        confirmLabel="Clear All"
        cancelLabel="Cancel"
      />
    </>
  );
};
