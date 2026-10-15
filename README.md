# ShopKart — Full-Stack MERN E-Commerce Platform

A production-ready, full-stack E-Commerce application developed as a comprehensive 6-stage trimester lab project using the **MERN** stack (MongoDB, Express.js, React, Node.js) with **Razorpay Payment Gateway** integration and **Tailwind CSS**.

---

## 📑 Table of Contents
- [Overview](#overview)
- [Lab Milestones (Labs 1 – 6)](#lab-milestones-labs-1--6)
- [Tech Stack](#tech-stack)
- [Project Architecture & Directory Structure](#project-architecture--directory-structure)
- [Getting Started & Local Setup](#getting-started--local-setup)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Database Seeding](#database-seeding)
- [Razorpay Payment Gateway Testing Guide](#razorpay-payment-gateway-testing-guide)
- [API Reference](#api-reference)
- [Security Features](#security-features)

---

## 🌟 Overview

ShopKart is an end-to-end e-commerce platform designed with modern UX principles, cryptographic security, and scalable backend architecture:
- **Authentication**: JWT-based authentication stored in secure `httpOnly` cookies.
- **Product Catalog**: Multi-criteria search, category filters, price/newest sorting, and inventory management.
- **Wishlist & Cart**: Real-time reactive state synchronized across the navbar, pages, and MongoDB.
- **Checkout & Payments**: End-to-end Razorpay integration with server-side HMAC SHA-256 signature verification.
- **Post-Payment Lifecycle**: Automatic inventory decrement, database cart clearance, and order receipt generation.

---

## 🧪 Lab Milestones (Labs 1 – 6)

| Lab | Milestone | Core Features & Implementation |
| :--- | :--- | :--- |
| **Lab 1** | **Server Architecture & Database Setup** | Express 5 server initialization, MongoDB Atlas connectivity via Mongoose, environment variable management (`dotenv`), CORS configuration with credentials, and health check routes. |
| **Lab 2** | **Customer Authentication & Authorization** | Customer Mongoose Schema with strict validation, password hashing using `bcrypt`, JWT token generation delivered via secure `httpOnly` cookies, protected profile endpoint (`/customers/me`), and route protection middleware. |
| **Lab 3** | **Product Catalog & Management** | Product model with categories and stock tracking, catalog query engine with regex-based search, case-insensitive category filtering, multi-order sorting, single product detail pages, and automated database seeding (`seed.js`). |
| **Lab 4** | **Wishlist Functionality** | Customer-associated wishlist referencing Product IDs, endpoints to add, remove, and toggle items, populated product queries, and real-time Navbar count synchronization. |
| **Lab 5** | **Shopping Cart & State Management** | Embedded cart system with inventory threshold checks, quantity updates, removal, subtotal computation, global `CartContext` state management in React, and cart badge indicator. |
| **Lab 6** | **Checkout, Orders & Razorpay Payment Gateway** | Order model, shipping address validation, server-side Razorpay order generation (`orders.create`), client-side Razorpay Checkout modal, server-side HMAC SHA-256 signature verification, stock decrement upon payment, cart clearing, and order tracking. |

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios (with cookie credentials enabled)
- **Payment SDK**: Razorpay Checkout.js

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js 5
- **Database**: MongoDB Atlas with Mongoose ORM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcrypt`
- **Payment Gateway**: Official `razorpay` Node SDK & native `crypto` HMAC verification

---

## 📁 Project Architecture & Directory Structure

```text
MERN/
├── backend/
│   ├── config/
│   │   └── razorpay.js            # Razorpay instance configuration
│   ├── controllers/
│   │   ├── cart.controller.js     # Cart operations & stock checking
│   │   ├── customer.controller.js # Auth (register, login, profile, logout)
│   │   ├── order.controller.js    # Razorpay order creation & HMAC verification
│   │   ├── product.controller.js  # Product listing, search & sorting
│   │   └── wishlist.controller.js # Wishlist management & toggling
│   ├── middlewares/
│   │   └── auth.middleware.js     # JWT verification middleware
│   ├── models/
│   │   ├── customer.model.js      # Customer schema with embedded cart & wishlist
│   │   ├── order.model.js         # Order schema with payment tracking
│   │   └── product.model.js       # Product schema with inventory stock
│   ├── routes/
│   │   ├── cart.routes.js         # /cart routes
│   │   ├── customer.routes.js     # /customers routes
│   │   ├── order.routes.js        # /orders routes
│   │   ├── product.routes.js      # /products routes
│   │   └── wishlist.routes.js     # /wishlist routes
│   ├── utils/
│   │   └── generateToken.js       # JWT cookie generation utility
│   ├── .env.example               # Template environment variables
│   ├── index.js                   # Main Express application entry point
│   ├── package.json
│   └── seed.js                    # Database seeder script
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CartItem.jsx       # Cart item with quantity adjustment
│   │   │   ├── Navbar.jsx         # Navigation bar with live badges
│   │   │   ├── ProductCard.jsx    # Card with wishlist toggle & Add to Cart
│   │   │   ├── SearchBar.jsx      # Search input with debounce
│   │   │   └── WishlistCard.jsx   # Wishlist item component
│   │   ├── context/
│   │   │   └── CartContext.jsx    # Global cart state provider
│   │   ├── pages/
│   │   │   ├── Cart.jsx           # Shopping cart view
│   │   │   ├── Checkout.jsx       # Shipping form & Razorpay popup portal
│   │   │   ├── Home.jsx           # Customer dashboard
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── OrderDetails.jsx   # Verified receipt & payment summary
│   │   │   ├── Orders.jsx         # Order history page
│   │   │   ├── ProductDetails.jsx # Detailed single product page
│   │   │   ├── Products.jsx       # Main catalog with filter/sort
│   │   │   ├── Register.jsx       # Customer registration page
│   │   │   └── Wishlist.jsx       # Saved items page
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   ├── utils/
│   │   │   └── formatCurrency.js  # INR (₹) formatting helper
│   │   ├── App.jsx                # Application routes & auth provider
│   │   ├── index.css              # Global styles & Tailwind directives
│   │   └── main.jsx               # React DOM entry
│   ├── index.html                 # HTML root with Razorpay checkout.js script
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore                     # Git ignore protecting .env and dependencies
└── README.md                      # Project documentation
```

---

## 🚀 Getting Started & Local Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- [Razorpay Test Account](https://dashboard.razorpay.com/) for API keys

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd MERN
```

### 2. Backend Setup
1. Navigate into the backend directory:
   ```bash
   cd backend
   npm install
   ```

2. Create your `.env` configuration file from the template:
   ```bash
   cp .env.example .env
   ```

3. Fill in your environment variables in `backend/.env`:
   ```env
   # MongoDB Connection String
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shopcart?retryWrites=true&w=majority

   # JWT Secret Key
   JWT_SECRET=your_jwt_secret_key_here

   # Server Port
   PORT=3000

   # Node Environment
   NODE_ENV=development

   # Razorpay Test Credentials (from Razorpay Dashboard -> Settings -> API Keys)
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```

4. Populate the product catalog with sample items:
   ```bash
   node seed.js
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   # Server runs at http://localhost:3000
   ```

### 3. Frontend Setup
1. Open a new terminal window and navigate into the frontend directory:
   ```bash
   cd frontend
   npm install
   ```

2. Start the Vite development server:
   ```bash
   npm run dev
   # App runs at http://localhost:5173
   ```

3. Open **`http://localhost:5173`** in your browser.

---

## 💳 Razorpay Payment Gateway Testing Guide

ShopKart is configured with Razorpay Test Mode. You can test complete payment flows without real money:

1. Register or Log in to your ShopKart account.
2. Browse products, add items to your cart, and navigate to **Checkout**.
3. Fill in the shipping details (Name, 10-digit Phone, Address, City, State, 6-digit Pincode).
4. Click **Pay & Place Order** to trigger the Razorpay modal.
5. Use any of the following official Razorpay test methods:

| Method | Test Credentials | Expected Outcome |
| :--- | :--- | :--- |
| **UPI** | Virtual Payment Address: `success@razorpay` | Instant Successful Payment |
| **Card** | Card Number: `4111 1111 1111 1111`<br>Expiry: Any future date (e.g. `12/28`)<br>CVV: `123`<br>OTP: `123456` | Verified Card Payment |
| **Netbanking** | Choose any bank (e.g. SBI, HDFC, ICICI) & select **Success** | Verified Netbanking Payment |

Upon completion, you will be redirected to the **Order Details** screen with a verified payment receipt and Razorpay Payment ID.

---

## 📡 API Reference

### Customer Authentication (`/customers`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/customers/register` | Register a new customer | No |
| `POST` | `/customers/login` | Login & receive `httpOnly` JWT cookie | No |
| `GET` | `/customers/me` | Fetch authenticated customer profile | Yes |
| `POST` | `/customers/logout` | Clear auth cookie | Yes |

### Product Catalog (`/products`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/products` | Get products with `search`, `category`, and `sort` | No |
| `GET` | `/products/:id` | Get single product by ID | No |
| `POST` | `/products` | Create new product | Yes |

### Wishlist (`/wishlist`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/wishlist` | Get user's populated wishlist | Yes |
| `POST` | `/wishlist/:productId` | Add product to wishlist | Yes |
| `DELETE`| `/wishlist/:productId` | Remove product from wishlist | Yes |
| `PATCH` | `/wishlist/:productId/toggle` | Toggle item in/out of wishlist | Yes |

### Shopping Cart (`/cart`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/cart` | Get populated shopping cart | Yes |
| `POST` | `/cart/:productId` | Add product to cart (stock-checked) | Yes |
| `PATCH` | `/cart/:productId` | Update item quantity in cart | Yes |
| `DELETE`| `/cart/:productId` | Remove item from cart | Yes |

### Orders & Payments (`/orders`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/orders/create-payment-order` | Validate cart & generate Razorpay order ID | Yes |
| `POST` | `/orders/verify-payment` | Verify HMAC SHA-256 signature & finalize order | Yes |
| `GET` | `/orders` | Get user's order history | Yes |
| `GET` | `/orders/:id` | Get single order receipt | Yes |
| `PATCH` | `/orders/:id/status` | Update order tracking status | Yes |

---

## 🔒 Security Features

1. **HMAC SHA-256 Verification**: Razorpay payment signatures are validated server-side using Node's native `crypto` library. Forged or altered signatures are rejected with `400 Bad Request`.
2. **HttpOnly Cookie Authentication**: JWT tokens are transmitted via `httpOnly` and `sameSite` cookies, protecting against Cross-Site Scripting (XSS).
3. **Server-Side Price & Stock Verification**: Order totals are calculated on the server using fresh database records, preventing client-side price tampering.
4. **Git Security & Secret Isolation**: All sensitive credentials, `.env` files, and local certificates are strictly excluded via `.gitignore`. A safe `.env.example` is provided for configuration.
