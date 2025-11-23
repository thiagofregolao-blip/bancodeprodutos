
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BulkCreateProductsDto } from './dto/bulk-create-products.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { RequiresAdmin } from '../common/decorators/requires-admin.decorator';

@ApiTags('Admin - Products')
@Controller('api/admin/products')
@UseGuards(ApiKeyGuard)
@RequiresAdmin()
@ApiSecurity('X-API-Key')
export class AdminProductsController {
  private readonly logger = new Logger(AdminProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product (Admin only)' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createProductDto: CreateProductDto) {
    this.logger.log(`POST /api/admin/products - Creating: ${createProductDto.name}`);
    return this.productsService.create(createProductDto);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Create multiple products in bulk (Admin only)' })
  @ApiResponse({ status: 201, description: 'Products created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  bulkCreate(@Body() bulkCreateDto: BulkCreateProductsDto) {
    this.logger.log(
      `POST /api/admin/products/bulk - Creating ${bulkCreateDto.products.length} products`,
    );
    return this.productsService.bulkCreate(bulkCreateDto.products);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    this.logger.log(`PATCH /api/admin/products/${id}`);
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product (Admin only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`DELETE /api/admin/products/${id}`);
    return this.productsService.remove(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get product statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getStats() {
    this.logger.log('GET /api/admin/products/stats');
    return this.productsService.getStats();
  }
}
