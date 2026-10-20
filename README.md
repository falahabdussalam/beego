# BEEGO — Virajpet Edition (Kodagu, Karnataka)

A refined, human-designed frontend for a luxury on-demand delivery platform based in **Virajpet (Virajpete), Kodagu**, featuring **100% Halal Certified** dining, local estate coffee, spices, pure honey, and mountain essentials.

---

## 🎨 Color Palette & Visual System

- **Light Cream Backgrounds**: `#FAF7F2` (Base page), `#F5EFE6` (Surface tint), `#FFFFFF` (Card surfaces), `#E5DACB` (Warm borders)
- **Dark Maroon Primary**: `#520D18` (Brand maroon), `#3D0911` (Dark headers), `#29050A` (Deepest wine/charcoal), `#6B1422` (Interactive hover)
- **Accents**: `#C08D38` (Artisanal gold badge), `#236B36` (Fresh delivery green indicator), `#221614` (Deep roasted espresso text)
- **Typography**: `Bricolage Grotesque` (Full-variable grotesque font with optical sizing across display headlines, buttons, and UI components)

---

## 🍗 100% Halal Food & Virajpet Offerings

1. **Al-Bait Kodagu Halal Kitchen** (*Clock Tower Circle, Virajpet*):
   - *Coorg Halal Koli Curry with Soft Akki Oti (3 Pcs)* — ₹260
   - *Kodagu Halal Mutton Pepper Fry (Handi Roasted)* — ₹380
   - *Kadambuttu (Steamed Rice Dumplings) & Chicken Gravy* — ₹220
   - *Noolputtu (Coorg String Hoppers) with Coconut Milk* — ₹160

2. **Hotel Capitol Royale Biryani House** (*Main Road, Virajpet*):
   - *Special Kodagu Mutton Dum Biryani (Jeerakasala Kaima Rice)* — ₹340
   - *Halal Chicken Dum Biryani with Egg & Raita* — ₹240
   - *Coorg Bird-Eye Chilly Chicken Al-Fahm (Half)* — ₹290
   - *Ghee Rice (Nei Choru) with Pepper Chicken Sukka* — ₹220

3. **Crown Halal Bakes & Confectionery** (*Malabar Road, Virajpet*):
   - *Crisp Halal Chicken Keema Puffs (Box of 4)* — ₹120
   - *Erachi Chatti Pathiri (Layered Savory Meat Pie)* — ₹240
   - *Sweet Unnakaya (Stuffed Golden Plantains, 4 Pcs)* — ₹110
   - *Coorg Forest Honey & Vanilla Sponge Tea Cake (500g)* — ₹250

4. **Virajpet Estate Roasters & Kaapi House** (*College Road, Virajpet*):
   - *Virajpet Pure Arabica Filter Kaapi Flask (Serves 2)* — ₹90
   - *Ginger-Cardamom Sulaimani Tea with Fresh Mint (Serves 2)* — ₹60
   - *Hot Kerala Banana Fritters (Pazham Pori, 4 Pcs)* — ₹70
   - *Pure Ghee Mysore Pak (250g Box)* — ₹180

5. **Coorg Heritage Spice & Wild Honey Mandi** (*Market Road, Virajpet*):
   - *Virajpet Pure Wild Forest Raw Honey (500g Jar)* — ₹440
   - *Kodagu Grade-1 Bold Black Pepper (500g Pack)* — ₹390
   - *Authentic Coorg Homemade Kachampuli Extract (150ml Bottle)* — ₹230
   - *Coorg Green Cardamom (8mm Super Bold, 250g)* — ₹560

6. **Virajpet Daily Mandi & Halal Provisions** (*Bazaar Street, Virajpet* — Grocery):
   - *Kodagu Farm Fresh Halal Eggs (Crate of 30)* — ₹195
   - *Traditional Aged Ponni Boiled Rice (5kg Bag)* — ₹320
   - *Pure Cold-Pressed Coconut Cooking Oil (1L)* — ₹240
   - *Fresh Estate Bird-Eye Chillies & Ginger Pack (250g)* — ₹55

7. **Virajpet Central Town Pharmacy & Medico** (*Hospital Road, Virajpet* — Medicine):
   - *Coorg Nilgiri & Eucalyptus Herbal Pain Balm (50g)* — ₹95
   - *Family First Aid & Antiseptic Emergency Kit* — ₹280
   - *Electral Oral Rehydration Salts WHO Formula (Pack of 5)* — ₹110
   - *Digital Rapid Clinical Thermometer with LCD Alert* — ₹175

8. **Al-Madeena Arabian & Charcoal Court** (*Gonikoppal Road, Virajpet* — Food):
   - *Special Halal Chicken Mandi Platter (Serves 2)* — ₹380
   - *Tandoori Halal Chicken Full (Charcoal Roasted)* — ₹390
   - *Jumbo Halal Chicken Shawarma Roll* — ₹120

---

## ⚡ Quick Hero Category Navigation
Seamless single-line category switching directly in the hero header:
- **Food**: Kodagu halal koli curry, dum biryanis, al-fahm & kebabs
- **Grocery**: Fresh farm produce, Ponni rice, coconut oil, Coorg wild honey & bold black pepper
- **Medicine**: First aid kits, oral rehydration salts, mountain herbal balms & wellness care
- **Beverages**: Single-origin shade-grown arabica filter kaapi & spiced sulaimani tea
- **Desserts**: Pure ghee Mysore pak, sweet unnakaya, royal falooda & Coorg honey tea cakes

---

## 📍 Virajpet Localities & Delivery Fleet

- **Local Landmarks & Hubs**: Clock Tower Circle (Gadiyara Kambha), College Road, Kaveri Layout, Malabar Road, Meenupet, Bittangala, Arji, and Gonikoppal Road.
- **Delivery Partner**: Mohammed Suhail (TVS iQube / Ather EV Fleet, temperature-shielded container).

---

## ⚡ Backend & Server Architecture (Node.js + Express + SQLite + WebSockets)

BEEGO features a dedicated, production-grade backend server tailored for Virajpet's topography and logistics:

- **Server Engine**: Node.js + Express 5 with graceful shutdown (`SIGINT`/`SIGTERM`), rate limiting, request logging, and CORS.
- **Embedded Database**: SQLite via `better-sqlite3` with Write-Ahead Logging (WAL mode), ACID transactions, and auto-seeding.
- **Real-Time Telemetry**: Native WebSocket Gateway (`/ws`) broadcasting 1 Hz GPS coordinates, scooter speed, battery level, and timeline transitions for rider **Mohammed Suhail** across Virajpet landmarks (Clock Tower → College Road → Kaveri Layout → Malabar Road).
- **Operations & Dispatcher Dashboard**: Live operations center at `/admin` for tracking orders and inspecting system health.
- **Interactive API Documentation & Explorer**: Interactive Swagger-style documentation portal at `/api` or `/docs`.

### 📡 API Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | `GET` | System health, memory, uptime, and database records count |
| `/api/merchants` | `GET` | List merchants with filtering (`category`, `search`, `sort`) |
| `/api/merchants/categories` | `GET` | List categories with item counts |
| `/api/merchants/:id` | `GET` | Merchant menu details grouped by category |
| `/api/orders` | `POST` | Place order (re-calculates totals, applies promo, stores in SQLite, triggers live telemetry) |
| `/api/orders` | `GET` | List orders with pagination & status filters |
| `/api/orders/:id` | `GET` | Order details with 4-stage tracking timeline |
| `/api/orders/:id/status` | `PATCH` | Update order status (`PREPARING`, `PICKED_UP`, `ON_THE_WAY`, `DELIVERED`) |
| `/api/user/profile` | `GET` | User profile (Falah Abdulla), wallet balance, saved places, and unified activity feed |
| `/api/user/preferences` | `PATCH` | Update spice level and eco-packaging preference |
| `/api/user/wallet/topup` | `POST` | Wallet top-up via UPI with transaction ledger entry |
| `/api/user/wallet/transactions` | `GET` | Retrieve wallet credit/debit transaction history |
| `/api/user/addresses` | `POST` | Add new saved address from Google Maps picker |
| `/api/user/addresses/:id` | `DELETE` | Remove a saved address from user profile |
| `/api/user/addresses/:id/default` | `PATCH` | Set default active delivery address |
| `/api/promos/validate` | `POST` | Validate coupon codes (`BEEGO10`, `BEEGOFIRST`, `FREEDEL`, `KODAGU50`) |
| `/ws` | `WebSocket` | Real-time telemetry & order event stream |

---

## 💻 Running the Server

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Production Server
```bash
npm start
```

### 3. Start in Development Mode (Live Watch)
```bash
npm run dev
```

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Access Points
- **Customer Web Portal**: [http://localhost:3000](http://localhost:3000)
- **Operations & Dispatcher Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Interactive API Documentation & Explorer**: [http://localhost:3000/api](http://localhost:3000/api)
- **System Health & Metrics**: [http://localhost:3000/api/health](http://localhost:3000/api/health)

