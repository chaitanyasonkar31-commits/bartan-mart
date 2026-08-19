/* Data Manager & Storage Engine for Bartan Mart */

const DEFAULT_PRODUCTS = [
  {
    id: "p1",
    name: "Tri-Ply Stainless Steel Pressure Cooker (3 Litre)",
    category: "Pressure Cookers",
    mrp: 3499,
    price: 2499,
    material: "Tri-Ply Stainless Steel",
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    stock: 25,
    description: "Heavy bottom 3L tri-ply stainless steel pressure cooker with outer lid. Energy efficient, induction and gas compatible."
  },
  {
    id: "p2",
    name: "Royal Copper Bottom Handi Set with Lids (Set of 3)",
    category: "Cookware",
    mrp: 2999,
    price: 1899,
    material: "Pure Copper & Steel",
    image: "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    stock: 18,
    description: "Authentic Indian kitchenware copper bottom handi serving and cooking utensils. Mirror finish, rust-proof."
  },
  {
    id: "p3",
    name: "Heavy Gauge Stainless Steel Dinner Set (51 Pieces)",
    category: "Dinnerware",
    mrp: 6999,
    price: 4999,
    material: "High Grade Stainless Steel",
    image: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?auto=format&fit=crop&w=600&q=80",
    rating: 5.0,
    stock: 12,
    description: "Complete family 51-piece premium dinnerware set containing thalis, bowls, glasses, spoons, and serving trays."
  },
  {
    id: "p4",
    name: "Non-Stick Granite Finish Kadai with Glass Lid (26cm)",
    category: "Cookware",
    mrp: 2299,
    price: 1499,
    material: "Granite Non-Stick",
    image: "https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    stock: 30,
    description: "5-layer non-stick scratch resistant kadai. Requires 80% less oil cooking. Easy to clean."
  },
  {
    id: "p5",
    name: "Pure Brass Traditional Lagan Kadhai (2.5 Kg)",
    category: "Utensils",
    mrp: 4500,
    price: 3299,
    material: "Traditional Pure Brass",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    rating: 4.9,
    stock: 8,
    description: "Handcrafted pure brass heavy lagan kadhai with tin lining (Kalai) for healthy traditional Indian cooking."
  },
  {
    id: "p6",
    name: "Stainless Steel Air-Tight Container Jar Set (Set of 6)",
    category: "Storage & Containers",
    mrp: 1899,
    price: 1199,
    material: "Food Grade Steel",
    image: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=600&q=80",
    rating: 4.6,
    stock: 40,
    description: "Air-tight see-through lid stainless steel grocery container storage set. 100% moisture proof."
  },
  {
    id: "p7",
    name: "Pre-Seasoned Cast Iron Dosa Tawa (30 cm)",
    category: "Cookware",
    mrp: 1999,
    price: 1299,
    material: "Pre-seasoned Cast Iron",
    image: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
    rating: 4.8,
    stock: 22,
    description: "Naturally non-stick heavy cast iron dosa & roti pan. Enriches food with natural iron."
  },
  {
    id: "p8",
    name: "Kitchen Tool Set - Ladle, Spatula, Skimmer (Set of 7)",
    category: "Kitchen Tools",
    mrp: 1299,
    price: 799,
    material: "Ergonomic Stainless Steel",
    image: "https://images.unsplash.com/photo-1590794056226-77ef3a6c4743?auto=format&fit=crop&w=600&q=80",
    rating: 4.7,
    stock: 50,
    description: "Heat resistant solid stainless steel cooking spoon and ladle set with wall mounting stand."
  }
];

const DEFAULT_PROMO_CODES = []; // Empty by default. Promo codes & sales will only exist when manually added by owner.

const DEFAULT_STORE_SETTINGS = {
  helplinePhone: "+91 98765 43210",
  whatsappPhone: "919876543210",
  upiId: "bartanmart@upi",
  gstPercentage: 18,
  freeDeliveryThreshold: 999,
  flatDeliveryFee: 49,
  adminPassword: "chaitanya1949",
  announcementText: "🔥 Welcome to Bartan Mart | 100% Genuine Kitchenware & Utensils | Direct Delivery"
};

// Storage Manager Helpers
class StorageManager {
  static getProducts() {
    const data = localStorage.getItem("bm_products");
    return data ? JSON.parse(data) : DEFAULT_PRODUCTS;
  }

  static saveProducts(products) {
    localStorage.setItem("bm_products", JSON.stringify(products));
  }

  static getPromoCodes() {
    const data = localStorage.getItem("bm_promo_codes");
    return data ? JSON.parse(data) : DEFAULT_PROMO_CODES;
  }

  static savePromoCodes(codes) {
    localStorage.setItem("bm_promo_codes", JSON.stringify(codes));
  }

  static getOrders() {
    const data = localStorage.getItem("bm_orders");
    return data ? JSON.parse(data) : [];
  }

  static saveOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order); // latest order first
    localStorage.setItem("bm_orders", JSON.stringify(orders));
  }

  static updateOrderStatus(orderId, paymentStatus, deliveryStatus) {
    const orders = this.getOrders();
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
      if (paymentStatus) orders[orderIndex].paymentStatus = paymentStatus;
      if (deliveryStatus) orders[orderIndex].deliveryStatus = deliveryStatus;
      localStorage.setItem("bm_orders", JSON.stringify(orders));
      return orders[orderIndex];
    }
    return null;
  }

  static getLoggedUser() {
    const data = localStorage.getItem("bm_logged_user");
    return data ? JSON.parse(data) : null;
  }

  static setLoggedUser(userObj) {
    localStorage.setItem("bm_logged_user", JSON.stringify(userObj));
  }

  static logoutUser() {
    localStorage.removeItem("bm_logged_user");
  }

  static getSettings() {
    const data = localStorage.getItem("bm_settings");
    return data ? JSON.parse(data) : DEFAULT_STORE_SETTINGS;
  }

  static saveSettings(settings) {
    localStorage.setItem("bm_settings", JSON.stringify(settings));
  }

  static initSeed() {
    if (!localStorage.getItem("bm_products")) {
      this.saveProducts(DEFAULT_PRODUCTS);
    }
    if (!localStorage.getItem("bm_promo_codes")) {
      this.savePromoCodes(DEFAULT_PROMO_CODES);
    }
    if (!localStorage.getItem("bm_settings")) {
      this.saveSettings(DEFAULT_STORE_SETTINGS);
    }
  }
}

// Initialize default seed
StorageManager.initSeed();
