# CustomMattres Mattress E-Commerce - Demo Guide

Welcome to the CustomMattres Mattress E-Commerce application! This is a complete full-stack e-commerce web application built with React, featuring both User and Admin panels.

## 🎨 Design Theme

- **Primary Color**: #1E3A8A (Navy Blue)
- **Accent Color**: #FFC107 (Golden Yellow)
- **Background**: #F9FAFB (Light Gray)
- **Text**: #1C1C1C (Dark Gray)

## 🔑 Demo Credentials

### User Account
- **Email**: Any email (e.g., user@example.com)
- **Password**: Any password
- Mock authentication accepts any credentials

### Admin Account
- **Email**: admin@CustomMattres.com
- **Password**: Any password
- This email specifically grants admin access

## 🎯 How to Access Admin Panel

### Method 1: Homepage Button (Easiest!)
1. On the homepage, scroll down to find the **golden "Admin Panel Access"** section
2. Click **"Login as Admin"** button
3. You'll be redirected to login with admin credentials pre-filled
4. After login, you'll land directly on the admin dashboard

### Method 2: Header Button
1. Login with admin credentials (`admin@CustomMattres.com`)
2. Look for the **golden "Admin Panel"** button in the header
3. Click it to access the admin dashboard

### Method 3: Login Page Quick Fill
1. Go to the login page
2. Click the **"Fill Admin Credentials"** button in the golden box
3. Admin email will auto-fill (any password works)
4. Login and navigate to `/admin`

### Method 4: Direct URL
- Navigate to `/admin` after logging in as admin
- You'll be redirected to login if not authenticated

## 📱 User Panel Features

### Public Access (No Login Required)
- Browse all mattresses
- View product details
- Customize mattress options (size, firmness, height)
- Add items to cart
- View cart

### Authenticated Features (Login Required)
- Checkout and place orders
- Order tracking with status updates
- View order history
- Manage profile information
- Save delivery addresses
- Update password

## 👨‍💼 Admin Panel Features

Access the admin panel at `/admin` after logging in with admin credentials:

### Dashboard
- Total orders, revenue, and product statistics
- Sales trend charts (monthly)
- Category performance analytics
- Recent orders overview

### Product Management (`/admin/products`)
- View all products in a table
- Add new mattress products
- Edit existing products
- Delete products
- Search and filter products

### Order Management (`/admin/orders`)
- View all customer orders
- Filter orders by status
- Update order status (Pending → Confirmed → Shipped → Delivered)
- View detailed order information
- Search orders by ID

## 🛍️ Shopping Flow

1. **Browse Products**: Start from homepage or products page
2. **Customize Mattress**: Select size, firmness, and height
3. **Add to Cart**: Products can be added without login
4. **Login/Signup**: Required before checkout
5. **Checkout**: Select address and payment method
6. **Track Order**: View order status and timeline

## 🎯 Key Features

### Product Features
- 6 different mattress categories
- Customizable options (size, firmness, height)
- Dynamic pricing based on selections
- Product ratings and reviews
- Popular and featured product sections

### Shopping Features
- Guest cart (no login required)
- Real-time price calculation
- Free delivery on orders above ₹5,000
- Multiple payment methods (COD, Card, UPI)
- Order status tracking

### Admin Features
- Sales analytics with charts
- Product CRUD operations
- Order status management
- Revenue tracking
- Category performance insights

## 📄 Available Pages

### Public Pages
- `/` - Homepage with hero carousel
- `/products` - All products with filters
- `/product/:id` - Product detail page
- `/cart` - Shopping cart
- `/login` - Login page
- `/signup` - Signup page

### User Pages (Protected)
- `/checkout` - Checkout page
- `/orders` - Order history and tracking
- `/profile` - User profile management

### Admin Pages (Admin Only)
- `/admin` - Admin dashboard
- `/admin/products` - Product management
- `/admin/orders` - Order management

## 🎨 UI Components

The application uses:
- **ShadCN UI** components for consistent design
- **Lucide Icons** for iconography
- **Recharts** for analytics charts
- **Motion/React** for smooth animations
- **React Router** for navigation
- **Context API** for state management

## 📊 Mock Data

The application includes comprehensive mock data:
- 6 mattress products with complete details
- 3 sample orders with different statuses
- User profile with saved addresses
- Sales analytics data
- Category performance metrics

## 🚀 Features Not Implemented (As Requested)

The following were intentionally skipped as requested:
- Real database connectivity
- Backend API integration
- JWT authentication logic
- Payment gateway integration
- File upload functionality

These use mock implementations and can be replaced with real backend services.

## 💡 Usage Tips

1. **Guest Shopping**: You can browse and add items to cart without logging in
2. **Quick Add**: Use "Add to Cart" for default options, or "Customize" for specific selections
3. **Admin Access**: Login with admin@CustomMattres.com to access admin panel
4. **Order Tracking**: View order timeline with visual progress indicators
5. **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🎯 Next Steps for Production

To make this production-ready:
1. Connect to a real database (MongoDB/MySQL)
2. Implement JWT-based authentication
3. Set up backend API (Node.js/Spring Boot)
4. Integrate payment gateway
5. Add image upload functionality
6. Implement email notifications
7. Add product reviews and ratings system
8. Set up analytics tracking

Enjoy exploring the CustomMattres Mattress E-Commerce application! 🛏️✨
