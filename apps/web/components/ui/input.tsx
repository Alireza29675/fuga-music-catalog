// Generated via Shadcn/UI
import * as React from 'react';
import styled from 'styled-components';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledInput = styled.input`
  display: flex;
  height: 2.25rem;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.inputBorder};
  background-color: transparent;
  padding: 0.25rem ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.fontSize.sm};
  transition: all ${({ theme }) => theme.transitions.fast};
  font-family: inherit;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textLight};
  }

  &:focus-visible {
    outline: none;
    border-color: ${({ theme }) => theme.colors.inputFocus};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.inputFocus};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[type='file'] {
    padding: 0.375rem ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fontSize.sm};

    &::file-selector-button {
      border: 0;
      background-color: transparent;
      font-size: ${({ theme }) => theme.fontSize.sm};
      font-weight: ${({ theme }) => theme.fontWeight.medium};
      margin-right: ${({ theme }) => theme.spacing.md};
      cursor: pointer;
    }
  }
`;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ type = 'text', ...props }, ref) => {
  return <StyledInput ref={ref} type={type} {...props} />;
});

Input.displayName = 'Input';
