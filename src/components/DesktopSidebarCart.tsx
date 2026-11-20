import React, { useState } from 'react';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Utensils } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';
import { CartItem } from '../types';
import { DeleteConfirmationSheet } from './DeleteConfirmationSheet';

export const DesktopSidebarCart: React.FC = () => {
  const {
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

  const handleProceedCheckout = () => {
    if (!user?.isVerified) {
      startAuthFlow(() => {
        setIsCheckoutOpen(true);
      });
    } else {
      setIsCheckoutOpen(true);
    }
  };

  return (
    <>
      <div className="hidden lg:block w-80 xl:w-96 flex-shrink-0">
        <div className="sticky top-[180px] bg-white rounded-3xl border border-stone-200/90 shadow-soft overflow-hidden flex flex-col max-h-[calc(100vh-210px)]">
          {/* Top Header */}
          <div className="p-4 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center font-bold text-xs shadow-2xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm text-stone-900">
                  Your Order
                </h3>
                <p className="text-[11px] text-stone-500 font-medium">
                  {cartSummary.count} {cartSummary.count === 1 ? 'dish' : 'dishes'}
                </p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => setIsClearAllConfirmOpen(true)}
                className="text-xs font-semibold text-stone-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Scrollable Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-2.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 text-stone-400 flex items-center justify-center mx-auto shadow-2xs">
                  <Utensils className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-stone-800">
                  Your table order is empty
                </p>
                <p className="text-[11px] text-stone-500 max-w-xs mx-auto leading-relaxed">
                  Add delicious dishes from the menu to build your table feast.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="p-3.5 rounded-2xl border border-stone-200/90 bg-white hover:border-stone-300 transition-all shadow-2xs space-y-2.5 animate-item-in"
                >
                  <div className="flex items-start gap-2.5">
                    <img
                      src={item.menuItem.image}
                      alt={item.menuItem.name}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0 bg-stone-100 border border-stone-100 shadow-2xs"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-serif font-bold text-stone-900 truncate text-xs sm:text-sm">
                          {item.menuItem.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => setItemToDelete(item)}
                          className="text-stone-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[11px] font-mono font-semibold text-stone-500">
                        {RESTAURANT_INFO.currency}{item.unitPrice} each
                      </span>
                    </div>
                  </div>

                  {item.selectedModifiers.length > 0 && (
                    <div className="bg-[#FAF8F5] border border-stone-200/70 rounded-lg p-2 space-y-0.5 text-[11px] text-stone-700">
                      {item.selectedModifiers.map(m => (
                        <div key={m.optionId} className="flex justify-between items-center">
                          <span className="truncate">• {m.optionName}</span>
                          {m.price > 0 && (
                            <span className="font-mono font-bold text-stone-900 ml-1">
                              +{RESTAURANT_INFO.currency}{m.price}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1.5 border-t border-stone-100">
                    <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5 border border-stone-200/60">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity === 1) {
                            setItemToDelete(item);
                          } else {
                            updateQuantity(item.cartItemId, -1);
                          }
                        }}
                        className="w-5 h-5 rounded bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center text-xs transition-transform active:scale-75 shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" />
                      </button>
                      <span
                        key={item.quantity}
                        className="w-5 text-center font-bold font-mono text-xs text-stone-950 animate-number-pop"
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.cartItemId, 1)}
                        className="w-5 h-5 rounded bg-white hover:bg-stone-200 text-stone-800 flex items-center justify-center text-xs transition-transform active:scale-75 shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <span
                      key={item.totalPrice}
                      className="font-extrabold font-mono text-sm text-stone-950 animate-number-pop"
                    >
                      {RESTAURANT_INFO.currency}{item.totalPrice}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bill Breakdown & CTA (No Coupon, No GST) */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-stone-200 bg-white space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span className="font-medium">Items Subtotal</span>
                  <span className="font-mono font-bold text-stone-900">
                    {RESTAURANT_INFO.currency}{cartSummary.subtotal}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>Table Service & Taxes</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                    Inclusive
                  </span>
                </div>
                <div className="flex justify-between font-serif font-bold text-stone-900 text-base border-t border-stone-200 pt-2 mt-1">
                  <span>To Pay</span>
                  <span className="font-mono font-black text-lg text-stone-950">
                    {RESTAURANT_INFO.currency}{cartSummary.total}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceedCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-md flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer border border-stone-800"
              >
                <span>Proceed to Checkout</span>
                <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
                  <span>{RESTAURANT_INFO.currency}{cartSummary.total}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* iOS-Style Delete Confirmation Modal / Sheet */}
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
