# 🐝 BeeGo Delivery — Admin & Dispatch Dashboard

A standalone admin portal engineered specifically for **BeeGo Delivery** in Virajpete, Kodagu.

## 🚀 Quick Start (Standalone Mode)

```bash
cd admin-dashboard
npm install
npm run dev
```

Runs on port **3001** (`http://localhost:3001`) and connects seamlessly to the customer backend on `http://localhost:3000`.

## 📦 Features

1. **Live Syncing**: Any product added or edited, store marked open/closed, or announcement banner published immediately syncs to the customer website.
2. **Products & Inventory**: Full CRUD, original MRP discounts, stock units, Schedule H Rx flags, 1-click In/Out-of-Stock toggle.
3. **Merchant Stores**: Manage Virajpete merchant partners, toggle store availability, edit delivery times and contacts.
4. **Orders & Deliveries**: Real-time order dispatch console with status advance controls (`Placed` → `Confirmed` → `Preparing` → `Out for Delivery` → `Delivered`).
5. **Platform & Announcements**: Set base delivery fees, free delivery threshold, and broadcast alert banners across the customer site.
