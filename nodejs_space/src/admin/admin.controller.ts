
import { Controller, Get, Post, Body, UseGuards, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { ApiKeyGuard } from '../common/guards/api-key.guard';
import { RequiresAdmin } from '../common/decorators/requires-admin.decorator';

@ApiTags('Admin')
@Controller('api/admin')
@UseGuards(ApiKeyGuard)
@RequiresAdmin()
@ApiSecurity('X-API-Key')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get overall statistics (Admin only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getStats() {
    this.logger.log('GET /api/admin/stats');
    return this.adminService.getStats();
  }

  @Post('fix-product-names')
  @ApiOperation({ summary: 'Fix product names (remove descriptions from names)' })
  @ApiResponse({ status: 200, description: 'Product names fixed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  fixProductNames() {
    this.logger.log('POST /api/admin/fix-product-names');
    return this.adminService.fixProductNames();
  }

  @Post('clear-database')
  @ApiOperation({ summary: 'Clear database - delete products and/or categories' })
  @ApiResponse({ status: 200, description: 'Database cleared successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async clearDatabase(@Body() body: { products?: boolean; categories?: boolean }) {
    this.logger.log('POST /api/admin/clear-database', body);
    return this.adminService.clearDatabase(body.products, body.categories);
  }
}
