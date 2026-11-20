import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Minus, Check, MessageSquare, Sparkles } from 'lucide-react';
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
            // Replace first or ignore
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      {/* Modal Container */}
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[90vh] sm:max-h-[85vh] flex flex-col shadow-2xl border border-stone-200/80 animate-slide-up overflow-hidden">
        {/* Sticky Header with image banner */}
        <div className="relative h-44 sm:h-52 bg-stone-100 flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-stone-900/20 to-transparent" />

          {/* Close Button */}
          <button
            onClick={closeCustomization}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white flex items-center justify-center backdrop-blur-xs transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dish Title Overlay */}
          <div className="absolute bottom-3 left-4 right-4 text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              {item.dietary === 'veg' ? (
                <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                  Pure Veg
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-md bg-red-700/90 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-xs">
                  Non-Veg
                </span>
              )}
              {item.isChefSpecial && (
                <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-[10px] font-bold text-stone-900 uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> Chef Signature
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif leading-tight">
              {item.name}
            </h2>
            <p className="text-xs text-stone-200 line-clamp-2 mt-0.5 font-light">
              {item.description}
            </p>
          </div>
        </div>

        {/* Scrollable Customization Groups (Reference 2 UX principles) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {groups.map(group => {
            const isSingleChoice = (group.maxSelections || 1) === 1;
            const currentSelected = selectedOptions[group.id] || [];

            return (
              <div key={group.id} className="border-b border-stone-100 pb-5 last:border-b-0">
                <div className="flex items-center justify-between mb-2.5">
                  <div>
                    <h3 className="font-bold text-sm text-stone-900">
                      {group.name}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {isSingleChoice ? 'Choose 1 option' : `Select up to ${group.maxSelections || 'multiple'}`}
                    </p>
                  </div>
                  {group.required ? (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                      Required
                    </span>
                  ) : (
                    <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">
                      Optional
                    </span>
                  )}
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  {group.options.map(option => {
                    const isSelected = currentSelected.includes(option.id);

                    return (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => handleOptionToggle(group, option.id)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-orange-50/60 border-orange-500/80 text-stone-900 shadow-2xs'
                            : 'bg-stone-50/60 hover:bg-stone-100/80 border-stone-200/80 text-stone-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Radio / Checkbox Indicator */}
                          <div
                            className={`w-4 h-4 rounded-${isSingleChoice ? 'full' : 'md'} border flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-orange-600 border-orange-600 text-white'
                                : 'border-stone-400 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </div>
                          <span className="text-xs sm:text-sm font-medium">
                            {option.name}
                          </span>
                        </div>

                        <span className="text-xs font-semibold text-stone-800">
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
            <div className="flex items-center gap-1.5 mb-2 text-stone-900 font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-orange-600" />
              <span>Special Cooking Notes</span>
            </div>

            {/* Quick Tag Pills */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {quickTags.map(tag => {
                const isActive = specialInstructions.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleQuickTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                      isActive
                        ? 'bg-stone-900 text-white'
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
              className="w-full p-3 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 resize-none bg-stone-50"
            />
          </div>
        </div>

        {/* Sticky Dynamic Pricing & Add to Cart Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200 flex items-center justify-between gap-3 flex-shrink-0">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-1 bg-stone-100 rounded-xl p-1 border border-stone-200">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors active:scale-95 shadow-2xs"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-bold font-mono text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-lg bg-white hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors active:scale-95 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Dynamic Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={!isFormValid}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-between transition-all active:scale-[0.99] shadow-sm ${
              isFormValid
                ? 'bg-orange-600 hover:bg-orange-700 text-white'
                : 'bg-stone-200 text-stone-400 cursor-not-allowed'
            }`}
          >
            <span>{isFormValid ? 'Add to Cart' : 'Select Required'}</span>
            <span className="font-mono text-base font-extrabold">
              {RESTAURANT_INFO.currency}{totalPrice}
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
