import { ApiProperty } from '@nestjs/swagger';
import { Locale } from '@prisma/client';

export class LocaleEntity implements Locale {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  constructor(partial: Partial<LocaleEntity>) {
    Object.assign(this, partial);
  }
}
