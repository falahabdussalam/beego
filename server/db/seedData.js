const { db, initDatabase } = require('./database');

const SEED_MERCHANTS = [
  {
    id: 'm1',
    name: 'Al-Bait Kodagu Halal Kitchen',
    category: 'food',
    cuisine: 'Authentic Kodagu Koli Curry, Akki Oti & Halal Pepper Fry',
    rating: 4.97,
    reviewsCount: '1.4k+',
    deliveryTime: '15–25 min',
    deliveryFee: 0.00,
    minOrder: 150.00,
    featuredBadge: '100% Halal Certified',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=700&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1200&q=80',
    location: 'Clock Tower Circle, Virajpet',
    items: [
      {
        id: 'item_101',
        name: 'Coorg Halal Koli Curry with Soft Akki Oti (3 Pcs)',
        price: 260.00,
        desc: 'Succulent fresh halal chicken slow-cooked with fresh ground coconut, roasted black pepper and coriander, served with authentic Coorg rice rotis.',
        image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80',
        category: 'Main Course'
      },
      {
        id: 'item_102',
        name: 'Kodagu Halal Mutton Pepper Fry (Handi Roasted)',
        price: 380.00,
        desc: 'Tender baby mutton pan-roasted in iron wok with hand-crushed Virajpet estate black pepper, shallots, curry leaves, and green chillies.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=300&q=80',
        category: 'Starters'
      },
      {
        id: 'item_103',
        name: 'Kadambuttu (Steamed Rice Dumplings, 4 Pcs) & Chicken Gravy',
        price: 220.00,
        desc: 'Fluffy round steamed broken-rice dumplings drenched in spicy, aromatic Kodagu chicken pepper gravy.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80',
        category: 'Traditional'
      },
      {
        id: 'item_104',
        name: 'Noolputtu (Coorg String Hoppers, 4 Pcs) with Sweetened Coconut Milk',
        price: 160.00,
        desc: 'Delicate hand-pressed steamed rice noodle cakes served with warm, freshly pressed cardamom coconut milk.',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80',
        category: 'Breakfast & Tiffin'
      }
    ]
  },
  {
    id: 'm2',
    name: 'Hotel Capitol Royale Biryani House',
    category: 'food',
    cuisine: 'Traditional Thalassery & Kodagu Kaima Rice Dum Biryani',
    rating: 4.96,
    reviewsCount: '2.1k+',
    deliveryTime: '20–30 min',
    deliveryFee: 0.00,
    minOrder: 180.00,
    featuredBadge: 'Zabiha Halal',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=700&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=1200&q=80',
    location: 'Main Road (Near Town Police Station), Virajpet',
    items: [
      {
        id: 'item_201',
        name: 'Special Kodagu Mutton Dum Biryani (Jeerakasala Kaima Rice)',
        price: 340.00,
        desc: 'Tender halal mutton dum-cooked in pure ghee with fragrant short-grain jeerakasala rice, golden fried onions, cashews, raita, and date pickle.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
        category: 'Biryani'
      },
      {
        id: 'item_202',
        name: 'Halal Chicken Dum Biryani with Egg & Mint Raita',
        price: 240.00,
        desc: 'Marinated farm chicken steeped in Malabar spices and layered with aromatic kaima rice, boiled egg, and roasted nuts.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
        category: 'Biryani'
      },
      {
        id: 'item_203',
        name: 'Coorg Bird-Eye Chilly Chicken Al-Fahm (Half)',
        price: 290.00,
        desc: "Charcoal-grilled juicy halal chicken marinated in fiery local bird's eye chillies, mint, garlic, and wild coriander.",
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80',
        category: 'Charcoal Grills'
      },
      {
        id: 'item_204',
        name: 'Ghee Rice (Nei Choru) with Halal Pepper Chicken Sukka',
        price: 220.00,
        desc: 'Fragrant kaima rice tempered in pure desi ghee, served with thick dry-roasted Kodagu pepper chicken.',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281788?auto=format&fit=crop&w=300&q=80',
        category: 'Combos'
      }
    ]
  },
  {
    id: 'm3',
    name: 'Crown Halal Bakes & Confectionery',
    category: 'desserts',
    cuisine: 'Halal Desserts, Chatti Pathiri, Honey Cakes & Falooda',
    rating: 4.94,
    reviewsCount: '1.8k+',
    deliveryTime: '15–20 min',
    deliveryFee: 25.00,
    minOrder: 100.00,
    featuredBadge: 'Oven Fresh Daily',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=700&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    location: 'Malabar Road, Virajpet',
    items: [
      {
        id: 'item_301',
        name: 'Coorg Forest Honey & Vanilla Tea Cake (500g)',
        price: 250.00,
        desc: 'Soft, moist bakery sponge cake baked with fresh butter and authentic sweet Coorg wild forest honey.',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=300&q=80',
        category: 'Cakes'
      },
      {
        id: 'item_302',
        name: 'Sweet Unnakaya (Stuffed Golden Plantains, 4 Pcs)',
        price: 110.00,
        desc: 'Traditional spindle-shaped treat made of boiled ripe plantain stuffed with sweet coconut, cardamom, and roasted raisins.',
        image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=300&q=80',
        category: 'Sweets'
      },
      {
        id: 'item_303',
        name: 'Royal Malabar Falooda with Rose Milk & Pistachios',
        price: 140.00,
        desc: 'Chilled dessert drink layered with rose syrup, vermicelli, sabja seeds, creamy vanilla ice cream, and chopped roasted nuts.',
        image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=80',
        category: 'Beverages'
      },
      {
        id: 'item_304',
        name: 'Erachi Chatti Pathiri (Layered Savory Meat Pie)',
        price: 240.00,
        desc: 'Famous festive Malabar & Kodagu baked pancake pie layered with spiced halal minced mutton, onions, eggs, and herbs.',
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80',
        category: 'Savory'
      }
    ]
  },
  {
    id: 'm4',
    name: 'Virajpet Estate Roasters & Kaapi House',
    category: 'beverages',
    cuisine: 'Single-Origin Shade-Grown Coorg Coffee & Sulaimani',
    rating: 4.98,
    reviewsCount: '3.4k+',
    deliveryTime: '10–20 min',
    deliveryFee: 20.00,
    minOrder: 80.00,
    featuredBadge: 'Estate Grown',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=700&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80',
    location: 'College Road, Virajpet',
    items: [
      {
        id: 'item_401',
        name: 'Virajpet Pure Arabica Filter Kaapi Flask (Serves 2)',
        price: 90.00,
        desc: 'Freshly decocted pure shade-grown plantation coffee with rich frothy milk, delivered hot in a spill-proof thermal flask.',
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80',
        category: 'Coffee'
      },
      {
        id: 'item_402',
        name: 'Spiced Ginger-Cardamom Sulaimani Tea with Fresh Mint (Serves 2)',
        price: 60.00,
        desc: 'Traditional fragrant black tea brewed with crushed Coorg green cardamom, dry ginger, fresh mint leaves and lemon.',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80',
        category: 'Tea'
      },
      {
        id: 'item_403',
        name: 'Hot Kerala Banana Fritters (Pazham Pori, 4 Pcs)',
        price: 70.00,
        desc: 'Ripe sweet nendran bananas dipped in spiced batter and fried golden crisp. The ultimate evening tea snack.',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80',
        category: 'Snacks'
      },
      {
        id: 'item_404',
        name: 'Traditional Pure Ghee Mysore Pak (250g Box)',
        price: 180.00,
        desc: 'Melt-in-mouth traditional sweet confection crafted with roasted gram flour, pure cow ghee and sugar.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=300&q=80',
        category: 'Sweets'
      }
    ]
  },
  {
    id: 'm5',
    name: 'Coorg Heritage Spice & Wild Honey Mandi',
    category: 'grocery',
    cuisine: '100% Pure Forest Raw Honey, Estate Pepper & Kachampuli',
    rating: 4.99,
    reviewsCount: '4.2k+',
    deliveryTime: '20–30 min',
    deliveryFee: 30.00,
    minOrder: 200.00,
    featuredBadge: '100% Natural Harvest',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=700&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
    location: 'Market Road, Near Clock Tower, Virajpet',
    items: [
      {
        id: 'item_501',
        name: 'Virajpet Pure Wild Forest Raw Honey (500g Glass Jar)',
        price: 440.00,
        desc: '100% unfiltered, unpasteurized natural honey collected by local tribes from cliff hives in Kodagu forests.',
        image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80',
        category: 'Forest Produce'
      },
      {
        id: 'item_502',
        name: 'Kodagu Grade-1 Bold Black Pepper (500g Sealed Pack)',
        price: 390.00,
        desc: 'Direct harvest from Virajpet coffee estates. Handpicked sun-dried bold black peppercorns with intense aroma.',
        image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80',
        category: 'Estate Spices'
      },
      {
        id: 'item_503',
        name: 'Authentic Coorg Homemade Kachampuli Extract (150ml Bottle)',
        price: 230.00,
        desc: 'Traditional Kodagu tart souring vinegar extracted by slow simmering ripe Kodampuli fruits. Essential for Coorg curries.',
        image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=300&q=80',
        category: 'Kodagu Specialties'
      },
      {
        id: 'item_504',
        name: 'Coorg Green Cardamom (8mm Super Bold, 250g)',
        price: 560.00,
        desc: 'Highest grade plantation green cardamom pods with potent natural oils and sweet floral fragrance.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=300&q=80',
        category: 'Estate Spices'
      }
    ]
  },
  {
    id: 'm8',
    name: 'Virajpet Daily Mandi & Halal Provisions',
    category: 'grocery',
    cuisine: 'Fresh Farm Produce, Ponni Boiled Rice, Pure Oils & Eggs',
    rating: 4.95,
    reviewsCount: '2.8k+',
    deliveryTime: '15–25 min',
    deliveryFee: 20.00,
    minOrder: 150.00,
    featuredBadge: 'Daily Fresh Harvest',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=1200&q=80',
    location: 'Bazaar Street (Opp. Old Bus Stand), Virajpet',
    items: [
      {
        id: 'item_801',
        name: 'Kodagu Farm Fresh Halal Eggs (Crate of 30 Eggs)',
        price: 195.00,
        desc: 'Country farm fresh halal certified brown eggs packed securely in shock-resistant crates.',
        image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80',
        category: 'Dairy & Eggs'
      },
      {
        id: 'item_802',
        name: 'Traditional Aged Ponni Boiled Rice (5kg Sealed Bag)',
        price: 320.00,
        desc: 'Premium short-grain boiled rice ideal for akki roti, steamed rice, and authentic daily Kodagu lunches.',
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80',
        category: 'Grains & Rice'
      },
      {
        id: 'item_803',
        name: 'Pure Cold-Pressed Coconut Cooking Oil (1L Bottle)',
        price: 240.00,
        desc: '100% natural expeller-pressed unrefined coconut oil with fresh tropical aroma for authentic cooking.',
        image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=300&q=80',
        category: 'Oils & Ghee'
      },
      {
        id: 'item_804',
        name: 'Fresh Estate Bird-Eye Chillies & Ginger Pack (250g)',
        price: 55.00,
        desc: 'Pungent local hot bird-eye chillies and aromatic tender Kodagu ginger roots harvested this morning.',
        image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=300&q=80',
        category: 'Fresh Produce'
      }
    ]
  },
  {
    id: 'm9',
    name: 'Virajpet Central Town Pharmacy & Medico',
    category: 'medicine',
    cuisine: 'First Aid, Wellness, Mountain Pain Balms & Prescriptions',
    rating: 4.99,
    reviewsCount: '3.9k+',
    deliveryTime: '10–20 min',
    deliveryFee: 15.00,
    minOrder: 50.00,
    featuredBadge: 'Licensed Pharmacist Verified',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=700&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=1200&q=80',
    location: 'Hospital Road, Near Government Hospital, Virajpet',
    items: [
      {
        id: 'item_901',
        name: 'Coorg Nilgiri & Eucalyptus Herbal Pain Balm (50g)',
        price: 95.00,
        desc: 'Authentic Kodagu mountain herbal balm with pure eucalyptus and clove oil for joint relief and congestion.',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80',
        category: 'Wellness & Pain'
      },
      {
        id: 'item_902',
        name: 'Family First Aid & Antiseptic Emergency Kit',
        price: 280.00,
        desc: 'Includes Dettol antiseptic (100ml), sterile gauze bandages, waterproof band-aids (20s), cotton roll, and medical tape.',
        image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=300&q=80',
        category: 'First Aid'
      },
      {
        id: 'item_903',
        name: 'Electral Oral Rehydration Salts WHO Formula (Pack of 5)',
        price: 110.00,
        desc: 'Instant energy and essential electrolyte rehydration drink mix with zinc, sodium and potassium.',
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=300&q=80',
        category: 'Nutrition'
      },
      {
        id: 'item_904',
        name: 'Digital Rapid Clinical Thermometer with LCD Alert',
        price: 175.00,
        desc: 'Waterproof high-precision instant digital temperature thermometer with LCD display and auto power-off.',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&q=80',
        category: 'Devices'
      }
    ]
  },
  {
    id: 'm6',
    name: 'Al-Madeena Arabian & Charcoal Court',
    category: 'food',
    cuisine: 'Authentic Halal Chicken Mandi, Shawarma & Tandoori',
    rating: 4.93,
    reviewsCount: '1.2k+',
    deliveryTime: '25–35 min',
    deliveryFee: 0.00,
    minOrder: 180.00,
    featuredBadge: '100% Halal Certified',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=700&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    location: 'Gonikoppal Road, Virajpet',
    items: [
      {
        id: 'item_601',
        name: 'Special Halal Chicken Mandi Platter (Serves 2)',
        price: 380.00,
        desc: 'Whole chicken slow-roasted in underground tandoor over long-grain fragrant spiced rice, served with spicy tomato dakous and toum.',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
        category: 'Arabian'
      },
      {
        id: 'item_602',
        name: 'Tandoori Halal Chicken Full (Charcoal Roasted)',
        price: 390.00,
        desc: 'Whole fresh halal chicken marinated in thick hung curd, Kashmiri degi mirch and aromatic spices, roasted in clay tandoor.',
        image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80',
        category: 'Tandoori'
      },
      {
        id: 'item_603',
        name: 'Jumbo Halal Chicken Shawarma Roll',
        price: 120.00,
        desc: 'Thinly shaved rotisserie spiced chicken, pickled cucumbers, garlic toum, and green chillies in fluffy khubbus.',
        image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=300&q=80',
        category: 'Wraps & Rolls'
      }
    ]
  }
];

const SEED_PROMOS = [
  {
    code: 'BEEGO10',
    type: 'PERCENTAGE',
    value: 10.0,
    min_order: 100.0,
    max_discount: 100.0,
    description: '10% discount on entire order'
  },
  {
    code: 'BEEGOFIRST',
    type: 'FREE_DELIVERY',
    value: 25.0,
    min_order: 100.0,
    max_discount: 40.0,
    description: 'Complimentary Virajpet town delivery'
  },
  {
    code: 'FREEDEL',
    type: 'FREE_DELIVERY',
    value: 25.0,
    min_order: 100.0,
    max_discount: 40.0,
    description: 'Free delivery voucher'
  },
  {
    code: 'KODAGU50',
    type: 'FLAT',
    value: 50.0,
    min_order: 300.0,
    max_discount: 50.0,
    description: 'Flat ₹50 OFF on Kodagu special orders'
  }
];

/**
 * Seed database if tables are empty
 */
function seedDatabase(options = {}) {
  initDatabase();

  const isForce = options.force || process.argv.includes('--force');

  if (isForce) {
    db.prepare('DELETE FROM orders').run();
    db.prepare('DELETE FROM wallet_transactions').run();
    db.prepare("UPDATE users SET name = 'Falah Abdulla', phone = '+91 98451 23456', email = 'falah.kodagu@gmail.com', avatar_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&h=180&q=80', location = 'Virajpet Town, Kodagu 571218', wallet_balance = 0.00 WHERE id = 'user_falah'").run();
    console.log('[Seed] Cleared orders and reset wallet balance to 0.00.');
  }

  // Ensure default user has consistent baseline values
  try {
    db.prepare("UPDATE users SET name = 'Falah Abdulla', phone = '+91 98451 23456', email = 'falah.kodagu@gmail.com', location = 'Virajpet Town, Kodagu 571218' WHERE id = 'user_falah'").run();
  } catch (e) {}

  // Ensure legacy courier merchants and items are purged from existing database
  try {
    db.prepare("DELETE FROM menu_items WHERE merchant_id = 'm7'").run();
    db.prepare("DELETE FROM merchants WHERE id = 'm7' OR category = 'courier'").run();
  } catch (e) {}

  const countMerchants = db.prepare('SELECT COUNT(*) as count FROM merchants').get().count;
  if (countMerchants > 0) {
    return; // Merchants and catalog already seeded
  }

  console.log('[Seed] Seeding BEEGO database with Virajpet merchants & authentic Kodagu data...');

  const insertMerchant = db.prepare(`
    INSERT INTO merchants (id, name, category, cuisine, rating, reviews_count, delivery_time, delivery_fee, min_order, featured_badge, image, banner_image, location)
    VALUES (@id, @name, @category, @cuisine, @rating, @reviewsCount, @deliveryTime, @deliveryFee, @minOrder, @featuredBadge, @image, @bannerImage, @location)
  `);

  const insertMenuItem = db.prepare(`
    INSERT INTO menu_items (id, merchant_id, name, price, description, image, category)
    VALUES (@id, @merchant_id, @name, @price, @desc, @image, @category)
  `);

  const insertPromo = db.prepare(`
    INSERT INTO promos (code, type, value, min_order, max_discount, description)
    VALUES (@code, @type, @value, @min_order, @max_discount, @description)
  `);

  const seedTransaction = db.transaction(() => {
    // 1. Seed Merchants & Menu Items
    for (const m of SEED_MERCHANTS) {
      insertMerchant.run({
        id: m.id,
        name: m.name,
        category: m.category,
        cuisine: m.cuisine,
        rating: m.rating,
        reviewsCount: m.reviewsCount,
        deliveryTime: m.deliveryTime,
        deliveryFee: m.deliveryFee,
        minOrder: m.minOrder,
        featuredBadge: m.featuredBadge,
        image: m.image,
        bannerImage: m.bannerImage,
        location: m.location
      });

      for (const item of m.items) {
        insertMenuItem.run({
          id: item.id,
          merchant_id: m.id,
          name: item.name,
          price: item.price,
          desc: item.desc,
          image: item.image,
          category: item.category || 'Specialty'
        });
      }
    }

    // 2. Seed Promo Codes
    for (const p of SEED_PROMOS) {
      insertPromo.run(p);
    }

    // 3. Seed Default User (Falah Abdulla)
    db.prepare(`
      INSERT INTO users (id, name, email, phone, avatar_url, membership, wallet_balance, spice_level, eco_pack)
      VALUES ('user_falah', 'Falah Abdulla', 'falah@beego.in', '+91 98452 71098', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80', 'Royale Member Active', 0.00, 'medium', 1)
    `).run();

    // 4. Seed Saved Addresses
    const insertAddr = db.prepare(`
      INSERT INTO addresses (id, user_id, title, subtitle, address_line, landmark, lat, lng, preset, is_default)
      VALUES (@id, @user_id, @title, @subtitle, @address_line, @landmark, @lat, @lng, @preset, @is_default)
    `);

    insertAddr.run({
      id: 'addr_1',
      user_id: 'user_falah',
      title: 'Clock Tower Circle, Virajpet',
      subtitle: 'Main Road, Beside Jamia Masjid, Virajpet 571218',
      address_line: 'Clock Tower Circle, Main Road, Virajpet 571218',
      landmark: 'Jamia Masjid',
      lat: 12.2015,
      lng: 75.8034,
      preset: 'Home',
      is_default: 1
    });

    insertAddr.run({
      id: 'addr_2',
      user_id: 'user_falah',
      title: 'Kaveri Layout, College Road',
      subtitle: 'Near Kaveri Women’s College, Virajpet 571218',
      address_line: 'Kaveri Layout, College Road, Virajpet 571218',
      landmark: 'Kaveri College',
      lat: 12.2052,
      lng: 75.8068,
      preset: 'Work',
      is_default: 0
    });

    insertAddr.run({
      id: 'addr_3',
      user_id: 'user_falah',
      title: 'Malabar Road, Near Bilal Masjid',
      subtitle: 'Malabar Road, Meenupet Area, Virajpet 571218',
      address_line: 'Malabar Road, Meenupet Area, Virajpet 571218',
      landmark: 'Bilal Masjid',
      lat: 12.1985,
      lng: 75.8012,
      preset: 'Other',
      is_default: 0
    });

    // 5. Clean Slate: No demo orders or artificial transactions
    // Real orders and top-ups will be placed by the customer and recorded live!
  });

  seedTransaction();
  console.log('[Seed] Database seeding completed successfully (clean state: 0 demo orders, 0 fake transactions).');
}

if (require.main === module) {
  seedDatabase();
  console.log('Seed executed as standalone script.');
}

module.exports = {
  seedDatabase,
  SEED_MERCHANTS,
  SEED_PROMOS
};
