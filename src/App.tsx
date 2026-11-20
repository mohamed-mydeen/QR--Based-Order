import React, { useMemo, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { FoodCard } from './components/FoodCard';
import { FoodCustomizationModal } from './components/FoodCustomizationModal';
import { BottomCartBar } from './components/BottomCartBar';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TableModal } from './components/TableModal';
import { AuthModal } from './components/AuthModal';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DesktopSidebarCart } from './components/DesktopSidebarCart';
import { MENU_ITEMS, RESTAURANT_INFO } from './data/mockData';
import { Search, CheckCircle, ChevronDown } from 'lucide-react';

interface MainMenuContentProps {
  isJustRevealed?: boolean;
}

const MainMenuContent: React.FC<MainMenuContentProps> = ({ isJustRevealed = false }) => {
  const {
    selectedCategory,
    searchQuery,
    dietaryFilter,
    tableNumber,
    toastMessage,
    user,
    pendingUserName,
    setIsTableModalOpen
  } = useApp();
  const displayName = user?.name || pendingUserName;

  // Filter items by category, search query, and dietary selection
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // Category filter
      if (selectedCategory === 'bestsellers' && !item.isPopular && !item.isChefSpecial) {
        return false;
      }
      if (
        selectedCategory !== 'all' &&
        selectedCategory !== 'bestsellers' &&
        item.categoryId !== selectedCategory
      ) {
        return false;
      }

      // Dietary filter
      if (dietaryFilter === 'veg' && item.dietary !== 'veg' && item.dietary !== 'vegan') {
        return false;
      }
      if (dietaryFilter === 'non-veg' && item.dietary !== 'non-veg' && item.dietary !== 'egg') {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesCategory = item.categoryId.toLowerCase().includes(query);
        return matchesName || matchesDesc || matchesCategory;
      }

      return true;
    });
  }, [selectedCategory, searchQuery, dietaryFilter]);

  return (
    <div className="min-h-screen pb-28 lg:pb-16 flex flex-col justify-between">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 left-4 sm:left-auto sm:right-6 z-50 max-w-sm mx-auto bg-stone-900 text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-float border border-stone-700 flex items-center gap-2.5 animate-slide-up">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}

      {/* Top Header with entrance animation */}
      <Header isJustRevealed={isJustRevealed} />

      {/* Welcome Table Banner with Personalized Customer Greeting */}
      <div className={`bg-gradient-to-b from-[#FAF8F5] to-white border-b border-stone-200/60 py-4 sm:py-6 transition-all ${
        isJustRevealed ? 'animate-banner-reveal' : ''
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#1C1917] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-orange-600/10 blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-orange-600 text-[10px] font-bold uppercase tracking-wider text-white">
                  Table-Side QR Active
                </span>
                <button
                  type="button"
                  onClick={() => setIsTableModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-800/80 hover:bg-stone-800 text-amber-400 text-xs font-mono font-bold border border-stone-700/60 transition-all cursor-pointer"
                  title="View or change table"
                >
                  <span>{tableNumber}</span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>
                {displayName && (
                  <span className="text-stone-300 text-xs hidden sm:inline">• Dining as <strong className="text-white">{displayName}</strong></span>
                )}
              </div>
              <h2 className="font-serif font-bold text-lg sm:text-2xl tracking-tight text-white">
                {displayName ? `Welcome, ${displayName.split(' ')[0]}!` : 'Welcome!'} Freshly Handcrafted to {tableNumber}
              </h2>
              <p className="text-xs text-stone-300 max-w-xl font-light leading-relaxed">
                Choose dishes, customize spices & portion sizes, and order instantly. No waiting for physical menus or payment machines.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-start border-t sm:border-t-0 border-stone-800 pt-3 sm:pt-0">
              <div className="text-left sm:text-right">
                <span className="text-[10px] text-stone-400 block font-medium">Kitchen Status</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 sm:justify-end">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live & Cooking
                </span>
              </div>
              <div className="h-7 w-px bg-stone-800 hidden sm:block" />
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block font-medium">Table Service</span>
                <span className="text-xs font-bold text-stone-200">Express 15m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Navigation Sticky Bar */}
      <div className={isJustRevealed ? 'animate-stagger-1' : ''}>
        <CategoryNav />
      </div>

      {/* Main Content Layout (Responsive: Grid on left + Desktop Sidebar Cart on right) */}
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 flex-1 w-full ${
        isJustRevealed ? 'animate-stagger-2' : ''
      }`}>
        <div className="flex items-start gap-8">
          {/* Menu Items Section */}
          <div className="flex-1 min-w-0">
            {/* Section Header & Count */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold font-serif text-stone-900 capitalize">
                  {selectedCategory === 'all'
                    ? 'All Dishes'
                    : selectedCategory === 'bestsellers'
                    ? 'Chef Recommended Specials'
                    : selectedCategory.replace('-', ' ')}
                </h2>
                <p className="text-xs text-stone-500">
                  Showing {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
                  {dietaryFilter !== 'all' && ` (${dietaryFilter.toUpperCase()})`}
                </p>
              </div>

              {dietaryFilter !== 'all' && (
                <span className="text-xs text-orange-700 bg-orange-50 px-2.5 py-1 rounded-full font-semibold border border-orange-200">
                  Filtered: {dietaryFilter}
                </span>
              )}
            </div>

            {/* Food Grid: Compact 2-column mobile layout, expands gracefully on tablet & desktop */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/80 p-8 space-y-3 animate-fade-in shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto animate-empty-float">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-800">
                  No dishes found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  We couldn't find matches for "{searchQuery}". Try searching for dumplings, noodles, drinks, or reset dietary filters.
                </p>
              </div>
            ) : (
              <div
                key={`${selectedCategory}-${dietaryFilter}-${searchQuery ? 'search' : 'all'}`}
                className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-5"
              >
                {filteredItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-card-cascade"
                    style={{ animationDelay: `${Math.min(index * 35, 280)}ms` }}
                  >
                    <FoodCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Side-by-Side Cart (Widescreen layout enhancement) */}
          <DesktopSidebarCart />
        </div>
      </main>

      {/* Floating Bottom Cart Bar for Mobile View */}
      <BottomCartBar />

      {/* Global Modals & Drawers */}
      <FoodCustomizationModal />
      <CartDrawer />
      <CheckoutModal />
      <TableModal />

      {/* Minimal Footer */}
      <footer className="mt-12 border-t border-stone-200/80 bg-white py-6 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">{RESTAURANT_INFO.name}</span>
            <span>•</span>
            <span>{RESTAURANT_INFO.address}</span>
          </div>
          <div>
            Self-Order Platform • Powered by Antigravity
          </div>
        </div>
      </footer>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isAuthOpen, setIsAuthOpen } = useApp();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selarasa_onboarding_completed') === 'true';
    }
    return false;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // 1. Show Onboarding for first-time visitors before login
  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={() => setHasCompletedOnboarding(true)} />;
  }

  // 2. Both unauthenticated (with overlay) and authenticated states render MainMenuContent
  // as the primed foundation in DOM. This eliminates any blank screen flash, DOM reconstruction lag,
  // or layout shifts. When OTP verification succeeds, the AuthModal overlay scales down and fades away,
  // revealing the expanding restaurant home page underneath.
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAF8F5]">
      {/* Expanding Restaurant Home Page (Reveals with staggered entrance when transitioning) */}
      <div className={isTransitioning ? 'animate-home-expand' : ''}>
        <MainMenuContent isJustRevealed={isTransitioning} />
      </div>

      {/* Auth Modal Screen / Seamless Transition Overlay */}
      {((!user?.isVerified && isAuthOpen) || isTransitioning) && (
        <div
          className={`fixed inset-0 z-50 overflow-y-auto transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <AuthModal
            isFadingOut={isTransitioning}
            onClose={() => setIsAuthOpen(false)}
            onSuccessTransition={() => {
              setIsTransitioning(true);
              setIsAuthOpen(false);
              setTimeout(() => {
                setIsTransitioning(false);
              }, 1200);
            }}
          />
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;

