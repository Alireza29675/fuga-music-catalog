import styled from 'styled-components';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing.md};
`;

export const StyledCard = styled(Card)`
  width: 100%;
  max-width: 28rem;
`;

export const FullWidthButton = styled(Button)`
  width: 100%;
`;
