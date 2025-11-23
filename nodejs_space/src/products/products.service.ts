
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { Prisma } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private readonly uploadsDir = path.join(process.cwd(), 'uploads', 'products');

  constructor(private prisma: PrismaService) {
    // Criar diretório de uploads se não existir
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }
  }

  private async saveBase64Image(base64Data: string, filename: string, productId: number): Promise<string> {
    try {
      this.logger.log(`📥 saveBase64Image chamado - produto: ${productId}, arquivo: ${filename}`);
      this.logger.log(`📊 Base64 recebido - tamanho: ${base64Data.length} chars, início: "${base64Data.substring(0, 100)}..."`);
      
      // Extrair o base64 puro (aceita image/* ou application/octet-stream)
      const matches = base64Data.match(/^data:(?:image\/(\w+)|application\/octet-stream);base64,(.+)$/);
      if (!matches) {
        this.logger.error(`❌ Formato de imagem inválido - NÃO MATCHOU O REGEX`);
        this.logger.error(`📄 Primeira parte: ${base64Data.substring(0, 100)}...`);
        this.logger.error(`📄 Tamanho total: ${base64Data.length}`);
        throw new Error('Formato de imagem inválido - regex não bateu');
      }

      // Se veio como octet-stream, pega extensão do filename, senão do mime type
      const ext = matches[1] || filename.split('.').pop() || 'jpg';
      const data = matches[2];
      const buffer = Buffer.from(data, 'base64');
      this.logger.log(`📊 Imagem processada - ext: ${ext}, tamanho: ${buffer.length} bytes`);

      // Nome único para o arquivo
      const timestamp = Date.now();
      const uniqueFilename = `${productId}_${timestamp}_${filename}`;
      const filepath = path.join(this.uploadsDir, uniqueFilename);
      this.logger.log(`💾 Salvando em: ${filepath}`);

      // Salvar arquivo
      fs.writeFileSync(filepath, buffer);
      this.logger.log(`✅ Arquivo salvo com sucesso!`);

      // Retornar URL pública
      const publicUrl = `/uploads/products/${uniqueFilename}`;
      this.logger.log(`🔗 URL pública: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      this.logger.error(`❌ Erro ao salvar imagem: ${error.message}`);
      throw error;
    }
  }

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

    // Criar produto primeiro (sem imagens)
    const product = await this.prisma.product.create({
      data: {
        ...productData,
        categoryId,
      },
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        categoryRelation: true,
      },
    });

    // Processar imagens se existirem
    if (images && images.length > 0) {
      this.logger.log(`📸 Processando ${images.length} imagens para produto ${product.id}`);
      const imageRecords = [];
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        try {
          let imageUrl: string;
          
          // Se a imagem tem 'data' (base64), salvar localmente
          if (img.data) {
            this.logger.log(`💾 Salvando imagem ${i+1}/${images.length} (${img.filename || `image_${i}.${img.ext}`})`);
            imageUrl = await this.saveBase64Image(img.data, img.filename || `image_${i}.${img.ext}`, product.id);
            this.logger.log(`✅ Imagem salva: ${imageUrl}`);
          } else if (img.url) {
            // Se já tem URL, usar diretamente
            this.logger.log(`🔗 Usando URL externa: ${img.url}`);
            imageUrl = img.url;
          } else {
            this.logger.warn(`⚠️ Imagem ${i} sem data e sem URL, pulando...`);
            continue;
          }

          imageRecords.push({
            productId: product.id,
            url: imageUrl,
            order: img.order ?? i + 1,
          });
        } catch (error) {
          this.logger.error(`❌ Erro ao processar imagem ${i}: ${error.message}`);
          this.logger.error(`Stack trace: ${error.stack}`);
        }
      }

      // Criar registros de imagem no banco
      this.logger.log(`📦 Total de imagens processadas: ${imageRecords.length}`);
      if (imageRecords.length > 0) {
        this.logger.log(`💿 Criando ${imageRecords.length} registros no banco...`);
        this.logger.log(`📋 Dados: ${JSON.stringify(imageRecords, null, 2)}`);
        
        try {
          await this.prisma.image.createMany({
            data: imageRecords,
          });
          this.logger.log(`✅ Registros de imagem criados com sucesso!`);
        } catch (error) {
          this.logger.error(`❌ Erro ao criar registros: ${error.message}`);
          this.logger.error(`Stack: ${error.stack}`);
        }

        // Recarregar produto com imagens
        return this.prisma.product.findUnique({
          where: { id: product.id },
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
            categoryRelation: true,
          },
        });
      }
    }

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

    // If images are provided, delete existing ones
    if (images) {
      await this.prisma.image.deleteMany({
        where: { productId: id },
      });
    }

    // Prepare update data
    const updateData: any = { ...productData };
    if (categoryId !== undefined) {
      updateData.categoryId = categoryId;
    }

    // Update product
    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        categoryRelation: true,
      },
    });

    // Process images if provided
    if (images && images.length > 0) {
      const imageRecords = [];
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        try {
          let imageUrl: string;
          
          if (img.data) {
            imageUrl = await this.saveBase64Image(img.data, img.filename || `image_${i}.${img.ext}`, product.id);
          } else if (img.url) {
            imageUrl = img.url;
          } else {
            continue;
          }

          imageRecords.push({
            productId: product.id,
            url: imageUrl,
            order: img.order ?? i + 1,
          });
        } catch (error) {
          this.logger.error(`Erro ao processar imagem ${i}: ${error.message}`);
        }
      }

      if (imageRecords.length > 0) {
        await this.prisma.image.createMany({
          data: imageRecords,
        });

        // Reload product with images
        return this.prisma.product.findUnique({
          where: { id: product.id },
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
            categoryRelation: true,
          },
        });
      }
    }

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
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      const productDto = products[i];
      try {
        this.logger.log(`Creating product ${i + 1}/${products.length}: ${productDto.name}`);
        
        // Validação básica
        if (!productDto.name || productDto.name.trim() === '') {
          throw new Error('Nome do produto não pode estar vazio');
        }

        const product = await this.create(productDto);
        if (product) {
          createdProducts.push(product);
          this.logger.log(`✅ Product created: ${product.name}`);
        }
      } catch (error) {
        const errorMsg = error.message || 'Erro desconhecido';
        this.logger.error(
          `❌ Error creating product ${productDto.name}: ${errorMsg}`,
        );
        errors.push({
          product: productDto.name,
          error: errorMsg,
        });
      }
    }

    this.logger.log(
      `Bulk create completed: ${createdProducts.length}/${products.length} products created, ${errors.length} errors`,
    );

    return {
      success: createdProducts.length > 0,
      created: createdProducts.length,
      total: products.length,
      errors: errors.length,
      errorDetails: errors,
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
