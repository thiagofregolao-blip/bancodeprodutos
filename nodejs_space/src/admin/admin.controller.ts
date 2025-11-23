
import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
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
}
