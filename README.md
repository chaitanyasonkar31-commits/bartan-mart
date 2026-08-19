# 🍳 Bartan Mart - Kitchenwares & Utensils E-Commerce Website

A modern, high-performance, visually attractive static e-commerce web application for **Bartan Mart** built to be hosted directly on **GitHub Pages** with zero backend infrastructure costs!

---

## 🌟 Key Features

1. **GitHub Pages Ready**: Hosted 100% free on GitHub Pages using standard web standards (HTML5, CSS3, ES6 JavaScript).
2. **Product Catalog & Management**:
   - Pre-loaded with seed products (Tri-Ply Cookware, Pressure Cookers, Copper Handi, Brass Kadhai, Dinnerware Sets, Storage Jars).
   - Category filtering (Cookware, Pressure Cookers, Utensils, Dinnerware, Storage, Kitchen Tools) & live search bar.
   - Quick View Product Modal.
3. **Owner Admin Dashboard (`🔒 Admin`)**:
   - Protected by Admin Password (default: `admin123`).
   - Add new products manually with custom prices, stock status, descriptions, and product images (supports file upload via Base64 or Image URLs).
   - Edit product prices or delete items directly.
4. **Owner-Only Manual Offers & Promo Codes**:
   - Create custom promo codes (% discount or fixed ₹ discount) with minimum order thresholds.
   - Customers cannot create or tamper with offers; they can only apply active promo codes created by the admin.
5. **Anti-Fraud & Order Desk**:
   - **100% Prepaid Only**: Cash on Delivery (COD) is disabled to prevent fake orders.
   - **Mandatory Customer Phone Number**: Validates 10-digit mobile number during checkout.
   - **Mandatory 12-Digit UTR Capture**: Customers must enter UPI UTR or bank transaction reference ID after scanning your store QR code or paying to `bartanmart@upi`.
   - **Payment Verification Desk**: Admin receives incoming orders marked **"Pending Payment Verification"**. Admin checks bank/UPI app for funds, then clicks **"Verify Payment"** before advancing to **"Packing"**.
   - **Quick Contact Buttons**: Admin panel includes 1-click **Call Customer** (`tel:`) and **WhatsApp Customer** (`wa.me`) buttons for immediate delivery coordination.
6. **Detailed Pricing & Tax Breakdown**:
   - Subtotal calculation.
   - Transparent **GST Tax Breakdown** (e.g. 18% included tax).
   - Delivery fee (Free above ₹999 or flat ₹49).
   - Instant promo discount deduction.
7. **Customer Order Tracking Timeline**:
   - Visual step progress (`Order Placed` ➔ `Payment Verified` ➔ `Packing` ➔ `Out for Delivery` ➔ `Delivered`).
8. **Trust Badges & Store Policies**:
   - Prominently displays **100% Genuine Legitimate Products** guarantee.
   - **Strict No-Replacement Policy** banner notice.
   - Store Helpline support number (+91 98765 43210).

---

## 🚀 How to Host Directly on GitHub Pages (Step-by-Step)

Follow these easy steps to host your Bartan Mart website live on the internet for free using GitHub Pages:

### Step 1: Create a GitHub Repository
1. Go to [GitHub.com](https://github.com) and log in to your account.
2. Click the **"+"** button at the top right and select **New repository**.
3. Name your repository (e.g., `bartan-mart` or `kitchenware-store`).
4. Set the repository visibility to **Public**.
5. Click **Create repository**.

### Step 2: Upload Your Files
1. In your newly created GitHub repository page, click **"uploading an existing file"**.
2. Drag and drop all the files from this folder into GitHub:
   - `index.html`
   - `css/styles.css`
   - `js/data.js`
   - `js/cart.js`
   - `js/admin.js`
   - `js/app.js`
   - `README.md`
3. Click **Commit changes**.

*Alternative (via Git CLI)*:
```bash
git init
git add .
git commit -m "Initial commit for Bartan Mart website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bartan-mart.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository **Settings** tab.
2. Scroll down on the left sidebar and click **Pages** (under Code and automation).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` and `/ (root)`.
4. Click **Save**.

### Step 4: Access Your Live Website!
After 1-2 minutes, GitHub Pages will deploy your website. Your live website URL will be:
`https://YOUR_USERNAME.github.io/bartan-mart/`

---

## 🛠️ How to Access the Admin Panel

1. Open your live website.
2. Click the **🔒 Admin** button at the top right of the navigation header.
3. Enter the default Admin Password: `admin123`
4. Use the tabs to:
   - Check customer order requests & verify UTR payment references.
   - Add new kitchenware items, set prices & upload product photos.
   - Generate promo codes & banner offers.
   - Update your helpline phone number, UPI ID, and admin password in **Store Settings**.

---

## 📞 Technical Support
For any customizations or store settings updates, modify `DEFAULT_STORE_SETTINGS` in `js/data.js` or manage directly inside the Admin Dashboard Settings tab.
