
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    this.logger.log(`Creating product: ${createProductDto.name}`);

    const { images, ...productData } = createProductDto;

    // Find or create category if provided
    let categoryId = undefined;
    if (productData.category) {
      const slug = productData.category.toLowerCase().replace(/\s+/g, '-');
      const category = await this.prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: productData.category,
          slug,
        },
      });
      categoryId = category.id;
    }

    const product = await this.prisma.product.create({
      data: {
        ...productData,
        categoryId,
        images: images
          ? {
              create: images.map((img, index) => ({
                url: img.url,
                order: img.order ?? index + 1,
              })),
            }
          : undefined,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        categoryRelation: true,
      },
    });

    return product;
  }

  async findAll(filterDto: FilterProductsDto) {
    const { page = 1, limit = 10, category, brand, condition, minPrice, maxPrice } = filterDto;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }

    if (condition) {
      where.condition = { contains: condition, mode: 'insensitive' };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          categoryRelation: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        categoryRelation: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async search(searchDto: SearchProductsDto) {
    const { q, page = 1, limit = 10, category, brand, condition } = searchDto;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { brand: { contains: q, mode: 'insensitive' } },
        { model: { contains: q, mode: 'insensitive' } },
      ],
    };

    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (brand) {
      where.brand = { contains: brand, mode: 'insensitive' };
    }

    if (condition) {
      where.condition = { contains: condition, mode: 'insensitive' };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { order: 'asc' },
          },
          categoryRelation: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        query: q,
      },
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    this.logger.log(`Updating product: ${id}`);

    // Check if product exists
    await this.findOne(id);

    const { images, ...productData } = updateProductDto;

    // Update category if provided
    let categoryId = undefined;
    if (productData.category) {
      const slug = productData.category.toLowerCase().replace(/\s+/g, '-');
      const category = await this.prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          name: productData.category,
          slug,
        },
      });
      categoryId = category.id;
    }

    // If images are provided, delete existing ones and create new ones
    if (images) {
      await this.prisma.image.deleteMany({
        where: { productId: id },
      });
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        ...(categoryId !== undefined && { categoryId }),
        ...(images && {
          images: {
            create: images.map((img, index) => ({
              url: img.url,
              order: img.order ?? index + 1,
            })),
          },
        }),
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        categoryRelation: true,
      },
    });

    return product;
  }

  async remove(id: number) {
    this.logger.log(`Deleting product: ${id}`);

    // Check if product exists
    await this.findOne(id);

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: 'Product deleted successfully' };
  }

  async bulkCreate(products: CreateProductDto[]) {
    this.logger.log(`Bulk creating ${products.length} products`);

    const createdProducts = [];

    for (const productDto of products) {
      try {
        const product = await this.create(productDto);
        createdProducts.push(product);
      } catch (error) {
        this.logger.error(
          `Error creating product ${productDto.name}: ${error.message}`,
        );
      }
    }

    return {
      created: createdProducts.length,
      total: products.length,
      products: createdProducts,
    };
  }

  async getStats() {
    const [
      totalProducts,
      productsByCategory,
      avgPrice,
      productsByCondition,
    ] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.product.groupBy({
        by: ['category'],
        _count: { category: true },
      }),
      this.prisma.product.aggregate({
        _avg: { price: true },
      }),
      this.prisma.product.groupBy({
        by: ['condition'],
        _count: { condition: true },
      }),
    ]);

    return {
      totalProducts,
      avgPrice: avgPrice._avg.price
        ? Number(avgPrice._avg.price.toFixed(2))
        : 0,
      productsByCategory: productsByCategory.map((item) => ({
        category: item.category,
        count: item._count.category,
      })),
      productsByCondition: productsByCondition.map((item) => ({
        condition: item.condition,
        count: item._count.condition,
      })),
    };
  }
}
