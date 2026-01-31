import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding beverage data:');

  // Cleaning up the database
  // Delete orderItems first, then orders and beverages
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.beverage.deleteMany();

  // Create Beverages
  await prisma.beverage.createMany({
    data: [
      {
        name: 'Classic Lemonade',
        price: 2.00,
      },
      {
        name: 'Strawberry Fizz',
        price: 3.00,
      },
      {
        name: 'Iced Tea',
        price: 2.00,
      },
    ],
  });

  console.log('Database seeded successfully with beverage data.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });