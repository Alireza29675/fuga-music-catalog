'use client';

// Generated via Shadcn/UI
import { X } from 'lucide-react';
import * as React from 'react';
import styled from 'styled-components';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

const ToastContainer = styled.div`
  position: fixed;
  bottom: ${({ theme }) => theme.spacing.md};
  right: ${({ theme }) => theme.spacing.md};
  z-index: ${({ theme }) => theme.zIndex.toast};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ToastItem = styled.div<{ $type: ToastType }>`
  min-width: 300px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid;
  padding: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spacing.md};

  ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return `
          background-color: ${theme.colors.successBg};
          border-color: ${theme.colors.successBorder};
          color: ${theme.colors.success};
        `;
      case 'error':
        return `
          background-color: ${theme.colors.errorBg};
          border-color: ${theme.colors.errorBorder};
          color: ${theme.colors.error};
        `;
      default:
        return `
          background-color: ${theme.colors.background};
          border-color: ${theme.colors.border};
          color: ${theme.colors.text};
        `;
    }
  }}
`;

const ToastMessage = styled.p`
  flex: 1;
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const ToastCloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
  opacity: 0.7;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 1;
  }
`;

const ToastContext = React.createContext<{
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} $type={toast.type}>
            <ToastMessage>{toast.message}</ToastMessage>
            <ToastCloseButton onClick={() => removeToast(toast.id)}>
              <X size={16} />
            </ToastCloseButton>
          </ToastItem>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
