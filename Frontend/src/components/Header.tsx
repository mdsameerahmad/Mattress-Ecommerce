import { Bed, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const cartCount = getCartCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1E3A8A]">
              <Bed className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-[#1E3A8A] to-[#1E3A8A]/70 bg-clip-text text-transparent">CustomMattres</span>
          </Link>

          {/* Desktop Navigation */}
          {!isAdminRoute && (
            <nav className="hidden items-center gap-6 md:flex">
              <Link to="/" className="text-sm transition-colors hover:text-[#1E3A8A]">
                Home
              </Link>
              <Link to="/products" className="text-sm transition-colors hover:text-[#1E3A8A]">
                Products
              </Link>
              <Link to="/customize-mattress" className="text-sm transition-colors hover:text-[#1E3A8A]">
                Customize Mattress
              </Link>
            </nav>
          )}

          {isAdminRoute && (
            <nav className="hidden items-center gap-6 md:flex">
              <Link to="/admin" className="text-sm transition-colors hover:text-[#1E3A8A]">
                Dashboard
              </Link>
              <Link to="/admin/products" className="text-sm transition-colors hover:text-[#1E3A8A]">
                Products
              </Link>
              <Link to="/admin/orders" className="text-sm transition-colors hover:text-[#1E3A8A]">
                Orders
              </Link>
            </nav>
          )}

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {!isAdminRoute && (
              <>
                <Button variant="ghost" size="icon" className="relative">
                  <Search className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative"
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FFC107] text-xs">
                      {cartCount}
                    </span>
                  )}
                </Button>
                
                {/* Admin Panel Button */}
                {isAuthenticated && isAdmin && (
                  <Button 
                    onClick={() => navigate('/admin')}
                    className="bg-gradient-to-r from-[#FFC107] to-[#FFD700] text-black hover:from-[#FFD700] hover:to-[#FFC107]"
                  >
                    Admin Panel
                  </Button>
                )}
              </>
            )}
            
            {/* Back to Store Button (when in admin) */}
            {isAdminRoute && (
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white"
              >
                Back to Store
              </Button>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    {isAdmin && (
                      <span className="mt-1 inline-block rounded-full bg-[#FFC107] px-2 py-0.5 text-xs text-black">
                        Admin
                      </span>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  {!isAdminRoute && (
                    <>
                      <DropdownMenuItem onClick={() => navigate('/profile')}>
                        My Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate('/orders')}>
                        My Orders
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/login')} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t py-4 md:hidden">
            {!isAdminRoute && (
              <nav className="flex flex-col gap-4">
                <Link
                  to="/"
                  className="text-sm transition-colors hover:text-[#1E3A8A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="text-sm transition-colors hover:text-[#1E3A8A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/customize-mattress"
                  className="text-sm transition-colors hover:text-[#1E3A8A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Customize Mattress
                </Link>
                <Link
                  to="/cart"
                  className="text-sm transition-colors hover:text-[#1E3A8A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Cart ({cartCount})
                </Link>
              </nav>
            )}
            {isAdminRoute && (
              <nav className="flex flex-col gap-4">
                <Link
                  to="/admin"
                  className="text-sm transition-colors hover:text-[#1E3A8A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/products"
                  className="text-sm transition-colors hover:text-[#1E3A8A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/admin/orders"
                  className="text-sm transition-colors hover:text-[#1E3A8A]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              </nav>
            )}
            <div className="mt-4 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {!isAdminRoute && (
                    <Button variant="outline" onClick={() => { navigate('/profile'); setMobileMenuOpen(false); }}>
                      Profile
                    </Button>
                  )}
                  {isAdmin && !isAdminRoute && (
                    <Button 
                      onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                      className="bg-gradient-to-r from-[#FFC107] to-[#FFD700] text-black hover:from-[#FFD700] hover:to-[#FFC107]"
                    >
                      Admin Panel
                    </Button>
                  )}
                  {isAdminRoute && (
                    <Button 
                      onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
                      variant="outline"
                    >
                      Back to Store
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
