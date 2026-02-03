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
        description: 'A classic, chilled blend of real lemon juice, water, and organic cane sugar.',
        imageUrl: '/lemonade.png',
        price: 2.00,
      },
      {
        name: 'Strawberry Fizz',
        description: 'Ripe strawberry flavor meets sparkling water for a light, fruity, and refreshingly bubbly drink.',
        imageUrl: '/strawberry_fizz.png',
        price: 3.00,
      },
      {
        name: 'Iced Tea',
        description: 'A smooth, lightly sweetened black tea served ice cold',
        imageUrl: '/iced_tea.png',
        price: 2.50,
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
