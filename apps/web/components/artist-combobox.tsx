'use client';

import * as React from 'react';
import { Check, Plus } from 'lucide-react';
import styled from 'styled-components';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

interface Artist {
  id: number;
  name: string;
}

interface ArtistComboboxProps {
  artists: Artist[];
  selectedArtists: Artist[];
  onSelectArtist: (artist: Artist) => void;
  onCreateArtist: (name: string) => void;
  isLoading?: boolean;
  isCreating?: boolean;
  disabled?: boolean;
}

const TriggerButton = styled(Button)`
  width: 100%;
  justify-content: flex-start;
  font-weight: normal;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledPopoverContent = styled(PopoverContent)`
  width: var(--radix-popover-trigger-width);
  padding: 0;
`;

const CreateItemContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  color: ${({ theme }) => theme.colors.primary};
`;

const CheckIcon = styled(Check)`
  margin-left: auto;
  height: 1rem;
  width: 1rem;
`;

export function ArtistCombobox({
  artists,
  selectedArtists,
  onSelectArtist,
  onCreateArtist,
  isLoading = false,
  isCreating = false,
  disabled = false,
}: ArtistComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const hasExactMatch = artists.some(
    (artist) => artist.name.toLowerCase() === search.toLowerCase()
  );

  const filteredArtists = search
    ? artists.filter((artist) =>
        artist.name.toLowerCase().includes(search.toLowerCase())
      )
    : artists;

  const handleSelect = (artist: Artist) => {
    onSelectArtist(artist);
    setSearch('');
    setOpen(false);
  };

  const handleCreate = () => {
    if (search.trim()) {
      onCreateArtist(search.trim());
      setSearch('');
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <TriggerButton
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
        >
          Search or create artist...
        </TriggerButton>
      </PopoverTrigger>
      <StyledPopoverContent align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search or create artist..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {isLoading && (
              <CommandEmpty>Loading artists...</CommandEmpty>
            )}
            {!isLoading && filteredArtists.length === 0 && !search && (
              <CommandEmpty>No artists found.</CommandEmpty>
            )}
            {!isLoading && filteredArtists.length === 0 && search && !hasExactMatch && (
              <CommandEmpty>No artists found.</CommandEmpty>
            )}
            {!isLoading && filteredArtists.length > 0 && (
              <CommandGroup>
                {filteredArtists.map((artist) => {
                  const isSelected = selectedArtists.some((a) => a.id === artist.id);
                  return (
                    <CommandItem
                      key={artist.id}
                      value={artist.name}
                      onSelect={() => handleSelect(artist)}
                      disabled={isSelected}
                    >
                      {artist.name}
                      {isSelected && <CheckIcon />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            {!isLoading && search && !hasExactMatch && (
              <>
                {filteredArtists.length > 0 && <CommandSeparator />}
                <CommandGroup>
                  <CommandItem
                    value={`create-${search}`}
                    onSelect={handleCreate}
                    disabled={isCreating}
                  >
                    <CreateItemContent>
                      <Plus size={16} />
                      Create "{search}"
                    </CreateItemContent>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </StyledPopoverContent>
    </Popover>
  );
}
