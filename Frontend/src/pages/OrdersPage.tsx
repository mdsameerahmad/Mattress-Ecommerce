import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { mockOrders } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/orders');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Confirmed':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'Shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'Delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8">My Orders</h1>

        {mockOrders.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <Package className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2">No orders yet</h3>
              <p className="mb-6 text-muted-foreground">Start shopping to see your orders here</p>
              <Button onClick={() => navigate('/products')} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="mb-1">Order #{order.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Items */}
                  <div className="space-y-4 border-b pb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border">
                          <ImageWithFallback
                            src={item.mattress.image}
                            alt={item.mattress.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className="mb-1 cursor-pointer hover:text-[#1E3A8A]"
                            onClick={() => navigate(`/product/${item.mattress.id}`)}
                          >
                            {item.mattress.name}
                          </h4>
                          <p className="mb-1 text-sm text-muted-foreground">
                            {item.selectedOptions.size} • {item.selectedOptions.firmness} •{' '}
                            {item.selectedOptions.height}
                          </p>
                          <p className="text-sm">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#1E3A8A]">₹{item.mattress.price.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Delivery Address</p>
                      <p className="text-sm">{order.shippingAddress.street}</p>
                      <p className="text-sm">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      <p className="text-sm">{order.shippingAddress.pincode}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Payment Method</p>
                      <p className="text-sm">{order.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-[#1E3A8A]">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      Track Order
                    </Button>
                    {order.status === 'Delivered' && (
                      <Button variant="outline" size="sm">
                        Download Invoice
                      </Button>
                    )}
                    {order.status === 'Pending' && (
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                        Cancel Order
                      </Button>
                    )}
                  </div>

                  {/* Order Timeline */}
                  {order.status !== 'Cancelled' && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              ['Pending', 'Confirmed', 'Shipped', 'Delivered'].includes(order.status)
                                ? 'bg-[#1E3A8A]'
                                : 'bg-gray-300'
                            }`}
                          >
                            <CheckCircle className="h-5 w-5 text-white" />
                          </div>
                          <p className="text-xs">Confirmed</p>
                        </div>
                        <div className={`flex-1 border-t-2 ${
                          ['Shipped', 'Delivered'].includes(order.status)
                            ? 'border-[#1E3A8A]'
                            : 'border-gray-300'
                        }`} />
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              ['Shipped', 'Delivered'].includes(order.status)
                                ? 'bg-[#1E3A8A]'
                                : 'bg-gray-300'
                            }`}
                          >
                            <Truck className="h-5 w-5 text-white" />
                          </div>
                          <p className="text-xs">Shipped</p>
                        </div>
                        <div className={`flex-1 border-t-2 ${
                          order.status === 'Delivered'
                            ? 'border-[#1E3A8A]'
                            : 'border-gray-300'
                        }`} />
                        <div className="flex flex-col items-center gap-1">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              order.status === 'Delivered'
                                ? 'bg-[#1E3A8A]'
                                : 'bg-gray-300'
                            }`}
                          >
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <p className="text-xs">Delivered</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
