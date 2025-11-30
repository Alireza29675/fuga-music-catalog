import { Check } from 'lucide-react';
import styled from 'styled-components';
import { Button } from '@/components/ui/button';
import { PopoverContent } from '@/components/ui/popover';

export const TriggerButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const StyledPopoverContent = styled(PopoverContent)`
  width: var(--radix-popover-trigger-width);
  padding: 0;
`;

export const CreateItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

export const CheckIcon = styled(Check)`
  margin-left: auto;
  height: 1rem;
  width: 1rem;
`;
