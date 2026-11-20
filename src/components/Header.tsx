import React, { useState } from 'react';
import { Search, User, LogOut, X, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';
import { ConfirmationSheet } from './ConfirmationSheet';
import { CategoryNav } from './CategoryNav';

interface HeaderProps {
  isJustRevealed?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isJustRevealed = false }) => {
  const {
    user,
    startAuthFlow,
    logoutUser,
    searchQuery,
    setSearchQuery,
    dietaryFilter,
    setDietaryFilter,
    orderHistory,
    setActiveView
  } = useApp();

  const [isSignOutConfirmOpen, setIsSignOutConfirmOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/70 transition-all ${
        isJustRevealed ? 'animate-header-reveal' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-900 text-amber-400 border border-stone-800/80 flex items-center justify-center font-serif font-black text-lg shadow-2xs select-none">
              <span>S</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif font-bold text-lg sm:text-xl text-stone-900 tracking-tight leading-none">
                  {RESTAURANT_INFO.name.split(' ')[0]}
                </h1>
              </div>
              <p className="text-[11px] text-stone-400 font-medium tracking-wide mt-0.5">
                Artisanal Asian Eatery
              </p>
            </div>
          </div>

          {/* Right Action Controls: Minimal & Professional */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Order History Page Button */}
            {orderHistory.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveView('orders')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer border border-stone-800 select-none"
                title="View your order history"
              >
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>Orders ({orderHistory.length})</span>
              </button>
            )}

            {/* Minimalist Profile Avatar (Initial only - No profile name text) */}
            {user?.isVerified ? (
              <button
                type="button"
                onClick={() => setIsSignOutConfirmOpen(true)}
                className="w-9 h-9 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-400 font-serif font-bold text-sm flex items-center justify-center border-2 border-white ring-1 ring-stone-200/80 shadow-xs transition-all active:scale-95 cursor-pointer"
                title="Signed in • Tap to sign out"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-stone-300" />}
              </button>
            ) : (
              <button
                onClick={() => startAuthFlow()}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar & Dietary Filter Row */}
        <div className="pb-3 pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Food Search Input with Smooth Focus Micro-Interaction & Perfectly Centered Icons */}
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-stone-400 group-focus-within:text-amber-600 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, drinks, chef specials..."
              className="w-full pl-9 pr-9 py-2 rounded-xl bg-stone-100/70 hover:bg-stone-100 focus:bg-white border border-stone-200/80 text-xs sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/25 focus:border-amber-500 transition-all duration-200 shadow-2xs focus:shadow-xs"
            />
            {searchQuery && (
              <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center">
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="w-5 h-5 rounded-full bg-stone-200/90 hover:bg-stone-300 active:scale-90 text-stone-600 hover:text-stone-900 flex items-center justify-center transition-all cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            )}
          </div>

          {/* Veg / Non-Veg Quick Dietary Segmented Control with Animated Transitions & Matching UI Icons */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl w-full sm:w-auto justify-between sm:justify-start border border-stone-200/70 select-none shadow-2xs">
            <button
              type="button"
              onClick={() => setDietaryFilter('all')}
              className={`flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 cursor-pointer ${
                dietaryFilter === 'all'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              All Dishes
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('veg')}
              className={`flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 cursor-pointer ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-stone-600 hover:text-emerald-700 hover:bg-emerald-50/60'
              }`}
            >
              <div className="w-3.5 h-3.5 border-[1.5px] border-emerald-500 rounded-xs flex items-center justify-center p-0.5 bg-white flex-shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              </div>
              <span>Veg Only</span>
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('non-veg')}
              className={`flex-1 sm:flex-initial text-center px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-95 cursor-pointer ${
                dietaryFilter === 'non-veg'
                  ? 'bg-red-700 text-white shadow-md shadow-red-700/20'
                  : 'text-stone-600 hover:text-red-800 hover:bg-red-50/60'
              }`}
            >
              <div className="w-3.5 h-3.5 border-[1.5px] border-red-700 rounded-xs flex items-center justify-center p-0.5 bg-white flex-shrink-0">
                <div className="w-0 h-0 border-l-[2.5px] border-l-transparent border-r-[2.5px] border-r-transparent border-b-[5px] border-b-red-700" />
              </div>
              <span>Non-Veg</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Category Navigation Pills integrated cleanly into the Sticky Header */}
      <CategoryNav />

      {/* iOS-Style Sign Out Confirmation Dialog (Centered Alert matching App Color) */}
      <ConfirmationSheet
        isOpen={isSignOutConfirmOpen}
        onClose={() => setIsSignOutConfirmOpen(false)}
        onConfirm={() => {
          logoutUser();
          setIsSignOutConfirmOpen(false);
        }}
        title="Sign out of table?"
        description={`You are currently dining as ${user?.name || 'Guest Diner'} (+91 ${user?.phone || '98765 43210'}). Signing out will end your dining session.`}
        confirmLabel="Sign Out"
        cancelLabel="Stay Signed In"
        variant="destructive"
        isCenterDialog={true}
        icon={<LogOut className="w-5 h-5 text-amber-400" />}
      />
    </header>
  );
};
