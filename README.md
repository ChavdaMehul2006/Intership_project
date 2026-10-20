# AuraShop - Full-Stack MERN E-Commerce Website

A premium, design-forward full-stack e-commerce web application featuring a glassmorphism theme,
fully responsive design, secure JWT authentication, cart, wishlist, orders, checkout, search/filters,
and a complete administrator control panel. Inspired by and rebuilt from scratch based on the
`EcommersInternship` project.

---

## Technology Stack

- **Frontend**: React.js, Vite, React Router, Axios, Tailwind CSS, Lucide Icons, Recharts, Canvas-Confetti.
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Multer, Morgan, CORS.
- **Database**: MongoDB & Mongoose.

---

## Project Structure

```
aurashop/
  client/                 # Vite React application
    src/
      components/         # Navbar, Footer, ProductCard, route guards, AdminLayout
      context/             # Auth, Cart, Wishlist, Toast context providers
      pages/               # Customer-facing screens
        admin/             # Admin dashboard, products, orders, categories, users
      services/api.js      # Axios instance with auth interceptor
      App.jsx               # Main router
      index.css             # Tailwind + glassmorphism utility classes
  server/                 # Express REST API
    config/db.js           # MongoDB connection
    models/                 # User, Product, Category, Order, Review (Mongoose schemas)
    controllers/            # Business logic per resource
    middleware/              # auth (JWT), upload (Multer), errorHandler
    routes/                   # Express routers per resource
    data/seed.js              # Seeds categories, ~40 products, 2 users, sample order/review
    uploads/                   # Local image upload destination (served statically)
  README.md
```

---

## Features

- JWT authentication (register/login), password hashing with bcrypt
- Product catalog with categories, search, price filters, sorting, pagination
- Product detail page with image gallery, ratings, and customer reviews
- Cart (persisted in localStorage) and Wishlist (persisted per-user in MongoDB)
- Full checkout flow: shipping address, payment method, order summary, confetti on success
- Order history and order detail pages for customers
- Profile page: update name, change password
- Admin dashboard: revenue chart, product/order/user counts
- Admin CRUD: Products (with image upload support), Categories, Order status updates, User role/activation management
- Responsive glassmorphism UI throughout

---

## Setup & Running Instructions

### Prerequisites

You need **Node.js** (v18+) and **MongoDB** installed and running locally, or an Atlas connection URI.

### Step 1: Server Setup

```bash
cd server
npm install
```

Edit `.env` if needed (defaults shown below already work with a local MongoDB):

```
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ecommers
JWT_SECRET=supersecretjwtkey12345_ecommerce_application
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

Seed the database (creates categories, ~40 products, and two test accounts):

```bash
npm run seed
```

Start the API server:

```bash
npm run dev
```

The server runs on `http://localhost:5000`.

### Step 2: Client Setup

```bash
cd client
npm install
npm run dev
```

The React app starts on `http://localhost:3000` and proxies `/api` and `/uploads` requests to port `5000`.

---

## Default Seeded Accounts

### Administrator
- **Email**: `admin@example.com`
- **Password**: `admin123_secure_password`
- **Access**: Full dashboard — manage products, categories, orders, users.

### Standard Customer
- **Email**: `user@example.com`
- **Password**: `user123_secure_password`
- **Access**: Edit profile, place orders, write reviews, view order history.

---

## Notes

- This project has been verified to build cleanly (`npm run build` in `client/`) and all backend
  modules load without errors. Running the app locally still requires a MongoDB instance (local or Atlas).
- Product images use high-quality, authentic photos curated in `server/data/productImages.js` matching each product name and category, with support for custom photo uploads via Multer in the admin dashboard.

---

## Deployment Guide

### Option A: Render (Full-Stack Monorepo - Recommended)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New > Blueprint**.
3. Connect your GitHub repository `Intership_project`. Render will read `render.yaml` automatically.
4. Set the `MONGODB_URI` environment variable with your MongoDB Atlas connection string.
5. Click **Apply**. The frontend and backend will build and deploy on a single live URL.

### Option B: Vercel (Frontend) + Render (Backend)
1. **Backend on Render**:
   - Create a Web Service pointing to repository root or `server/`.
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Set Environment Variables: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`.
2. **Frontend on Vercel**:
   - Import your repository on [Vercel](https://vercel.com).
   - Set **Root Directory**: `client`
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Set Environment Variable: `VITE_API_URL` to your backend URL (e.g. `https://aurashop-api.onrender.com/api`).
   - Click **Deploy**.
