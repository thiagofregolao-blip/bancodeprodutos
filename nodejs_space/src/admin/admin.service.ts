
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
}
