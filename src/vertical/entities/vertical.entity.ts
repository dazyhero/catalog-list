import { ApiProperty } from '@nestjs/swagger';
import { Vertical, VerticalEnum } from '@prisma/client';

export class VerticalEntity implements Vertical {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: VerticalEnum;

  constructor(partial: Partial<VerticalEntity>) {
    Object.assign(this, partial);
  }
}
