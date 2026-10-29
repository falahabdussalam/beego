# BeeGo Delivery (Virajpete, Kodagu)

> **"We deliver you."**  
> A full-stack hyperlocal delivery platform engineered specifically for Virajpete (Virajpet), Kodagu, Karnataka, India.  
> **Order by WhatsApp**: Select items, review your cart, and place your order directly via WhatsApp for instant hyperlocal fulfillment!

---

## 🐝 Overview & Starter Web

**BeeGo Delivery** is a clean, starter hyperlocal delivery platform built for **Virajpete, Kodagu**. 

Built with **Next.js 15 (App Router, JavaScript)**, **Tailwind CSS**, and **PostgreSQL / Supabase**, BeeGo enables customers to select local food, groceries, vegetables, milk, and medicines, add them to their cart, and order **directly on WhatsApp**.

### Key Highlights
- **Direct WhatsApp Ordering**: The cart is wired to **Order on WhatsApp only**. When customers select items and go to the cart, entering their Virajpete delivery address generates a formatted, structured WhatsApp message sent directly to the BeeGo delivery desk for immediate confirmation.
- **Floating WhatsApp & Quick Action Buttons**: A persistent floating WhatsApp button (`FloatingWhatsApp.js`), Header button, Hero banner CTA, and single-item WhatsApp buttons on product cards and product detail pages give users instant access.
- **Locality-Centric**: Geofenced to Virajpete town center (`12.2039° N, 75.8037° E`) with a 5.0 km delivery radius calculated via the mathematical Haversine formula on both client and server.
- **Clean Starter Catalog**: Essential categories and authentic starter stores in Virajpete (Coorg Heritage Kitchen, Virajpet Central Super Store, City Care Pharmacy, Nandini Milk Parlour, Maletirike Farm Produce, Royal Bakery & Coffee Bar) with zero bloated dummy past orders or fake testimonials.
- **Indian Pharmaceutical Compliance**: Built-in Schedule H / H1 medicine compliance requiring customer prescription acknowledgment before order dispatch.
- **Single-Store Cart Policy**: Hyperlocal delivery rules ensure single-merchant carts to guarantee 25–35 minute delivery times across Virajpete, complete with conflict resolution modals when switching stores.
- **Zero-Config Developer Fallback**: Includes a production-ready PostgreSQL connection pool (`pg`) with automatic fallback to an in-memory repository for local development and previewing without a live DB container.

---

## 💬 How WhatsApp Ordering Works

```
1. Customer browses stores / categories
2. Adds items to Cart (with quantity controls + / -)
3. Opens Cart (/cart) & fills in delivery details:
   - Full Name
   - 10-digit WhatsApp / Phone Number
   - Virajpete Street & Building Name
   - Delivery instructions (optional)
4. Clicks "Order via WhatsApp • ₹Total"
5. Opens WhatsApp with pre-filled order:
   ----------------------------------------
   🐝 BEEGO DELIVERY - NEW ORDER
   📍 Virajpete, Kodagu, Karnataka
   📋 Order ID: BG-WA-202601
   👤 Customer: Rahul Bopanna
   📞 Phone: 9480112233
   🏠 Address: 14, Main Clock Tower Road, Virajpete
   🛒 ITEMS ORDERED:
   1. 2x Pandi Curry with Akki Roti - ₹520
   2. 1x Nandini Cow Ghee (500ml) - ₹340
   💰 Subtotal: ₹860 | 🚚 Delivery: FREE
   💵 TOTAL PAYABLE: ₹860
   ----------------------------------------
6. Cart clears and celebratory confirmation card is shown with one-click re-open link!
```

---

## 🎨 Brand Identity

- **Brand Name**: BeeGo Delivery
- **Tagline**: *"We deliver you."*
- **Primary Colors**: Light Cream (`#FDFBF7`, `#FAF5EC`) & Dark Maroon (`#58111E`, `#380611`)
- **Typography**: Space Grotesk
- **Action / WhatsApp Color**: WhatsApp Green (`#25D366`)
- **Location**: Virajpete, Kodagu, Karnataka, India
- **Currency**: Indian Rupee (`₹`, INR)
- **Timezone**: `Asia/Kolkata` (IST)

---

## 🔑 Customer Sign-In (Optional)

Customers can browse and order via WhatsApp directly without signing in, or create a customer account to save Virajpete delivery addresses.

| Account | Email | Password | Access URL |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@beegodelivery.in` | `BeeGo@2026Pass!` | `/login` |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.18.0` or higher (tested on Node.js `v20+` and `v26+`)
- **npm**: `v9.0.0` or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
# Windows PowerShell
Copy-Item .env.example .env.local

# Linux / macOS
cp .env.example .env.local
```

Configure your WhatsApp number in `.env.local`:
```env
NEXT_PUBLIC_WHATSAPP_NUMBER="918277000000"
NEXT_PUBLIC_WHATSAPP_DISPLAY="+91 82770 00000"
```

### 3. Run Automated Tests
```bash
npm test
```
*Runs 14 unit tests covering WhatsApp message formatting, URL generation, security, geofencing, and pricing.*

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Variables Reference

| Variable | Required | Default | Description |
| :--- | :---: | :--- | :--- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Yes | `918277000000` | International format phone number receiving WhatsApp orders. |
| `NEXT_PUBLIC_WHATSAPP_DISPLAY` | No | `+91 82770 00000` | Formatted display number shown to customers. |
| `NEXT_PUBLIC_DEFAULT_LAT` | Yes | `12.2039` | Virajpete Clock Tower latitude. |
| `NEXT_PUBLIC_DEFAULT_LNG` | Yes | `75.8037` | Virajpete Clock Tower longitude. |
| `NEXT_PUBLIC_DEFAULT_RADIUS_KM` | Yes | `5.0` | Default delivery geofence radius in kilometers. |
| `DATABASE_URL` | No | *(In-Memory Fallback)* | PostgreSQL connection string (`postgresql://...`). |
| `JWT_SECRET` | Yes | *(32+ chars)* | Secret key for signing session tokens. |
| `DEFAULT_DELIVERY_FEE` | No | `35.00` | Standard base delivery fee in ₹. |
| `FREE_DELIVERY_THRESHOLD` | No | `499.00` | Minimum subtotal to trigger free delivery in ₹. |

---

## 📄 License

BeeGo Delivery is private, proprietary software built for Virajpete, Kodagu, Karnataka, India.  
Copyright © 2026 BeeGo Delivery. All rights reserved.
