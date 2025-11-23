
import { Controller, Post, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';

@ApiTags('Seed')
@Controller('api/seed')
export class SeedController {
  private readonly logger = new Logger(SeedController.name);

  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Initialize database with seed data (API keys, categories, sample product)',
    description: 'This endpoint creates initial API keys and sample data. Run once on first deployment.'
  })
  @ApiResponse({ status: 201, description: 'Database seeded successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async seed() {
    this.logger.log('POST /api/seed - Seeding database');
    return this.seedService.seed();
  }
}
