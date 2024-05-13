import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.vertical.createMany({
      data: [
        {
          name: 'FASHION',
        },
        {
          name: 'HOME',
        },
        {
          name: 'GENERAL',
        },
      ],
    });

    console.log('Verticals seeded successfully');
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        console.error('Verticals already seeded');
      }
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
