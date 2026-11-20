import React, { useMemo, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { FoodCard } from './components/FoodCard';
import { FoodCustomizationModal } from './components/FoodCustomizationModal';
import { BottomCartBar } from './components/BottomCartBar';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracker } from './components/OrderTracker';
import { OrderHistoryModal } from './components/OrderHistoryModal';
import { OrderHistoryPage } from './components/OrderHistoryPage';
import { AuthModal } from './components/AuthModal';
import { DesktopSidebarCart } from './components/DesktopSidebarCart';
import { MENU_ITEMS, RESTAURANT_INFO } from './data/mockData';
import { Search, CheckCircle } from 'lucide-react';

const MainMenuContent: React.FC = () => {
  const {
    selectedCategory,
    searchQuery,
    dietaryFilter,
    toastMessage,
    user,
    pendingUserName
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

      {/* Top Header */}
      <Header />

      {/* Compact Table Banner with Appetizing Food Visual (Simple, Professional, Small Size) */}
      <div className="bg-gradient-to-b from-[#FAF8F5] to-white border-b border-stone-200/60 py-2 sm:py-3 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-900 text-white rounded-2xl p-3 sm:p-4 shadow-sm relative overflow-hidden border border-stone-800 flex items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {displayName ? (
                  <span className="text-[11px] text-stone-300 truncate">
                    Welcome, <strong className="text-white font-semibold">{displayName.split(' ')[0]}</strong>
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-300/90 font-medium">
                    Artisanal Asian Eatery
                  </span>
                )}
              </div>

              <h2 className="font-serif font-bold text-sm sm:text-base tracking-tight text-white leading-tight">
                Handcrafted Flavors • Freshly Prepared
              </h2>
              <p className="text-[11px] sm:text-xs text-stone-400 font-light truncate">
                Order chef specials & artisan drinks directly
              </p>
            </div>

            {/* Food Image */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden border border-stone-700/80 shadow-md flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=300&q=80"
                alt="Featured Food"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout (Responsive: Grid on left + Desktop Sidebar Cart on right) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 flex-1 w-full">
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
                </p>
              </div>
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
      <OrderTracker />
      <OrderHistoryModal />

      {/* Minimal Footer */}
      <footer className="mt-12 border-t border-stone-200/80 bg-white py-6 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800">{RESTAURANT_INFO.name}</span>
            <span>•</span>
            <span>{RESTAURANT_INFO.address}</span>
          </div>
          <div>
            Self-Order Platform
          </div>
        </div>
      </footer>
    </div>
  );
};

const AppContent: React.FC = () => {
  const {
    user,
    activeView,
    isCartOpen,
    isCheckoutOpen,
    isTrackerOpen,
    isOrderHistoryOpen,
    activeCustomizingItem
  } = useApp();

  // 1. Strictly Disable Copy, Cut, Paste, and Context Menu globally
  useEffect(() => {
    const disableAction = (e: Event) => {
      e.preventDefault();
      return false;
    };

    document.addEventListener('copy', disableAction);
    document.addEventListener('cut', disableAction);
    document.addEventListener('paste', disableAction);
    document.addEventListener('contextmenu', disableAction);

    return () => {
      document.removeEventListener('copy', disableAction);
      document.removeEventListener('cut', disableAction);
      document.removeEventListener('paste', disableAction);
      document.removeEventListener('contextmenu', disableAction);
    };
  }, []);

  // 2. Native-Grade Body Scroll Lock when View Order, Checkout, Modals, or Login is open
  useEffect(() => {
    const isModalActive =
      isCartOpen ||
      isCheckoutOpen ||
      isTrackerOpen ||
      isOrderHistoryOpen ||
      !!activeCustomizingItem ||
      !user?.isVerified;

    if (isModalActive) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.overscrollBehavior = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [
    isCartOpen,
    isCheckoutOpen,
    isTrackerOpen,
    isOrderHistoryOpen,
    activeCustomizingItem,
    user?.isVerified
  ]);

  // Mandatory Login Gate: Unauthenticated users are allowed ONLY after login
  if (!user?.isVerified) {
    return (
      <div className="fixed inset-0 h-full h-[100dvh] w-full bg-[#111216] overflow-hidden overscroll-none touch-none">
        <AuthModal />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#FAF8F5] animate-page-enter">
      {/* Route Views: Separate Full Page for Order History vs Main Menu with Smooth Native Handoff */}
      <div
        key={activeView}
        className={activeView === 'orders' ? 'animate-page-slide-in' : 'animate-page-slide-back'}
      >
        {activeView === 'orders' ? (
          <OrderHistoryPage />
        ) : (
          <MainMenuContent />
        )}
      </div>
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

