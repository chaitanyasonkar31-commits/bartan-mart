/* Admin Dashboard Panel Logic for Bartan Mart */

class AdminManager {
  constructor() {
    this.isAuthenticated = false;
  }

  login(password) {
    const settings = StorageManager.getSettings();
    if (password === settings.adminPassword || password === "chaitanya1949") {
      this.isAuthenticated = true;
      // Auto-sync password in localStorage
      if (settings.adminPassword !== "chaitanya1949") {
        settings.adminPassword = "chaitanya1949";
        StorageManager.saveSettings(settings);
      }
      return true;
    }
    return false;
  }

  renderProductsTable() {
    const products = StorageManager.getProducts();
    const tbody = document.getElementById("admin-products-tbody");
    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No products found. Add your first product above.</td></tr>`;
      return;
    }

    tbody.innerHTML = products.map(p => `
      <tr>
        <td><img src="${p.image}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;" alt="Product"></td>
        <td><strong>${p.name}</strong><br><small style="color:#6B7280;">${p.material}</small></td>
        <td>${p.category}</td>
        <td><s style="color:#9CA3AF;">₹${p.mrp}</s> <strong style="color:#C84B31;">₹${p.price}</strong></td>
        <td>
          ${p.stock > 0 
            ? `<span class="status-pill delivered">${p.stock} In Stock</span>` 
            : `<span class="status-pill pending" style="background:#FEE2E2; color:#991B1B;">OUT OF STOCK</span>`}
        </td>
        <td>
          <button class="btn-sm ${p.stock > 0 ? 'btn-danger' : 'btn-success'}" onclick="adminManager.toggleStock('${p.id}')">
            ${p.stock > 0 ? 'Mark Out of Stock' : 'Mark In Stock'}
          </button>
          <button class="btn-sm btn-primary" onclick="adminManager.editProductPrice('${p.id}')">Edit Price</button>
          <button class="btn-sm btn-danger" onclick="adminManager.deleteProduct('${p.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  toggleStock(productId) {
    const products = StorageManager.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.stock > 0) {
      product.stock = 0;
    } else {
      product.stock = 20; // default restock quantity
    }

    StorageManager.saveProducts(products);
    this.renderProductsTable();
    window.appManager.renderCatalog();
    alert(`Product "${product.name}" stock updated!`);
  }

  addProduct(productData) {
    const products = StorageManager.getProducts();
    const newProduct = {
      id: "p_" + Date.now(),
      name: productData.name,
      category: productData.category,
      mrp: parseFloat(productData.mrp),
      price: parseFloat(productData.price),
      material: productData.material || "Stainless Steel",
      image: productData.image || "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80",
      rating: 4.8,
      stock: parseInt(productData.stock) || 20,
      description: productData.description || "100% Genuine product guaranteed by Bartan Mart."
    };

    products.unshift(newProduct);
    StorageManager.saveProducts(products);
    this.renderProductsTable();
    window.appManager.renderCatalog();
    alert("Product added successfully!");
  }

  editProductPrice(productId) {
    const products = StorageManager.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newPrice = prompt(`Enter new Selling Price for "${product.name}" (Current: ₹${product.price}):`, product.price);
    if (newPrice !== null && !isNaN(parseFloat(newPrice))) {
      product.price = parseFloat(newPrice);
      StorageManager.saveProducts(products);
      this.renderProductsTable();
      window.appManager.renderCatalog();
      alert("Product price updated successfully!");
    }
  }

  deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product from your shop catalog?")) {
      let products = StorageManager.getProducts();
      products = products.filter(p => p.id !== productId);
      StorageManager.saveProducts(products);
      this.renderProductsTable();
      window.appManager.renderCatalog();
    }
  }

  renderPromoCodesTable() {
    const codes = StorageManager.getPromoCodes();
    const tbody = document.getElementById("admin-promos-tbody");
    if (!tbody) return;

    tbody.innerHTML = codes.map(c => `
      <tr>
        <td><strong style="color:#C84B31;">${c.code}</strong></td>
        <td>${c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} Flat OFF`}</td>
        <td>₹${c.minOrder}</td>
        <td>${c.active ? `<span class="status-pill delivered">Active</span>` : `<span class="status-pill pending">Disabled</span>`}</td>
        <td>
          <button class="btn-sm ${c.active ? 'btn-danger' : 'btn-success'}" onclick="adminManager.togglePromo('${c.code}')">
            ${c.active ? 'Disable' : 'Enable'}
          </button>
          <button class="btn-sm btn-danger" onclick="adminManager.deletePromo('${c.code}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  addPromoCode(promoData) {
    const codes = StorageManager.getPromoCodes();
    const existing = codes.find(c => c.code.toUpperCase() === promoData.code.trim().toUpperCase());
    if (existing) {
      alert("A promo code with this name already exists!");
      return;
    }

    codes.unshift({
      code: promoData.code.trim().toUpperCase(),
      type: promoData.type,
      value: parseFloat(promoData.value),
      minOrder: parseFloat(promoData.minOrder) || 0,
      active: true,
      description: promoData.description || `Special manual offer code ${promoData.code}`
    });

    StorageManager.savePromoCodes(codes);
    this.renderPromoCodesTable();
    alert("Manual Promo Code created successfully!");
  }

  togglePromo(codeStr) {
    const codes = StorageManager.getPromoCodes();
    const code = codes.find(c => c.code === codeStr);
    if (code) {
      code.active = !code.active;
      StorageManager.savePromoCodes(codes);
      this.renderPromoCodesTable();
    }
  }

  deletePromo(codeStr) {
    let codes = StorageManager.getPromoCodes();
    codes = codes.filter(c => c.code !== codeStr);
    StorageManager.savePromoCodes(codes);
    this.renderPromoCodesTable();
  }

  renderOrdersTable() {
    const orders = StorageManager.getOrders();
    const tbody = document.getElementById("admin-orders-tbody");
    if (!tbody) return;

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">No customer order requests placed yet.</td></tr>`;
      return;
    }

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td><strong>#${o.id}</strong><br><small style="color:#6B7280;">${o.date}</small></td>
        <td>
          <strong>${o.customerName}</strong><br>
          <span style="font-weight:700; color:#1F2937;">📞 ${o.phone}</span><br>
          <a href="tel:${o.phone}" class="btn-sm btn-primary" style="text-decoration:none; display:inline-block; margin-top:2px;">Call</a>
          <a href="https://wa.me/91${o.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(o.customerName)},%20regarding%20your%20Bartan%20Mart%20Order%20%23${o.id}" target="_blank" class="btn-sm btn-success" style="text-decoration:none; display:inline-block; margin-top:2px;">WhatsApp</a>
        </td>
        <td><small>${o.address}, ${o.pincode}</small></td>
        <td>
          <strong>₹${o.totalAmount}</strong><br>
          <small style="color:#6B7280;">${o.items.length} items</small>
        </td>
        <td>
          <span style="font-weight:700;">${o.paymentMethod}</span><br>
          <small style="background:#FEF3C7; padding:2px 6px; border-radius:4px; font-family:monospace;">UTR: ${o.utr || 'N/A'}</small>
        </td>
        <td>
          <span class="status-pill ${o.paymentStatus === 'Payment Verified' ? 'delivered' : 'pending'}">${o.paymentStatus}</span>
          <br>
          <button class="btn-sm btn-success" style="margin-top:4px;" onclick="adminManager.verifyPayment('${o.id}')">Verify Payment</button>
        </td>
        <td>
          <span class="status-pill ${o.deliveryStatus === 'Delivered' ? 'delivered' : o.deliveryStatus === 'Out for Delivery' ? 'shipped' : 'packing'}">${o.deliveryStatus}</span>
          <br>
          <select onchange="adminManager.updateDeliveryStatus('${o.id}', this.value)" style="font-size:0.75rem; margin-top:4px; padding:2px;">
            <option value="Order Placed" ${o.deliveryStatus === 'Order Placed' ? 'selected' : ''}>Order Placed</option>
            <option value="Packing" ${o.deliveryStatus === 'Packing' ? 'selected' : ''}>Packing</option>
            <option value="Out for Delivery" ${o.deliveryStatus === 'Out for Delivery' ? 'selected' : ''}>Out for Delivery</option>
            <option value="Delivered" ${o.deliveryStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
          </select>
        </td>
      </tr>
    `).join('');
  }

  verifyPayment(orderId) {
    StorageManager.updateOrderStatus(orderId, 'Payment Verified', null);
    this.renderOrdersTable();
    alert(`Order #${orderId} payment verified!`);
  }

  updateDeliveryStatus(orderId, newStatus) {
    StorageManager.updateOrderStatus(orderId, null, newStatus);
    this.renderOrdersTable();
  }

  exportCatalogJSON() {
    const data = {
      products: StorageManager.getProducts(),
      promos: StorageManager.getPromoCodes(),
      settings: StorageManager.getSettings()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bartan_mart_master_data.json";
    a.click();
  }

  importCatalogJSON(jsonFile) {
    if (!jsonFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.products) StorageManager.saveProducts(data.products);
        if (data.promos) StorageManager.savePromoCodes(data.promos);
        if (data.settings) StorageManager.saveSettings(data.settings);
        this.renderProductsTable();
        this.renderPromoCodesTable();
        this.renderSettingsForm();
        window.appManager.renderCatalog();
        alert("Store catalog and settings imported successfully across devices!");
      } catch (err) {
        alert("Invalid JSON data file format!");
      }
    };
    reader.readAsText(jsonFile);
  }

  renderSettingsForm() {
    const s = StorageManager.getSettings();
    document.getElementById("set-helpline").value = s.helplinePhone;
    document.getElementById("set-upi").value = s.upiId;
    document.getElementById("set-gst").value = s.gstPercentage;
    document.getElementById("set-freedelivery").value = s.freeDeliveryThreshold;
    document.getElementById("set-announcement").value = s.announcementText;
  }

  saveSettingsFromForm() {
    const s = StorageManager.getSettings();
    s.helplinePhone = document.getElementById("set-helpline").value;
    s.upiId = document.getElementById("set-upi").value;
    s.gstPercentage = parseFloat(document.getElementById("set-gst").value);
    s.freeDeliveryThreshold = parseFloat(document.getElementById("set-freedelivery").value);
    s.announcementText = document.getElementById("set-announcement").value;
    
    const newPass = document.getElementById("set-password").value;
    if (newPass.trim() !== "") {
      s.adminPassword = newPass.trim();
    }

    StorageManager.saveSettings(s);
    window.appManager.updateStoreHeaderSettings();
    alert("Store settings saved successfully!");
  }
}

// Global Admin Manager Instance
window.adminManager = new AdminManager();
