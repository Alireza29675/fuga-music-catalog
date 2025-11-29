import { prisma } from '../lib/prisma';

export class ContributionTypeService {
  async list() {
    return prisma.contributionType.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
