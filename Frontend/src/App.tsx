import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ProductManagement } from './pages/admin/ProductManagement';
import { OrderManagement } from './pages/admin/OrderManagement';
import { Toaster } from './components/ui/sonner';
import CustomizeMattressPage from './pages/CustomizeMattressPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected User Routes */}
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />

                {/* Mattress Customizer Route */}
                <Route path="/customize-mattress" element={<CustomizeMattressPage />} />

                {/* Placeholder Routes */}
                <Route path="/categories" element={<ProductsPage />} />
                <Route path="/about" element={<PlaceholderPage title="About Us" />} />
                <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
                <Route path="/faq" element={<PlaceholderPage title="FAQ" />} />
                <Route path="/shipping" element={<PlaceholderPage title="Shipping Policy" />} />
                <Route path="/returns" element={<PlaceholderPage title="Returns & Exchanges" />} />
                <Route path="/warranty" element={<PlaceholderPage title="Warranty Information" />} />
                <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
                <Route path="/terms" element={<PlaceholderPage title="Terms & Conditions" />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="mb-4">{title}</h1>
      <p className="text-muted-foreground">This page is under construction.</p>
    </div>
  );
}
