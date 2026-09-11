import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import exercises from './exercises.json' with { type: 'json' };

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  for (const exercise of exercises.exercises) {
    await prisma.exercise.create({
      data: {
        name: exercise.name,
        category: exercise.category,
        muscles: {
          create: exercise.muscles,
        },
      },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
