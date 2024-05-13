import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class UpdateLocalesDto {
  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  locales: string[];
}
