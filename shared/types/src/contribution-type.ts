export interface ContributionType {
  id: number;
  name: string;
  description: string | null;
}

export type GetContributionTypesResponse = ContributionType[];
