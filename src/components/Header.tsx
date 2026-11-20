import React, { useState } from 'react';
import { Search, User, LogOut, X, Receipt } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RESTAURANT_INFO } from '../data/mockData';
import { ConfirmationSheet } from './ConfirmationSheet';

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
    activeOrder,
    setIsTrackerOpen
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
            {/* View Placed Order Option */}
            {activeOrder && (
              <button
                type="button"
                onClick={() => setIsTrackerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer border border-stone-800 select-none"
                title="View your placed order details"
              >
                <Receipt className="w-3.5 h-3.5 text-amber-300" />
                <span>View Order</span>
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

          {/* Veg / Non-Veg Quick Dietary Segmented Control with Smooth Tactile Feedback */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl self-start sm:self-auto border border-stone-200/70 select-none">
            <button
              type="button"
              onClick={() => setDietaryFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                dietaryFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs scale-105'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              All Dishes
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                dietaryFilter === 'veg'
                  ? 'bg-emerald-600 text-white shadow-xs scale-105'
                  : 'text-stone-600 hover:text-emerald-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-300 ring-2 ring-emerald-500"></span>
              Veg Only
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('non-veg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${
                dietaryFilter === 'non-veg'
                  ? 'bg-amber-800 text-white shadow-xs scale-105'
                  : 'text-stone-600 hover:text-amber-900'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-300 ring-2 ring-amber-600"></span>
              Non-Veg
            </button>
          </div>
        </div>
      </div>

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
