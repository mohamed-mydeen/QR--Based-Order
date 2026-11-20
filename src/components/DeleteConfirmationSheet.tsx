import React from 'react';
import { Trash2 } from 'lucide-react';
import { CartItem } from '../types';
import { RESTAURANT_INFO } from '../data/mockData';
import { ConfirmationSheet } from './ConfirmationSheet';

export interface DeleteConfirmationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: string;
  item?: CartItem | null;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const DeleteConfirmationSheet: React.FC<DeleteConfirmationSheetProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Remove this item?',
  description,
  item,
  confirmLabel = 'Remove Item',
  cancelLabel = 'Cancel'
}) => {
  const displayDescription =
    description ||
    (item
      ? `Are you sure you want to remove ${item.menuItem.name} from your cart?`
      : 'All items will be removed from your table order.');

  const itemPreview = item ? (
    <div className="bg-white rounded-2xl border border-stone-200/80 p-3 flex items-center gap-3 shadow-2xs">
      <img
        src={item.menuItem.image}
        alt={item.menuItem.name}
        className="w-14 h-14 rounded-xl object-cover bg-stone-100 flex-shrink-0 border border-stone-100 shadow-2xs"
      />
      <div className="flex-1 min-w-0">
        <h4 className="font-serif font-bold text-sm text-stone-900 truncate">
          {item.menuItem.name}
        </h4>
        {item.selectedModifiers.length > 0 && (
          <p className="text-[11px] text-stone-500 truncate">
            {item.selectedModifiers.map((m) => m.optionName).join(', ')}
          </p>
        )}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-mono font-extrabold text-stone-900">
            {RESTAURANT_INFO.currency}{item.totalPrice}
          </span>
          <span className="text-[10px] text-stone-400 font-mono">
            ({item.quantity} {item.quantity === 1 ? 'portion' : 'portions'})
          </span>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <ConfirmationSheet
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      description={displayDescription}
      confirmLabel={confirmLabel}
      cancelLabel={cancelLabel}
      variant="destructive"
      icon={<Trash2 className="w-5 h-5" />}
      itemPreview={itemPreview}
    />
  );
};
