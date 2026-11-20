import { Category, MenuItem } from '../types';

export const RESTAURANT_INFO = {
  name: 'Selarasa Modern Eatery',
  tagline: 'Artisanal Asian & Contemporary Dining',
  logo: '🥢',
  address: 'Level 2, Indiranagar 100ft Rd, Bengaluru',
  operatingHours: '11:30 AM – 11:00 PM',
  currency: '₹',
  gstRate: 0.05, // 5% GST
  serviceChargeRate: 0.025, // 2.5% Service & Table charge
  wifiPassword: 'selarasa_guest',
  upiVpa: 'selarasa@upi',
  phone: '+91 98450 12345'
};

export const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Menu', icon: '✨' },
  { id: 'bestsellers', name: 'Chef Specials', icon: '🔥' },
  { id: 'starters', name: 'Small Plates', icon: '🥟' },
  { id: 'mains', name: 'Main Course', icon: '🍲' },
  { id: 'noodles-rice', name: 'Rice & Noodles', icon: '🍜' },
  { id: 'beverages', name: 'Artisan Drinks', icon: '🍹' },
  { id: 'desserts', name: 'Sweet Endings', icon: '🍮' }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dish-1',
    name: 'Truffle Edamame Dim Sum',
    description: 'Delicate translucent parcels packed with water chestnut, edamame and black truffle emulsion.',
    price: 380,
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=700&q=80',
    categoryId: 'starters',
    dietary: 'veg',
    isPopular: true,
    isChefSpecial: true,
    isAvailable: true,
    prepTimeMinutes: 12,
    rating: 4.9,
    reviewCount: 142,
    modifierGroups: [
      {
        id: 'portion',
        name: 'Portion Size',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'p-4', name: '4 Pieces (Standard)', price: 0, isDefault: true },
          { id: 'p-6', name: '6 Pieces (Sharing)', price: 140 }
        ]
      },
      {
        id: 'dip',
        name: 'Handcrafted Dip',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'dip-chili', name: 'Smoked Chili Crisp Oil', price: 0, isDefault: true },
          { id: 'dip-scallion', name: 'Ginger Scallion Relish', price: 0 },
          { id: 'dip-ponzu', name: 'Truffle Ponzu Soy', price: 30 }
        ]
      },
      {
        id: 'addons',
        name: 'Chef Add-ons',
        required: false,
        maxSelections: 2,
        options: [
          { id: 'add-crispy-garlic', name: 'Crispy Golden Garlic Flakes', price: 40 },
          { id: 'add-chili-paste', name: 'Extra Chili Crisp Oil (50ml)', price: 50 }
        ]
      }
    ]
  },
  {
    id: 'dish-2',
    name: 'Balinese Spiced Chicken Satay',
    description: 'Char-grilled lemongrass chicken skewers basted with sweet kecap manis & crushed peanut sauce.',
    price: 420,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80',
    categoryId: 'starters',
    dietary: 'non-veg',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 15,
    rating: 4.8,
    reviewCount: 215,
    modifierGroups: [
      {
        id: 'satay-portion',
        name: 'Skewers Count',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sk-4', name: '4 Skewers', price: 0, isDefault: true },
          { id: 'sk-6', name: '6 Skewers (Recommended)', price: 180 }
        ]
      },
      {
        id: 'spice',
        name: 'Spice Level',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sp-mild', name: 'Mild & Sweet', price: 0 },
          { id: 'sp-med', name: 'Medium Spice (Authentic)', price: 0, isDefault: true },
          { id: 'sp-fire', name: 'Sambal Extra Spicy 🔥', price: 0 }
        ]
      },
      {
        id: 'sides',
        name: 'Accompaniment',
        required: false,
        maxSelections: 2,
        options: [
          { id: 'side-crackers', name: 'Crispy Prawn Crackers (Krupuk)', price: 60 },
          { id: 'side-ricecakes', name: 'Steamed Rice Cakes (Lontong)', price: 70 }
        ]
      }
    ]
  },
  {
    id: 'dish-3',
    name: 'Crispy Lotus Stem in Hot Bean Sauce',
    description: 'Thinly sliced lotus root tossed with Sichuan peppercorns, scallions and honey-chili glaze.',
    price: 340,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
    categoryId: 'starters',
    dietary: 'veg',
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 10,
    rating: 4.6,
    reviewCount: 88,
    modifierGroups: [
      {
        id: 'sweetness',
        name: 'Glaze Preference',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'g-classic', name: 'Honey Chili (Sweet & Savory)', price: 0, isDefault: true },
          { id: 'g-peppery', name: 'Dry Sichuan Peppercorn (Spicy)', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'dish-4',
    name: 'Signature Nasi Goreng Selarasa',
    description: 'Indonesian aromatic wok-tossed jasmine rice served with chicken satay, sunny-side egg, and kerupuk.',
    price: 490,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=700&q=80',
    categoryId: 'noodles-rice',
    dietary: 'non-veg',
    isPopular: true,
    isChefSpecial: true,
    isAvailable: true,
    prepTimeMinutes: 18,
    rating: 4.9,
    reviewCount: 310,
    modifierGroups: [
      {
        id: 'egg-prep',
        name: 'Fried Egg Doneness',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'egg-runny', name: 'Sunny Side Up (Runny Yolk)', price: 0, isDefault: true },
          { id: 'egg-hard', name: 'Well Done Egg', price: 0 },
          { id: 'egg-none', name: 'No Egg', price: 0 }
        ]
      },
      {
        id: 'rice-spice',
        name: 'Spice Level',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sp-mild', name: 'Mild', price: 0 },
          { id: 'sp-med', name: 'Medium (Chef Original)', price: 0, isDefault: true },
          { id: 'sp-hot', name: 'Indonesian Spicy 🔥', price: 0 }
        ]
      },
      {
        id: 'rice-extras',
        name: 'Extras',
        required: false,
        maxSelections: 2,
        options: [
          { id: 'ex-satay', name: 'Extra Chicken Satay (2 pcs)', price: 120 },
          { id: 'ex-prawns', name: 'Butter Garlic Prawns (3 pcs)', price: 160 }
        ]
      }
    ]
  },
  {
    id: 'dish-5',
    name: 'Claypot Massaman Coconut Curry (Paneer / Veg)',
    description: 'Slow-simmered rich Southern Thai coconut curry with roasted peanuts, shallots, baby potatoes and fresh paneer.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=700&q=80',
    categoryId: 'mains',
    dietary: 'veg',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 16,
    rating: 4.8,
    reviewCount: 167,
    modifierGroups: [
      {
        id: 'protein-base',
        name: 'Choose Core Protein',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'prot-paneer', name: 'Malai Cottage Cheese (Paneer)', price: 0, isDefault: true },
          { id: 'prot-tofu', name: 'Organic Silken Tofu (Vegan)', price: 20 },
          { id: 'prot-exotic', name: 'Exotic Asian Farm Greens', price: 0 }
        ]
      },
      {
        id: 'bread-rice',
        name: 'Choice of Carbs',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'carb-jasmine', name: 'Steamed Fragrant Jasmine Rice', price: 0, isDefault: true },
          { id: 'carb-parotta', name: 'Flaky Malaysian Roti Canai (2 pcs)', price: 40 },
          { id: 'carb-coconut-rice', name: 'Coconut Milk Sticky Rice', price: 50 }
        ]
      }
    ]
  },
  {
    id: 'dish-6',
    name: 'Slow-Cooked Beef Rendang Minangkabau',
    description: 'Tender beef morsels caramelized in coconut cream, lemongrass, galangal and toasted coconut paste for 6 hours.',
    price: 580,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80',
    categoryId: 'mains',
    dietary: 'non-veg',
    isPopular: false,
    isChefSpecial: true,
    isAvailable: true,
    prepTimeMinutes: 20,
    rating: 4.9,
    reviewCount: 198,
    modifierGroups: [
      {
        id: 'rendang-carbs',
        name: 'Carbohydrate Pairing',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'rc-pandan', name: 'Pandan Blue Pea Flower Rice', price: 0, isDefault: true },
          { id: 'rc-roti', name: 'Flaky Roti Canai (2 pcs)', price: 40 }
        ]
      }
    ]
  },
  {
    id: 'dish-7',
    name: 'Wok-Tossed Dan Dan Noodles',
    description: 'Hand-pulled wheat noodles with preserved winter greens, toasted sesame paste, chili oil and crushed peanuts.',
    price: 390,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80',
    categoryId: 'noodles-rice',
    dietary: 'veg',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 12,
    rating: 4.7,
    reviewCount: 124,
    modifierGroups: [
      {
        id: 'noodle-spice',
        name: 'Sichuan Heat',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sp-med', name: 'Classic Tingling Numbing (Medium)', price: 0, isDefault: true },
          { id: 'sp-high', name: 'Chef Red Oil Extra Heat 🔥', price: 0 }
        ]
      },
      {
        id: 'noodle-protein',
        name: 'Protein',
        required: false,
        maxSelections: 1,
        options: [
          { id: 'prot-minced-mushrooms', name: 'Shiitake Mushroom Mince (Included)', price: 0, isDefault: true },
          { id: 'prot-tofu-cubes', name: 'Pan-Seared Five Spice Tofu', price: 60 }
        ]
      }
    ]
  },
  {
    id: 'dish-8',
    name: 'Yuzu Lemongrass Iced Fizz',
    description: 'Sparkling cold brew Japanese yuzu juice with smashed bruised lemongrass and kaffir lime bubbles.',
    price: 210,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=80',
    categoryId: 'beverages',
    dietary: 'veg',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 5,
    rating: 4.8,
    reviewCount: 95,
    modifierGroups: [
      {
        id: 'drink-sugar',
        name: 'Sweetness',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sug-100', name: 'Regular (Optimal)', price: 0, isDefault: true },
          { id: 'sug-50', name: 'Less Sweet (50%)', price: 0 },
          { id: 'sug-0', name: 'Zero Sugar Added', price: 0 }
        ]
      },
      {
        id: 'drink-ice',
        name: 'Ice Level',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'ice-reg', name: 'Standard Chilled Ice', price: 0, isDefault: true },
          { id: 'ice-less', name: 'Less Ice', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'dish-9',
    name: 'Iced Thai Milk Tea with Brown Sugar Boba',
    description: 'Slow-steeped Ceylon tea leaves infused with star anise and condensed milk, poured over warm boba pearls.',
    price: 240,
    image: 'https://images.unsplash.com/photo-1558857563-b37fcdd6f1db?auto=format&fit=crop&w=700&q=80',
    categoryId: 'beverages',
    dietary: 'veg',
    isPopular: true,
    isAvailable: true,
    prepTimeMinutes: 5,
    rating: 4.9,
    reviewCount: 280,
    modifierGroups: [
      {
        id: 'boba-sugar',
        name: 'Sweetness',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'bs-reg', name: 'Classic Sweet', price: 0, isDefault: true },
          { id: 'bs-low', name: 'Low Sweet (30%)', price: 0 }
        ]
      },
      {
        id: 'boba-toppings',
        name: 'Toppings',
        required: false,
        maxSelections: 2,
        options: [
          { id: 'top-cheese', name: 'Himalayan Salted Cheese Foam Cap', price: 50 },
          { id: 'top-extra-boba', name: 'Double Brown Sugar Tapioca', price: 40 }
        ]
      }
    ]
  },
  {
    id: 'dish-10',
    name: 'Warm Sticky Rice with Fresh Mango & Coconut Cream',
    description: 'Pandan infused sweet glutinous rice drizzled with warm salted coconut cream and fresh Alphonso slices.',
    price: 320,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=700&q=80',
    categoryId: 'desserts',
    dietary: 'veg',
    isPopular: true,
    isChefSpecial: true,
    isAvailable: true,
    prepTimeMinutes: 10,
    rating: 5.0,
    reviewCount: 340,
    modifierGroups: [
      {
        id: 'dessert-portion',
        name: 'Serving Size',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'srv-single', name: 'Individual Plate', price: 0, isDefault: true },
          { id: 'srv-duo', name: 'Double Sharing Plate', price: 180 }
        ]
      }
    ]
  },
  {
    id: 'dish-11',
    name: 'Belgian Chocolate Volcano Cake',
    description: 'Molten dark chocolate centre with Madagascar vanilla bean gelato and roasted hazelnut praline.',
    price: 360,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=80',
    categoryId: 'desserts',
    dietary: 'egg',
    isPopular: false,
    isAvailable: true,
    prepTimeMinutes: 14,
    rating: 4.7,
    reviewCount: 110
  },
  {
    id: 'dish-12',
    name: 'Charred Edamame with Maldon Sea Salt',
    description: 'Steamed green soybean pods tossed with toasted sesame oil, garlic crunch and flaky Maldon salt.',
    price: 290,
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?auto=format&fit=crop&w=700&q=80',
    categoryId: 'starters',
    dietary: 'vegan',
    isPopular: false,
    isAvailable: false, // out of stock showcase
    prepTimeMinutes: 8,
    rating: 4.5,
    reviewCount: 52
  }
];
