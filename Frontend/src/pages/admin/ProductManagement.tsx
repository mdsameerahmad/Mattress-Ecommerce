import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { mockMattresses } from '../../lib/mockData';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export function ProductManagement() {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/admin/products');
    } else if (!isAdmin) {
      navigate('/');
    }
  }, [isAuthenticated, isAdmin, navigate]);

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  const filteredProducts = mockMattresses.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    toast.success('Product added successfully!');
    setShowAddDialog(false);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowAddDialog(true);
  };

  const handleDeleteProduct = (id: string) => {
    toast.success('Product deleted successfully!');
  };

  const handleSaveProduct = () => {
    if (editingProduct) {
      toast.success('Product updated successfully!');
    } else {
      toast.success('Product added successfully!');
    }
    setShowAddDialog(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2">Product Management</h1>
            <p className="text-muted-foreground">Manage your mattress inventory</p>
          </div>
          <Button
            className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            onClick={() => {
              setEditingProduct(null);
              setShowAddDialog(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 overflow-hidden rounded border">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="line-clamp-1">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {product.reviews} reviews
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{product.category}</Badge>
                    </TableCell>
                    <TableCell>₹{product.price.toLocaleString()}</TableCell>
                    <TableCell>{product.rating} ⭐</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add/Edit Product Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Product Name</Label>
                  <Input placeholder="Enter product name" defaultValue={editingProduct?.name} />
                </div>
                <div>
                  <Label>Category</Label>
                  <Select defaultValue={editingProduct?.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Orthopedic">Orthopedic</SelectItem>
                      <SelectItem value="Memory Foam">Memory Foam</SelectItem>
                      <SelectItem value="Latex">Latex</SelectItem>
                      <SelectItem value="Dual Comfort">Dual Comfort</SelectItem>
                      <SelectItem value="Baby Mattress">Baby Mattress</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  placeholder="Enter product description"
                  defaultValue={editingProduct?.description}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price (₹)</Label>
                  <Input type="number" placeholder="8999" defaultValue={editingProduct?.price} />
                </div>
                <div>
                  <Label>Original Price (₹)</Label>
                  <Input type="number" placeholder="12999" defaultValue={editingProduct?.originalPrice} />
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input placeholder="https://..." defaultValue={editingProduct?.image} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Size Options</Label>
                  <Input placeholder="Single, Queen, King" />
                </div>
                <div>
                  <Label>Firmness Options</Label>
                  <Input placeholder="Soft, Medium, Hard" />
                </div>
                <div>
                  <Label>Height Options</Label>
                  <Input placeholder='6", 8", 10"' />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90" onClick={handleSaveProduct}>
                {editingProduct ? 'Update' : 'Add'} Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
