'use client';

import type { Artist } from '@fuga-catalog/types';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import * as S from './artistCombobox.styles';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverTrigger } from '@/components/ui/popover';

interface ArtistComboboxProps {
  artists: Artist[];
  selectedArtists: Artist[];
  onSelectArtist: (artist: Artist) => void;
  onCreateArtist: (name: string) => void;
  isLoading?: boolean;
  isCreating?: boolean;
  disabled?: boolean;
}

export function ArtistCombobox({
  artists,
  selectedArtists,
  onSelectArtist,
  onCreateArtist,
  isLoading = false,
  isCreating = false,
  disabled = false,
}: ArtistComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const hasExactMatch = artists.some((artist) => artist.name.toLowerCase() === search.toLowerCase());

  const filteredArtists = search
    ? artists.filter((artist) => artist.name.toLowerCase().includes(search.toLowerCase()))
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
        <S.TriggerButton type="button" variant="outline" role="combobox" aria-expanded={open} disabled={disabled}>
          Search or create artist...
        </S.TriggerButton>
      </PopoverTrigger>
      <S.StyledPopoverContent align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search or create artist..." value={search} onValueChange={setSearch} />
          <CommandList>
            {isLoading && <CommandEmpty>Loading artists...</CommandEmpty>}
            {!isLoading && filteredArtists.length === 0 && !search && <CommandEmpty>No artists found.</CommandEmpty>}
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
                      {isSelected && <S.CheckIcon />}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
            {!isLoading && search && !hasExactMatch && (
              <>
                {filteredArtists.length > 0 && <CommandSeparator />}
                <CommandGroup>
                  <CommandItem value={`create-${search}`} onSelect={handleCreate} disabled={isCreating}>
                    <S.CreateItemContent>
                      <Plus size={16} />
                      Create "{search}"
                    </S.CreateItemContent>
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </S.StyledPopoverContent>
    </Popover>
  );
}
