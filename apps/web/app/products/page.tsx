'use client';

import { PERMISSIONS } from '@fuga-catalog/constants';
import type { Product, CreateProductInput, UpdateProductInput } from '@fuga-catalog/types';
import { Plus, Pencil, Trash2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as S from './products.styles';
import { PermissionGuard } from '@/components/permission-guard';
import { ProductForm } from '@/components/product-form';
import { Button, ButtonIcon } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  ScrollableDialogContent,
} from '@/components/ui/dialog';
import { LoadingContainer, SpinningIcon } from '@/components/ui/loading';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/use-products';

export default function ProductsPage() {
  const router = useRouter();
  const { logout } = useAuth();
  const { addToast } = useToast();
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleCreateProduct = async (data: CreateProductInput) => {
    try {
      await createProduct.mutateAsync(data);
      setIsCreateDialogOpen(false);
      addToast('Product created successfully', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to create product', 'error');
    }
  };

  const handleUpdateProduct = async (data: UpdateProductInput) => {
    if (!editingProduct) return;

    try {
      await updateProduct.mutateAsync({ id: editingProduct.id, data });
      setEditingProduct(null);
      addToast('Product updated successfully', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to update product', 'error');
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingProduct) return;

    try {
      await deleteProduct.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
      addToast('Product deleted successfully', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Failed to delete product', 'error');
    }
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <SpinningIcon size={32} />
      </LoadingContainer>
    );
  }

  return (
    <S.PageWrapper>
      <S.Header>
        <S.HeaderContent>
          <S.Title>FUGA Music Catalog</S.Title>
          <Button variant="outline" onClick={handleLogout}>
            <ButtonIcon>
              <LogOut size={16} />
              Logout
            </ButtonIcon>
          </Button>
        </S.HeaderContent>
      </S.Header>

      <S.Main>
        <S.SectionHeader>
          <S.SectionTitle>Products</S.SectionTitle>
          <PermissionGuard permission={PERMISSIONS.PRODUCT_CREATE}>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <ButtonIcon>
                <Plus size={16} />
                New Product
              </ButtonIcon>
            </Button>
          </PermissionGuard>
        </S.SectionHeader>

        {products && products.length === 0 ? (
          <Card>
            <S.EmptyState>
              <S.EmptyText>No products yet. Create your first one!</S.EmptyText>
              <PermissionGuard permission={PERMISSIONS.PRODUCT_CREATE}>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <ButtonIcon>
                    <Plus size={16} />
                    New Product
                  </ButtonIcon>
                </Button>
              </PermissionGuard>
            </S.EmptyState>
          </Card>
        ) : (
          <S.ProductGrid>
            {products?.map((product) => (
              <S.ProductCardWrapper key={product.id}>
                <S.ProductCard>
                  <CardHeader style={{ padding: 0 }}>
                    <S.CoverArtContainer>
                      {product.coverArt && <img src={product.coverArt.resourceUri} alt={product.name} />}
                      <S.ActionButtons>
                        <PermissionGuard permission={PERMISSIONS.PRODUCT_EDIT}>
                          <Button variant="secondary" size="icon" onClick={() => setEditingProduct(product)}>
                            <Pencil size={16} />
                          </Button>
                        </PermissionGuard>
                        <PermissionGuard permission={PERMISSIONS.PRODUCT_EDIT}>
                          <Button variant="secondary" size="icon" onClick={() => setDeletingProduct(product)}>
                            <Trash2 size={16} />
                          </Button>
                        </PermissionGuard>
                      </S.ActionButtons>
                    </S.CoverArtContainer>
                  </CardHeader>
                  <S.ProductInfo>
                    <CardTitle style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{product.name}</CardTitle>
                    <S.ArtistList $visibleRows={2}>
                      {product.productArtists.map((pa, index) => (
                        <S.ArtistText key={index}>
                          {pa.artist.name}
                          {pa.contributionType && ` (${pa.contributionType.name})`}
                        </S.ArtistText>
                      ))}
                    </S.ArtistList>
                  </S.ProductInfo>
                </S.ProductCard>
              </S.ProductCardWrapper>
            ))}
          </S.ProductGrid>
        )}
      </S.Main>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <ScrollableDialogContent>
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>Add a new music product to the catalog</DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleCreateProduct}
            onCancel={() => setIsCreateDialogOpen(false)}
            isLoading={createProduct.isPending}
          />
        </ScrollableDialogContent>
      </Dialog>

      <Dialog open={!!editingProduct} onOpenChange={(open) => !open && setEditingProduct(null)}>
        <ScrollableDialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product information</DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSubmit={handleUpdateProduct}
              onCancel={() => setEditingProduct(null)}
              isLoading={updateProduct.isPending}
            />
          )}
        </ScrollableDialogContent>
      </Dialog>

      <Dialog open={!!deletingProduct} onOpenChange={(open) => !open && setDeletingProduct(null)}>
        <ScrollableDialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>Are you sure you want to delete "{deletingProduct?.name}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingProduct(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct} disabled={deleteProduct.isPending}>
              {deleteProduct.isPending ? (
                <ButtonIcon>
                  <SpinningIcon size={16} />
                  Deleting...
                </ButtonIcon>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </ScrollableDialogContent>
      </Dialog>
    </S.PageWrapper>
  );
}
