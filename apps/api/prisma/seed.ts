import { PrismaClient } from '../src/generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import { PERMISSIONS } from '@fuga-catalog/constants';
import { PermissionKey } from '@fuga-catalog/types';
import { env } from '../src/env';

const pool = new Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export const PERMISSION_DESCRIPTIONS: Record<PermissionKey, string> = {
  [PERMISSIONS.PRODUCT_VIEW]: 'View products and related data',
  [PERMISSIONS.PRODUCT_CREATE]: 'Create new products',
  [PERMISSIONS.PRODUCT_EDIT]: 'Edit and delete existing products',
};

const ADMIN_ROLE = {
  name: 'Admin',
  description: 'Full system access',
} as const;

const CONTRIBUTION_TYPES = [
  {
    name: 'Primary Artist',
    description: 'Main performing artist on the track',
  },
  {
    name: 'Featured Artist',
    description: 'Guest artist with a significant contribution',
  },
  {
    name: 'Remixer',
    description: 'Artist who created a remix of the track',
  },
  {
    name: 'Composer',
    description: 'Creator of the musical composition and melody',
  },
  {
    name: 'Producer',
    description: 'Oversees the recording and sound of the track',
  },
  {
    name: 'Mastering Engineer',
    description: 'Finalizes the audio for distribution',
  },
] as const;

async function main() {
  console.log('Starting database seed...');

  const adminEmail = env.ADMIN_EMAIL;
  const adminPassword = env.ADMIN_INIT_PASSWORD?.trim();

  if (!adminPassword) {
    throw new Error('ADMIN_INIT_PASSWORD environment variable is required. ' + 'Please set it in your .env file.');
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      isActive: true,
    },
  });

  console.log(`✅ Admin user ensured: ${admin.email}`);

  const adminRole = await prisma.role.upsert({
    where: { name: ADMIN_ROLE.name },
    update: {},
    create: {
      name: ADMIN_ROLE.name,
      description: ADMIN_ROLE.description,
    },
  });

  console.log(`✅ Admin role ensured: ${adminRole.name}`);

  const permissions = await Promise.all(
    Object.values(PERMISSIONS).map((key) =>
      prisma.permission.upsert({
        where: { key },
        update: {},
        create: {
          key,
          description: PERMISSION_DESCRIPTIONS[key],
        },
      })
    )
  );

  console.log(`✅ Permissions ensured: ${permissions.length}`);

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: adminRole.id,
    },
  });

  console.log('✅ Admin role assigned to admin user');

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: permission.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: permission.id,
      },
    });
  }

  console.log('✅ All permissions assigned to Admin role');

  const contributionTypes = await Promise.all(
    CONTRIBUTION_TYPES.map(({ name, description }) =>
      prisma.contributionType.upsert({
        where: { name },
        update: {},
        create: {
          name,
          description,
          createdByUserId: admin.id,
        },
      })
    )
  );

  console.log(`✅ Contribution types ensured: ${contributionTypes.length}`);
  console.log('\n🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
