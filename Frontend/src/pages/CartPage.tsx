import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { calculatePrice } from '../lib/mockData';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const deliveryCharge = subtotal > 5000 ? 0 : 500;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + deliveryCharge + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h2 className="mb-2">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">Add some products to get started</p>
        <Button onClick={() => navigate('/products')} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cartItems.map((item, index) => {
                    const itemPrice = calculatePrice(item.mattress.price, {
                      size: item.selectedOptions.size,
                      height: item.selectedOptions.height,
                    });

                    return (
                      <div key={index} className="p-4 sm:p-6">
                        <div className="flex gap-4">
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border">
                            <ImageWithFallback
                              src={item.mattress.image}
                              alt={item.mattress.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="flex flex-1 flex-col justify-between">
                            <div>
                              <div className="flex justify-between">
                                <div>
                                  <h3
                                    className="mb-1 cursor-pointer hover:text-[#1E3A8A]"
                                    onClick={() => navigate(`/product/${item.mattress.id}`)}
                                  >
                                    {item.mattress.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.selectedOptions.size} • {item.selectedOptions.firmness} •{' '}
                                    {item.selectedOptions.height}
                                  </p>
                                </div>
                                <p className="text-[#1E3A8A]">
                                  ₹{(itemPrice * item.quantity).toLocaleString()}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateQuantity(
                                      item.mattress.id,
                                      item.selectedOptions,
                                      item.quantity - 1
                                    )
                                  }
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    updateQuantity(
                                      item.mattress.id,
                                      item.selectedOptions,
                                      item.quantity + 1
                                    )
                                  }
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => removeFromCart(item.mattress.id, item.selectedOptions)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardContent className="p-6">
                <h3 className="mb-4">Order Summary</h3>

                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Charge</span>
                    <span>
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (5%)</span>
                    <span>₹{tax.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between py-4">
                  <span>Total</span>
                  <span className="text-[#1E3A8A]">₹{total.toLocaleString()}</span>
                </div>

                {subtotal < 5000 && (
                  <p className="mb-4 rounded-lg bg-[#FFC107]/10 p-3 text-xs text-[#1E3A8A]">
                    Add ₹{(5000 - subtotal).toLocaleString()} more to get FREE delivery!
                  </p>
                )}

                <Button
                  size="lg"
                  className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => navigate('/products')}
                >
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
