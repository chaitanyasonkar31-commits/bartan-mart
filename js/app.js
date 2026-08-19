// Initialize Google Firebase with Owner Project Keys (Safe Init)
try {
  const firebaseConfig = {
    apiKey: "AIzaSyBlF2SkKAD3ym85y8UwPWCNJic7nNpzzKA",
    authDomain: "bartan-mart.firebaseapp.com",
    projectId: "bartan-mart",
    storageBucket: "bartan-mart.firebasestorage.app",
    messagingSenderId: "554619831555",
    appId: "1:554619831555:web:683f935638a7c7e245d536",
    measurementId: "G-PGS44NZZ3G"
  };

  if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
} catch (err) {
  console.warn("Firebase Init Notice:", err);
}

class AppManager {
  constructor() {
    this.currentCategory = "All";
    this.searchQuery = "";
    this.recaptchaVerifier = null;
    this.confirmationResult = null;
    this.pendingPhone = null;
  }

  init() {
    this.updateStoreHeaderSettings();
    this.renderHeaderAuth();
    this.renderCatalog();
    this.updateCartBadge();
    this.setupEventListeners();
    this.resetAllModals();

    // Auto-open Welcome Login Modal if user is not logged in
    const user = StorageManager.getLoggedUser();
    if (!user || !user.phone) {
      setTimeout(() => {
        this.openModal("modal-customer-login");
      }, 600);
    }
  }

  resetAllModals() {
    document.querySelectorAll(".modal-overlay").forEach(modal => {
      if (!modal.classList.contains("active")) {
        modal.style.setProperty("display", "none", "important");
        modal.style.setProperty("opacity", "0", "important");
        modal.style.setProperty("visibility", "hidden", "important");
        modal.style.setProperty("pointer-events", "none", "important");
        modal.style.setProperty("z-index", "-1", "important");
      }
    });
  }

  renderHeaderAuth() {
    const user = StorageManager.getLoggedUser();
    const container = document.getElementById("user-header-auth-container");
    if (!container) return;

    if (user && user.phone) {
      container.innerHTML = `
        <div class="user-logged-badge">
          <span>👤 +91 ${user.phone}</span>
          <button onclick="appManager.logoutCustomer()" style="background:none; border:none; color:#EF4444; font-weight:700; cursor:pointer; margin-left:6px;" title="Logout">✕</button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <button class="btn-nav-action btn-user-login" onclick="appManager.openModal('modal-customer-login')">
          📱 Login with Phone
        </button>
      `;
    }
  }

  initFirebaseRecaptcha() {
    if (!this.recaptchaVerifier && typeof firebase !== 'undefined') {
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved
        }
      });
    }
  }

  sendWhatsAppOTP() {
    const phoneInput = document.getElementById("login-phone-input").value.trim();
    if (!/^[6-9]\d{9}$/.test(phoneInput)) {
      alert("Please enter a valid 10-digit Indian Mobile Phone Number!");
      return;
    }

    this.pendingPhone = phoneInput;
    const waOtp = Math.floor(1000 + Math.random() * 9000).toString();
    this.currentWaOTP = waOtp;

    // Set code on screen for instant seamless login
    const codeDisplay = document.getElementById("on-screen-otp-code");
    if (codeDisplay) codeDisplay.textContent = waOtp;

    const settings = StorageManager.getSettings();
    const waMsg = encodeURIComponent(`Hello Bartan Mart! My verification code is ${waOtp} for mobile number +91 ${phoneInput}.`);
    const waLink = `https://wa.me/${settings.whatsappPhone}?text=${waMsg}`;
    
    const waBtn = document.getElementById("direct-wa-link-btn");
    if (waBtn) {
      waBtn.href = waLink;
      waBtn.style.display = "block";
    }

    document.getElementById("display-otp-phone").textContent = "+91 " + phoneInput;
    document.getElementById("firebase-otp-code-input").placeholder = "Enter 4-digit code shown above";
    document.getElementById("firebase-otp-code-input").maxLength = 4;
    document.getElementById("otp-step-1").style.display = "none";
    document.getElementById("otp-step-2").style.display = "block";
    document.getElementById("firebase-otp-code-input").focus();
  }

  sendFirebaseSMSOTP() {
    const phoneInput = document.getElementById("login-phone-input").value.trim();
    if (!/^[6-9]\d{9}$/.test(phoneInput)) {
      alert("Please enter a valid 10-digit Indian Mobile Phone Number!");
      return;
    }

    const sendBtn = document.getElementById("btn-send-sms-otp");
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending Real SMS... ⏳";

    this.pendingPhone = phoneInput;
    const fullPhoneNumber = "+91" + phoneInput;

    this.initFirebaseRecaptcha();

    firebase.auth().signInWithPhoneNumber(fullPhoneNumber, this.recaptchaVerifier)
      .then((confirmationResult) => {
        this.confirmationResult = confirmationResult;
        document.getElementById("display-otp-phone").textContent = fullPhoneNumber;
        document.getElementById("otp-step-1").style.display = "none";
        document.getElementById("otp-step-2").style.display = "block";
        document.getElementById("firebase-otp-code-input").focus();
        sendBtn.disabled = false;
        sendBtn.textContent = "Send Real SMS OTP 📩";
        alert(`📱 Real SMS OTP sent by Google to ${fullPhoneNumber}! Check your mobile messages.`);
      })
      .catch((error) => {
        console.error("Error sending SMS OTP:", error);
        sendBtn.disabled = false;
        sendBtn.textContent = "Send Real SMS OTP 📩";
        if (error.code === 'auth/invalid-phone-number') {
          alert("Invalid phone number format. Please check the number.");
        } else if (error.code === 'auth/quota-exceeded') {
          alert("SMS quota exceeded. Please try again later.");
        } else {
          alert(`Google SMS Notice: ${error.message}\n\nPlease make sure Phone Auth is enabled in your Firebase console under Authentication ➔ Sign-in method ➔ Phone.`);
        }
      });
  }

  verifyFirebaseSMSOTP() {
    const otpInput = document.getElementById("firebase-otp-code-input").value.trim();

    // If verified via WhatsApp 4-digit OTP
    if (this.currentWaOTP && otpInput === this.currentWaOTP) {
      StorageManager.setLoggedUser({ phone: this.pendingPhone, loggedAt: new Date().toISOString(), type: 'whatsapp' });
      this.renderHeaderAuth();
      this.closeModal("modal-customer-login");
      alert(`🎉 Verified via WhatsApp! Logged in successfully with +91 ${this.pendingPhone}!`);

      document.getElementById("otp-step-2").style.display = "none";
      document.getElementById("otp-step-1").style.display = "block";
      document.getElementById("login-phone-input").value = "";
      document.getElementById("firebase-otp-code-input").value = "";
      this.currentWaOTP = null;
      return;
    }

    if (otpInput.length !== 6 && !this.currentWaOTP) {
      alert("Please enter the full 6-digit SMS code received on your mobile phone!");
      return;
    }

    const verifyBtn = document.getElementById("btn-verify-sms-otp");
    verifyBtn.disabled = true;
    verifyBtn.textContent = "Verifying Code... ⏳";

    if (!this.confirmationResult && !this.currentWaOTP) {
      alert("Session expired. Please click Resend.");
      verifyBtn.disabled = false;
      verifyBtn.textContent = "Verify SMS Code & Login 🔓";
      return;
    }

    if (this.confirmationResult) {
      this.confirmationResult.confirm(otpInput)
        .then((result) => {
          StorageManager.setLoggedUser({ phone: this.pendingPhone, loggedAt: new Date().toISOString(), uid: result.user.uid, type: 'firebase' });
          this.renderHeaderAuth();
          this.closeModal("modal-customer-login");
          verifyBtn.disabled = false;
          verifyBtn.textContent = "Verify SMS Code & Login 🔓";
          alert(`🎉 Verified! Logged in successfully with +91 ${this.pendingPhone}!`);

          // Reset UI
          document.getElementById("otp-step-2").style.display = "none";
          document.getElementById("otp-step-1").style.display = "block";
          document.getElementById("login-phone-input").value = "";
          document.getElementById("firebase-otp-code-input").value = "";
        })
        .catch((error) => {
          console.error("Error verifying SMS OTP:", error);
          verifyBtn.disabled = false;
          verifyBtn.textContent = "Verify SMS Code & Login 🔓";
          alert("Incorrect verification code! Please check the code received on your phone.");
        });
    } else {
      verifyBtn.disabled = false;
      verifyBtn.textContent = "Verify SMS Code & Login 🔓";
      alert("Incorrect verification code! Please check the WhatsApp or SMS code.");
    }
  }

  logoutCustomer() {
    if (confirm("Are you sure you want to log out?")) {
      if (typeof firebase !== 'undefined') {
        firebase.auth().signOut().catch(() => {});
      }
      StorageManager.logoutUser();
      this.renderHeaderAuth();
    }
  }

  updateStoreHeaderSettings() {
    const s = StorageManager.getSettings();
    const helplineEl = document.getElementById("top-helpline-link");
    if (helplineEl) {
      helplineEl.href = `tel:${s.helplinePhone.replace(/\s+/g, '')}`;
      helplineEl.innerHTML = `📞 Helpline: ${s.helplinePhone}`;
    }
    const announcementEl = document.getElementById("top-announcement-text");
    if (announcementEl) {
      announcementEl.textContent = s.announcementText;
    }
    const upiTextEl = document.getElementById("checkout-upi-id-display");
    if (upiTextEl) {
      upiTextEl.textContent = s.upiId;
    }
  }

  renderCatalog() {
    const products = StorageManager.getProducts();
    const grid = document.getElementById("products-grid");
    if (!grid) return;

    let filtered = products;
    if (this.currentCategory !== "All") {
      filtered = filtered.filter(p => p.category.toLowerCase() === this.currentCategory.toLowerCase());
    }
    if (this.searchQuery.trim() !== "") {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.material.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; background: white; border-radius: 12px; border: 1px solid #E5E7EB;">
          <h3 style="color: #374151; margin-bottom: 8px;">No Kitchenware Found</h3>
          <p style="color: #6B7280;">Try searching for another product or selecting a different category.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const discountPct = Math.round(((p.mrp - p.price) / p.mrp) * 100);
      const isOutOfStock = (p.stock <= 0);
      return `
        <div class="product-card ${isOutOfStock ? 'out-of-stock-card' : ''}">
          <div class="product-image-wrap" onclick="appManager.openQuickView('${p.id}')">
            <img src="${p.image}" class="product-img" alt="${p.name}" loading="lazy">
            ${isOutOfStock ? `<span class="discount-badge" style="background:#EF4444;">OUT OF STOCK</span>` : (discountPct > 0 ? `<span class="discount-badge">${discountPct}% OFF</span>` : '')}
            <span class="material-badge">${p.material}</span>
          </div>
          <div class="product-body">
            <span class="product-category">${p.category}</span>
            <h3 class="product-title" onclick="appManager.openQuickView('${p.id}')" style="cursor:pointer;">${p.name}</h3>
            <div class="product-rating">⭐ ${p.rating} (100% Genuine)</div>
            <div class="product-price-row">
              <span class="price-current">₹${p.price}</span>
              <span class="price-mrp">₹${p.mrp}</span>
              <span class="tax-tag">Inc. GST</span>
            </div>
            ${isOutOfStock ? `
              <button class="btn-add-cart" disabled style="background:#9CA3AF; cursor:not-allowed;">
                🚫 Out of Stock
              </button>
            ` : `
              <button class="btn-add-cart" onclick="appManager.addToCart('${p.id}')">
                🛒 Add to Cart
              </button>
            `}
          </div>
        </div>
      `;
    }).join('');
  }

  setCategory(categoryName, pillElement) {
    this.currentCategory = categoryName;
    document.querySelectorAll(".category-pill").forEach(el => el.classList.remove("active"));
    if (pillElement) pillElement.classList.add("active");
    this.renderCatalog();
  }

  handleSearch(query) {
    this.searchQuery = query;
    this.renderCatalog();
  }

  addToCart(productId) {
    const user = StorageManager.getLoggedUser();
    if (!user || !user.phone) {
      alert("Please log in with your mobile phone number first to add items to your cart!");
      this.openModal("modal-customer-login");
      return;
    }

    window.cartManager.addItem(productId);
    this.updateCartBadge();
    this.openModal("modal-cart");
    this.renderCartModal();
  }

  updateCartBadge() {
    const count = window.cartManager.getItemCount();
    const countEl = document.getElementById("cart-badge-count");
    if (countEl) countEl.textContent = count;
    const mobileCountEl = document.getElementById("mobile-cart-badge-count");
    if (mobileCountEl) mobileCountEl.textContent = count;
  }

  renderCartModal() {
    const cart = window.cartManager.cart;
    const itemsContainer = document.getElementById("cart-items-container");
    if (!itemsContainer) return;

    if (cart.length === 0) {
      itemsContainer.innerHTML = `
        <div style="text-align:center; padding:30px 10px;">
          <div style="font-size:3rem; margin-bottom:10px;">🍳</div>
          <h4>Your Cart is Empty</h4>
          <p style="color:#6B7280; font-size:0.9rem; margin-top:4px;">Explore our premium kitchenware collection and add items to your cart.</p>
        </div>
      `;
      document.getElementById("cart-checkout-btn").style.display = "none";
    } else {
      itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
          <img src="${item.image}" class="cart-item-img" alt="${item.name}">
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-price">₹${item.price}</div>
          </div>
          <div class="qty-controls">
            <button class="btn-qty" onclick="appManager.changeCartQty('${item.id}', -1)">-</button>
            <span class="qty-val">${item.qty}</span>
            <button class="btn-qty" onclick="appManager.changeCartQty('${item.id}', 1)">+</button>
          </div>
          <button onclick="appManager.removeCartItem('${item.id}')" style="background:none; border:none; color:#EF4444; font-size:1.1rem; cursor:pointer; padding:4px;">✕</button>
        </div>
      `).join('');
      document.getElementById("cart-checkout-btn").style.display = "block";
    }

    this.renderPriceTotalsUI();
  }

  changeCartQty(productId, delta) {
    window.cartManager.updateQty(productId, delta);
    this.updateCartBadge();
    this.renderCartModal();
  }

  removeCartItem(productId) {
    window.cartManager.removeItem(productId);
    this.updateCartBadge();
    this.renderCartModal();
  }

  renderPriceTotalsUI() {
    const totals = window.cartManager.calculateTotals();
    const box = document.getElementById("price-breakdown-container");
    if (!box) return;

    box.innerHTML = `
      <div class="price-row">
        <span>Product Subtotal</span>
        <span>₹${totals.subtotal}</span>
      </div>
      <div class="price-row" style="font-size:0.8rem; color:#6B7280;">
        <span>Includes GST (${totals.gstRate}%)</span>
        <span>₹${totals.gstAmount}</span>
      </div>
      <div class="price-row">
        <span>Delivery Fee</span>
        <span>${totals.deliveryFee === 0 ? '<strong style="color:#10B981;">FREE</strong>' : '₹' + totals.deliveryFee}</span>
      </div>
      ${totals.discountAmount > 0 ? `
        <div class="price-row discount">
          <span>Promo Discount (${totals.appliedPromo.code})</span>
          <span>- ₹${totals.discountAmount}</span>
        </div>
      ` : ''}
      <div class="price-row total">
        <span>Final Payable Amount</span>
        <span style="color:#C84B31;">₹${totals.finalTotal}</span>
      </div>
    `;
  }

  applyPromoCodeFromInput() {
    const input = document.getElementById("promo-input-code");
    const msgEl = document.getElementById("promo-msg-display");
    if (!input || !msgEl) return;

    const res = window.cartManager.applyPromoCode(input.value);
    if (res.success) {
      msgEl.className = "promo-msg success";
      msgEl.textContent = res.message;
    } else {
      msgEl.className = "promo-msg error";
      msgEl.textContent = res.message;
    }
    this.renderPriceTotalsUI();
  }

  openCheckoutModal() {
    const user = StorageManager.getLoggedUser();
    if (!user || !user.phone) {
      alert("Please log in with your mobile phone number first to proceed to checkout!");
      this.openModal("modal-customer-login");
      return;
    }

    if (window.cartManager.cart.length === 0) return;
    this.closeModal("modal-cart");
    this.openModal("modal-checkout");
    this.renderCheckoutTotals();

    // Auto-fill logged in user phone number
    const phoneInput = document.getElementById("cust-phone");
    if (phoneInput && user.phone) phoneInput.value = user.phone;
  }

  renderCheckoutTotals() {
    const totals = window.cartManager.calculateTotals();
    document.getElementById("checkout-total-payable").textContent = totals.finalTotal;
  }

  processOrderSubmit() {
    const name = document.getElementById("cust-name").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const address = document.getElementById("cust-address").value.trim();
    const pincode = document.getElementById("cust-pincode").value.trim();
    const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
    const utr = document.getElementById("cust-utr").value.trim();

    // Validations
    if (!name || !address || !pincode) {
      alert("Please fill in your Full Name, Shipping Address, and Pincode!");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit Indian Mobile Phone Number!");
      return;
    }
    if (!utr || utr.length < 6) {
      alert("Please enter your official 12-Digit UPI UTR or Payment Transaction Reference Number!");
      return;
    }

    const totals = window.cartManager.calculateTotals();
    const orderId = "BM" + Math.floor(100000 + Math.random() * 900000);
    const dateStr = new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

    const newOrder = {
      id: orderId,
      date: dateStr,
      customerName: name,
      phone: phone,
      address: address,
      pincode: pincode,
      items: [...window.cartManager.cart],
      totals: totals,
      totalAmount: totals.finalTotal,
      paymentMethod: paymentMethod,
      utr: utr,
      paymentStatus: "Pending Verification",
      deliveryStatus: "Order Placed"
    };

    StorageManager.saveOrder(newOrder);
    window.cartManager.clearCart();
    this.updateCartBadge();
    this.closeModal("modal-checkout");

    // Render Order Confirmation Modal
    document.getElementById("conf-order-id").textContent = orderId;
    document.getElementById("conf-cust-phone").textContent = phone;
    document.getElementById("conf-total-paid").textContent = totals.finalTotal;
    document.getElementById("conf-utr").textContent = utr;

    // WhatsApp Notification Button Setup
    const settings = StorageManager.getSettings();
    const waText = encodeURIComponent(`Hello Bartan Mart! I have placed an order.\n\n📦 Order ID: #${orderId}\n👤 Name: ${name}\n📞 Phone: ${phone}\n💳 Total Paid: ₹${totals.finalTotal}\n🔑 UTR Reference: ${utr}\n\nPlease confirm payment and dispatch.`);
    const waBtn = document.getElementById("conf-whatsapp-btn");
    if (waBtn) {
      waBtn.href = `https://wa.me/${settings.whatsappPhone}?text=${waText}`;
    }

    this.openModal("modal-confirmation");
  }

  lookupOrderTracking() {
    const idInput = document.getElementById("track-order-id-input").value.trim().toUpperCase().replace('#', '');
    const resBox = document.getElementById("tracking-result-box");
    if (!idInput) {
      alert("Please enter your Order ID!");
      return;
    }

    const orders = StorageManager.getOrders();
    const order = orders.find(o => o.id === idInput);

    if (!order) {
      resBox.innerHTML = `
        <div style="text-align:center; padding:20px; color:#EF4444; font-weight:700;">
          No order found with Order ID #${idInput}. Please check the ID and try again.
        </div>
      `;
      return;
    }

    const statuses = ["Order Placed", "Packing", "Out for Delivery", "Delivered"];
    let currentIdx = statuses.indexOf(order.deliveryStatus);
    if (currentIdx === -1) currentIdx = 0;

    resBox.innerHTML = `
      <div style="background:#F9FAFB; border:1px solid #E5E7EB; border-radius:12px; padding:16px; margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <div>
            <h4 style="color:#111827; font-size:1.1rem;">Order #${order.id}</h4>
            <p style="color:#6B7280; font-size:0.85rem;">Placed on: ${order.date}</p>
          </div>
          <div>
            <span class="status-pill ${order.paymentStatus === 'Payment Verified' ? 'delivered' : 'pending'}">${order.paymentStatus}</span>
          </div>
        </div>
      </div>

      <div class="tracking-stepper">
        <div class="step-item ${currentIdx >= 0 ? 'completed' : ''} ${currentIdx === 0 ? 'active' : ''}">
          <div class="step-icon-wrap">📝</div>
          <div class="step-label">Order Placed</div>
        </div>
        <div class="step-item ${currentIdx >= 1 ? 'completed' : ''} ${currentIdx === 1 ? 'active' : ''}">
          <div class="step-icon-wrap">📦</div>
          <div class="step-label">Packing</div>
        </div>
        <div class="step-item ${currentIdx >= 2 ? 'completed' : ''} ${currentIdx === 2 ? 'active' : ''}">
          <div class="step-icon-wrap">🚚</div>
          <div class="step-label">Out for Delivery</div>
        </div>
        <div class="step-item ${currentIdx >= 3 ? 'completed' : ''} ${currentIdx === 3 ? 'active' : ''}">
          <div class="step-icon-wrap">✅</div>
          <div class="step-label">Delivered</div>
        </div>
      </div>

      <div style="background:#FFF; border:1px solid #E5E7EB; border-radius:12px; padding:16px;">
        <h5 style="margin-bottom:8px; font-weight:700;">Order Summary</h5>
        <p style="font-size:0.85rem; color:#4B5563; margin-bottom:4px;"><strong>Customer:</strong> ${order.customerName} (${order.phone})</p>
        <p style="font-size:0.85rem; color:#4B5563; margin-bottom:4px;"><strong>Delivery Address:</strong> ${order.address}, ${order.pincode}</p>
        <p style="font-size:0.85rem; color:#4B5563;"><strong>Total Amount:</strong> ₹${order.totalAmount} (Prepaid via ${order.paymentMethod})</p>
      </div>
    `;
  }

  openQuickView(productId) {
    const products = StorageManager.getProducts();
    const p = products.find(prod => prod.id === productId);
    if (!p) return;

    const modalBody = document.getElementById("quickview-body");
    modalBody.innerHTML = `
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:20px;">
        <div>
          <img src="${p.image}" style="width:100%; border-radius:12px; object-fit:cover; max-height:280px;" alt="${p.name}">
        </div>
        <div>
          <span style="color:#C84B31; font-weight:700; font-size:0.8rem; text-transform:uppercase;">${p.category}</span>
          <h3 style="font-size:1.3rem; margin:4px 0 8px;">${p.name}</h3>
          <p style="font-size:0.85rem; color:#6B7280; margin-bottom:12px;">Material: <strong>${p.material}</strong></p>
          <div style="font-size:1.4rem; font-weight:800; color:#C84B31; margin-bottom:12px;">
            ₹${p.price} <s style="font-size:0.9rem; color:#9CA3AF;">₹${p.mrp}</s>
          </div>
          <p style="font-size:0.9rem; color:#374151; margin-bottom:16px;">${p.description}</p>
          <div style="background:#FEF2F2; border:1px solid #FCA5A5; border-radius:8px; padding:10px; font-size:0.8rem; color:#991B1B; margin-bottom:16px;">
            🛡️ <strong>Guaranteed Authentic:</strong> 100% Genuine Legitimate Product.<br>
            🚫 <strong>Store Policy:</strong> Strict No-Replacement Policy. Checked for perfection before packing.
          </div>
          ${p.stock <= 0 ? `
            <button class="btn-add-cart" disabled style="background:#9CA3AF; cursor:not-allowed;">
              🚫 Currently Out of Stock
            </button>
          ` : `
            <button class="btn-add-cart" onclick="appManager.addToCart('${p.id}'); appManager.closeModal('modal-quickview');">
              🛒 Add to Cart Now
            </button>
          `}
        </div>
      </div>
    `;
    this.openModal("modal-quickview");
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      modal.style.setProperty("display", "flex", "important");
      modal.style.setProperty("opacity", "1", "important");
      modal.style.setProperty("visibility", "visible", "important");
      modal.style.setProperty("pointer-events", "auto", "important");
      modal.style.setProperty("z-index", "10000", "important");
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      modal.style.setProperty("display", "none", "important");
      modal.style.setProperty("opacity", "0", "important");
      modal.style.setProperty("visibility", "hidden", "important");
      modal.style.setProperty("pointer-events", "none", "important");
      modal.style.setProperty("z-index", "-1", "important");
    }
  }

  switchAdminTab(tabName, btnElement) {
    document.querySelectorAll(".admin-tab-content").forEach(el => el.style.display = "none");
    document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));
    
    document.getElementById(`admin-tab-${tabName}`).style.display = "block";
    if (btnElement) btnElement.classList.add("active");

    if (tabName === 'products') window.adminManager.renderProductsTable();
    if (tabName === 'offers') window.adminManager.renderPromoCodesTable();
    if (tabName === 'orders') window.adminManager.renderOrdersTable();
    if (tabName === 'settings') window.adminManager.renderSettingsForm();
  }

  setupEventListeners() {
    // Search input binding
    const searchInput = document.getElementById("search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => this.handleSearch(e.target.value));
    }

    // Secret Owner Admin Access (#admin in URL or Alt + A or Ctrl + Shift + A)
    if (window.location.hash === "#admin") {
      this.openModal("modal-admin-login");
    }
    window.addEventListener("hashchange", () => {
      if (window.location.hash === "#admin") {
        this.openModal("modal-admin-login");
      }
    });

    document.addEventListener("keydown", (e) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        this.openModal("modal-admin-login");
      }
    });
  }
}

// Global App Instance & Standalone Fallback Functions
window.appManager = new AppManager();

window.openModal = function(id) {
  if (window.appManager) window.appManager.openModal(id);
};
window.closeModal = function(id) {
  if (window.appManager) window.appManager.closeModal(id);
};

document.addEventListener("DOMContentLoaded", () => {
  window.appManager.init();
});
