
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin API key
  const adminApiKey = uuidv4();
  await prisma.apiKey.upsert({
    where: { key: adminApiKey },
    update: {},
    create: {
      key: adminApiKey,
      name: 'Admin Key',
      isActive: true,
      isAdmin: true,
    },
  });

  console.log(`✅ Admin API Key created: ${adminApiKey}`);

  // Create read-only API key
  const readOnlyKey = uuidv4();
  await prisma.apiKey.upsert({
    where: { key: readOnlyKey },
    update: {},
    create: {
      key: readOnlyKey,
      name: 'Read-Only Key',
      isActive: true,
      isAdmin: false,
    },
  });

  console.log(`✅ Read-Only API Key created: ${readOnlyKey}`);

  // Create sample categories
  const categories = ['iMac', 'MacBook', 'Notebook', 'Desktop', 'Acessórios'];
  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: { slug: categoryName.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: {
        name: categoryName,
        slug: categoryName.toLowerCase().replace(/\s+/g, '-'),
      },
    });
  }

  console.log('✅ Categories created');

  // Create sample product
  const imacCategory = await prisma.category.findUnique({
    where: { slug: 'imac' },
  });

  if (imacCategory) {
    const sampleProduct = await prisma.product.create({
      data: {
        name: 'iMac 24" M1 2021',
        description: 'iMac 24 polegadas com chip M1, 8GB RAM, 256GB SSD. Estado: Semi-novo, com todos os acessórios originais.',
        price: 8500.00,
        category: 'iMac',
        categoryId: imacCategory.id,
        condition: 'semi-novo',
        brand: 'Apple',
        model: 'iMac 24" M1',
        specs: {
          processor: 'Apple M1',
          ram: '8GB',
          storage: '256GB SSD',
          screen: '24 polegadas 4.5K Retina',
        },
        images: {
          create: [
            {
              url: 'https://upload.wikimedia.org/wikipedia/commons/6/64/IMac_G5_-_Frontal_view.png',
              order: 1,
            },
            {
              url: 'https://cdn.pixabay.com/photo/2021/04/21/15/25/imac-6196689_1280.png',
              order: 2,
            },
          ],
        },
      },
    });

    console.log(`✅ Sample product created: ${sampleProduct.name}`);
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
