// Generated via Shadcn/UI
import * as React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined);

function useDialog() {
  const context = React.useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within Dialog');
  }
  return context;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: ${({ theme }) => theme.colors.overlay};
`;

const ContentWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledDialogContent = styled.div`
  position: relative;
  z-index: 50;
  display: grid;
  width: 100%;
  max-width: 32rem;
  gap: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  @media (max-width: 640px) {
    border-radius: 0;
    max-width: 100%;
    height: 100%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  opacity: 0.7;
  transition: opacity ${({ theme }) => theme.transitions.fast};
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.inputFocus};
    outline-offset: 2px;
  }
`;

const VisuallyHidden = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const StyledDialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  text-align: left;

  @media (max-width: 640px) {
    text-align: center;
  }
`;

const StyledDialogTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  line-height: 1;
  letter-spacing: -0.025em;
`;

const StyledDialogDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledDialogFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 640px) {
    flex-direction: column-reverse;
  }
`;

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogTrigger({
  asChild,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }) {
  const { onOpenChange } = useDialog();

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as any;
    return React.cloneElement(children, {
      onClick: (e: React.MouseEvent) => {
        childProps?.onClick?.(e);
        onOpenChange(true);
      },
    } as any);
  }

  return (
    <button onClick={() => onOpenChange(true)} {...props}>
      {children}
    </button>
  );
}

export function DialogContent({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { open, onOpenChange } = useDialog();

  if (!open) return null;

  return (
    <ContentWrapper>
      <Overlay onClick={() => onOpenChange(false)} />
      <StyledDialogContent {...props}>
        {children}
        <CloseButton onClick={() => onOpenChange(false)}>
          <X size={16} />
          <VisuallyHidden>Close</VisuallyHidden>
        </CloseButton>
      </StyledDialogContent>
    </ContentWrapper>
  );
}

export function DialogHeader(props: React.HTMLAttributes<HTMLDivElement>) {
  return <StyledDialogHeader {...props} />;
}

export function DialogTitle(props: React.HTMLAttributes<HTMLHeadingElement>) {
  return <StyledDialogTitle {...props} />;
}

export function DialogDescription(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return <StyledDialogDescription {...props} />;
}

export function DialogFooter(props: React.HTMLAttributes<HTMLDivElement>) {
  return <StyledDialogFooter {...props} />;
}
