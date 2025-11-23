
import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';

@ApiTags('Categories')
@Controller('api/categories')
@UseGuards(ApiKeyGuard)
@ApiSecurity('X-API-Key')
export class CategoriesController {
  private readonly logger = new Logger(CategoriesController.name);

  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all categories with product counts' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    this.logger.log('GET /api/categories');
    return this.categoriesService.findAll();
  }
}
