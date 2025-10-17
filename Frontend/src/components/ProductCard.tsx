import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { Mattress } from '../lib/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  mattress: Mattress;
}

export function ProductCard({ mattress }: ProductCardProps) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleQuickAdd = () => {
    // Quick add with default options
    addToCart(mattress, {
      size: mattress.sizeOptions[0],
      firmness: mattress.firmnessOptions[0],
      height: mattress.heightOptions[0],
    });
    toast.success(`${mattress.name} added to cart!`);
  };

  const discount = mattress.originalPrice
    ? Math.round(((mattress.originalPrice - mattress.price) / mattress.originalPrice) * 100)
    : 0;

  return (
    <>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative overflow-hidden">
          <div className="aspect-[4/3] overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={mattress.image}
              alt={mattress.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          
          {mattress.popular && (
            <Badge className="absolute left-2 top-2 bg-[#FFC107] text-black hover:bg-[#FFC107]/90">
              Popular
            </Badge>
          )}
          
          {discount > 0 && (
            <Badge className="absolute right-2 top-2 bg-red-500 hover:bg-red-600">
              {discount}% OFF
            </Badge>
          )}

          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => navigate(`/product/${mattress.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              Quick View
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <Badge variant="outline" className="mb-2">
            {mattress.category}
          </Badge>
          <h3
            className="mb-2 line-clamp-2 cursor-pointer transition-colors hover:text-[#1E3A8A]"
            onClick={() => navigate(`/product/${mattress.id}`)}
          >
            {mattress.name}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {mattress.description}
          </p>

          <div className="mb-3 flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(mattress.rating)
                      ? 'fill-[#FFC107] text-[#FFC107]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {mattress.rating} ({mattress.reviews})
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-[#1E3A8A]">₹{mattress.price.toLocaleString()}</span>
            {mattress.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{mattress.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button
            className="flex-1 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            onClick={handleQuickAdd}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/product/${mattress.id}`)}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
