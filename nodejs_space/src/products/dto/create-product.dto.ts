
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsObject,
  IsDateString,
  Min,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ImageDto {
  @ApiProperty()
  @IsString()
  url: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  order?: number;
}

export class CreateProductDto {
  @ApiProperty({ example: 'iMac 24" M1 2021' })
  @IsString()
  name: string;

  @ApiProperty({
    example:
      'iMac 24 polegadas com chip M1, 8GB RAM, 256GB SSD. Estado: Semi-novo.',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 8500.0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'iMac' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ example: 'semi-novo' })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiPropertyOptional({ example: 'Apple' })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({ example: 'iMac 24" M1' })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiPropertyOptional({
    example: { processor: 'Apple M1', ram: '8GB', storage: '256GB SSD' },
  })
  @IsOptional()
  @IsObject()
  specs?: any;

  @ApiPropertyOptional({ example: 'https://example.com/product' })
  @IsOptional()
  @IsString()
  urlOriginal?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  extractionDate?: string;

  @ApiPropertyOptional({
    type: [ImageDto],
    example: [
      { url: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh5dDLsWBxgmgEyiEP4ZUVap0wpTOb126jzYsNmlbg7RXW9HsDM0OTSzA5uuvVpxjqsqVwM35enX-0p9ngY_p3LWLEs2Pn8ex0EDaDyeqLdqEjehMjkX32NKrC89Hph7X7qNoYTSC1fO0U/s1600/LabelImg+4.PNG', order: 1 },
      { url: 'https://i.ytimg.com/vi/KELqVT7hjeE/maxresdefault.jpg', order: 2 },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  images?: ImageDto[];
}
