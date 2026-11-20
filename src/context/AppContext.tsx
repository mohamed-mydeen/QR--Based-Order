import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  MenuItem,
  Order,
  PaymentMethod,
  SelectedModifier,
  UserProfile
} from '../types';

interface CartSummary {
  count: number;
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
}

interface PendingAuthState {
  name: string;
  phone: string;
  otpStep: 'phone' | 'otp';
  devOtp: string;
  timerExpiresAt: number;
}

interface AppContextType {
  // Table
  tableNumber: string;
  setTableNumber: (table: string) => void;
  isTableModalOpen: boolean;
  setIsTableModalOpen: (open: boolean) => void;

  // Customer Auth
  user: UserProfile | null;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  pendingOtpPhone: string;
  pendingUserName: string;
  otpStep: 'phone' | 'otp';
  devOtp: string;
  otpResendTimer: number;
  startAuthFlow: (onSuccessCallback?: () => void) => void;
  requestOtp: (name: string, phone: string) => void;
  verifyOtp: (code: string) => Promise<{ success: boolean; message?: string }>;
  resendOtp: () => void;
  changePhoneNumber: () => void;
  cancelAuth: () => void;
  logoutUser: () => void;

  // Menu Navigation & Search
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  dietaryFilter: 'all' | 'veg' | 'non-veg';
  setDietaryFilter: (filter: 'all' | 'veg' | 'non-veg') => void;

  // Customization
  activeCustomizingItem: MenuItem | null;
  openCustomization: (item: MenuItem) => void;
  closeCustomization: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    item: MenuItem,
    modifiers?: SelectedModifier[],
    instructions?: string,
    quantity?: number
  ) => void;
  updateQuantity: (cartItemId: string, delta: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  cartSummary: CartSummary;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  promoCode: string | null;
  applyPromo: (code: string) => { success: boolean; message: string };

  // Checkout & Ordering
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeOrder: Order | null;
  placeOrder: (paymentMethod: PaymentMethod, notes?: string) => Promise<Order>;
  cancelActiveOrder: () => void;
  
  // Tracking
  isTrackerOpen: boolean;
  setIsTrackerOpen: (open: boolean) => void;
  callWaiter: () => void;
  waiterCalled: boolean;

  // Navigation & View Routing
  activeView: 'menu' | 'orders';
  setActiveView: (view: 'menu' | 'orders') => void;

  // Order History
  orderHistory: Order[];
  isOrderHistoryOpen: boolean;
  setIsOrderHistoryOpen: (open: boolean) => void;
  viewingOrder: Order | null;
  setViewingOrder: (order: Order | null) => void;
  reorderItems: (items: CartItem[]) => void;
  
  // Quick notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Table Detection from URL (e.g. ?table=T-08 or ?t=12) or LocalStorage
  const [tableNumber, setTableNumberState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlTable = params.get('table') || params.get('t');
      if (urlTable) {
        const formatted = urlTable.toUpperCase().startsWith('T-') ? urlTable.toUpperCase() : `Table ${urlTable}`;
        localStorage.setItem('selarasa_table', formatted);
        return formatted;
      }
      return localStorage.getItem('selarasa_table') || 'Table 04';
    }
    return 'Table 04';
  });

  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  const setTableNumber = (table: string) => {
    setTableNumberState(table);
    localStorage.setItem('selarasa_table', table);
  };

  // 2. User Authentication & OTP Flow
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selarasa_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Restore pending auth flow from localStorage so browser refresh preserves Step 2
  const [pendingAuth, setPendingAuth] = useState<PendingAuthState>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selarasa_pending_auth');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            name: parsed.name || '',
            phone: parsed.phone || '',
            otpStep: parsed.otpStep || 'phone',
            devOtp: parsed.devOtp || '',
            timerExpiresAt: parsed.timerExpiresAt || (Date.now() + 30000)
          };
        } catch {
          // ignore
        }
      }
    }
    return {
      name: '',
      phone: '',
      otpStep: 'phone',
      devOtp: '',
      timerExpiresAt: Date.now() + 30000
    };
  });

  const [otpResendTimer, setOtpResendTimer] = useState<number>(() => {
    const remaining = Math.max(0, Math.ceil((pendingAuth.timerExpiresAt - Date.now()) / 1000));
    return pendingAuth.otpStep === 'otp' ? (remaining > 0 ? remaining : 0) : 30;
  });

  const [authSuccessCallback, setAuthSuccessCallback] = useState<(() => void) | null>(null);

  // Resend Countdown Timer effect
  useEffect(() => {
    if (pendingAuth.otpStep !== 'otp') return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((pendingAuth.timerExpiresAt - Date.now()) / 1000));
      setOtpResendTimer(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [pendingAuth.otpStep, pendingAuth.timerExpiresAt]);

  const generateDevOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const startAuthFlow = (onSuccess?: () => void) => {
    if (user?.isVerified) {
      if (onSuccess) onSuccess();
      return;
    }
    if (onSuccess) setAuthSuccessCallback(() => onSuccess);
    setIsAuthOpen(true);
  };

  const requestOtp = (name: string, phone: string) => {
    const code = generateDevOtp();
    const expiresAt = Date.now() + 30000;
    const nextState: PendingAuthState = {
      name,
      phone,
      otpStep: 'otp',
      devOtp: code,
      timerExpiresAt: expiresAt
    };

    setPendingAuth(nextState);
    setOtpResendTimer(30);
    localStorage.setItem('selarasa_pending_auth', JSON.stringify(nextState));
    showToast(`Verification code: ${code} (Development Mode)`);
  };

  const resendOtp = () => {
    const newCode = generateDevOtp();
    const expiresAt = Date.now() + 30000;
    const nextState: PendingAuthState = {
      ...pendingAuth,
      devOtp: newCode,
      timerExpiresAt: expiresAt
    };

    setPendingAuth(nextState);
    setOtpResendTimer(30);
    localStorage.setItem('selarasa_pending_auth', JSON.stringify(nextState));
    showToast(`New verification code: ${newCode} (Development Mode)`);
  };

  const changePhoneNumber = () => {
    const nextState: PendingAuthState = {
      ...pendingAuth,
      otpStep: 'phone'
    };
    setPendingAuth(nextState);
    localStorage.setItem('selarasa_pending_auth', JSON.stringify(nextState));
  };

  const verifyOtp = async (code: string): Promise<{ success: boolean; message?: string }> => {
    const cleanCode = code.trim();
    if (cleanCode.length !== 6) {
      return { success: false, message: 'Please enter a complete 6-digit verification code.' };
    }

    if (cleanCode !== pendingAuth.devOtp) {
      return {
        success: false,
        message: 'Incorrect verification code. Please check the code provided above and try again.'
      };
    }

    // Success
    const verifiedProfile: UserProfile = {
      name: pendingAuth.name || 'Guest Diner',
      phone: pendingAuth.phone || '9876543210',
      isVerified: true
    };

    setUser(verifiedProfile);
    localStorage.setItem('selarasa_user', JSON.stringify(verifiedProfile));
    localStorage.removeItem('selarasa_pending_auth');

    // Reset pending
    setPendingAuth({
      name: '',
      phone: '',
      otpStep: 'phone',
      devOtp: '',
      timerExpiresAt: Date.now()
    });

    setIsAuthOpen(false);
    showToast(`Welcome, ${verifiedProfile.name}! Enjoy your dining.`);

    if (authSuccessCallback) {
      authSuccessCallback();
      setAuthSuccessCallback(null);
    }

    return { success: true };
  };

  const cancelAuth = () => {
    setIsAuthOpen(false);
    setAuthSuccessCallback(null);
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('selarasa_user');
    localStorage.removeItem('selarasa_pending_auth');
    setPendingAuth({
      name: '',
      phone: '',
      otpStep: 'phone',
      devOtp: '',
      timerExpiresAt: Date.now()
    });
    setActiveView('menu');
    setIsAuthOpen(true);
    showToast('Signed out successfully');
  };

  // 3. Menu Navigation & Filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all');

  // 4. Customization Modal
  const [activeCustomizingItem, setActiveCustomizingItem] = useState<MenuItem | null>(null);

  const openCustomization = (item: MenuItem) => {
    setActiveCustomizingItem(item);
  };

  const closeCustomization = () => {
    setActiveCustomizingItem(null);
  };

  // 5. Cart Management
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selarasa_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('selarasa_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (
    item: MenuItem,
    modifiers: SelectedModifier[] = [],
    instructions?: string,
    quantity = 1
  ) => {
    const modHash = modifiers.map(m => m.optionId).sort().join('-');
    const cartItemId = `${item.id}_${modHash}_${instructions ? encodeURIComponent(instructions) : 'std'}`;

    const additionalModifierCost = modifiers.reduce((acc, curr) => acc + curr.price, 0);
    const unitPrice = item.price + additionalModifierCost;

    setCart(prev => {
      const existingIdx = prev.findIndex(ci => ci.cartItemId === cartItemId);
      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: newQty,
          totalPrice: newQty * unitPrice
        };
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          menuItem: item,
          quantity,
          selectedModifiers: modifiers,
          specialInstructions: instructions,
          unitPrice,
          totalPrice: unitPrice * quantity
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${item.name}" to cart`);
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(ci => {
          if (ci.cartItemId === cartItemId) {
            const nextQty = ci.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...ci,
              quantity: nextQty,
              totalPrice: nextQty * ci.unitPrice
            };
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null);
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(ci => ci.cartItemId !== cartItemId));
    showToast('Item removed from cart');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Promo code calculation
  const applyPromo = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'SELARASA10' || clean === 'WELCOME10') {
      setPromoCode(clean);
      return { success: true, message: '10% discount applied!' };
    }
    if (clean === 'TABLE50') {
      setPromoCode(clean);
      return { success: true, message: '₹50 flat discount applied!' };
    }
    return { success: false, message: 'Invalid or expired coupon code' };
  };

  // Calculate Cart Summary
  const cartSummary: CartSummary = (() => {
    const count = cart.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    
    let discount = 0;
    if (promoCode === 'SELARASA10' || promoCode === 'WELCOME10') {
      discount = Math.round(subtotal * 0.1);
    } else if (promoCode === 'TABLE50') {
      discount = Math.min(50, subtotal);
    }

    const discountedSubtotal = Math.max(0, subtotal - discount);
    // GST and service fees removed per user request (net all-inclusive pricing)
    const tax = 0;
    const serviceCharge = 0;
    const total = discountedSubtotal;

    return {
      count,
      subtotal,
      discount,
      tax,
      serviceCharge,
      total
    };
  })();

  // 6. Checkout & Order Flow
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeOrder, setActiveOrder] = useState<Order | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selarasa_active_order');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [waiterCalled, setWaiterCalled] = useState(false);

  // 7. Order History Flow & View Routing
  const [activeView, setActiveView] = useState<'menu' | 'orders'>('menu');
  const [orderHistory, setOrderHistory] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selarasa_order_history');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });
  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  const reorderItems = (items: CartItem[]) => {
    items.forEach(ci => {
      addToCart(ci.menuItem, ci.selectedModifiers, ci.specialInstructions, ci.quantity);
    });
    showToast(`Added ${items.length} dishes to cart!`);
    setIsOrderHistoryOpen(false);
    setActiveView('menu');
    setIsCartOpen(true);
  };

  const placeOrder = async (paymentMethod: PaymentMethod, notes?: string): Promise<Order> => {
    const orderId = `SEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: orderId,
      tableNumber,
      customer: user || { name: 'Guest Diner', phone: '9876543210', isVerified: true },
      items: [...cart],
      subtotal: cartSummary.subtotal,
      tax: cartSummary.tax,
      serviceCharge: cartSummary.serviceCharge,
      discount: cartSummary.discount,
      total: cartSummary.total,
      paymentMethod,
      paymentStatus: paymentMethod === 'upi' ? 'paid' : 'pending',
      status: 'placed',
      placedAt: nowTime,
      estimatedMinutes: 18,
      specialNotes: notes,
      statusHistory: [
        {
          status: 'placed',
          label: 'Order Sent to Kitchen',
          description: 'Received by kitchen display terminal.',
          time: nowTime,
          isCompleted: false,
          isCurrent: true
        },
        {
          status: 'confirmed',
          label: 'Chef Accepted',
          description: 'Station chef started gathering fresh ingredients.',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'cooking',
          label: 'Wok & Grill In Progress',
          description: 'Dishes are being actively cooked with precision.',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'ready',
          label: 'Plated & Quality Checked',
          description: 'Garnished, inspected and being dispatched.',
          isCompleted: false,
          isCurrent: false
        },
        {
          status: 'served',
          label: 'Served to Table',
          description: 'Enjoy your meal! Call staff if you need anything.',
          isCompleted: false,
          isCurrent: false
        }
      ]
    };

    setActiveOrder(newOrder);
    localStorage.setItem('selarasa_active_order', JSON.stringify(newOrder));
    const nextHistory = [newOrder, ...orderHistory.filter(o => o.id !== newOrder.id)];
    setOrderHistory(nextHistory);
    localStorage.setItem('selarasa_order_history', JSON.stringify(nextHistory));
    setViewingOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    setIsCheckoutOpen(false);
    setIsTrackerOpen(false);
    return newOrder;
  };

  const cancelActiveOrder = () => {
    if (!activeOrder) return;
    const orderId = activeOrder.id;
    setActiveOrder(null);
    localStorage.removeItem('selarasa_active_order');
    const nextHistory = orderHistory.filter(o => o.id !== orderId);
    setOrderHistory(nextHistory);
    localStorage.setItem('selarasa_order_history', JSON.stringify(nextHistory));
    setIsTrackerOpen(false);
    setViewingOrder(null);
    showToast(`Order #${orderId} was cancelled.`);
  };

  const callWaiter = () => {
    setWaiterCalled(true);
    showToast(`Staff alerted for ${tableNumber}. Someone will assist you shortly.`);
    setTimeout(() => {
      setWaiterCalled(false);
    }, 15000);
  };

  // Toast Notification System
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3200);
  };

  return (
    <AppContext.Provider
      value={{
        tableNumber,
        setTableNumber,
        isTableModalOpen,
        setIsTableModalOpen,
        user,
        isAuthOpen,
        setIsAuthOpen,
        otpStep: pendingAuth.otpStep,
        pendingOtpPhone: pendingAuth.phone,
        pendingUserName: pendingAuth.name,
        devOtp: pendingAuth.devOtp,
        otpResendTimer,
        startAuthFlow,
        requestOtp,
        verifyOtp,
        resendOtp,
        changePhoneNumber,
        cancelAuth,
        logoutUser,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        dietaryFilter,
        setDietaryFilter,
        activeCustomizingItem,
        openCustomization,
        closeCustomization,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartSummary,
        isCartOpen,
        setIsCartOpen,
        promoCode,
        applyPromo,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeOrder,
        placeOrder,
        cancelActiveOrder,
        isTrackerOpen,
        setIsTrackerOpen,
        callWaiter,
        waiterCalled,
        activeView,
        setActiveView,
        orderHistory,
        isOrderHistoryOpen,
        setIsOrderHistoryOpen,
        viewingOrder,
        setViewingOrder,
        reorderItems,
        toastMessage,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
