import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdatePrimaryDto {
  @ApiProperty()
  @IsBoolean()
  isPrimary: boolean;
}
