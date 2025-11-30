// Generated via Shadcn/UI
import * as React from 'react';
import styled from 'styled-components';

export type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const StyledLabel = styled.label`
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  line-height: 1;

  &:has(+ input:disabled) {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  return <StyledLabel ref={ref} {...props} />;
});

Label.displayName = 'Label';
