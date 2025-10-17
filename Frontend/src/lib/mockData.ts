// Mock data for the mattress e-commerce application

export interface Mattress {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'Orthopedic' | 'Memory Foam' | 'Latex' | 'Dual Comfort' | 'Baby Mattress';
  sizeOptions: string[];
  firmnessOptions: string[];
  heightOptions: string[];
  image: string;
  rating: number;
  reviews: number;
  popular?: boolean;
  featured?: boolean;
}

export interface CartItem {
  mattress: Mattress;
  quantity: number;
  selectedOptions: {
    size: string;
    firmness: string;
    height: string;
  };
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  shippingAddress: Address;
  paymentMethod: string;
}

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  addresses: Address[];
}

export const mockMattresses: Mattress[] = [
  {
    id: '1',
    name: 'Orthopedic Memory Foam Mattress',
    description: 'Experience ultimate comfort with our premium orthopedic memory foam mattress. Designed to provide optimal spinal support and pressure relief for a restful sleep.',
    price: 8999,
    originalPrice: 12999,
    category: 'Orthopedic',
    sizeOptions: ['Single', 'Queen', 'King', 'Custom'],
    firmnessOptions: ['Soft', 'Medium', 'Hard'],
    heightOptions: ['6 inch', '8 inch', '10 inch'],
    image: 'https://images.unsplash.com/photo-1648634158203-199accfd7afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtYXR0cmVzcyUyMGJlZHJvb218ZW58MXx8fHwxNzYwNTI1MzYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviews: 342,
    popular: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Dual Comfort Hybrid Mattress',
    description: 'Revolutionary dual-sided mattress offering both soft and firm comfort. Flip it based on your preference for the perfect sleep experience.',
    price: 10999,
    originalPrice: 14999,
    category: 'Dual Comfort',
    sizeOptions: ['Single', 'Queen', 'King'],
    firmnessOptions: ['Dual (Soft/Hard)'],
    heightOptions: ['8 inch', '10 inch'],
    image: 'https://images.unsplash.com/photo-1668089677938-b52086753f77?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzYwNTI4NDc0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.8,
    reviews: 289,
    featured: true,
  },
  {
    id: '3',
    name: 'Premium Latex Mattress',
    description: 'Natural latex mattress for superior breathability and bounce. Hypoallergenic and eco-friendly for a healthy sleep environment.',
    price: 13999,
    originalPrice: 18999,
    category: 'Latex',
    sizeOptions: ['Single', 'Queen', 'King'],
    firmnessOptions: ['Medium', 'Hard'],
    heightOptions: ['6 inch', '8 inch'],
    image: 'https://images.unsplash.com/photo-1759176170879-6bd7073ab4f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW1vcnklMjBmb2FtJTIwbWF0dHJlc3N8ZW58MXx8fHwxNzYwNTI4ODM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.6,
    reviews: 178,
    popular: true,
  },
  {
    id: '4',
    name: 'Cloud Memory Foam Mattress',
    description: 'Sink into cloud-like comfort with our advanced memory foam technology. Temperature-regulating gel infusion keeps you cool all night.',
    price: 7999,
    originalPrice: 11999,
    category: 'Memory Foam',
    sizeOptions: ['Single', 'Queen', 'King', 'Custom'],
    firmnessOptions: ['Soft', 'Medium'],
    heightOptions: ['6 inch', '8 inch', '10 inch'],
    image: 'https://images.unsplash.com/photo-1759176170553-7c078c66c514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcnRob3BlZGljJTIwbWF0dHJlc3MlMjBjb21mb3J0fGVufDF8fHx8MTc2MDU5Nzg2NXww&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.5,
    reviews: 421,
    popular: true,
  },
  {
    id: '5',
    name: 'Baby Comfort Mattress',
    description: 'Specially designed for infants and toddlers with hypoallergenic materials. Firm support for healthy spine development.',
    price: 4999,
    originalPrice: 6999,
    category: 'Baby Mattress',
    sizeOptions: ['Crib', 'Toddler'],
    firmnessOptions: ['Firm'],
    heightOptions: ['4 inch', '5 inch'],
    image: 'https://images.unsplash.com/photo-1645636989368-cd96850e97f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGVlcGluZyUyMGNvbWZvcnQlMjBiZWR8ZW58MXx8fHwxNzYwNTk3ODY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.9,
    reviews: 156,
    featured: true,
  },
  {
    id: '6',
    name: 'Spinal Care Orthopedic Plus',
    description: 'Advanced orthopedic design with zoned support technology. Perfect for those with back pain or requiring extra spinal support.',
    price: 9999,
    originalPrice: 13999,
    category: 'Orthopedic',
    sizeOptions: ['Single', 'Queen', 'King'],
    firmnessOptions: ['Medium', 'Hard'],
    heightOptions: ['8 inch', '10 inch'],
    image: 'https://images.unsplash.com/photo-1648634158203-199accfd7afc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtYXR0cmVzcyUyMGJlZHJvb218ZW58MXx8fHwxNzYwNTI1MzYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    rating: 4.7,
    reviews: 267,
  },
];

export const mockUser: User = {
  id: 'user1',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+91 9876543210',
  role: 'user',
  addresses: [
    {
      id: 'addr1',
      label: 'Home',
      street: '123, MG Road, Apartment 4B',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 9876543210',
    },
    {
      id: 'addr2',
      label: 'Office',
      street: '456, Tech Park, Tower A',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560037',
      phone: '+91 9876543210',
    },
  ],
};

export const mockOrders: Order[] = [
  {
    id: 'ORD001',
    userId: 'user1',
    items: [
      {
        mattress: mockMattresses[0],
        quantity: 1,
        selectedOptions: {
          size: 'Queen',
          firmness: 'Medium',
          height: '8 inch',
        },
      },
    ],
    totalAmount: 8999,
    status: 'Delivered',
    createdAt: '2025-10-01T10:30:00Z',
    shippingAddress: mockUser.addresses[0],
    paymentMethod: 'UPI',
  },
  {
    id: 'ORD002',
    userId: 'user1',
    items: [
      {
        mattress: mockMattresses[4],
        quantity: 1,
        selectedOptions: {
          size: 'Crib',
          firmness: 'Firm',
          height: '4 inch',
        },
      },
    ],
    totalAmount: 4999,
    status: 'Shipped',
    createdAt: '2025-10-10T14:20:00Z',
    shippingAddress: mockUser.addresses[0],
    paymentMethod: 'COD',
  },
  {
    id: 'ORD003',
    userId: 'user1',
    items: [
      {
        mattress: mockMattresses[1],
        quantity: 1,
        selectedOptions: {
          size: 'King',
          firmness: 'Dual (Soft/Hard)',
          height: '10 inch',
        },
      },
    ],
    totalAmount: 10999,
    status: 'Pending',
    createdAt: '2025-10-15T09:15:00Z',
    shippingAddress: mockUser.addresses[1],
    paymentMethod: 'Debit Card',
  },
];

// Helper function to calculate price based on options
export function calculatePrice(basePrice: number, options: { size: string; height: string }): number {
  let price = basePrice;
  
  // Size multiplier
  if (options.size === 'Queen') price *= 1.3;
  else if (options.size === 'King') price *= 1.5;
  else if (options.size === 'Custom') price *= 1.4;
  
  // Height multiplier
  if (options.height === '8 inch') price *= 1.1;
  else if (options.height === '10 inch') price *= 1.2;
  
  return Math.round(price);
}
