'use client';

import { PERMISSIONS } from '@fuga-catalog/constants';
import type { Product, CreateProductInput, UpdateProductInput } from '@fuga-catalog/types';
import { Plus, Pencil, Trash2, Loader2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { PermissionGuard } from '@/components/permission-guard';
import { ProductForm } from '@/components/product-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/toast';
import { useAuth } from '@/hooks/use-auth';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/use-products';

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.header`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 1280px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ProductCard = styled(Card)`
  overflow: hidden;
`;

const CoverArtContainer = styled.div`
  aspect-ratio: 1;
  position: relative;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled(CardContent)`
  padding: ${({ theme }) => theme.spacing.md};
`;

const ArtistList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ArtistText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionButtons = styled(CardFooter)`
  padding: ${({ theme }) => theme.spacing.md};
  padding-top: 0;
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const FlexButton = styled(Button)`
  flex: 1;
`;

const EmptyState = styled(CardContent)`
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LoadingContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpinningIcon = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ScrollableDialogContent = styled(DialogContent)`
  max-width: 42rem;
  max-height: 90vh;
  overflow-y: auto;
`;

const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

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
    <PageWrapper>
      <Header>
        <HeaderContent>
          <Title>FUGA Music Catalog</Title>
          <Button variant="outline" onClick={handleLogout}>
            <ButtonIcon>
              <LogOut size={16} />
              Logout
            </ButtonIcon>
          </Button>
        </HeaderContent>
      </Header>

      <Main>
        <SectionHeader>
          <SectionTitle>Products</SectionTitle>
          <PermissionGuard permission={PERMISSIONS.PRODUCT_CREATE}>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <ButtonIcon>
                <Plus size={16} />
                New Product
              </ButtonIcon>
            </Button>
          </PermissionGuard>
        </SectionHeader>

        {products && products.length === 0 ? (
          <Card>
            <EmptyState>
              <EmptyText>No products yet. Create your first one!</EmptyText>
              <PermissionGuard permission={PERMISSIONS.PRODUCT_CREATE}>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <ButtonIcon>
                    <Plus size={16} />
                    Create Product
                  </ButtonIcon>
                </Button>
              </PermissionGuard>
            </EmptyState>
          </Card>
        ) : (
          <ProductGrid>
            {products?.map((product) => (
              <ProductCard key={product.id}>
                <CardHeader style={{ padding: 0 }}>
                  <CoverArtContainer>
                    {product.coverArt && <img src={product.coverArt.resourceUri} alt={product.name} />}
                  </CoverArtContainer>
                </CardHeader>
                <ProductInfo>
                  <CardTitle style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{product.name}</CardTitle>
                  <ArtistList>
                    {product.productArtists.map((pa, index) => (
                      <ArtistText key={index}>
                        {pa.artist.name}
                        {pa.contributionType && ` (${pa.contributionType.name})`}
                      </ArtistText>
                    ))}
                  </ArtistList>
                </ProductInfo>
                <ActionButtons>
                  <PermissionGuard permission={PERMISSIONS.PRODUCT_EDIT}>
                    <FlexButton variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                      <ButtonIcon>
                        <Pencil size={16} />
                        Edit
                      </ButtonIcon>
                    </FlexButton>
                  </PermissionGuard>
                  <PermissionGuard permission={PERMISSIONS.PRODUCT_EDIT}>
                    <FlexButton variant="outline" size="sm" onClick={() => setDeletingProduct(product)}>
                      <ButtonIcon>
                        <Trash2 size={16} />
                        Delete
                      </ButtonIcon>
                    </FlexButton>
                  </PermissionGuard>
                </ActionButtons>
              </ProductCard>
            ))}
          </ProductGrid>
        )}
      </Main>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <ScrollableDialogContent>
          <DialogHeader>
            <DialogTitle>Create New Product</DialogTitle>
            <DialogDescription>Add a new music product to your catalog</DialogDescription>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingProduct?.name}"? This action cannot be undone.
            </DialogDescription>
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
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
