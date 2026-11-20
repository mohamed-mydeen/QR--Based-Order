import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Minus, Check, MessageSquare, Sparkles, Star } from 'lucide-react';
import { SelectedModifier } from '../types';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';

export const FoodCustomizationModal: React.FC = () => {
  const { activeCustomizingItem, closeCustomization, addToCart } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Preset cooking preference tags for fast 1-tap customization
  const quickTags = [
    'Less spicy',
    'No spring onions',
    'Extra sauce on side',
    'Well done & crispy',
    'Less oil',
    'Pack cutlery'
  ];

  // Initialize defaults when modal opens
  useEffect(() => {
    if (activeCustomizingItem) {
      const initial: Record<string, string[]> = {};
      if (activeCustomizingItem.modifierGroups) {
        activeCustomizingItem.modifierGroups.forEach(group => {
          const defaultOpts = group.options.filter(o => o.isDefault).map(o => o.id);
          if (defaultOpts.length > 0) {
            initial[group.id] = defaultOpts;
          } else if (group.required && group.options.length > 0) {
            initial[group.id] = [group.options[0].id];
          } else {
            initial[group.id] = [];
          }
        });
      }
      setSelectedOptions(initial);
      setQuantity(1);
      setSpecialInstructions('');
    }
  }, [activeCustomizingItem]);

  if (!activeCustomizingItem) return null;
  if (typeof document === 'undefined') return null;

  const item = activeCustomizingItem;
  const groups = item.modifierGroups || [];

  // Toggle or select option
  const handleOptionToggle = (group: { id: string; maxSelections?: number; required: boolean }, optionId: string) => {
    const isSingleChoice = (group.maxSelections || 1) === 1;

    setSelectedOptions(prev => {
      const currentSelected = prev[group.id] || [];

      if (isSingleChoice) {
        return {
          ...prev,
          [group.id]: [optionId]
        };
      } else {
        // Multi-select
        const exists = currentSelected.includes(optionId);
        let next: string[];
        if (exists) {
          next = currentSelected.filter(id => id !== optionId);
        } else {
          const max = group.maxSelections || 99;
          if (currentSelected.length >= max) {
            next = [...currentSelected.slice(1), optionId];
          } else {
            next = [...currentSelected, optionId];
          }
        }
        return {
          ...prev,
          [group.id]: next
        };
      }
    });
  };

  // Calculate dynamic unit price
  let additionalCost = 0;
  const flatSelectedModifiers: SelectedModifier[] = [];

  groups.forEach(group => {
    const selectedIds = selectedOptions[group.id] || [];
    group.options.forEach(option => {
      if (selectedIds.includes(option.id)) {
        additionalCost += option.price;
        flatSelectedModifiers.push({
          groupId: group.id,
          groupName: group.name,
          optionId: option.id,
          optionName: option.name,
          price: option.price
        });
      }
    });
  });

  const unitPrice = item.price + additionalCost;
  const totalPrice = unitPrice * quantity;

  // Validation: ensure all required groups have at least 1 selection
  const isFormValid = groups.every(group => {
    if (!group.required) return true;
    const selected = selectedOptions[group.id] || [];
    return selected.length > 0;
  });

  const handleAddToCart = () => {
    if (!isFormValid) return;
    addToCart(item, flatSelectedModifiers, specialInstructions.trim() || undefined, quantity);
    closeCustomization();
  };

  const toggleQuickTag = (tag: string) => {
    setSpecialInstructions(prev => {
      if (prev.includes(tag)) {
        return prev.replace(tag, '').replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '').trim();
      }
      return prev ? `${prev}, ${tag}` : tag;
    });
  };

  const modalContent = (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeCustomization();
        }
      }}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/65 backdrop-blur-xs overscroll-none animate-fade-in select-none"
    >
      {/* Modal / Bottom Sheet Container (Swiggy / Zomato style) */}
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[85vh] sm:max-h-[80vh] flex flex-col shadow-2xl border border-stone-200/80 animate-slide-up overflow-hidden">
        {/* Mobile Drag Indicator Pill */}
        <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mt-2 sm:hidden flex-shrink-0" />

        {/* Clean Header: Dish details on left, compact thumbnail and close button on right */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-start justify-between gap-3.5 bg-white flex-shrink-0">
          <div className="flex-1 min-w-0 pr-1">
            {/* Dietary & Badges */}
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              {/* Veg / Non-Veg Indicator */}
              <div className="p-0.5 rounded-sm flex items-center justify-center">
                {item.dietary === 'veg' || item.dietary === 'vegan' ? (
                  <div
                    className="w-3.5 h-3.5 border-[1.5px] border-emerald-600 rounded-xs flex items-center justify-center"
                    title="Vegetarian"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  </div>
                ) : item.dietary === 'egg' ? (
                  <div
                    className="w-3.5 h-3.5 border-[1.5px] border-amber-600 rounded-xs flex items-center justify-center"
                    title="Contains Egg"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                  </div>
                ) : (
                  <div
                    className="w-3.5 h-3.5 border-[1.5px] border-red-700 rounded-xs flex items-center justify-center"
                    title="Non-Vegetarian"
                  >
                    <div className="w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-b-[6px] border-b-red-700" />
                  </div>
                )}
              </div>

              {item.isChefSpecial && (
                <span className="px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 text-[10px] font-bold tracking-wide flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Chef's Special
                </span>
              )}

              {item.rating && (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded-md">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {item.rating}
                </span>
              )}
            </div>

            {/* Dish Name */}
            <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 leading-snug">
              {item.name}
            </h2>

            {/* Base Price */}
            <div className="text-sm sm:text-base font-bold font-mono text-stone-900 mt-0.5">
              {RESTAURANT_INFO.currency}{item.price}
            </div>

            {/* Description */}
            {item.description && (
              <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>

          {/* Right Image Thumbnail & Close Action */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={closeCustomization}
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-900 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {item.image && (
              <div className="relative w-20 h-20 sm:w-22 sm:h-22 rounded-2xl overflow-hidden border border-stone-200/80 shadow-2xs bg-stone-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-6">
          {groups.map(group => {
            const isSingleChoice = (group.maxSelections || 1) === 1;
            const currentSelected = selectedOptions[group.id] || [];

            return (
              <div key={group.id} className="border-b border-stone-100 pb-5 last:border-b-0">
                {/* Group Heading */}
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 tracking-tight">
                      {group.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {isSingleChoice ? 'Choose 1 option' : `Select up to ${group.maxSelections || 'multiple'} options`}
                    </p>
                  </div>
                  {group.required ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 shadow-2xs">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                      Optional
                    </span>
                  )}
                </div>

                {/* Swiggy/Zomato style clean list items (No bulky box cards) */}
                <div className="divide-y divide-stone-100/80">
                  {group.options.map(option => {
                    const isSelected = currentSelected.includes(option.id);

                    return (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => handleOptionToggle(group, option.id)}
                        className={`w-full py-3 px-2 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer select-none group ${
                          isSelected
                            ? 'bg-stone-50/80'
                            : 'hover:bg-stone-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Radio / Checkbox Indicator matching app stone/amber theme */}
                          {isSingleChoice ? (
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-stone-900 bg-white'
                                  : 'border-stone-300 group-hover:border-stone-400 bg-white'
                              }`}
                            >
                              {isSelected && <div className="w-2 h-2 rounded-full bg-stone-900" />}
                            </div>
                          ) : (
                            <div
                              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-stone-900 bg-stone-900 text-amber-300'
                                  : 'border-stone-300 group-hover:border-stone-400 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          )}

                          <span
                            className={`text-xs sm:text-sm transition-colors ${
                              isSelected ? 'text-stone-950 font-semibold' : 'text-stone-700 font-normal'
                            }`}
                          >
                            {option.name}
                          </span>
                        </div>

                        <span
                          className={`text-xs ${
                            option.price > 0
                              ? isSelected
                                ? 'font-mono font-bold text-stone-900'
                                : 'font-mono font-medium text-stone-600'
                              : 'text-stone-400 font-sans'
                          }`}
                        >
                          {option.price > 0 ? `+${RESTAURANT_INFO.currency}${option.price}` : 'Free'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Quick Cooking Notes & Special Instructions */}
          <div className="pt-1">
            <div className="flex items-center gap-1.5 mb-2.5 text-stone-900 font-bold text-xs sm:text-sm">
              <MessageSquare className="w-4 h-4 text-stone-700" />
              <span>Special Cooking Notes</span>
            </div>

            {/* Quick Tag Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {quickTags.map(tag => {
                const isActive = specialInstructions.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleQuickTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-stone-900 text-amber-300 shadow-2xs'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                    }`}
                  >
                    + {tag}
                  </button>
                );
              })}
            </div>

            <textarea
              rows={2}
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              placeholder="e.g. Allergies, less salt, extra crispy, sauce separately..."
              className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 resize-none bg-stone-50/70"
            />
          </div>
        </div>

        {/* Sticky Dynamic Pricing & Add to Cart Footer (Swiggy / Zomato style) */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200/80 flex items-center justify-between gap-3 flex-shrink-0 shadow-lg">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1 border border-stone-200/80">
            <button
              type="button"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors active:scale-95 shadow-2xs cursor-pointer"
              title="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-bold font-mono text-sm text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors active:scale-95 shadow-2xs cursor-pointer"
              title="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dynamic Add to Cart CTA Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isFormValid}
            className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-between transition-all active:scale-[0.99] shadow-md select-none ${
              isFormValid
                ? 'bg-stone-900 hover:bg-stone-800 text-white cursor-pointer'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>{isFormValid ? 'Add Item to Order' : 'Select Required Options'}</span>
            <span className={`font-mono text-base font-extrabold ${isFormValid ? 'text-amber-300' : 'text-stone-400'}`}>
              {RESTAURANT_INFO.currency}{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
