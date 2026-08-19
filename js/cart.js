/* Shopping Cart & Checkout Engine for Bartan Mart */

class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.appliedPromo = null;
  }

  loadCart() {
    const saved = localStorage.getItem("bm_cart");
    return saved ? JSON.parse(saved) : [];
  }

  saveCart() {
    localStorage.setItem("bm_cart", JSON.stringify(this.cart));
  }

  addItem(productId) {
    const products = StorageManager.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return false;

    const existingIndex = this.cart.findIndex(item => item.id === productId);
    if (existingIndex !== -1) {
      this.cart[existingIndex].qty += 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        mrp: product.mrp,
        image: product.image,
        category: product.category,
        qty: 1
      });
    }
    this.saveCart();
    return true;
  }

  updateQty(productId, delta) {
    const itemIndex = this.cart.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
      this.cart[itemIndex].qty += delta;
      if (this.cart[itemIndex].qty <= 0) {
        this.cart.splice(itemIndex, 1);
      }
      this.saveCart();
    }
  }

  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
  }

  clearCart() {
    this.cart = [];
    this.appliedPromo = null;
    this.saveCart();
  }

  getItemCount() {
    return this.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  calculateTotals() {
    const settings = StorageManager.getSettings();
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Tax breakdown: price includes GST (e.g. 18%)
    const gstRate = settings.gstPercentage || 18;
    const gstAmount = Math.round(subtotal * (gstRate / (100 + gstRate)));
    const productCostBeforeTax = subtotal - gstAmount;

    // Delivery charge
    let deliveryFee = settings.flatDeliveryFee || 49;
    if (subtotal >= (settings.freeDeliveryThreshold || 999) || subtotal === 0) {
      deliveryFee = 0;
    }

    // Promo Code Discount Calculation
    let discountAmount = 0;
    if (this.appliedPromo && subtotal >= (this.appliedPromo.minOrder || 0)) {
      if (this.appliedPromo.type === "percentage") {
        discountAmount = Math.round((subtotal * this.appliedPromo.value) / 100);
      } else if (this.appliedPromo.type === "fixed") {
        discountAmount = this.appliedPromo.value;
      }
    } else if (this.appliedPromo && subtotal < (this.appliedPromo.minOrder || 0)) {
      // Invalidated because subtotal dropped below minOrder
      this.appliedPromo = null;
    }

    const finalTotal = Math.max(0, subtotal + deliveryFee - discountAmount);

    return {
      subtotal,
      productCostBeforeTax,
      gstAmount,
      gstRate,
      deliveryFee,
      discountAmount,
      appliedPromo: this.appliedPromo,
      finalTotal
    };
  }

  applyPromoCode(codeStr) {
    const promoCodes = StorageManager.getPromoCodes();
    const code = promoCodes.find(p => p.code.toUpperCase() === codeStr.trim().toUpperCase() && p.active);
    
    const totals = this.calculateTotals();
    
    if (!code) {
      return { success: false, message: "Invalid or expired promo code!" };
    }
    if (totals.subtotal < code.minOrder) {
      return { success: false, message: `Minimum order total of ₹${code.minOrder} required for this code!` };
    }

    this.appliedPromo = code;
    return { success: true, message: `Promo code ${code.code} applied successfully!` };
  }
}

// Global Cart Instance
window.cartManager = new CartManager();
