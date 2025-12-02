import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Card, CardContent } from '@/components/ui/card';

export const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(16px);
`;

export const HeaderContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

export const Main = styled.main`
  max-width: 1280px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.md};
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.xl};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: start;

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

export const CoverArtContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

export const ProductInfo = styled(CardContent)`
  padding: ${({ theme }) => theme.spacing.md};
`;

export const ArtistList = styled.div<{ children: ReactNode; $visibleRows: number }>`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow: hidden;
  min-height: ${({ $visibleRows }) => $visibleRows * 1.25}rem;
  max-height: ${({ $visibleRows }) => $visibleRows * 1.25}rem;
  position: relative;
  transition: max-height 0.3s;
  padding-bottom: ${({ theme }) => theme.spacing.sm};

  &::after {
    content: '';
    pointer-events: none;
    display: ${({ children, $visibleRows }) =>
      React.Children.count(children || []) > $visibleRows ? 'block' : 'none'};
    position: absolute;
    opacity: 1;
    transition: opacity 0.3s;
    right: 0;
    top: calc(100% - 2rem);
    width: 100%;
    height: 2rem;
    background: linear-gradient(to bottom, transparent, ${({ theme }) => theme.colors.background});
  }
`;

export const ArtistText = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ActionButtons = styled.div`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  opacity: 0;
  pointer-events: none;
  transform: translateY(8px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
`;

export const ProductCardWrapper = styled.div`
  position: relative;
  aspect-ratio: 1/1.35;
`;

export const ProductCard = styled(Card)`
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.3s;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: absolute;
  width: 100%;

  &:hover {
    transform: scale(1.02);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    z-index: ${({ theme }) => theme.zIndex.base};

    ${ArtistList} {
      max-height: 30rem;

      &::after {
        opacity: 0;
      }
    }

    ${ActionButtons} {
      pointer-events: auto;
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export const EmptyState = styled(CardContent)`
  padding: ${({ theme }) => theme.spacing['3xl']} ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

export const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;
