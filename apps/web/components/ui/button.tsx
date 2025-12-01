// Generated via Shadcn/UI
import * as React from 'react';
import styled, { css } from 'styled-components';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  transition: all ${({ theme }) => theme.transitions.fast};
  border: none;
  cursor: pointer;
  font-family: inherit;
  backdrop-filter: blur(4px);

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.inputFocus};
    outline-offset: 2px;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  ${({ variant = 'default', theme }) => {
    switch (variant) {
      case 'destructive':
        return css`
          background-color: ${theme.colors.error};
          color: white;
          box-shadow: ${theme.shadows.sm};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.error}dd;
          }
        `;
      case 'outline':
        return css`
          background-color: ${theme.colors.background};
          color: ${theme.colors.text};
          border: 1px solid ${theme.colors.border};
          box-shadow: ${theme.shadows.sm};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.backgroundSecondary};
          }
        `;
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: white;
          box-shadow: ${theme.shadows.sm};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.secondary}cc;
          }
        `;
      case 'ghost':
        return css`
          background-color: transparent;
          color: ${theme.colors.text};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.backgroundSecondary};
          }
        `;
      case 'link':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          text-decoration: underline;
          text-underline-offset: 4px;
          &:hover:not(:disabled) {
            text-decoration: underline;
          }
        `;
      default:
        return css`
          background-color: ${theme.colors.primary};
          color: white;
          box-shadow: ${theme.shadows.sm};
          &:hover:not(:disabled) {
            background-color: ${theme.colors.primaryHover};
          }
        `;
    }
  }}

  ${({ size = 'default', theme }) => {
    switch (size) {
      case 'sm':
        return css`
          height: 2rem;
          padding: 0 ${theme.spacing.md};
          font-size: ${theme.fontSize.xs};
        `;
      case 'lg':
        return css`
          height: 2.5rem;
          padding: 0 ${theme.spacing.xl};
        `;
      case 'icon':
        return css`
          height: 2.25rem;
          width: 2.25rem;
          padding: 0;
        `;
      default:
        return css`
          height: 2.25rem;
          padding: 0.5rem ${theme.spacing.md};
        `;
    }
  }}
`;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'default', size = 'default', ...props }, ref) => {
    return <StyledButton ref={ref} variant={variant} size={size} {...props} />;
  }
);

Button.displayName = 'Button';

export const ButtonIcon = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;
