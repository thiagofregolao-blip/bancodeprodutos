
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private prisma: PrismaService) {}

  async getStats() {
    this.logger.log('Fetching admin statistics');

    const [
      totalProducts,
      totalCategories,
      totalImages,
      productsByCategory,
      recentProducts,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.category.count(),
      this.prisma.image.count(),
      this.prisma.product.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      this.prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          price: true,
          category: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalProducts,
      totalCategories,
      totalImages,
      avgImagesPerProduct:
        totalProducts > 0 ? (totalImages / totalProducts).toFixed(2) : 0,
      productsByCategory: productsByCategory.map((item) => ({
        category: item.category,
        count: item._count.category,
      })),
      recentProducts,
    };
  }

  async fixProductNames() {
    this.logger.log('🔧 Fixing product names...');

    try {
      // Buscar todos os produtos
      const products = await this.prisma.product.findMany({
        select: {
          id: true,
          name: true,
          description: true,
        },
      });

      this.logger.log(`📊 Total products: ${products.length}`);

      let updatedCount = 0;
      const updates = [];

      for (const product of products) {
        // Verificar se o nome parece ser uma frase/descrição
        const nameNeedsFixing =
          product.name.length > 80 ||
          product.name.includes(', ') ||
          product.name.match(/\.\s/) ||
          product.name.toLowerCase().startsWith('o ') ||
          product.name.toLowerCase().includes(' é a ') ||
          product.name.toLowerCase().includes(' é o ');

        if (nameNeedsFixing && product.description) {
          // Tentar extrair um nome curto da descrição
          const descLines = product.description.split('\n');

          // Procurar por um título curto nas primeiras linhas
          let newName = null;

          for (const line of descLines.slice(0, 3)) {
            const cleanLine = line.trim();
            // Se encontrar uma linha que parece um título de produto
            if (cleanLine.length > 10 && cleanLine.length <= 100) {
              // Verificar se tem padrão de nome de produto (letras maiúsculas, números, etc)
              if (cleanLine.match(/[A-Z0-9]/)) {
                newName = cleanLine;
                break;
              }
            }
          }

          // Se não encontrou, pegar as primeiras palavras do nome atual até 80 chars
          if (!newName) {
            const words = product.name.split(' ');
            let shortName = '';
            for (const word of words) {
              if ((shortName + ' ' + word).length > 80) break;
              shortName += (shortName ? ' ' : '') + word;
            }
            newName = shortName || product.name.substring(0, 80);
          }

          // Atualizar o produto
          await this.prisma.product.update({
            where: { id: product.id },
            data: { name: newName },
          });

          updates.push({
            id: product.id,
            oldName: product.name.substring(0, 80),
            newName: newName,
          });

          updatedCount++;
        }
      }

      this.logger.log(
        `✨ Fix completed! Updated ${updatedCount} of ${products.length} products`,
      );

      return {
        success: true,
        message: 'Product names fixed successfully',
        totalProducts: products.length,
        updatedCount: updatedCount,
        updates: updates.slice(0, 10), // Retornar apenas os primeiros 10 exemplos
      };
    } catch (error) {
      this.logger.error(`❌ Error fixing product names: ${error.message}`);
      throw error;
    }
  }

  async clearDatabase(deleteProducts = true, deleteCategories = false) {
    this.logger.log(`🗑️  Clearing database - Products: ${deleteProducts}, Categories: ${deleteCategories}`);

    try {
      let deletedProducts = 0;
      let deletedImages = 0;
      let deletedCategories = 0;
      let totalImages = 0;
      let totalProducts = 0;

      if (deleteProducts) {
        // Contar antes de deletar
        totalImages = await this.prisma.image.count();
        totalProducts = await this.prisma.product.count();
        
        this.logger.log(`🗑️  Truncating tables (${totalImages} images, ${totalProducts} products)...`);
        
        // TRUNCATE é MUITO mais rápido que DELETE (ignora rows individuais)
        await this.prisma.$executeRaw`TRUNCATE TABLE "images", "products" RESTART IDENTITY CASCADE`;
        
        deletedImages = totalImages;
        deletedProducts = totalProducts;
        
        this.logger.log(`✅ Truncated successfully`);
      }

      if (deleteCategories) {
        const categoriesResult = await this.prisma.category.deleteMany();
        deletedCategories = categoriesResult.count;
        this.logger.log(`🗑️  Deleted ${deletedCategories} categories`);
      }

      this.logger.log('✅ Database cleared successfully');

      return {
        success: true,
        message: 'Database cleared successfully',
        deleted: {
          products: deletedProducts,
          images: deletedImages,
          categories: deletedCategories,
        },
      };
    } catch (error) {
      this.logger.error(`❌ Error clearing database: ${error.message}`);
      throw error;
    }
  }
}
