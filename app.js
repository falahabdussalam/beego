/**
 * BEEGO Virajpet Edition (Kodagu, Karnataka)
 * 100% Halal Food, Local Coffee & Spices Platform
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. DATA REPOSITORY: 100% HALAL MERCHANTS & OFFERINGS (VIRAJPEE & KODAGU)
  // =========================================================================
  let MERCHANTS_DATA = [
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
          image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_102',
          name: 'Kodagu Halal Mutton Pepper Fry (Handi Roasted)',
          price: 380.00,
          desc: 'Tender baby mutton pan-roasted in iron wok with hand-crushed Virajpet estate black pepper, shallots, curry leaves, and green chillies.',
          image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_103',
          name: 'Kadambuttu (Steamed Rice Dumplings, 4 Pcs) & Chicken Gravy',
          price: 220.00,
          desc: 'Fluffy round steamed broken-rice dumplings drenched in spicy, aromatic Kodagu chicken pepper gravy.',
          image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_104',
          name: 'Noolputtu (Coorg String Hoppers, 4 Pcs) with Sweetened Coconut Milk',
          price: 160.00,
          desc: 'Delicate hand-pressed steamed rice noodle cakes served with warm, freshly pressed cardamom coconut milk.',
          image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=300&q=80'
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
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_202',
          name: 'Halal Chicken Dum Biryani with Egg & Mint Raita',
          price: 240.00,
          desc: 'Marinated farm chicken steeped in Malabar spices and layered with aromatic kaima rice, boiled egg, and roasted nuts.',
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_203',
          name: 'Coorg Bird-Eye Chilly Chicken Al-Fahm (Half)',
          price: 290.00,
          desc: 'Charcoal-grilled juicy halal chicken marinated in fiery local bird\'s eye chillies, mint, garlic, and wild coriander.',
          image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_204',
          name: 'Ghee Rice (Nei Choru) with Halal Pepper Chicken Sukka',
          price: 220.00,
          desc: 'Fragrant kaima rice tempered in pure desi ghee, served with thick dry-roasted Kodagu pepper chicken.',
          image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281788?auto=format&fit=crop&w=300&q=80'
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
          image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_302',
          name: 'Sweet Unnakaya (Stuffed Golden Plantains, 4 Pcs)',
          price: 110.00,
          desc: 'Traditional spindle-shaped treat made of boiled ripe plantain stuffed with sweet coconut, cardamom, and roasted raisins.',
          image: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_303',
          name: 'Royal Malabar Falooda with Rose Milk & Pistachios',
          price: 140.00,
          desc: 'Chilled dessert drink layered with rose syrup, vermicelli, sabja seeds, creamy vanilla ice cream, and chopped roasted nuts.',
          image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_304',
          name: 'Erachi Chatti Pathiri (Layered Savory Meat Pie)',
          price: 240.00,
          desc: 'Famous festive Malabar & Kodagu baked pancake pie layered with spiced halal minced mutton, onions, eggs, and herbs.',
          image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80'
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
          image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_402',
          name: 'Spiced Ginger-Cardamom Sulaimani Tea with Fresh Mint (Serves 2)',
          price: 60.00,
          desc: 'Traditional fragrant black tea brewed with crushed Coorg green cardamom, dry ginger, fresh mint leaves and lemon.',
          image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_403',
          name: 'Hot Kerala Banana Fritters (Pazham Pori, 4 Pcs)',
          price: 70.00,
          desc: 'Ripe sweet nendran bananas dipped in spiced batter and fried golden crisp. The ultimate evening tea snack.',
          image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_404',
          name: 'Traditional Pure Ghee Mysore Pak (250g Box)',
          price: 180.00,
          desc: 'Melt-in-mouth traditional sweet confection crafted with roasted gram flour, pure cow ghee and sugar.',
          image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=300&q=80'
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
          image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_502',
          name: 'Kodagu Grade-1 Bold Black Pepper (500g Sealed Pack)',
          price: 390.00,
          desc: 'Direct harvest from Virajpet coffee estates. Handpicked sun-dried bold black peppercorns with intense aroma.',
          image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_503',
          name: 'Authentic Coorg Homemade Kachampuli Extract (150ml Bottle)',
          price: 230.00,
          desc: 'Traditional Kodagu tart souring vinegar extracted by slow simmering ripe Kodampuli fruits. Essential for Coorg curries.',
          image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_504',
          name: 'Coorg Green Cardamom (8mm Super Bold, 250g)',
          price: 560.00,
          desc: 'Highest grade plantation green cardamom pods with potent natural oils and sweet floral fragrance.',
          image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=300&q=80'
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
          image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_802',
          name: 'Traditional Aged Ponni Boiled Rice (5kg Sealed Bag)',
          price: 320.00,
          desc: 'Premium short-grain boiled rice ideal for akki roti, steamed rice, and authentic daily Kodagu lunches.',
          image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_803',
          name: 'Pure Cold-Pressed Coconut Cooking Oil (1L Bottle)',
          price: 240.00,
          desc: '100% natural expeller-pressed unrefined coconut oil with fresh tropical aroma for authentic cooking.',
          image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_804',
          name: 'Fresh Estate Bird-Eye Chillies & Ginger Pack (250g)',
          price: 55.00,
          desc: 'Pungent local hot bird-eye chillies and aromatic tender Kodagu ginger roots harvested this morning.',
          image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=300&q=80'
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
          image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_902',
          name: 'Family First Aid & Antiseptic Emergency Kit',
          price: 280.00,
          desc: 'Includes Dettol antiseptic (100ml), sterile gauze bandages, waterproof band-aids (20s), cotton roll, and medical tape.',
          image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_903',
          name: 'Electral Oral Rehydration Salts WHO Formula (Pack of 5)',
          price: 110.00,
          desc: 'Instant energy and essential electrolyte rehydration drink mix with zinc, sodium and potassium.',
          image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_904',
          name: 'Digital Rapid Clinical Thermometer with LCD Alert',
          price: 175.00,
          desc: 'Waterproof high-precision instant digital temperature thermometer with LCD display and auto power-off.',
          image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&q=80'
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
          image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_602',
          name: 'Tandoori Halal Chicken Full (Charcoal Roasted)',
          price: 390.00,
          desc: 'Whole fresh halal chicken marinated in thick hung curd, Kashmiri degi mirch and aromatic spices, roasted in clay tandoor.',
          image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80'
        },
        {
          id: 'item_603',
          name: 'Jumbo Halal Chicken Shawarma Roll',
          price: 120.00,
          desc: 'Thinly shaved rotisserie spiced chicken, pickled cucumbers, garlic toum, and green chillies in fluffy khubbus.',
          image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=300&q=80'
        }
      ]
    }
  ];

  // =========================================================================
  // 2. STATE MANAGEMENT (VIRAJPEE & INR)
  // =========================================================================
  const state = {
    cart: [],
    currentAddress: 'Clock Tower Circle, Main Road, Virajpet 571218',
    currentCategory: 'all',
    searchQuery: '',
    selectedTip: 0.00,
    appliedPromo: null,
    deliveryFee: 25.00,
    serviceFee: 15.00,
    activeOrder: null
  };

  // Helper for Indian Currency Formatting
  function formatINR(amount) {
    return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  // =========================================================================
  // 3. DOM ELEMENTS SELECTION
  // =========================================================================
  const merchantsGrid = document.getElementById('merchants-grid');
  const emptySearchState = document.getElementById('empty-search-state');
  const emptySearchQuery = document.getElementById('empty-search-query');
  const btnResetSearch = document.getElementById('btn-reset-search');
  const globalSearchInput = document.getElementById('global-search-input');
  const clearSearchBtn = document.getElementById('clear-search');
  const categoryPills = document.querySelectorAll('.cat-pill');
  const heroNavItems = document.querySelectorAll('.hero-nav-item');

  // Hero single-line action bar elements
  const heroServiceMode = document.getElementById('hero-service-mode');
  const heroBtnLabel = document.getElementById('hero-btn-label');
  const btnHeroExplore = document.getElementById('btn-hero-explore');

  // Address picker
  const addressTrigger = document.getElementById('address-trigger');
  const addressModal = document.getElementById('address-modal');
  const btnCloseAddressModal = document.getElementById('btn-close-address-modal');
  const btnCancelAddress = document.getElementById('btn-cancel-address');
  const btnConfirmAddress = document.getElementById('btn-confirm-address');
  const currentAddressText = document.getElementById('current-address-text');

  // Tracking section elements
  const trackingStandbyView = document.getElementById('tracking-standby-view');
  const trackingActiveView = document.getElementById('tracking-active-view');
  const trackingHeadingText = document.getElementById('tracking-heading-text');
  const liveTrackingBadge = document.getElementById('live-tracking-badge');
  const btnToggleTracking = document.getElementById('btn-toggle-tracking-details');
  const toggleTrackingText = document.getElementById('toggle-tracking-text');
  const trackingBody = document.getElementById('tracking-body');
  const trackModalTrigger = document.getElementById('track-modal-trigger');
  const quickTrackLink = document.getElementById('quick-track-link');
  const btnOpenLiveTrack = document.getElementById('btn-open-live-track');
  const btnCallCourier = document.getElementById('btn-call-courier');
  const btnTipCourierNow = document.getElementById('btn-tip-courier-now');

  // Tracking dynamic state helpers
  function showActiveTracking(orderNumber, statusText = 'Freshly Prepared', riderName = 'Mohammed Suhail') {
    state.activeOrder = { orderNumber, statusText, riderName };
    if (trackingStandbyView) trackingStandbyView.style.display = 'none';
    if (trackingActiveView) trackingActiveView.style.display = 'block';
    if (trackingHeadingText) trackingHeadingText.textContent = `Active Delivery: Order #${orderNumber}`;
    if (liveTrackingBadge) liveTrackingBadge.textContent = statusText;
    if (trackModalTrigger) {
      trackModalTrigger.style.display = 'inline-flex';
      const pillText = trackModalTrigger.querySelector('span:last-child');
      if (pillText) pillText.textContent = `Track (#${orderNumber})`;
    }
  }

  function showStandbyTracking() {
    state.activeOrder = null;
    if (trackingStandbyView) trackingStandbyView.style.display = 'block';
    if (trackingActiveView) trackingActiveView.style.display = 'none';
    if (trackModalTrigger) trackModalTrigger.style.display = 'none';
  }

  // Cart drawer elements
  const cartDrawer = document.getElementById('cart-drawer');
  const cartBackdrop = document.getElementById('cart-drawer-backdrop');
  const cartTriggerBtn = document.getElementById('cart-drawer-trigger');
  const btnCloseCart = document.getElementById('btn-close-cart');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartBadgeCount = document.getElementById('cart-badge-count');
  const cartHeaderTotal = document.getElementById('cart-header-total');
  const cartStoreName = document.getElementById('cart-store-name');
  const cartMerchantInfo = document.getElementById('cart-merchant-info');
  const tipButtons = document.querySelectorAll('.tip-btn');
  const promoCodeInput = document.getElementById('promo-code-input');
  const btnApplyPromo = document.getElementById('btn-apply-promo');
  const promoMsg = document.getElementById('promo-msg');
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryDelivery = document.getElementById('summary-delivery');
  const summaryService = document.getElementById('summary-service');
  const summaryDiscountRow = document.getElementById('summary-discount-row');
  const summaryDiscount = document.getElementById('summary-discount');
  const summaryTip = document.getElementById('summary-tip');
  const summaryTotal = document.getElementById('summary-total');
  const btnCheckout = document.getElementById('btn-checkout');
  const btnCheckoutAmount = document.getElementById('btn-checkout-amount');

  // Merchant Store Modal elements
  const merchantModal = document.getElementById('merchant-modal');
  const btnCloseMerchantModal = document.getElementById('btn-close-merchant-modal');
  const modalBannerImg = document.getElementById('modal-banner-img');
  const modalTag = document.getElementById('modal-tag');
  const modalStoreName = document.getElementById('modal-store-name');
  const modalMetaRow = document.getElementById('modal-meta-row');
  const modalMenuList = document.getElementById('modal-menu-list');

  // Checkout Success Modal elements
  const checkoutModal = document.getElementById('checkout-modal');
  const btnCloseCheckoutModal = document.getElementById('btn-close-checkout-modal');
  const confirmedOrderId = document.getElementById('confirmed-order-id');
  const confAddressText = document.getElementById('conf-address-text');
  const confTotalPrice = document.getElementById('conf-total-price');
  const btnTrackNewOrder = document.getElementById('btn-track-new-order');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // =========================================================================
  // 4. RENDER MERCHANTS GRID
  // =========================================================================
  function renderMerchants() {
    const filtered = MERCHANTS_DATA.filter(merchant => {
      // Category check
      const matchesCategory = state.currentCategory === 'all' || merchant.category === state.currentCategory;
      
      // Search check
      const q = state.searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        merchant.name.toLowerCase().includes(q) ||
        merchant.cuisine.toLowerCase().includes(q) ||
        merchant.items.some(i => i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      merchantsGrid.innerHTML = '';
      emptySearchState.style.display = 'block';
      emptySearchQuery.textContent = state.searchQuery || state.currentCategory;
      return;
    }

    emptySearchState.style.display = 'none';

    merchantsGrid.innerHTML = filtered.map(m => {
      const feeFormatted = m.deliveryFee === 0 ? 'Free delivery' : `${formatINR(m.deliveryFee)} delivery`;
      return `
        <article class="merchant-card" data-merchant-id="${m.id}" tabindex="0" role="button" aria-label="View menu for ${m.name}">
          <div class="merchant-thumb-wrap">
            <img src="${m.image}" alt="${m.name}" class="merchant-thumb" loading="lazy">
            <div class="merchant-time-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span>${m.deliveryTime}</span>
            </div>
            ${m.featuredBadge ? `<span class="merchant-featured-badge">${m.featuredBadge}</span>` : ''}
          </div>
          <div class="merchant-info">
            <div class="merchant-header">
              <h3 class="merchant-title">${m.name}</h3>
              <div class="merchant-rating">
                <span>★</span>
                <span>${m.rating.toFixed(2)}</span>
              </div>
            </div>
            <p class="merchant-cuisine">${m.cuisine}</p>
            <div class="merchant-meta-footer">
              <span class="merchant-fee">${feeFormatted}</span>
              <span class="merchant-view-action">
                <span>Explore Menu</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </span>
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Attach card click handlers
    document.querySelectorAll('.merchant-card').forEach(card => {
      card.addEventListener('click', () => {
        const merchantId = card.getAttribute('data-merchant-id');
        openMerchantModal(merchantId);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const merchantId = card.getAttribute('data-merchant-id');
          openMerchantModal(merchantId);
        }
      });
    });
  }

  // =========================================================================
  // 5. MERCHANT STORE MODAL
  // =========================================================================
  function openMerchantModal(merchantId) {
    const merchant = MERCHANTS_DATA.find(m => m.id === merchantId);
    if (!merchant) return;

    modalBannerImg.style.backgroundImage = `url('${merchant.bannerImage}')`;
    modalTag.textContent = merchant.featuredBadge || '100% Halal';
    modalStoreName.textContent = merchant.name;
    modalMetaRow.innerHTML = `
      <span>★ ${merchant.rating.toFixed(2)} (${merchant.reviewsCount} reviews)</span>
      <span>•</span>
      <span>${merchant.deliveryTime} delivery</span>
      <span>•</span>
      <span>${merchant.location}</span>
    `;

    modalMenuList.innerHTML = merchant.items.map(item => `
      <div class="menu-item-card">
        <div class="menu-item-text">
          <span class="item-name">${item.name}</span>
          <p class="item-desc">${item.desc}</p>
          <div class="item-bottom-row">
            <span class="item-price">${formatINR(item.price)}</span>
            <button class="btn-add-item" data-store-id="${merchant.id}" data-item-id="${item.id}">
              + Add to Basket
            </button>
          </div>
        </div>
        <img src="${item.image}" alt="${item.name}" class="menu-item-img" loading="lazy">
      </div>
    `).join('');

    // Attach Add to cart clicks
    modalMenuList.querySelectorAll('.btn-add-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const sId = btn.getAttribute('data-store-id');
        const iId = btn.getAttribute('data-item-id');
        addItemToCart(sId, iId);
      });
    });

    merchantModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeMerchantModal() {
    merchantModal.style.display = 'none';
    document.body.style.overflow = '';
  }

  btnCloseMerchantModal.addEventListener('click', closeMerchantModal);
  merchantModal.addEventListener('click', (e) => {
    if (e.target === merchantModal) closeMerchantModal();
  });

  // =========================================================================
  // 6. CART MANAGEMENT & FINANCIALS (VIRAJPEE & INR)
  // =========================================================================
  function addItemToCart(storeId, itemId) {
    const store = MERCHANTS_DATA.find(m => m.id === storeId);
    if (!store) return;
    const item = store.items.find(i => i.id === itemId);
    if (!item) return;

    // If adding from different store, notify customer
    const existingDifferentStore = state.cart.find(c => c.storeId !== storeId);
    if (existingDifferentStore) {
      if (!confirm(`Your basket contains items from ${existingDifferentStore.storeName}. Would you like to clear it and start an order from ${store.name}?`)) {
        return;
      }
      state.cart = [];
    }

    const existingItem = state.cart.find(c => c.item.id === itemId);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      state.cart.push({
        storeId: store.id,
        storeName: store.name,
        item: { ...item },
        qty: 1
      });
    }

    updateCartUI();
    showToast(`Added "${item.name}" to your basket.`);
  }

  function adjustCartItemQty(itemId, delta) {
    const itemIndex = state.cart.findIndex(c => c.item.id === itemId);
    if (itemIndex > -1) {
      state.cart[itemIndex].qty += delta;
      if (state.cart[itemIndex].qty <= 0) {
        state.cart.splice(itemIndex, 1);
        showToast('Item removed from basket.');
      }
    }
    updateCartUI();
  }

  function updateCartUI() {
    const totalCount = state.cart.reduce((sum, c) => sum + c.qty, 0);
    cartBadgeCount.textContent = totalCount;

    if (totalCount > 0) {
      cartBadgeCount.style.display = 'inline-flex';
      cartHeaderTotal.style.display = 'inline-block';
      if (cartMerchantInfo) cartMerchantInfo.style.display = 'flex';
    } else {
      cartBadgeCount.style.display = 'none';
      cartHeaderTotal.style.display = 'none';
      if (cartMerchantInfo) cartMerchantInfo.style.display = 'none';
    }

    // Subtotal
    const subtotal = state.cart.reduce((sum, c) => sum + (c.item.price * c.qty), 0);

    // Delivery fee (free if promo, empty, or order > 199 in Virajpet)
    let currentDelivery = state.cart.length > 0 ? state.deliveryFee : 0;
    if (subtotal >= 199.00 || (state.appliedPromo && state.appliedPromo.freeDelivery)) {
      currentDelivery = 0;
    }

    // Discount
    let discount = 0;
    if (state.appliedPromo && state.appliedPromo.discountRate) {
      discount = subtotal * state.appliedPromo.discountRate;
    }

    const tip = state.cart.length > 0 ? state.selectedTip : 0;
    const service = state.cart.length > 0 ? state.serviceFee : 0;
    const grandTotal = Math.max(0, subtotal - discount + currentDelivery + service + tip);

    // Update Header
    cartHeaderTotal.textContent = `₹${Math.round(grandTotal).toLocaleString('en-IN')}`;

    // Update Drawer Financials
    summarySubtotal.textContent = formatINR(subtotal);
    summaryDelivery.textContent = currentDelivery === 0 ? (state.cart.length > 0 ? 'FREE' : '₹0.00') : formatINR(currentDelivery);
    summaryService.textContent = formatINR(service);
    summaryTip.textContent = formatINR(tip);
    summaryTotal.textContent = formatINR(grandTotal);
    btnCheckoutAmount.textContent = formatINR(grandTotal);

    if (discount > 0) {
      summaryDiscountRow.style.display = 'flex';
      summaryDiscount.textContent = `-${formatINR(discount)}`;
    } else {
      summaryDiscountRow.style.display = 'none';
    }

    // Update Store Name in drawer
    if (state.cart.length > 0) {
      cartStoreName.textContent = state.cart[0].storeName;
    } else {
      cartStoreName.textContent = 'No Halal Kitchen Selected';
    }

    // Render cart items list
    if (state.cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-view">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          <h4>Your Halal Basket is Empty</h4>
          <p>Explore our authentic Kodagu koli curries, Thalassery biryanis, and estate coffee to begin your order.</p>
        </div>
      `;
      btnCheckout.disabled = true;
      btnCheckout.style.opacity = '0.6';
      btnCheckout.style.cursor = 'not-allowed';
    } else {
      btnCheckout.disabled = false;
      btnCheckout.style.opacity = '1';
      btnCheckout.style.cursor = 'pointer';

      cartItemsContainer.innerHTML = state.cart.map(c => `
        <div class="cart-item-row">
          <div class="cart-item-main">
            <div class="cart-item-name">${c.item.name}</div>
            <div class="cart-item-price">${formatINR(c.item.price * c.qty)} (${formatINR(c.item.price)} each)</div>
          </div>
          <div class="cart-qty-ctrl">
            <button class="qty-btn" data-action="dec" data-item-id="${c.item.id}">−</button>
            <span class="qty-display">${c.qty}</span>
            <button class="qty-btn" data-action="inc" data-item-id="${c.item.id}">+</button>
          </div>
        </div>
      `).join('');

      // Attach listener to quantity buttons
      cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-item-id');
          const action = btn.getAttribute('data-action');
          adjustCartItemQty(id, action === 'inc' ? 1 : -1);
        });
      });
    }
  }

  function openCartDrawer() {
    if (typeof closeProfileDrawer === 'function') {
      closeProfileDrawer();
    }
    cartDrawer.classList.add('open');
    cartBackdrop.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    cartDrawer.classList.remove('open');
    cartBackdrop.style.display = 'none';
    document.body.style.overflow = '';
  }

  cartTriggerBtn.addEventListener('click', openCartDrawer);
  btnCloseCart.addEventListener('click', closeCartDrawer);
  cartBackdrop.addEventListener('click', closeCartDrawer);

  // Tips Selection (Virajpet Rider Tips)
  tipButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tipButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.selectedTip = parseFloat(btn.getAttribute('data-tip')) || 0;
      updateCartUI();
      showToast(`Rider gratuity updated to ₹${state.selectedTip}.`);
    });
  });

  // Promo Code Validation
  btnApplyPromo.addEventListener('click', async () => {
    const code = promoCodeInput.value.trim().toUpperCase();
    promoMsg.style.display = 'block';

    const currentSubtotal = state.cart.reduce((s, c) => s + (c.item?.price || c.price || 0) * c.qty, 0);

    try {
      const res = await fetch('/api/promos/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: currentSubtotal, deliveryFee: state.deliveryFee })
      });

      const promoData = await res.json();
      if (promoData.success && promoData.valid) {
        if (promoData.data.type === 'FREE_DELIVERY') {
          state.appliedPromo = { code, freeDelivery: true };
        } else {
          state.appliedPromo = { code, discountRate: promoData.data.discountAmount / (currentSubtotal || 1) };
        }
        promoMsg.textContent = `✓ ${promoData.data.benefitText}`;
        promoMsg.className = 'promo-status-msg text-success';
        updateCartUI();
        showToast(`Promo code applied: ${promoData.data.benefitText}`);
        return;
      } else {
        promoMsg.textContent = promoData.message || 'Invalid promo code.';
        promoMsg.className = 'promo-status-msg text-maroon';
        return;
      }
    } catch (e) {
      // Fallback local promo validation
    }

    if (code === 'BEEGO10') {
      state.appliedPromo = { code: 'BEEGO10', discountRate: 0.10 };
      promoMsg.textContent = '✓ 10% Virajpet Royale discount applied!';
      promoMsg.className = 'promo-status-msg text-success';
      updateCartUI();
      showToast('Promo code applied: 10% Discount.');
    } else if (code === 'BEEGOFIRST' || code === 'FREEDEL') {
      state.appliedPromo = { code: code, freeDelivery: true };
      promoMsg.textContent = '✓ Complimentary Virajpet town delivery applied!';
      promoMsg.className = 'promo-status-msg text-success';
      updateCartUI();
      showToast('Complimentary Delivery Applied!');
    } else {
      promoMsg.textContent = 'Invalid promo code. Try "BEEGO10" or "BEEGOFIRST"';
      promoMsg.className = 'promo-status-msg text-maroon';
    }
  });

  // Checkout Placement
  btnCheckout.addEventListener('click', async () => {
    if (state.cart.length === 0) return;

    const cartSnapshot = [...state.cart];
    const tipVal = state.selectedTip;
    const promoCodeVal = state.appliedPromo ? state.appliedPromo.code : null;
    const currentAddr = state.currentAddress;
    const currentTotalFormatted = summaryTotal.textContent;

    closeCartDrawer();
    
    // Default fallback order ID
    let finalOrderNum = String(Math.floor(1000 + Math.random() * 9000));
    
    try {
      // Send real order to backend
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: cartSnapshot[0]?.storeId,
          customerName: 'Falah Abdulla',
          deliveryAddress: currentAddr,
          items: cartSnapshot.map(c => ({
            id: c.item?.id || c.id,
            name: c.item?.name || c.name,
            price: c.item?.price || c.price,
            qty: c.qty
          })),
          tip: tipVal,
          promoCode: promoCodeVal,
          paymentMethod: 'UPI'
        })
      });

      if (res.ok) {
        const orderData = await res.json();
        if (orderData.success && orderData.data) {
          finalOrderNum = orderData.data.orderNumber.replace('BG-', '');
          showActiveTracking(orderData.data.orderNumber, 'Freshly Prepared');
          // Subscribe to WebSocket channel for live telemetry
          if (window.beegoWs && window.beegoWs.readyState === 1) {
            window.beegoWs.send(JSON.stringify({
              type: 'subscribe',
              channel: `order:${orderData.data.orderNumber}`
            }));
          }
          fetchUserProfile();
        }
      }
    } catch (e) {
      console.warn('Backend offline, proceeding with client confirmation', e.message);
    }

    confirmedOrderId.textContent = finalOrderNum;
    confAddressText.textContent = currentAddr;
    confTotalPrice.textContent = currentTotalFormatted;

    // Reset Cart
    state.cart = [];
    state.appliedPromo = null;
    promoCodeInput.value = '';
    promoMsg.style.display = 'none';
    updateCartUI();

    // Show confirmation modal
    checkoutModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });

  btnCloseCheckoutModal.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
    document.body.style.overflow = '';
  });

  btnTrackNewOrder.addEventListener('click', () => {
    checkoutModal.style.display = 'none';
    document.body.style.overflow = '';
    document.getElementById('track-section').scrollIntoView({ behavior: 'smooth' });
    showToast('Viewing live Virajpet delivery telemetry.');
  });

  // =========================================================================
  // 7. HERO & BROWSE CATEGORY NAVIGATION & GLOBAL SEARCH
  // =========================================================================
  function updateHeroBtnLabel(mode) {
    if (!heroBtnLabel) return;
    if (mode === 'track') {
      heroBtnLabel.textContent = 'Track Live Order';
    } else if (mode === 'grocery') {
      heroBtnLabel.textContent = 'Explore Fresh Grocery';
    } else if (mode === 'medicine') {
      heroBtnLabel.textContent = 'Order Medicines & Care';
    } else if (mode === 'beverages') {
      heroBtnLabel.textContent = 'Explore Estate Kaapi';
    } else if (mode === 'desserts') {
      heroBtnLabel.textContent = 'Explore Halal Desserts';
    } else {
      heroBtnLabel.textContent = 'Explore Halal Menus';
    }
  }

  // Hero Quick Navigation Buttons (Food, Grocery, Medicine, Beverages, Desserts)
  heroNavItems.forEach(item => {
    item.addEventListener('click', () => {
      heroNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const cat = item.getAttribute('data-category');
      state.currentCategory = cat;

      // Sync category pills in browse section
      categoryPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === cat));

      // Sync hero service dropdown if applicable
      if (heroServiceMode) {
        heroServiceMode.value = cat;
        updateHeroBtnLabel(cat);
      }

      renderMerchants();

      // Smooth scroll to browse section
      const browseSection = document.getElementById('categories-browse');
      if (browseSection) {
        browseSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Browse Section Category Pills
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-category');
      state.currentCategory = cat;

      // Sync hero navigation pills
      heroNavItems.forEach(hn => hn.classList.toggle('active', hn.getAttribute('data-category') === cat));

      if (heroServiceMode && ['food', 'grocery', 'medicine', 'beverages', 'desserts'].includes(cat)) {
        heroServiceMode.value = cat;
        updateHeroBtnLabel(cat);
      }

      renderMerchants();
    });
  });

  globalSearchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    clearSearchBtn.style.display = state.searchQuery ? 'block' : 'none';
    renderMerchants();
  });

  clearSearchBtn.addEventListener('click', () => {
    globalSearchInput.value = '';
    state.searchQuery = '';
    clearSearchBtn.style.display = 'none';
    renderMerchants();
  });

  btnResetSearch.addEventListener('click', () => {
    globalSearchInput.value = '';
    state.searchQuery = '';
    state.currentCategory = 'all';
    categoryPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === 'all'));
    heroNavItems.forEach(hn => hn.classList.toggle('active', hn.getAttribute('data-category') === 'food'));
    clearSearchBtn.style.display = 'none';
    renderMerchants();
  });

  // =========================================================================
  // 9. HERO SECTION ALL-IN-ONE-LINE ACTION BAR
  // =========================================================================
  if (heroServiceMode) {
    heroServiceMode.addEventListener('change', () => {
      const mode = heroServiceMode.value;
      updateHeroBtnLabel(mode);
      if (['food', 'grocery', 'medicine', 'beverages', 'desserts'].includes(mode)) {
        state.currentCategory = mode;
        heroNavItems.forEach(hn => hn.classList.toggle('active', hn.getAttribute('data-category') === mode));
        categoryPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === mode));
        renderMerchants();
      }
    });
  }

  if (btnHeroExplore) {
    btnHeroExplore.addEventListener('click', () => {
      const mode = heroServiceMode ? heroServiceMode.value : 'food';
      if (mode === 'track') {
        focusTrackingSection();
        showToast('Viewing live Virajpet delivery tracking.');
      } else {
        state.currentCategory = mode;
        heroNavItems.forEach(hn => hn.classList.toggle('active', hn.getAttribute('data-category') === mode));
        categoryPills.forEach(p => p.classList.toggle('active', p.getAttribute('data-category') === mode));
        renderMerchants();
        document.getElementById('categories-browse').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // =========================================================================
  // 10. GOOGLE MAP MANUAL LOCATION PICKER (LEAFLET + GOOGLE TILES)
  // =========================================================================
  let googlePickerMap = null;
  let googleMapRoadLayer = null;
  let googleMapSatLayer = null;
  let isSatelliteView = false;
  let isMapInitialized = false;
  let reverseGeocodeTimer = null;

  // Selected Location State (Defaults to Clock Tower Circle, Virajpet)
  let pickedLocation = {
    lat: 12.2015,
    lng: 75.8034,
    title: 'Clock Tower Circle, Virajpet',
    subtitle: 'Main Road, Beside Jamia Masjid, Virajpet, Kodagu, Karnataka 571218',
    preset: 'Home'
  };

  // Curated Virajpet landmarks for instant fast lookup & search suggestions
  const VIRAJPEE_HOTSPOTS = [
    {
      title: 'Clock Tower Circle, Virajpet',
      subtitle: 'Main Road, Beside Jamia Masjid, Virajpet 571218',
      lat: 12.2015,
      lng: 75.8034,
      keywords: 'clock tower main road jamia masjid town center'
    },
    {
      title: 'Kaveri Layout, College Road',
      subtitle: 'Near Kaveri Women’s College, Virajpet 571218',
      lat: 12.2052,
      lng: 75.8068,
      keywords: 'kaveri layout college residence'
    },
    {
      title: 'Malabar Road, Near Bilal Masjid',
      subtitle: 'Malabar Road, Meenupet Area, Virajpet 571218',
      lat: 12.1985,
      lng: 75.8012,
      keywords: 'malabar road bilal masjid meenupet'
    },
    {
      title: 'College Road Campus',
      subtitle: 'Near Coorg Institute / Junior College, Virajpet 571218',
      lat: 12.2080,
      lng: 75.8090,
      keywords: 'college road campus school'
    },
    {
      title: 'Meenupet Fish Market Road',
      subtitle: 'Meenupet, Lower Virajpet 571218',
      lat: 12.1950,
      lng: 75.7980,
      keywords: 'meenupet fish market lower virajpet'
    },
    {
      title: 'KSRTC Bus Station Area',
      subtitle: 'Bus Stand Circle, Main Bazaar, Virajpet 571218',
      lat: 12.1998,
      lng: 75.8028,
      keywords: 'ksrtc bus stand station depot'
    },
    {
      title: 'Telugupet Residential Colony',
      subtitle: 'Telugupet, Virajpet 571218',
      lat: 12.2030,
      lng: 75.8075,
      keywords: 'telugupet colony'
    },
    {
      title: 'St. Anne’s Church Road',
      subtitle: 'Near Catholic Church, Hill Road, Virajpet 571218',
      lat: 12.2005,
      lng: 75.8050,
      keywords: 'st anne church hill road convent'
    },
    {
      title: 'Kadanga Road Estate Road',
      subtitle: 'Kadanga Cross, Virajpet Rural 571218',
      lat: 12.2150,
      lng: 75.7950,
      keywords: 'kadanga estate coffee plantation'
    },
    {
      title: 'Bittangala Junction',
      subtitle: 'Virajpet - Gonikoppal Highway, Bittangala 571218',
      lat: 12.1890,
      lng: 75.8150,
      keywords: 'bittangala gonikoppal highway junction'
    }
  ];

  // DOM elements for Map Modal
  const mapCenterPin = document.getElementById('map-center-pin');
  const mapPinTooltip = document.getElementById('map-pin-tooltip');
  const mapPickedTitle = document.getElementById('map-picked-title');
  const mapPickedSubtext = document.getElementById('map-picked-subtext');
  const mapBadgeCoords = document.getElementById('map-badge-coords');
  const mapSearchInput = document.getElementById('map-search-input');
  const mapClearSearchBtn = document.getElementById('map-clear-search-btn');
  const mapSearchSuggestions = document.getElementById('map-search-suggestions');
  const btnMapLocateMe = document.getElementById('btn-map-locate-me');
  const btnMapLayerToggle = document.getElementById('btn-map-layer-toggle');
  const inputMapFlat = document.getElementById('input-map-flat');
  const inputMapLandmark = document.getElementById('input-map-landmark');
  const heroLocationSegment = document.getElementById('hero-location-segment');
  const btnHeroOpenMap = document.getElementById('btn-hero-open-map');

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function updateAddressFromCoords(lat, lng) {
    // 1. Update coordinates badge
    if (mapBadgeCoords) {
      mapBadgeCoords.textContent = `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E • Google Maps`;
    }

    // 2. Find nearest Virajpet hotspot
    let nearest = VIRAJPEE_HOTSPOTS[0];
    let minDistance = Infinity;

    for (const spot of VIRAJPEE_HOTSPOTS) {
      const dist = calculateDistance(lat, lng, spot.lat, spot.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = spot;
      }
    }

    if (minDistance <= 120) {
      pickedLocation.title = nearest.title;
      pickedLocation.subtitle = nearest.subtitle;
    } else if (minDistance <= 1200) {
      const distStr = Math.round(minDistance) + 'm';
      pickedLocation.title = `${nearest.title.split(',')[0]} (approx ${distStr})`;
      pickedLocation.subtitle = `Near ${nearest.subtitle}, Virajpet, Kodagu 571218`;
    } else {
      pickedLocation.title = `Virajpet Location (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      pickedLocation.subtitle = `Kodagu District, Karnataka 571218`;
    }

    pickedLocation.lat = lat;
    pickedLocation.lng = lng;

    if (mapPickedTitle) mapPickedTitle.textContent = pickedLocation.title;
    if (mapPickedSubtext) mapPickedSubtext.textContent = pickedLocation.subtitle;

    // Optional reverse geocode with Nominatim (debounced)
    clearTimeout(reverseGeocodeTimer);
    reverseGeocodeTimer = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            const road = data.address.road || data.address.neighbourhood || data.address.suburb || data.address.hamlet;
            if (road) {
              const fullTown = data.address.town || data.address.city || 'Virajpet';
              pickedLocation.title = `${road}, ${fullTown}`;
              pickedLocation.subtitle = data.display_name;
              if (mapPickedTitle) mapPickedTitle.textContent = pickedLocation.title;
              if (mapPickedSubtext) mapPickedSubtext.textContent = pickedLocation.subtitle;
            }
          }
        })
        .catch(() => {});
    }, 450);
  }

  function initGooglePickerMap() {
    if (isMapInitialized || typeof L === 'undefined') return;

    const mapElement = document.getElementById('google-picker-map');
    if (!mapElement) return;

    // Google Maps Road & Satellite Tile Layers
    googleMapRoadLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    });

    googleMapSatLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps Satellite'
    });

    googlePickerMap = L.map('google-picker-map', {
      center: [pickedLocation.lat, pickedLocation.lng],
      zoom: 16,
      zoomControl: true,
      layers: [googleMapRoadLayer]
    });

    // Move pin visual animation when map is dragged
    googlePickerMap.on('movestart', () => {
      if (mapCenterPin) mapCenterPin.classList.add('is-moving');
      if (mapPinTooltip) mapPinTooltip.textContent = 'Pinning doorstep...';
    });

    googlePickerMap.on('moveend', () => {
      if (mapCenterPin) mapCenterPin.classList.remove('is-moving');
      if (mapPinTooltip) mapPinTooltip.textContent = 'Pin Placed!';
      const center = googlePickerMap.getCenter();
      updateAddressFromCoords(center.lat, center.lng);
    });

    // Allow clicking anywhere to pan center directly
    googlePickerMap.on('click', (e) => {
      googlePickerMap.panTo(e.latlng);
    });

    isMapInitialized = true;
  }

  function openAddressModal() {
    addressModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Initialize or refresh Leaflet size
    if (!isMapInitialized) {
      initGooglePickerMap();
    }
    setTimeout(() => {
      if (googlePickerMap) {
        googlePickerMap.invalidateSize();
        googlePickerMap.setView([pickedLocation.lat, pickedLocation.lng], 16);
      }
    }, 120);
  }

  function closeAddressModal() {
    addressModal.style.display = 'none';
    document.body.style.overflow = '';
    if (mapSearchSuggestions) mapSearchSuggestions.style.display = 'none';
  }

  // Trigger bindings for opening the Google Map Picker
  if (addressTrigger) {
    addressTrigger.addEventListener('click', openAddressModal);
  }

  if (heroLocationSegment) {
    heroLocationSegment.addEventListener('click', openAddressModal);
  }

  if (btnHeroOpenMap) {
    btnHeroOpenMap.addEventListener('click', (e) => {
      e.stopPropagation();
      openAddressModal();
    });
  }

  const heroLocInput = document.getElementById('delivery-location-input');
  if (heroLocInput) {
    heroLocInput.addEventListener('click', openAddressModal);
  }

  if (btnCloseAddressModal) {
    btnCloseAddressModal.addEventListener('click', closeAddressModal);
  }
  if (btnCancelAddress) {
    btnCancelAddress.addEventListener('click', closeAddressModal);
  }

  // Map Search with Autocomplete
  if (mapSearchInput) {
    mapSearchInput.addEventListener('input', () => {
      const val = mapSearchInput.value.toLowerCase().trim();
      if (!val) {
        if (mapClearSearchBtn) mapClearSearchBtn.style.display = 'none';
        if (mapSearchSuggestions) mapSearchSuggestions.style.display = 'none';
        return;
      }
      if (mapClearSearchBtn) mapClearSearchBtn.style.display = 'block';

      const matches = VIRAJPEE_HOTSPOTS.filter(spot => 
        spot.title.toLowerCase().includes(val) ||
        spot.subtitle.toLowerCase().includes(val) ||
        spot.keywords.toLowerCase().includes(val)
      );

      if (matches.length > 0) {
        mapSearchSuggestions.innerHTML = matches.map(m => `
          <div class="map-search-item" data-lat="${m.lat}" data-lng="${m.lng}" data-title="${m.title}">
            <span class="map-search-item-icon">📍</span>
            <div class="map-search-item-text">
              <span class="map-search-item-title">${m.title}</span>
              <span class="map-search-item-sub">${m.subtitle}</span>
            </div>
          </div>
        `).join('');
        mapSearchSuggestions.style.display = 'flex';

        // Suggestion selection
        mapSearchSuggestions.querySelectorAll('.map-search-item').forEach(item => {
          item.addEventListener('click', () => {
            const lat = parseFloat(item.getAttribute('data-lat'));
            const lng = parseFloat(item.getAttribute('data-lng'));
            if (googlePickerMap) {
              googlePickerMap.flyTo([lat, lng], 17);
            }
            mapSearchInput.value = item.getAttribute('data-title');
            mapSearchSuggestions.style.display = 'none';
          });
        });
      } else {
        mapSearchSuggestions.innerHTML = `
          <div class="map-search-item" style="cursor: default; color: var(--text-muted);">
            No Virajpet match found. Move the map to pin manually.
          </div>
        `;
        mapSearchSuggestions.style.display = 'flex';
      }
    });

    if (mapClearSearchBtn) {
      mapClearSearchBtn.addEventListener('click', () => {
        mapSearchInput.value = '';
        mapClearSearchBtn.style.display = 'none';
        mapSearchSuggestions.style.display = 'none';
      });
    }
  }

  // Quick Landmark Chips
  document.querySelectorAll('.map-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.map-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const lat = parseFloat(chip.getAttribute('data-lat'));
      const lng = parseFloat(chip.getAttribute('data-lng'));
      if (googlePickerMap) {
        googlePickerMap.flyTo([lat, lng], 17);
      }
    });
  });

  // GPS Locate Me Button
  if (btnMapLocateMe) {
    btnMapLocateMe.addEventListener('click', () => {
      showToast('Acquiring your current GPS location...');
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const userLat = pos.coords.latitude;
            const userLng = pos.coords.longitude;
            if (googlePickerMap) {
              googlePickerMap.flyTo([userLat, userLng], 17);
            }
            showToast('GPS position acquired!');
          },
          () => {
            // Smoothly snap to Virajpet Clock Tower if GPS is unavailable
            if (googlePickerMap) {
              googlePickerMap.flyTo([12.2015, 75.8034], 17);
            }
            showToast('Centered on Virajpet Clock Tower');
          },
          { timeout: 6000 }
        );
      }
    });
  }

  // Satellite Layer Toggle
  if (btnMapLayerToggle) {
    btnMapLayerToggle.addEventListener('click', () => {
      if (!googlePickerMap) return;
      isSatelliteView = !isSatelliteView;
      if (isSatelliteView) {
        googlePickerMap.removeLayer(googleMapRoadLayer);
        googlePickerMap.addLayer(googleMapSatLayer);
        btnMapLayerToggle.style.backgroundColor = 'var(--maroon-700)';
        btnMapLayerToggle.style.color = '#FFFFFF';
        showToast('Switched to Google Satellite View');
      } else {
        googlePickerMap.removeLayer(googleMapSatLayer);
        googlePickerMap.addLayer(googleMapRoadLayer);
        btnMapLayerToggle.style.backgroundColor = '';
        btnMapLayerToggle.style.color = '';
        showToast('Switched to Google Maps Road View');
      }
    });
  }

  // Preset Tags (Home / Work / Estate / Other)
  document.querySelectorAll('.preset-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.preset-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      pickedLocation.preset = tag.getAttribute('data-tag');
    });
  });

  // Save & Confirm Address
  if (btnConfirmAddress) {
    btnConfirmAddress.addEventListener('click', () => {
      const flatVal = inputMapFlat ? inputMapFlat.value.trim() : '';
      const noteVal = inputMapLandmark ? inputMapLandmark.value.trim() : '';

      let finalAddress = pickedLocation.title;
      if (flatVal) {
        finalAddress = `${flatVal}, ${finalAddress}`;
      }
      if (noteVal) {
        finalAddress = `${finalAddress} (${noteVal})`;
      }

      state.currentAddress = finalAddress;

      // Update Header Address Display
      if (currentAddressText) {
        currentAddressText.textContent = pickedLocation.title;
      }

      // Update Hero Action Bar Input
      const heroInput = document.getElementById('delivery-location-input');
      if (heroInput) {
        heroInput.value = finalAddress;
      }

      // Update Checkout Modal Preview
      if (confAddressText) {
        confAddressText.textContent = finalAddress;
      }

      closeAddressModal();
      showToast(`📍 Delivery location set to: ${pickedLocation.title}`);
    });
  }

  // =========================================================================
  // 11. LIVE TRACKING BANNER & TOGGLES
  // =========================================================================
  let isTrackingExpanded = true;
  if (btnToggleTracking) {
    btnToggleTracking.addEventListener('click', () => {
      isTrackingExpanded = !isTrackingExpanded;
      if (isTrackingExpanded) {
        if (trackingBody) trackingBody.style.display = 'block';
        if (toggleTrackingText) toggleTrackingText.textContent = 'Hide Live Map';
      } else {
        if (trackingBody) trackingBody.style.display = 'none';
        if (toggleTrackingText) toggleTrackingText.textContent = 'Show Live Map';
      }
    });
  }

  function focusTrackingSection() {
    if (trackingBody) trackingBody.style.display = 'block';
    isTrackingExpanded = true;
    if (toggleTrackingText) toggleTrackingText.textContent = 'Hide Live Map';
    const trackSec = document.getElementById('track-section');
    if (trackSec) trackSec.scrollIntoView({ behavior: 'smooth' });
  }

  if (trackModalTrigger) trackModalTrigger.addEventListener('click', focusTrackingSection);
  if (quickTrackLink) {
    quickTrackLink.addEventListener('click', (e) => {
      e.preventDefault();
      focusTrackingSection();
    });
  }
  if (btnOpenLiveTrack) btnOpenLiveTrack.addEventListener('click', focusTrackingSection);

  if (btnCallCourier) {
    btnCallCourier.addEventListener('click', () => {
      showToast('Calling Rider Mohammed Suhail via encrypted relay...');
    });
  }

  if (btnTipCourierNow) {
    btnTipCourierNow.addEventListener('click', () => {
      openCartDrawer();
      const tipSec = document.querySelector('.cart-tip-section');
      if (tipSec) tipSec.scrollIntoView({ behavior: 'smooth' });
      showToast('Add or adjust rider tip in your provision basket.');
    });
  }


  // =========================================================================
  // 13. TOAST NOTIFICATION HELPER
  // =========================================================================
  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // =========================================================================
  // 14. USER PROFILE DRAWER (MY ACCOUNT)
  // =========================================================================
  const profileTrigger = document.getElementById('profile-trigger');
  const profileDrawer = document.getElementById('profile-drawer');
  const profileDrawerBackdrop = document.getElementById('profile-drawer-backdrop');
  const btnCloseProfile = document.getElementById('btn-close-profile');
  const profileTabBtns = document.querySelectorAll('.profile-tab-btn');
  const profileTabPanes = document.querySelectorAll('.profile-tab-pane');
  const btnProfileTrackLive = document.getElementById('btn-profile-track-live');
  const reorderBtns = document.querySelectorAll('.btn-reorder-mini');
  const placeCards = document.querySelectorAll('.profile-place-card');
  const btnProfileAddAddressMap = document.getElementById('btn-profile-add-address-map');
  const walletAddChips = document.querySelectorAll('.wallet-add-chip');
  const profileWalletBalance = document.getElementById('profile-wallet-balance');
  const prefSpiceLevel = document.getElementById('pref-spice-level');
  const prefEcoPack = document.getElementById('pref-eco-pack');
  const btnProfileSupport = document.getElementById('btn-profile-support');
  const btnProfileLogout = document.getElementById('btn-profile-logout');

  const profileOrdersContainer = document.getElementById('profile-orders-container');
  const profileStatOrders = document.getElementById('profile-stat-orders');
  const profileStatPoints = document.getElementById('profile-stat-points');
  const profileStatSavings = document.getElementById('profile-stat-savings');

  // User Profile Data & Edit Bindings
  const profileDisplayName = document.getElementById('profile-display-name');
  const profileDisplayLocation = document.getElementById('profile-display-location');
  const profileDisplayPhone = document.getElementById('profile-display-phone');
  const profileDisplayEmail = document.getElementById('profile-display-email');
  const profileMembershipPill = document.getElementById('profile-membership-pill');
  const profileAvatarImg = document.getElementById('profile-avatar-img');
  const profileAvatarWrap = document.getElementById('profile-avatar-wrap');
  const btnChangeAvatar = document.getElementById('btn-change-avatar');
  const btnOpenEditProfile = document.getElementById('btn-open-edit-profile');
  const headerAvatarImg = document.getElementById('header-avatar-img');
  const headerProfileName = document.getElementById('header-profile-name');

  // Edit Profile Modal elements
  const editProfileModal = document.getElementById('edit-profile-modal');
  const btnCloseEditProfile = document.getElementById('btn-close-edit-profile');
  const btnCancelEditProfile = document.getElementById('btn-cancel-edit-profile');
  const editProfileForm = document.getElementById('edit-profile-form');
  const editAvatarPreview = document.getElementById('edit-avatar-preview');
  const editProfileFileInput = document.getElementById('edit-profile-file-input');
  const btnTriggerFileUpload = document.getElementById('btn-trigger-file-upload');
  const editProfileAvatarUrl = document.getElementById('edit-profile-avatar-url');
  const avatarPresetBtns = document.querySelectorAll('.avatar-preset-btn');
  const editProfileName = document.getElementById('edit-profile-name');
  const editProfilePhone = document.getElementById('edit-profile-phone');
  const editProfileEmail = document.getElementById('edit-profile-email');
  const editProfileLocation = document.getElementById('edit-profile-location');
  const btnSaveProfile = document.getElementById('btn-save-profile');

  let currentProfile = {
    name: 'Falah Abdulla',
    email: 'falah.kodagu@gmail.com',
    phone: '+91 98451 23456',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&h=180&q=80',
    location: 'Virajpet Town, Kodagu 571218',
    membership: 'ROYALE GOLD'
  };

  function applyProfileToUI(profile) {
    if (!profile) return;
    currentProfile = { ...currentProfile, ...profile };

    if (profileDisplayName && currentProfile.name) profileDisplayName.textContent = currentProfile.name;
    if (profileDisplayLocation) profileDisplayLocation.textContent = '📍 ' + (currentProfile.location || 'Virajpet Town, Kodagu 571218');
    if (profileDisplayPhone) profileDisplayPhone.textContent = '📞 ' + (currentProfile.phone || '+91 98451 23456');
    if (profileDisplayEmail) profileDisplayEmail.textContent = '✉️ ' + (currentProfile.email || 'falah.kodagu@gmail.com');
    if (profileMembershipPill && currentProfile.membership) profileMembershipPill.textContent = currentProfile.membership.toUpperCase();
    if (profileAvatarImg && currentProfile.avatarUrl) profileAvatarImg.src = currentProfile.avatarUrl;

    if (headerAvatarImg && currentProfile.avatarUrl) headerAvatarImg.src = currentProfile.avatarUrl;
    if (headerProfileName && currentProfile.name) {
      const firstName = currentProfile.name.trim().split(' ')[0] || 'Falah';
      headerProfileName.textContent = firstName;
    }
  }

  function openProfileDrawer() {
    if (cartDrawer && cartDrawer.classList.contains('open')) {
      closeCartDrawer();
    }
    if (profileDrawer) profileDrawer.classList.add('open');
    if (profileDrawerBackdrop) profileDrawerBackdrop.style.display = 'block';
    document.body.style.overflow = 'hidden';
    fetchUserProfile();
  }

  function closeProfileDrawer() {
    if (profileDrawer) profileDrawer.classList.remove('open');
    if (profileDrawerBackdrop) profileDrawerBackdrop.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (profileTrigger) {
    profileTrigger.addEventListener('click', openProfileDrawer);
  }
  if (btnCloseProfile) {
    btnCloseProfile.addEventListener('click', closeProfileDrawer);
  }
  if (profileDrawerBackdrop) {
    profileDrawerBackdrop.addEventListener('click', closeProfileDrawer);
  }

  // Profile Drawer Tab Navigation
  profileTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      profileTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');
      profileTabPanes.forEach(pane => {
        if (pane.id === targetTab) {
          pane.style.display = 'flex';
        } else {
          pane.style.display = 'none';
        }
      });
    });
  });

  // Track Live Order from Profile Drawer
  if (btnProfileTrackLive) {
    btnProfileTrackLive.addEventListener('click', () => {
      closeProfileDrawer();
      focusTrackingSection();
      if (state.activeOrder) {
        showToast(`Tracking active delivery #${state.activeOrder.orderNumber} in Virajpet`);
      } else {
        showToast('Virajpet live telemetry ready. Place an order to track in real-time.');
      }
    });
  }

  // Past Orders Reorder Action
  reorderBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const itemName = btn.getAttribute('data-item-name');
      const itemPrice = parseFloat(btn.getAttribute('data-item-price')) || 250;

      // Find store and item in MERCHANTS_DATA
      let matchedStore = null;
      let matchedItem = null;
      for (const store of MERCHANTS_DATA) {
        const it = store.items.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()) || itemName.toLowerCase().includes(i.name.toLowerCase()));
        if (it) {
          matchedStore = store;
          matchedItem = it;
          break;
        }
      }

      if (matchedStore && matchedItem) {
        addItemToCart(matchedStore.id, matchedItem.id);
        closeProfileDrawer();
        openCartDrawer();
        showToast(`Reordered ${matchedItem.name}! Added to basket.`);
      } else {
        // Fallback: direct insert to cart
        const existingItem = state.cart.find(c => c.name === itemName);
        if (existingItem) {
          existingItem.qty += 1;
        } else {
          state.cart.push({
            id: 'reorder-' + Date.now(),
            storeId: 'albait',
            storeName: 'Al-Bait Kodagu Halal Kitchen',
            name: itemName,
            price: itemPrice,
            qty: 1,
            image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=500&q=80'
          });
        }
        updateCartUI();
        closeProfileDrawer();
        openCartDrawer();
        showToast(`Reordered ${itemName}! Basket updated.`);
      }
    });
  });

  // Saved Places Selection
  placeCards.forEach(card => {
    const handleSelectAddress = (e) => {
      if (card.classList.contains('active')) return;

      placeCards.forEach(c => {
        c.classList.remove('active');
        const pill = c.querySelector('.place-active-pill');
        const titleRow = c.querySelector('.place-title-row');
        if (pill) {
          pill.remove();
          const newBtn = document.createElement('button');
          newBtn.type = 'button';
          newBtn.className = 'btn-use-address-chip';
          newBtn.textContent = 'Select';
          newBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            handleSelectAddress(ev);
          });
          titleRow.appendChild(newBtn);
        }
      });

      card.classList.add('active');
      const currentSelectBtn = card.querySelector('.btn-use-address-chip');
      if (currentSelectBtn) {
        currentSelectBtn.remove();
      }
      const titleRow = card.querySelector('.place-title-row');
      const activePill = document.createElement('span');
      activePill.className = 'place-active-pill';
      activePill.textContent = 'Active Delivery';
      titleRow.appendChild(activePill);

      const newAddr = card.getAttribute('data-addr');
      const placeTitle = card.querySelector('.place-title')?.textContent || 'Selected Address';
      state.currentAddress = newAddr;

      // Sync across header, hero input, and checkout preview
      if (currentAddressText) {
        currentAddressText.textContent = placeTitle;
      }
      const heroInput = document.getElementById('delivery-location-input');
      if (heroInput) {
        heroInput.value = newAddr;
      }
      if (confAddressText) {
        confAddressText.textContent = newAddr;
      }

      showToast(`📍 Active delivery address set to: ${placeTitle}`);
    };

    const selectBtn = card.querySelector('.btn-use-address-chip');
    if (selectBtn) {
      selectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSelectAddress(e);
      });
    }

    card.addEventListener('click', handleSelectAddress);
  });

  // Pin New Address from Profile onto Google Map Picker
  if (btnProfileAddAddressMap) {
    btnProfileAddAddressMap.addEventListener('click', () => {
      closeProfileDrawer();
      openAddressModal();
      showToast('Pin your new Virajpet delivery address on Google Maps');
    });
  }

  // Wallet Quick Top-Up with Chips
  let currentWalletBalance = 0.00;
  walletAddChips.forEach(chip => {
    chip.addEventListener('click', async () => {
      const addAmount = parseFloat(chip.getAttribute('data-amount')) || 0;
      currentWalletBalance += addAmount;
      if (profileWalletBalance) {
        profileWalletBalance.textContent = currentWalletBalance.toFixed(2);
      }

      try {
        const res = await fetch('/api/user/wallet/topup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: addAmount, paymentMethod: 'UPI' })
        });
        if (res.ok) {
          const wData = await res.json();
          if (wData.success && wData.data) {
            currentWalletBalance = wData.data.newBalance;
            if (profileWalletBalance) profileWalletBalance.textContent = currentWalletBalance.toFixed(2);
          }
        }
      } catch (e) {
        console.warn('Backend offline for wallet top-up');
      }

      showToast(`🪙 ₹${addAmount.toLocaleString('en-IN')} added to your BEEGO Wallet via UPI!`);
    });
  });

  // Preferences Change Handlers
  if (prefSpiceLevel) {
    prefSpiceLevel.addEventListener('change', async () => {
      const selectedVal = prefSpiceLevel.value;
      const selectedText = prefSpiceLevel.options[prefSpiceLevel.selectedIndex].text;
      try {
        await fetch('/api/user/preferences', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spiceLevel: selectedVal })
        });
      } catch (e) {}
      showToast(`🌶️ Spice preference saved: ${selectedText}`);
    });
  }

  if (prefEcoPack) {
    prefEcoPack.addEventListener('change', async () => {
      const isChecked = prefEcoPack.checked;
      try {
        await fetch('/api/user/preferences', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ecoPackaging: isChecked })
        });
      } catch (e) {}
      showToast(isChecked ? '🌿 Eco-friendly Areca packaging enabled' : 'Standard packaging selected');
    });
  }

  // 24x7 Support and Logout Handlers
  if (btnProfileSupport) {
    btnProfileSupport.addEventListener('click', () => {
      showToast('Connecting to Virajpet 24x7 Helpdesk (08274-256789)...');
    });
  }

  if (btnProfileLogout) {
    btnProfileLogout.addEventListener('click', () => {
      closeProfileDrawer();
      showToast('Signed out of BEEGO Virajpet. See you soon!');
    });
  }

  // --- EDIT PROFILE & AVATAR MODAL CONTROLS ---
  function openEditProfileModal() {
    if (!editProfileModal) return;

    // Populate current values
    if (editProfileName) editProfileName.value = currentProfile.name || 'Falah Abdulla';
    if (editProfilePhone) editProfilePhone.value = currentProfile.phone || '+91 98451 23456';
    if (editProfileEmail) editProfileEmail.value = currentProfile.email || 'falah.kodagu@gmail.com';
    if (editProfileLocation) editProfileLocation.value = currentProfile.location || 'Virajpet Town, Kodagu 571218';
    if (editProfileAvatarUrl) editProfileAvatarUrl.value = currentProfile.avatarUrl || '';
    if (editAvatarPreview) editAvatarPreview.src = currentProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=180&h=180&q=80';

    // Highlight matching preset
    avatarPresetBtns.forEach(btn => {
      const url = btn.getAttribute('data-url');
      if (url === currentProfile.avatarUrl) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    editProfileModal.style.display = 'flex';
  }

  function closeEditProfileModal() {
    if (editProfileModal) {
      editProfileModal.style.display = 'none';
    }
  }

  if (btnOpenEditProfile) {
    btnOpenEditProfile.addEventListener('click', openEditProfileModal);
  }
  if (btnChangeAvatar) {
    btnChangeAvatar.addEventListener('click', (e) => {
      e.stopPropagation();
      openEditProfileModal();
    });
  }
  if (profileAvatarWrap) {
    profileAvatarWrap.addEventListener('click', openEditProfileModal);
  }

  if (btnCloseEditProfile) {
    btnCloseEditProfile.addEventListener('click', closeEditProfileModal);
  }
  if (btnCancelEditProfile) {
    btnCancelEditProfile.addEventListener('click', closeEditProfileModal);
  }

  if (editProfileModal) {
    editProfileModal.addEventListener('click', (e) => {
      if (e.target === editProfileModal) {
        closeEditProfileModal();
      }
    });
  }

  // Trigger Device File Picker
  if (btnTriggerFileUpload && editProfileFileInput) {
    btnTriggerFileUpload.addEventListener('click', () => {
      editProfileFileInput.click();
    });
  }

  // Handle Device File Upload
  if (editProfileFileInput) {
    editProfileFileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showToast('Please select a valid image file (PNG, JPG, WebP).');
          return;
        }

        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          const dataUrl = loadEvt.target.result;
          if (editAvatarPreview) editAvatarPreview.src = dataUrl;
          if (editProfileAvatarUrl) editProfileAvatarUrl.value = dataUrl;
          avatarPresetBtns.forEach(b => b.classList.remove('active'));
          showToast('📸 Photo loaded from device! Click Save to apply.');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Handle Preset Avatar Selection
  avatarPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      avatarPresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const url = btn.getAttribute('data-url');
      if (url) {
        if (editAvatarPreview) editAvatarPreview.src = url;
        if (editProfileAvatarUrl) editProfileAvatarUrl.value = url;
      }
    });
  });

  // Handle Manual Avatar URL input
  if (editProfileAvatarUrl) {
    editProfileAvatarUrl.addEventListener('input', () => {
      const url = editProfileAvatarUrl.value.trim();
      if (url && (url.startsWith('http') || url.startsWith('data:image'))) {
        if (editAvatarPreview) editAvatarPreview.src = url;
      }
    });
  }

  // Submit Profile Changes
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameVal = editProfileName ? editProfileName.value.trim() : '';
      const phoneVal = editProfilePhone ? editProfilePhone.value.trim() : '';
      const emailVal = editProfileEmail ? editProfileEmail.value.trim() : '';
      const locVal = editProfileLocation ? editProfileLocation.value.trim() : '';
      const avatarVal = editProfileAvatarUrl ? editProfileAvatarUrl.value.trim() : (editAvatarPreview ? editAvatarPreview.src : '');

      if (!nameVal) {
        showToast('Please enter your full name.');
        return;
      }

      if (btnSaveProfile) {
        btnSaveProfile.disabled = true;
        btnSaveProfile.innerHTML = '<span>Saving...</span>';
      }

      try {
        const res = await fetch('/api/user/profile', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameVal,
            phone: phoneVal,
            email: emailVal,
            location: locVal,
            avatarUrl: avatarVal
          })
        });

        const json = await res.json();
        if (json.success && json.data) {
          applyProfileToUI(json.data);
          closeEditProfileModal();
          showToast('✨ Profile & avatar updated successfully!');
        } else {
          showToast(json.message || 'Failed to update profile. Please try again.');
        }
      } catch (err) {
        // Fallback for offline mode: apply locally
        applyProfileToUI({
          name: nameVal,
          phone: phoneVal,
          email: emailVal,
          location: locVal,
          avatarUrl: avatarVal
        });
        closeEditProfileModal();
        showToast('✨ Profile updated locally!');
      } finally {
        if (btnSaveProfile) {
          btnSaveProfile.disabled = false;
          btnSaveProfile.innerHTML = '<span>Save Profile Changes</span>';
        }
      }
    });
  }

  // =========================================================================
  // 15. HEADER SCROLL ELEVATION
  // =========================================================================
  const siteHeader = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // =========================================================================
  // 16. BACKEND REAL-TIME WEBSOCKET & TELEMETRY INTEGRATION
  // =========================================================================
  async function fetchUserProfile() {
    try {
      const res = await fetch('/api/user/profile');
      if (!res.ok) return;
      const data = await res.json();
      if (data.success && data.data) {
        const profile = data.data;
        applyProfileToUI(profile);

        currentWalletBalance = profile.walletBalance || 0;
        if (profileWalletBalance) profileWalletBalance.textContent = currentWalletBalance.toFixed(2);
        
        if (profile.preferences) {
          if (prefSpiceLevel && profile.preferences.spiceLevel) prefSpiceLevel.value = profile.preferences.spiceLevel;
          if (prefEcoPack) prefEcoPack.checked = profile.preferences.ecoPackaging;
        }

        const orders = profile.recentOrders || [];

        if (profileStatOrders) profileStatOrders.textContent = orders.length;
        if (profileStatPoints) profileStatPoints.textContent = orders.length * 25;
        if (profileStatSavings) profileStatSavings.textContent = '₹' + (orders.length * 35);

        // Check if there is an active order in transit
        const activeOrder = orders.find(o => ['PENDING', 'ACCEPTED', 'PREPARING', 'PICKED_UP', 'ON_THE_WAY'].includes(o.status));
        if (activeOrder) {
          showActiveTracking(activeOrder.orderNumber, activeOrder.status === 'PREPARING' ? 'Kitchen Preparing' : 'Rider On The Way');
          if (window.beegoWs && window.beegoWs.readyState === 1) {
            window.beegoWs.send(JSON.stringify({
              type: 'subscribe',
              channel: `order:${activeOrder.orderNumber}`
            }));
          }
        } else {
          showStandbyTracking();
        }

        // Render profile orders list
        renderProfileOrders(orders);
      }
    } catch (e) {
      console.log('[BEEGO Core] Local profile mode active.');
    }
  }

  function renderProfileOrders(orders) {
    if (!profileOrdersContainer) return;

    if (!orders || orders.length === 0) {
      profileOrdersContainer.innerHTML = `
        <div class="empty-orders-view">
          <div class="empty-orders-icon">📦</div>
          <h4>No Orders Placed Yet</h4>
          <p>Your ongoing halal food deliveries will be tracked here live.</p>
          <a href="#categories-browse" class="btn btn-sm btn-primary" id="btn-profile-explore-now">Explore Halal Menus</a>
        </div>
      `;
      const exploreBtn = document.getElementById('btn-profile-explore-now');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
          closeProfileDrawer();
        });
      }
      return;
    }

    profileOrdersContainer.innerHTML = orders.map(o => {
      const isLive = ['PENDING', 'ACCEPTED', 'PREPARING', 'PICKED_UP', 'ON_THE_WAY'].includes(o.status);
      return `
        <div class="profile-order-card ${isLive ? 'live-card' : ''}">
          <div class="order-top-row">
            <div class="order-id-badge">
              ${isLive ? '<span class="pulse-dot"></span>' : ''}
              <strong>#${o.orderNumber}</strong>
            </div>
            <span class="order-status-pill ${isLive ? 'status-live' : 'status-completed'}">${o.status}</span>
          </div>
          <div class="order-body-row">
            <div class="order-main-info">
              <h4>${o.merchantName}</h4>
              <p class="order-items-snippet">${o.firstItemName} ${o.itemsCount > 1 ? `+ ${o.itemsCount - 1} more items` : ''}</p>
            </div>
            <div class="order-price-col">
              <span class="order-price-val">${formatINR(o.total)}</span>
            </div>
          </div>
          <div class="order-card-actions">
            ${isLive ? `
              <button type="button" class="btn-track-mini" data-order="${o.orderNumber}">
                <span>Track Live on Map</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            ` : `
              <button type="button" class="btn-reorder-mini" data-item-name="${o.firstItemName}">
                <span>Reorder Items</span>
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');

    // Attach listeners
    profileOrdersContainer.querySelectorAll('.btn-track-mini').forEach(btn => {
      btn.addEventListener('click', () => {
        closeProfileDrawer();
        focusTrackingSection();
      });
    });

    profileOrdersContainer.querySelectorAll('.btn-reorder-mini').forEach(btn => {
      btn.addEventListener('click', () => {
        const itemName = btn.getAttribute('data-item-name');
        showToast(`Adding ${itemName} to basket...`);
        for (const store of MERCHANTS_DATA) {
          const item = store.items.find(i => i.name.toLowerCase().includes(itemName.toLowerCase()));
          if (item) {
            addItemToCart(store.id, item.id);
            closeProfileDrawer();
            openCartDrawer();
            return;
          }
        }
      });
    });
  }

  function initBackendIntegration() {
    // 1. Fetch live merchants from backend if available
    fetch('/api/merchants')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          MERCHANTS_DATA = data.data;
          renderMerchants();
          console.log('[BEEGO Core] Loaded', MERCHANTS_DATA.length, 'merchants from SQLite backend.');
        }
      })
      .catch(() => {
        console.log('[BEEGO Core] Running with bundled local merchant catalog.');
      });

    // 2. Fetch live user profile and initial order/tracking state
    fetchUserProfile();

    // 3. Connect Real-time WebSocket
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
      const ws = new WebSocket(wsUrl);
      window.beegoWs = ws;

      ws.onopen = () => {
        console.log('[BEEGO WebSocket] Connected to real-time Virajpet telemetry gateway.');
        if (state.activeOrder && state.activeOrder.orderNumber) {
          ws.send(JSON.stringify({ type: 'subscribe', channel: `order:${state.activeOrder.orderNumber}` }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          handleRealtimeMessage(msg);
        } catch (e) {}
      };

      ws.onerror = () => {
        console.log('[BEEGO WebSocket] Gateway not reachable (local static mode).');
      };
    } catch (e) {}
  }

  function handleRealtimeMessage(msg) {
    if (msg.type === 'telemetry_update') {
      const { rider, status, statusText, progressPercent } = msg;

      // Update rider moving pin position on map
      const courierPin = document.querySelector('.map-pin.pin-courier');
      if (courierPin) {
        const leftPercent = 10 + (progressPercent / 100) * 76;
        const topPercent = 73 - Math.sin((progressPercent / 100) * Math.PI) * 35;
        courierPin.style.transition = 'left 1.5s ease-out, top 1.5s ease-out';
        courierPin.style.left = `${leftPercent}%`;
        courierPin.style.top = `${topPercent}%`;

        const popup = courierPin.querySelector('.pin-courier-popup');
        if (popup && rider) {
          popup.textContent = `Suhail (Rider) • ${rider.currentArea}`;
        }
      }

      // Update speed pill
      const speedPill = document.querySelector('.map-speed-pill');
      if (speedPill && rider) {
        speedPill.textContent = `Speed: ${rider.speedKmh} km/h • Battery: ${rider.batteryPercent}% • ${rider.vehicle}`;
      }

      // Update live status badge
      const statusBadge = document.querySelector('.badge-status-live');
      if (statusBadge && statusText) {
        statusBadge.textContent = statusText;
      }

      // Update timeline step elements
      const steps = document.querySelectorAll('#track-section .timeline-step');
      if (steps.length === 4) {
        if (status === 'PREPARING') {
          steps[0].className = 'timeline-step completed';
          steps[1].className = 'timeline-step active-step';
          steps[2].className = 'timeline-step pending';
          steps[3].className = 'timeline-step pending';
        } else if (status === 'PICKED_UP' || status === 'ON_THE_WAY') {
          steps[0].className = 'timeline-step completed';
          steps[1].className = 'timeline-step completed';
          steps[2].className = 'timeline-step active-step';
          steps[3].className = 'timeline-step pending';
        } else if (status === 'DELIVERED') {
          steps[0].className = 'timeline-step completed';
          steps[1].className = 'timeline-step completed';
          steps[2].className = 'timeline-step completed';
          steps[3].className = 'timeline-step completed';
        }
      }
    } else if (msg.type === 'order_status_update') {
      showToast(`Order #${msg.orderNumber}: ${msg.message}`);
    }
  }

  // =========================================================================
  // 17. INITIALIZATION
  // =========================================================================
  renderMerchants();
  updateCartUI();
  initBackendIntegration();
});
