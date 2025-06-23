import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';

const prisma = new PrismaClient();

async function main() {
  await prisma.category.deleteMany();

  await prisma.category.createManyAndReturn({
    data: [
      { title: 'Eletrodomésticos' },
      { title: 'Eletrônicos' },
      { title: 'Informática' },
      { title: 'Móveis' },
      { title: 'Decoração' },
      { title: 'Moda' },
      { title: 'Esportes' },
      { title: 'Brinquedos' },
      { title: 'Livros' },
      { title: 'Alimentos' },
    ].map((category) => {
      return {
        id: randomUUID(),
        title: category.title,
        slug: category.title
          .normalize('NFKD')
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]+/g, '')
          .replace(/_/g, '-')
          .replace(/--+/g, '-')
          .replace(/-$/g, ''),
      };
    }),
  });
}

main();
