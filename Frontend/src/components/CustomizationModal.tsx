import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '../contexts/CartContext';
import { Mattress, calculatePrice } from '../lib/mockData';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface CustomizationModalProps {
  mattress: Mattress;
  open: boolean;
  onClose: () => void;
}

export function CustomizationModal({ mattress, open, onClose }: CustomizationModalProps) {
  const [selectedSize, setSelectedSize] = useState(mattress.sizeOptions[0]);
  const [selectedFirmness, setSelectedFirmness] = useState(mattress.firmnessOptions[0]);
  const [selectedHeight, setSelectedHeight] = useState(mattress.heightOptions[0]);
  const [calculatedPrice, setCalculatedPrice] = useState(mattress.price);
  const { addToCart } = useCart();

  useEffect(() => {
    const price = calculatePrice(mattress.price, { size: selectedSize, height: selectedHeight });
    setCalculatedPrice(price);
  }, [selectedSize, selectedHeight, mattress.price]);

  const handleAddToCart = () => {
    addToCart(mattress, {
      size: selectedSize,
      firmness: selectedFirmness,
      height: selectedHeight,
    });
    toast.success('Custom mattress added to cart!');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl sm:max-w-lg md:max-w-2xl px-4 sm:px-6">
        <DialogHeader>
          <DialogTitle className="text-center sm:text-left">Customize Your Mattress</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Product Info with Preview */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <img
                src={mattress.image}
                alt={mattress.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
              <div>
                <h3 className="mb-1">{mattress.name}</h3>
                <p className="text-sm text-muted-foreground">{mattress.category}</p>
              </div>
            </div>
            
            {/* Mattress Preview */}
            <div className="mt-2 rounded-lg border p-4">
              <h4 className="mb-3 text-sm font-medium">Mattress Preview</h4>
              <div className="relative mx-auto h-40 w-full max-w-md rounded-lg bg-gray-100">
                <div 
                  className="absolute inset-0 rounded-lg border-2 border-[#1E3A8A]"
                  style={{
                    width: selectedSize === 'King' ? '100%' : 
                           selectedSize === 'Queen' ? '85%' : 
                           selectedSize === 'Full' ? '70%' : '60%',
                    height: selectedHeight === '12"' ? '100%' :
                            selectedHeight === '10"' ? '85%' : '70%',
                    margin: 'auto',
                    top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: selectedFirmness === 'Firm' ? '#E0E7FF' :
                                    selectedFirmness === 'Medium' ? '#EEF2FF' : '#F5F3FF',
                  }}
                />
                <div className="absolute bottom-2 right-2 rounded bg-white px-2 py-1 text-xs">
                  {selectedSize} • {selectedFirmness} • {selectedHeight}
                </div>
              </div>
            </div>
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

          {/* Price Summary */}
          <div className="rounded-lg bg-[#F9FAFB] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-[#1E3A8A]">₹{calculatedPrice.toLocaleString()}</p>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>Size: {selectedSize}</p>
                <p>Firmness: {selectedFirmness}</p>
                <p>Height: {selectedHeight}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
