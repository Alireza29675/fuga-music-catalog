import type { Artist, ContributionType } from '@fuga-catalog/types';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { ProductFormData } from '../productForm.schema';
import * as S from '../productForm.styles';
import { ArtistCombobox } from '@/components/artist-combobox';
import { Button } from '@/components/ui/button';
import { FormField, ErrorText } from '@/components/ui/form';
import { Label } from '@/components/ui/label';

interface ContributorsFieldProps {
  artists: Artist[];
  contributionTypes: ContributionType[];
  initialArtists: Artist[];
  isLoading: boolean;
  isCreatingArtist: boolean;
  onCreateArtist: (name: string) => Promise<Artist>;
}

const mergeArtists = (existing: Artist[], incoming: Artist[]) => {
  const byId = new Map(existing.map((artist) => [artist.id, artist]));
  incoming.forEach((artist) => byId.set(artist.id, artist));
  return Array.from(byId.values());
};

export function ContributorsField({
  artists,
  contributionTypes,
  initialArtists,
  isLoading,
  isCreatingArtist,
  onCreateArtist,
}: ContributorsFieldProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contributors',
  });

  const [artistOptions, setArtistOptions] = useState<Artist[]>(() => mergeArtists(artists, initialArtists));

  useEffect(() => {
    setArtistOptions((prev) => mergeArtists(prev, artists));
  }, [artists]);

  useEffect(() => {
    if (initialArtists.length) {
      setArtistOptions((prev) => mergeArtists(prev, initialArtists));
    }
  }, [initialArtists]);

  const indexedArtists = useMemo(
    () => fields.map((field) => artistOptions.find((artist) => artist.id === field.artistId)),
    [artistOptions, fields]
  );

  const handleAddArtist = (artist: Artist) => {
    const alreadyAdded = fields.some((field) => field.artistId === artist.id);
    if (alreadyAdded) {
      return;
    }
    append({ artistId: artist.id });
    setArtistOptions((prev) => mergeArtists(prev, [artist]));
  };

  const handleCreateArtist = async (name: string) => {
    const newArtist = await onCreateArtist(name);
    handleAddArtist(newArtist);
  };

  const handleRemoveArtist = (index: number) => {
    remove(index);
  };

  return (
    <FormField>
      <Label>Artists *</Label>
      <S.ArtistSection>
        <ArtistCombobox
          artists={artistOptions}
          selectedArtists={indexedArtists.filter(Boolean) as Artist[]}
          onSelectArtist={handleAddArtist}
          onCreateArtist={handleCreateArtist}
          isCreating={isCreatingArtist}
          disabled={isLoading}
        />

        {fields.length > 0 && (
          <S.ArtistList>
            {fields.map((field, index) => (
              <S.ArtistRow key={field.id}>
                <input
                  type="hidden"
                  {...register(`contributors.${index}.artistId` as const, { valueAsNumber: true })}
                  defaultValue={field.artistId}
                />
                <S.FlexInput value={indexedArtists[index]?.name || ''} disabled />
                <S.Select {...register(`contributors.${index}.contributionTypeId` as const)} disabled={isLoading}>
                  <option value="">Role (optional)</option>
                  {contributionTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </S.Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArtist(index)}
                  disabled={isLoading}
                >
                  <X size={16} />
                </Button>
              </S.ArtistRow>
            ))}
          </S.ArtistList>
        )}
      </S.ArtistSection>
      {errors.contributors && <ErrorText>{errors.contributors.message}</ErrorText>}
    </FormField>
  );
}
