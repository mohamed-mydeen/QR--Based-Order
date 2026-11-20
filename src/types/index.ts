export type DietaryType = 'veg' | 'non-veg' | 'egg' | 'vegan';

export interface ModifierOption {
  id: string;
  name: string;
  price: number; // additional cost (0 if included)
  isDefault?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  minSelections?: number;
  maxSelections?: number; // 1 for radio, >1 for multi-checkbox
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  dietary: DietaryType;
  isPopular?: boolean;
  isChefSpecial?: boolean;
  isAvailable: boolean;
  prepTimeMinutes?: number;
  rating?: number;
  reviewCount?: number;
  modifierGroups?: ModifierGroup[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  itemCount?: number;
}

export interface SelectedModifier {
  groupId: string;
  groupName: string;
  optionId: string;
  optionName: string;
  price: number;
}

export interface CartItem {
  cartItemId: string; // unique hash based on item + modifiers
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: SelectedModifier[];
  specialInstructions?: string;
  unitPrice: number; // base price + modifiers
  totalPrice: number; // unitPrice * quantity
}

export interface UserProfile {
  name: string;
  phone: string;
  isVerified: boolean;
}

export type PaymentMethod = 'upi' | 'cash';

export type OrderStatus = 'placed' | 'confirmed' | 'cooking' | 'ready' | 'served';

export interface OrderStatusStep {
  status: OrderStatus;
  label: string;
  description: string;
  time?: string;
  isCompleted: boolean;
  isCurrent: boolean;
}

export interface Order {
  id: string;
  tableNumber: string;
  customer: UserProfile;
  items: CartItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  statusHistory: OrderStatusStep[];
  placedAt: string;
  estimatedMinutes: number;
  specialNotes?: string;
}
