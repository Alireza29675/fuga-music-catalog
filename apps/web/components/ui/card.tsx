// Generated via Shadcn/UI
import * as React from 'react';
import styled from 'styled-components';

const StyledCard = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const StyledCardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const StyledCardTitle = styled.h3`
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  line-height: 1;
  letter-spacing: -0.025em;
`;

const StyledCardDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledCardContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: 0;
`;

const StyledCardFooter = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  padding-top: 0;
`;

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <StyledCard ref={ref} {...props} />
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <StyledCardHeader ref={ref} {...props} />
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  (props, ref) => <StyledCardTitle ref={ref} {...props} />
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>((props, ref) => <StyledCardDescription ref={ref} {...props} />);
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <StyledCardContent ref={ref} {...props} />
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <StyledCardFooter ref={ref} {...props} />
);
CardFooter.displayName = 'CardFooter';
