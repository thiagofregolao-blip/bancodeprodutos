
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
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
}
