import { ApiProperty } from '@nestjs/swagger';
import { VerticalEnum } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateCatalogDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isPrimary: boolean;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  locales: string[];

  @ApiProperty()
  @IsEnum(VerticalEnum)
  vertical: VerticalEnum;
}
