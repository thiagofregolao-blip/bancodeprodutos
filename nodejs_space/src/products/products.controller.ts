
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductsDto } from './dto/filter-products.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { BulkCreateProductsDto } from './dto/bulk-create-products.dto';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { RequiresAdmin } from '../common/decorators/requires-admin.decorator';

@ApiTags('Products')
@Controller('api/products')
@UseGuards(ApiKeyGuard)
@ApiSecurity('X-API-Key')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'List all products with filters and pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll(@Query() filterDto: FilterProductsDto) {
    this.logger.log(`GET /api/products - Filters: ${JSON.stringify(filterDto)}`);
    return this.productsService.findAll(filterDto);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by query string' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  search(@Query() searchDto: SearchProductsDto) {
    this.logger.log(`GET /api/products/search - Query: ${searchDto.q}`);
    return this.productsService.search(searchDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product details by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    this.logger.log(`GET /api/products/${id}`);
    return this.productsService.findOne(id);
  }
}
