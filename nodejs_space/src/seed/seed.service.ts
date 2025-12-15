
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private prisma: PrismaService) { }

  async seed() {
    try {
      this.logger.log('🌱 Starting database seeding...');

      // Create admin API key
      const adminApiKey = uuidv4();
      const adminKey = await this.prisma.apiKey.upsert({
        where: { key: adminApiKey },
        update: {},
        create: {
          key: adminApiKey,
          name: 'Admin Key',
          isActive: true,
          isAdmin: true,
        },
      });

      this.logger.log(`✅ Admin API Key: ${adminKey.key}`);

      // Create read-only API key
      const readOnlyKey = uuidv4();
      const readKey = await this.prisma.apiKey.upsert({
        where: { key: readOnlyKey },
        update: {},
        create: {
          key: readOnlyKey,
          name: 'Read-Only Key',
          isActive: true,
          isAdmin: false,
        },
      });

      this.logger.log(`✅ Read-Only API Key: ${readKey.key}`);

      // Create sample categories
      const categories = ['iMac', 'MacBook', 'Notebook', 'Desktop', 'Acessórios'];
      for (const categoryName of categories) {
        const slug = categoryName.toLowerCase().replace(/\s+/g, '-');
        await this.prisma.category.upsert({
          where: { slug },
          update: {},
          create: {
            name: categoryName,
            slug,
          },
        });
      }

      this.logger.log('✅ Categories created');

      // Check if sample product already exists
      const existingProducts = await this.prisma.product.count();

      if (existingProducts === 0) {
        // Create sample product
        const imacCategory = await this.prisma.category.findUnique({
          where: { slug: 'imac' },
        });

        if (imacCategory) {
          const sampleProduct = await this.prisma.product.create({
            data: {
              name: 'iMac 24" M1 2021',
              description:
                'iMac 24 polegadas com chip M1, 8GB RAM, 256GB SSD. Estado: Semi-novo, com todos os acessórios originais.',
              price: 8500.0,
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
                    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/IMac_M4_2024_2_%28cropped%29.jpg/1190px-IMac_M4_2024_2_%28cropped%29.jpg',
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

          this.logger.log(`✅ Sample product created: ${sampleProduct.name}`);
        }
      } else {
        this.logger.log(`ℹ️ Skipping sample product creation (${existingProducts} products already exist)`);
      }

      this.logger.log('✅ Database seeded successfully!');

      return {
        success: true,
        adminApiKey: adminKey.key,
        readOnlyApiKey: readKey.key,
      };
    } catch (error) {
      this.logger.error('❌ Error seeding database:', error);
      throw error;
    }
  }
}
