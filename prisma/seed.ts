// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/commons/utils/password.util';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

async function main() {
  await prisma.campaign.deleteMany();
  await prisma.user.deleteMany();
  await prisma.company.deleteMany();

  const acme = await prisma.company.create({
    data: {
      id: createId(),
      name: 'ACME Corporation',
      document: '45.997.418/0001-53',
    },
  });

  const netflix = await prisma.company.create({
    data: {
      id: createId(),
      name: 'Netflix Brasil',
      document: '13.590.585/0001-99',
    },
  });

  const hashedPassword = await hashPassword('123456');

  await prisma.user.create({
    data: {
      id: createId(),
      email: 'admin@acme.com',
      password: hashedPassword,
      company_id: acme.id,
    },
  });

  await prisma.user.create({
    data: {
      id: createId(),
      email: 'admin@netflix.com',
      password: hashedPassword,
      company_id: netflix.id,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
