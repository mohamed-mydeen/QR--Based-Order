# Selarasa — QR Restaurant Self-Ordering Web Application

A modern, mobile-first, and desktop-optimized QR food ordering website built with **React**, **TypeScript**, and **Tailwind CSS**.

Inspired by:
- **Selarasa QR Self-Order App** (Primary visual direction: clean layout, warm terracotta aesthetic, compact menu, high-quality food presentation).
- **Streamlining Restaurant Operations Self-Ordering Web App** (Customization UX: modifier groups, dynamic pricing, kitchen special instructions).

---

## 🚀 Key Features & Flow

### 1. Automatic QR Table Identification
- Automatically extracts table numbers from QR scan query parameters (e.g. `?table=T-08` or `?t=12`).
- Defaults to table location and allows switching tables via the header badge.

### 2. Customer Authentication & OTP Verification
- Frictionless guest login with Customer Name and 10-digit mobile number.
- 4-digit OTP verification screen with countdown resend and 1-tap demo auto-fill (`7392`).

### 3. Food Menu & Discovery
- Compact 2-column mobile card layout; adapts to 3-4 columns on tablet and desktop.
- Veg / Non-Veg / Vegan dietary indicator badges and filter controls.
- Instant search by dish name, description, or cuisine tag.
- Category navigation pills (Chef Specials, Small Plates, Main Course, Rice & Noodles, Artisan Drinks, Desserts).

### 4. Food Customization Modal
- Portion size options (Standard vs. Sharing).
- Spice levels (Mild, Medium, Fire 🔥).
- Ingredient & accompaniment choices (e.g. Jasmine Rice, Roti Canai, Dips).
- Optional chef add-ons with dynamic price adjustments.
- Preset cooking preference tags (*"Less spicy"*, *"No spring onions"*, *"Extra sauce on side"*) + custom notes.
- Sticky CTA button displaying real-time calculated total.

### 5. Shopping Cart & Billing Breakdown
- Itemized view with customized modifier notes.
- Quantity adjustment steppers `[- 1 +]` and item deletion.
- Coupon code support (try `SELARASA10` for 10% off or `TABLE50` for ₹50 off).
- Transparent bill calculation: Subtotal, 5% GST, and 2.5% Table Service Charge.

### 6. Checkout & Payment Options
- Customer and table verification summary.
- **Instant UPI Payment**: Dynamic UPI QR matrix, copyable VPA (`selarasa@upi`), and UPI app options (Google Pay, PhonePe, Paytm, BHIM).
- **Cash / Counter Payment**: Settle at table upon dining.

### 7. Live Kitchen Order Tracker
- Order Token ID (e.g. `#SEL-4829`) and estimated preparation timer (12–18 mins).
- Real-time 5-stage progress timeline:
  1. *Order Sent to Kitchen*
  2. *Chef Accepted*
  3. *Wok & Grill In Progress*
  4. *Plated & Quality Checked*
  5. *Served to Table*
- Quick Table Service: **Call Server / Waiter** button with instant feedback.
- Collapsible digital itemized receipt.

### 8. Responsive Desktop & Mobile Architecture
- **Mobile**: Thumb-friendly bottom bar summary (`BottomCartBar`), sticky header, slide-up drawers.
- **Desktop**: Maximum container width (`max-w-7xl`), side-by-side sticky cart summary (`DesktopSidebarCart`), preventing stretched mobile layouts.

---

## 🛠️ Development & Running

### Install dependencies:
```bash
npm install
```

### Start Development Server:
```bash
npm run dev
```
The app runs at `http://localhost:3000/`.

### Test Table QR Codes:
- `http://localhost:3000/?table=T-08`
- `http://localhost:3000/?table=Outdoor-02`
- `http://localhost:3000/?table=Booth-4`

### Build for Production:
```bash
npm run build
```
Generates optimized assets in the `dist/` directory.
