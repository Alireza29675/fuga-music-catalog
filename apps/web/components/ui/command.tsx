'use client';

// Generated via Shadcn/UI
import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';
import styled from 'styled-components';

const StyledCommand = styled(CommandPrimitive)`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
`;

const StyledCommandInput = styled(CommandPrimitive.Input)`
  display: flex;
  height: 2.75rem;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: transparent;
  padding: 0.75rem;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSize.sm};
  outline: none;
  border: none;
  color: ${({ theme }) => theme.colors.text};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const StyledCommandList = styled(CommandPrimitive.List)`
  max-height: 18rem;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.25rem;
`;

const StyledCommandEmpty = styled(CommandPrimitive.Empty)`
  padding: 1.5rem 0.5rem;
  text-align: center;
  font-size: ${({ theme }) => theme.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledCommandGroup = styled(CommandPrimitive.Group)`
  overflow: hidden;
  padding: 0.25rem;
  color: ${({ theme }) => theme.colors.text};

  [cmdk-group-heading] {
    padding: 0.375rem 0.5rem;
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const StyledCommandSeparator = styled(CommandPrimitive.Separator)`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: 0.25rem -0.25rem;
`;

const StyledCommandItem = styled(CommandPrimitive.Item)`
  position: relative;
  display: flex;
  cursor: pointer;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 0.5rem 0.75rem;
  font-size: ${({ theme }) => theme.fontSize.sm};
  outline: none;
  user-select: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &[aria-selected='true'] {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }

  &[aria-disabled='true'] {
    pointer-events: none;
    opacity: 0.5;
  }
`;

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ ...props }, ref) => <StyledCommand ref={ref} {...props} />);
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ ...props }, ref) => <StyledCommandInput ref={ref} {...props} />);
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ ...props }, ref) => <StyledCommandList ref={ref} {...props} />);
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => <StyledCommandEmpty ref={ref} {...props} />);
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ ...props }, ref) => <StyledCommandGroup ref={ref} {...props} />);
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ ...props }, ref) => <StyledCommandSeparator ref={ref} {...props} />);
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ ...props }, ref) => <StyledCommandItem ref={ref} {...props} />);
CommandItem.displayName = CommandPrimitive.Item.displayName;

export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator };
