import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle } from 'lucide-react';

export interface ConfirmationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'destructive' | 'warning' | 'primary' | 'neutral';
  icon?: React.ReactNode;
  itemPreview?: React.ReactNode;
  isCenterDialog?: boolean;
}

export const ConfirmationSheet: React.FC<ConfirmationSheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  icon,
  itemPreview,
  isCenterDialog = false
}) => {
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [dragTranslateY, setDragTranslateY] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Keyboard accessibility: Escape key dismisses sheet
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        handleDismiss();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing]);

  // Reset state whenever opened
  useEffect(() => {
    if (isOpen) {
      setDragTranslateY(0);
      setIsClosing(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;
  if (typeof document === 'undefined') return null;

  const handleDismiss = () => {
    if (isProcessing) return;
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setDragTranslateY(0);
      onClose();
    }, 220);
  };

  const handleConfirmAction = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      // Brief feedback delay to prevent double-clicks
      await new Promise((r) => setTimeout(r, 280));
      await onConfirm();
    } finally {
      setIsProcessing(false);
      onClose();
    }
  };

  // Mobile Swipe-Down Gesture Handlers (for bottom-sheet mode)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isProcessing || isCenterDialog) return;
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null || isProcessing || isCenterDialog) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;
    if (deltaY > 0) {
      setDragTranslateY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (isCenterDialog) return;
    if (dragTranslateY > 75) {
      handleDismiss();
    } else {
      setDragTranslateY(0);
    }
    setTouchStartY(null);
  };

  // Dynamic Button Color matching app palette (Charcoal, Amber-400, Warm Terracotta)
  const getConfirmButtonClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-stone-900 hover:bg-stone-800 text-amber-400 border border-stone-800 shadow-md shadow-stone-900/25';
      case 'warning':
        return 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-md shadow-amber-500/20';
      case 'primary':
        return 'bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20';
      case 'neutral':
      default:
        return 'bg-stone-900 hover:bg-stone-800 text-white shadow-md shadow-stone-900/15';
    }
  };

  const getIconBackgroundClasses = () => {
    switch (variant) {
      case 'destructive':
        return 'bg-stone-900 text-amber-400 border border-stone-800';
      case 'warning':
        return 'bg-amber-50 text-amber-700 border border-amber-200/60';
      case 'primary':
        return 'bg-orange-50 text-orange-600 border border-orange-200/60';
      case 'neutral':
      default:
        return 'bg-stone-100 text-stone-800 border border-stone-200';
    }
  };

  const modalContent = (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden flex justify-center ${
        isCenterDialog
          ? 'items-center p-4 sm:p-6'
          : 'items-end md:items-center p-0 md:p-4'
      }`}
    >
      {/* Background Dim & Blur Overlay */}
      <div
        onClick={handleDismiss}
        className={`fixed inset-0 bg-stone-950/65 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* iOS Dialog Card (Centered Alert or Bottom Action Sheet) */}
      <div
        ref={sheetRef}
        {...(!isCenterDialog
          ? {
              onTouchStart: handleTouchStart,
              onTouchMove: handleTouchMove,
              onTouchEnd: handleTouchEnd
            }
          : {})}
        style={
          isCenterDialog
            ? {
                transition: 'opacity 0.2s ease-out, transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isClosing ? 'scale(0.95)' : 'scale(1)',
                opacity: isClosing ? 0 : 1
              }
            : {
                transform:
                  dragTranslateY > 0
                    ? `translateY(${dragTranslateY}px)`
                    : isClosing
                    ? 'translateY(100%)'
                    : 'translateY(0)',
                transition:
                  dragTranslateY > 0
                    ? 'none'
                    : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease-out'
              }
        }
        className={`relative w-full ${
          isCenterDialog
            ? 'max-w-sm bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-200/90 p-5 sm:p-6 space-y-4 animate-pop-in select-none'
            : 'md:max-w-md bg-[#FAF8F5] rounded-t-[32px] sm:rounded-t-[36px] md:rounded-[32px] shadow-2xl border-t md:border border-stone-200/90 p-5 sm:p-6 space-y-4 animate-slide-up select-none'
        } ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* iOS Drag Handle (Only visible on bottom sheet mode on mobile) */}
        {!isCenterDialog && (
          <div className="w-10 h-1.5 rounded-full bg-stone-300 mx-auto -mt-1 mb-3 cursor-grab active:cursor-grabbing md:hidden" />
        )}

        {/* Header Icon, Title & Contextual Description */}
        <div className="text-center space-y-2">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto shadow-2xs ${getIconBackgroundClasses()}`}
          >
            {icon || <AlertTriangle className="w-5 h-5" />}
          </div>
          <h3 className="font-serif font-bold text-lg sm:text-xl text-stone-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 max-w-xs mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {/* Optional Custom Item Preview */}
        {itemPreview && <div>{itemPreview}</div>}

        {/* Action Buttons: Cancel vs Confirm */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleDismiss}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl sm:rounded-2xl bg-stone-100 hover:bg-stone-200 active:scale-[0.98] text-stone-700 border border-stone-200/80 font-semibold text-xs sm:text-sm transition-all cursor-pointer select-none"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={handleConfirmAction}
            disabled={isProcessing}
            className={`w-full py-3 px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm active:scale-[0.98] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-75 select-none ${getConfirmButtonClasses()}`}
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <span>{confirmLabel}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
