import { Bed, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t bg-[#1E3A8A] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Section */}
          <div>
            <Link to="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white">
                <Bed className="h-6 w-6 text-[#1E3A8A]" />
              </div>
              <span className="text-white">CustomMattres</span>
            </Link>
            <p className="mb-4 text-sm text-white/80">
              Experience the perfect sleep with our premium mattresses. Designed for comfort, engineered for support.
            </p>
            <div className="flex gap-3">
              <a href="#" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/products" className="transition-colors hover:text-white">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="transition-colors hover:text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition-colors hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link to="/shipping" className="transition-colors hover:text-white">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="transition-colors hover:text-white">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link to="/warranty" className="transition-colors hover:text-white">
                  Warranty Information
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="transition-colors hover:text-white">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>123 Sleep Street, Mattress Plaza, Bangalore - 560001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>support@CustomMattres.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <p className="text-sm text-white/60">Open 24/7 for support</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/60">
          <p>&copy; 2025 CustomMattres. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
