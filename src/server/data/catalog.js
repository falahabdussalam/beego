/**
 * Catalog Data Service for BeeGo Delivery
 * Initial seed records and query methods for stores, categories, and products in Virajpete, Kodagu.
 */

export const INITIAL_STORES = [
  {
    id: 'store_coorg_heritage',
    name: 'Coorg Heritage Kitchen',
    type: 'Restaurant',
    categoryName: 'Food & Dining',
    address: 'Near Clock Tower, Main Road, Virajpete',
    lat: 12.2041,
    lng: 75.8039,
    rating: 4.9,
    deliveryTimeMinutes: '25-30',
    distanceKm: 0.6,
    minOrderAmount: 150,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257111',
  },
  {
    id: 'store_viraj_provisions',
    name: 'Virajpet Central Super Store',
    type: 'Supermarket',
    categoryName: 'Grocery & Essentials',
    address: 'Market Road, Telugubedha, Virajpete',
    lat: 12.2065,
    lng: 75.8021,
    rating: 4.8,
    deliveryTimeMinutes: '20-25',
    distanceKm: 0.8,
    minOrderAmount: 99,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257222',
  },
  {
    id: 'store_city_pharmacy',
    name: 'City Care Licensed Pharmacy',
    type: 'Pharmacy',
    categoryName: 'Pharmacy & Healthcare',
    address: 'Opposite Government Hospital Road, Virajpete',
    lat: 12.2025,
    lng: 75.8055,
    rating: 4.9,
    deliveryTimeMinutes: '15-20',
    distanceKm: 0.4,
    minOrderAmount: 50,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257333',
    licenseNumber: 'KA-KOD-2024-DRUG-0482',
  },
  {
    id: 'store_nandini_parlour',
    name: 'Nandini Milk Parlour & Dairy',
    type: 'Dairy',
    categoryName: 'Milk & Fresh Dairy',
    address: 'Bus Stand Junction, Virajpete',
    lat: 12.2050,
    lng: 75.8048,
    rating: 4.8,
    deliveryTimeMinutes: '15-25',
    distanceKm: 0.5,
    minOrderAmount: 40,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257444',
  },
  {
    id: 'store_maletirike_greens',
    name: 'Maletirike Fresh Farm Produce',
    type: 'Produce',
    categoryName: 'Fruits & Vegetables',
    address: 'Maletirike Road, Virajpete',
    lat: 12.2070,
    lng: 75.8120,
    rating: 4.7,
    deliveryTimeMinutes: '20-30',
    distanceKm: 1.1,
    minOrderAmount: 80,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257555',
  },
  {
    id: 'store_royal_bakery',
    name: 'Royal Bakery & Coorg Coffee Bar',
    type: 'Bakery & Cafe',
    categoryName: 'Beverages & Snacks',
    address: 'Clock Tower Circle, Virajpete',
    lat: 12.2038,
    lng: 75.8035,
    rating: 4.9,
    deliveryTimeMinutes: '20-25',
    distanceKm: 0.2,
    minOrderAmount: 100,
    isOpen: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    phone: '+91 8274 257666',
  },
];

export const INITIAL_PRODUCTS = [
  // --- Food & Dining ---
  {
    id: 'prod_pandi_curry_meal',
    name: 'Traditional Kodava Pandi Curry with Akki Roti (2 pcs)',
    categoryId: 'food-dining',
    categoryName: 'Food & Restaurants',
    storeId: 'store_coorg_heritage',
    storeName: 'Coorg Heritage Kitchen',
    description: 'Authentic Kodava pork delicacy slow-cooked with roasted spices and dark Coorg kachampuli vinegar. Served hot with 2 soft Akki Rotis.',
    price: 260.00,
    originalPrice: 290.00,
    discountPercent: 10,
    unit: '1 Meal Box',
    stock: 25,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    tags: ['Coorg Special', 'Hot Meal', 'Bestseller'],
  },
  {
    id: 'prod_coorg_chicken_curry',
    name: 'Coorg Country Chicken Curry with Ghee Rice',
    categoryId: 'food-dining',
    categoryName: 'Food & Restaurants',
    storeId: 'store_coorg_heritage',
    storeName: 'Coorg Heritage Kitchen',
    description: 'Tender chicken simmered in rich roasted coconut and coriander masala, accompanied by fragrant aromatic Jeera Ghee Rice.',
    price: 240.00,
    originalPrice: 270.00,
    discountPercent: 11,
    unit: '1 Meal Box',
    stock: 20,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    tags: ['Chicken', 'Dinner', 'Bestseller'],
  },
  {
    id: 'prod_neer_dosa_platter',
    name: 'Soft Neer Dosa Platter (4 pcs) with Veg Korma & Chutney',
    categoryId: 'food-dining',
    categoryName: 'Food & Restaurants',
    storeId: 'store_coorg_heritage',
    storeName: 'Coorg Heritage Kitchen',
    description: 'Delicate, lacy coastal Karnataka rice crepes paired with mixed vegetable coconut stew and fresh coconut chutney.',
    price: 130.00,
    originalPrice: 150.00,
    discountPercent: 13,
    unit: '4 Pieces',
    stock: 35,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    tags: ['Breakfast', 'Vegetarian'],
  },

  // --- Groceries & Staples ---
  {
    id: 'prod_coorg_black_pepper',
    name: 'Coorg Estate Whole Black Pepper (Garbled Grade 1)',
    categoryId: 'groceries',
    categoryName: 'Grocery & Staples',
    storeId: 'store_viraj_provisions',
    storeName: 'Virajpet Central Super Store',
    description: 'Directly sourced from high-altitude shade-grown estates around Virajpete. Hand-picked, sundried, highly aromatic and pungent.',
    price: 195.00,
    originalPrice: 230.00,
    discountPercent: 15,
    unit: '200g Pouch',
    stock: 50,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    tags: ['Coorg Spice', 'Organic'],
  },
  {
    id: 'prod_coorg_forest_honey',
    name: 'Pure Wild Coorg Blossom Forest Honey',
    categoryId: 'groceries',
    categoryName: 'Grocery & Staples',
    storeId: 'store_viraj_provisions',
    storeName: 'Virajpet Central Super Store',
    description: '100% raw unpasteurized multifloral honey gathered from Western Ghats apiaries near Virajpete. Rich in natural pollen and enzymes.',
    price: 340.00,
    originalPrice: 390.00,
    discountPercent: 12,
    unit: '500g Glass Jar',
    stock: 40,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    tags: ['Natural', 'Bestseller'],
  },
  {
    id: 'prod_sona_masoori_rice',
    name: 'Premium Aged Sona Masoori Raw Rice',
    categoryId: 'groceries',
    categoryName: 'Grocery & Staples',
    storeId: 'store_viraj_provisions',
    storeName: 'Virajpet Central Super Store',
    description: 'Lightweight, easily digestible, 1-year aged premium daily staple rice. Cleaned and stone-free.',
    price: 320.00,
    originalPrice: 350.00,
    discountPercent: 8,
    unit: '5 kg Bag',
    stock: 60,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    tags: ['Staple', 'Household'],
  },

  // --- Fruits & Vegetables ---
  {
    id: 'prod_coorg_oranges',
    name: 'Fresh Coorg Mandarins (Kodagu Orange)',
    categoryId: 'fruits-vegetables',
    categoryName: 'Fruits & Vegetables',
    storeId: 'store_maletirike_greens',
    storeName: 'Maletirike Fresh Farm Produce',
    description: 'Famous Geographical Indication (GI) tagged Coorg mandarin oranges. Sweet, tangy, aromatic and juicy.',
    price: 90.00,
    originalPrice: 110.00,
    discountPercent: 18,
    unit: '1 kg',
    stock: 30,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    tags: ['Seasonal', 'GI Tag', 'Fresh'],
  },
  {
    id: 'prod_farm_tomatoes',
    name: 'Country Tomatoes (Nati Tomato)',
    categoryId: 'fruits-vegetables',
    categoryName: 'Fruits & Vegetables',
    storeId: 'store_maletirike_greens',
    storeName: 'Maletirike Fresh Farm Produce',
    description: 'Freshly harvested desi red tomatoes with rich pulp and pleasant tart flavor. Ideal for curries and rasam.',
    price: 38.00,
    originalPrice: 45.00,
    discountPercent: 15,
    unit: '1 kg',
    stock: 45,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
    tags: ['Daily Veg', 'Fresh'],
  },

  // --- Pharmacy & Medicines ---
  {
    id: 'prod_paracetamol_650',
    name: 'Dolo 650mg Paracetamol Tablets',
    categoryId: 'pharmacy-medicines',
    categoryName: 'Pharmacy & Healthcare',
    storeId: 'store_city_pharmacy',
    storeName: 'City Care Licensed Pharmacy',
    description: 'Effective fever and mild to moderate pain relief. Over-The-Counter (OTC) medication.',
    price: 32.00,
    originalPrice: 34.00,
    discountPercent: 5,
    unit: 'Strip of 15 Tablets',
    stock: 80,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    tags: ['OTC', 'Fever', 'Essentials'],
  },
  {
    id: 'prod_amox_clav_625',
    name: 'Augmentin 625 Duo Tablet (Amoxicillin + Potassium Clavulanate)',
    categoryId: 'pharmacy-medicines',
    categoryName: 'Pharmacy & Healthcare',
    storeId: 'store_city_pharmacy',
    storeName: 'City Care Licensed Pharmacy',
    description: 'Schedule H Prescription Drug. Broad-spectrum antibacterial medicine. Mandatory valid doctor prescription verification required under Indian drug rules prior to dispatch.',
    price: 185.00,
    originalPrice: 205.00,
    discountPercent: 10,
    unit: 'Strip of 10 Tablets',
    stock: 25,
    isPrescriptionRequired: true,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    tags: ['Schedule H', 'Prescription Required', 'Antibiotic'],
  },
  {
    id: 'prod_ors_tetrapack',
    name: 'Electral ORS Ready-to-Drink Solution (Apple Flavor)',
    categoryId: 'pharmacy-medicines',
    categoryName: 'Pharmacy & Healthcare',
    storeId: 'store_city_pharmacy',
    storeName: 'City Care Licensed Pharmacy',
    description: 'WHO-formula electrolyte replacement drink for fast recovery from dehydration and exhaustion.',
    price: 35.00,
    originalPrice: 38.00,
    discountPercent: 8,
    unit: '200ml Tetra Pack',
    stock: 50,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    tags: ['OTC', 'Hydration'],
  },

  // --- Milk & Fresh Dairy ---
  {
    id: 'prod_nandini_toned_milk',
    name: 'Nandini Pasteurised Toned Milk (Blue Pouch)',
    categoryId: 'milk-dairy',
    categoryName: 'Milk & Fresh Dairy',
    storeId: 'store_nandini_parlour',
    storeName: 'Nandini Milk Parlour & Dairy',
    description: 'Karnataka Milk Federation (KMF) fresh pasteurised toned milk with 3.0% Fat and 8.5% SNF. Fresh morning batch.',
    price: 24.00,
    originalPrice: 24.00,
    discountPercent: 0,
    unit: '500ml Pouch',
    stock: 100,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    tags: ['Dairy', 'Morning Essential'],
  },
  {
    id: 'prod_nandini_curd',
    name: 'Nandini Special Thick Curd (Mosaru)',
    categoryId: 'milk-dairy',
    categoryName: 'Milk & Fresh Dairy',
    storeId: 'store_nandini_parlour',
    storeName: 'Nandini Milk Parlour & Dairy',
    description: 'Fresh, delicious, thick set curd prepared from homogenized milk. Rich in natural probiotics.',
    price: 28.00,
    originalPrice: 28.00,
    discountPercent: 0,
    unit: '500g Pouch',
    stock: 60,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    tags: ['Curd', 'Probiotic'],
  },
  {
    id: 'prod_nandini_paneer',
    name: 'Nandini Fresh Malai Paneer',
    categoryId: 'milk-dairy',
    categoryName: 'Milk & Fresh Dairy',
    storeId: 'store_nandini_parlour',
    storeName: 'Nandini Milk Parlour & Dairy',
    description: 'Soft, creamy cottage cheese block made with pure cows milk. High protein and ready to cook.',
    price: 95.00,
    originalPrice: 105.00,
    discountPercent: 9,
    unit: '200g Vacuum Pack',
    stock: 35,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    tags: ['Protein', 'Fresh Paneer'],
  },

  // --- Beverages & Snacks ---
  {
    id: 'prod_coorg_filter_coffee',
    name: 'Coorg Traditional Estate Filter Coffee (80:20 Blend)',
    categoryId: 'beverages-snacks',
    categoryName: 'Beverages & Snacks',
    storeId: 'store_royal_bakery',
    storeName: 'Royal Bakery & Coorg Coffee Bar',
    description: 'Freshly roasted and ground Arabica and Robusta estate coffee beans with 20% fine Chicory for an intense decoction.',
    price: 175.00,
    originalPrice: 200.00,
    discountPercent: 12,
    unit: '500g Air-tight Pack',
    stock: 55,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    tags: ['Filter Coffee', 'Coorg Signature'],
  },
  {
    id: 'prod_banana_chips_coconut_oil',
    name: 'Kerala & Coorg Style Crispy Banana Chips in Pure Coconut Oil',
    categoryId: 'beverages-snacks',
    categoryName: 'Beverages & Snacks',
    storeId: 'store_royal_bakery',
    storeName: 'Royal Bakery & Coorg Coffee Bar',
    description: 'Thinly sliced raw Nendran plantains fried crisp in unrefined wood-pressed coconut oil, seasoned with sea salt.',
    price: 90.00,
    originalPrice: 105.00,
    discountPercent: 14,
    unit: '250g Pouch',
    stock: 40,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281699?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    tags: ['Snack', 'Freshly Fried'],
  },

  // --- Household Essentials ---
  {
    id: 'prod_surf_excel_1kg',
    name: 'Surf Excel Easy Wash Detergent Powder',
    categoryId: 'household',
    categoryName: 'Household Essentials',
    storeId: 'store_viraj_provisions',
    storeName: 'Virajpet Central Super Store',
    description: 'Removes tough stains like tea, oil, and mud with ease. Suitable for both hand wash and top-load machines.',
    price: 140.00,
    originalPrice: 155.00,
    discountPercent: 10,
    unit: '1 kg Poly Pack',
    stock: 40,
    isPrescriptionRequired: false,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
    tags: ['Cleaning', 'Daily Essential'],
  },
];

export async function getFeaturedStores() {
  return INITIAL_STORES;
}

export async function getStoreById(id) {
  return INITIAL_STORES.find((s) => s.id === id) || null;
}

export async function getPopularProducts() {
  return INITIAL_PRODUCTS;
}

export async function getDailyOffers() {
  return INITIAL_PRODUCTS.filter((p) => p.discountPercent >= 10);
}

export async function getProductsByCategory(categorySlug) {
  return INITIAL_PRODUCTS.filter((p) => p.categoryId === categorySlug);
}

export async function getProductById(id) {
  return INITIAL_PRODUCTS.find((p) => p.id === id) || null;
}

export async function searchCatalog(query, category, sort) {
  let results = [...INITIAL_PRODUCTS];

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.tags && p.tags.some((t) => t.toLowerCase().includes(q))) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.storeName.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    results = results.filter((p) => p.categoryId === category);
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    results.sort((a, b) => b.price - a.price);
  } else if (sort === 'popular') {
    results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  return results;
}

