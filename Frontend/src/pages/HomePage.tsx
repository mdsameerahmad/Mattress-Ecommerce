import { ArrowRight, Award, Package, Phone, Shield, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { HeroCarousel } from '../components/HeroCarousel';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { mockMattresses } from '../lib/mockData';

const categories = [
  { name: 'Orthopedic', icon: '🦴', count: 15 },
  { name: 'Memory Foam', icon: '☁️', count: 12 },
  { name: 'Latex', icon: '🌿', count: 8 },
  { name: 'Dual Comfort', icon: '🔄', count: 6 },
  { name: 'Baby Mattress', icon: '👶', count: 10 },
];

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const featuredProducts = mockMattresses.filter((m) => m.featured);
  const popularProducts = mockMattresses.filter((m) => m.popular);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Features Section */}
      <section className="border-b bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                <Truck className="h-6 w-6 text-[#1E3A8A]" />
              </div>
              <div>
                <h3 className="mb-1">Free Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  On orders above ₹5,000
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                <Shield className="h-6 w-6 text-[#1E3A8A]" />
              </div>
              <div>
                <h3 className="mb-1">10 Year Warranty</h3>
                <p className="text-sm text-muted-foreground">
                  Comprehensive coverage
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                <Award className="h-6 w-6 text-[#1E3A8A]" />
              </div>
              <div>
                <h3 className="mb-1">100 Night Trial</h3>
                <p className="text-sm text-muted-foreground">
                  Risk-free returns
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-[#1E3A8A]/10 p-3">
                <Phone className="h-6 w-6 text-[#1E3A8A]" />
              </div>
              <div>
                <h3 className="mb-1">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">
                  Expert assistance
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-[#F9FAFB] py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="mb-2">Shop by Category</h2>
            <p className="text-muted-foreground">Find the perfect mattress for your needs</p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => navigate('/products')}
                className="group flex flex-col items-center gap-3 rounded-xl border-2 border-gray-200 bg-white p-6 transition-all hover:border-[#1E3A8A] hover:shadow-lg"
              >
                <div className="text-4xl">{category.icon}</div>
                <div className="text-center">
                  <h3 className="mb-1 text-sm group-hover:text-[#1E3A8A]">{category.name}</h3>
                  <p className="text-xs text-muted-foreground">{category.count} Products</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2">Featured Mattresses</h2>
              <p className="text-muted-foreground">Hand-picked premium collection</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/products')}
              className="hidden md:flex"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((mattress) => (
              <ProductCard key={mattress.id} mattress={mattress} />
            ))}
          </div>
          <div className="mt-6 text-center md:hidden">
            <Button variant="outline" onClick={() => navigate('/products')}>
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="bg-[#F9FAFB] py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2">Customer Favorites</h2>
              <p className="text-muted-foreground">Most loved by our customers</p>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate('/products')}
              className="hidden md:flex"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularProducts.map((mattress) => (
              <ProductCard key={mattress.id} mattress={mattress} />
            ))}
          </div>
        </div>
      </section>


    </div>
  );
}
