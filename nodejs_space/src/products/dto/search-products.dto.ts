
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { PaginationDto } from '../../common/dto/pagination.dto';

export class SearchProductsDto extends PaginationDto {
  @ApiProperty({ example: 'iMac M1' })
  @IsString()
  q: string;

  @ApiPropertyOptional({ example: 'iMac' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'Apple' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'semi-novo' })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Include product images (default: true). Set to false for faster response.' 
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  includeImages?: boolean = true;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Maximum number of images to return per product (default: 1)' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  imageLimit?: number = 1;
}
