
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private prisma: PrismaService) {}

  async findAll() {
    this.logger.log('Fetching all categories');
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async delete(id: number) {
    this.logger.log(`Deleting category ${id}`);
    
    // Verificar se categoria existe
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Deletar (isso também desassocia os produtos)
    await this.prisma.category.delete({
      where: { id },
    });

    return { 
      message: 'Category deleted successfully',
      deletedCategory: category.name,
      affectedProducts: category._count.products
    };
  }
}
