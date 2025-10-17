import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockMattresses } from '../lib/mockData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, Award } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner@2.0.3';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { calculatePrice } from '../lib/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mattress = mockMattresses.find((m) => m.id === id);
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(mattress?.sizeOptions[0] || '');
  const [selectedFirmness, setSelectedFirmness] = useState(mattress?.firmnessOptions[0] || '');
  const [selectedHeight, setSelectedHeight] = useState(mattress?.heightOptions[0] || '');

  if (!mattress) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="mb-4">Product not found</h2>
        <Button onClick={() => navigate('/products')}>Back to Products</Button>
      </div>
    );
  }

  const finalPrice = calculatePrice(mattress.price, { size: selectedSize, height: selectedHeight });

  const handleAddToCart = () => {
    addToCart(mattress, {
      size: selectedSize,
      firmness: selectedFirmness,
      height: selectedHeight,
    });
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const discount = mattress.originalPrice
    ? Math.round(((mattress.originalPrice - mattress.price) / mattress.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <button onClick={() => navigate('/')} className="hover:text-[#1E3A8A]">
            Home
          </button>
          {' / '}
          <button onClick={() => navigate('/products')} className="hover:text-[#1E3A8A]">
            Products
          </button>
          {' / '}
          <span className="text-foreground">{mattress.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border">
              <ImageWithFallback
                src={mattress.image}
                alt={mattress.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{mattress.category}</Badge>
              <h1 className="mb-2">{mattress.name}</h1>
              
              {/* Rating */}
              <div className="mb-4 flex items-center gap-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(mattress.rating)
                          ? 'fill-[#FFC107] text-[#FFC107]'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm">
                  {mattress.rating} ({mattress.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-[#1E3A8A]">₹{finalPrice.toLocaleString()}</span>
                {mattress.originalPrice && (
                  <>
                    <span className="text-muted-foreground line-through">
                      ₹{mattress.originalPrice.toLocaleString()}
                    </span>
                    <Badge className="bg-red-500 hover:bg-red-600">{discount}% OFF</Badge>
                  </>
                )}
              </div>

              <p className="text-muted-foreground">{mattress.description}</p>
            </div>

            {/* Size Selection */}
            <div className="space-y-3">
              <Label>Select Size</Label>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {mattress.sizeOptions.map((size) => (
                    <div key={size}>
                      <RadioGroupItem
                        value={size}
                        id={`size-${size}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 p-3 text-center transition-all hover:border-[#1E3A8A] peer-data-[state=checked]:border-[#1E3A8A] peer-data-[state=checked]:bg-[#1E3A8A]/5"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Firmness Selection */}
            <div className="space-y-3">
              <Label>Select Firmness</Label>
              <RadioGroup value={selectedFirmness} onValueChange={setSelectedFirmness}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {mattress.firmnessOptions.map((firmness) => (
                    <div key={firmness}>
                      <RadioGroupItem
                        value={firmness}
                        id={`firmness-${firmness}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`firmness-${firmness}`}
                        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 p-3 text-center transition-all hover:border-[#1E3A8A] peer-data-[state=checked]:border-[#1E3A8A] peer-data-[state=checked]:bg-[#1E3A8A]/5"
                      >
                        {firmness}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Height Selection */}
            <div className="space-y-3">
              <Label>Select Height</Label>
              <RadioGroup value={selectedHeight} onValueChange={setSelectedHeight}>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {mattress.heightOptions.map((height) => (
                    <div key={height}>
                      <RadioGroupItem
                        value={height}
                        id={`height-${height}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`height-${height}`}
                        className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-gray-200 p-3 text-center transition-all hover:border-[#1E3A8A] peer-data-[state=checked]:border-[#1E3A8A] peer-data-[state=checked]:bg-[#1E3A8A]/5"
                      >
                        {height}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="flex-1" onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3 rounded-lg border bg-[#F9FAFB] p-4">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-[#1E3A8A]" />
                <div>
                  <p className="text-sm">Free Delivery</p>
                  <p className="text-xs text-muted-foreground">On orders above ₹5,000</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-[#1E3A8A]" />
                <div>
                  <p className="text-sm">10 Year Warranty</p>
                  <p className="text-xs text-muted-foreground">Comprehensive coverage</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-[#1E3A8A]" />
                <div>
                  <p className="text-sm">100 Night Trial</p>
                  <p className="text-xs text-muted-foreground">Risk-free returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4">Product Description</h3>
                <p className="mb-4 text-muted-foreground">{mattress.description}</p>
                <p className="text-muted-foreground">
                  Experience unparalleled comfort with our premium mattress collection. Each mattress is
                  crafted with precision and care to ensure you get the best sleep possible. Our innovative
                  design provides optimal support for your spine while maintaining a soft, comfortable
                  surface.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p>{mattress.category}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Available Sizes</p>
                    <p>{mattress.sizeOptions.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Firmness Options</p>
                    <p>{mattress.firmnessOptions.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Height Options</p>
                    <p>{mattress.heightOptions.join(', ')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Warranty</p>
                    <p>10 Years</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Trial Period</p>
                    <p>100 Nights</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-4">Customer Reviews</h3>
                <p className="text-muted-foreground">
                  Reviews coming soon. Be the first to review this product!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
