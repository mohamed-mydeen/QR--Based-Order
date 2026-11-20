import React, { useState } from 'react';
import { QrCode, UtensilsCrossed, Check, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TableModal: React.FC = () => {
  const { tableNumber, setTableNumber, isTableModalOpen, setIsTableModalOpen, showToast } = useApp();
  const [customTable, setCustomTable] = useState('');

  if (!isTableModalOpen) return null;

  const quickTables = [
    'Table 01', 'Table 02', 'Table 03', 'Table 04',
    'Table 05', 'Table 06', 'Table 07', 'Table 08',
    'Outdoor 01', 'Outdoor 02', 'Private Dining 1'
  ];

  const handleSelect = (t: string) => {
    setTableNumber(t);
    showToast(`Switched to ${t}`);
    setIsTableModalOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTable.trim()) {
      const formatted = customTable.toUpperCase().startsWith('T-')
        ? customTable.toUpperCase()
        : `Table ${customTable.replace(/^table\s*/i, '')}`;
      handleSelect(formatted);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 animate-slide-up relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsTableModalOpen(false)}
          className="absolute right-4 top-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* QR & Table Identification Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-stone-900 border border-stone-800 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-sm">
            <QrCode className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif font-bold text-stone-900">
            Table Identification
          </h2>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            You scanned a QR code or are dining in. Orders placed will be delivered straight to this table.
          </p>
          <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-900 text-xs font-semibold">
            <UtensilsCrossed className="w-3.5 h-3.5 text-stone-700" />
            Current Location: <span className="font-bold underline text-amber-600">{tableNumber}</span>
          </div>
        </div>

        {/* Quick Table Switch Grid */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-stone-600 mb-2 uppercase tracking-wider">
            Select Dining Table
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {quickTables.map((t) => {
              const isSelected = t === tableNumber;
              return (
                <button
                  key={t}
                  onClick={() => handleSelect(t)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-medium transition-all text-center flex flex-col items-center justify-center gap-1 border ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  <span className="truncate w-full">{t}</span>
                  {isSelected && <Check className="w-3 h-3 text-amber-300" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual Table Input */}
        <form onSubmit={handleCustomSubmit} className="pt-3 border-t border-stone-100">
          <label className="block text-xs font-medium text-stone-500 mb-1.5">
            Or enter custom table / booth number:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customTable}
              onChange={(e) => setCustomTable(e.target.value)}
              placeholder="e.g. 14, B-03, Rooftop-2"
              className="flex-1 px-3.5 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Update
            </button>
          </div>
        </form>

        <p className="text-[11px] text-stone-400 text-center mt-4 flex items-center justify-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          Table number is automatically embedded on each scanned QR stand.
        </p>
      </div>
    </div>
  );
};
