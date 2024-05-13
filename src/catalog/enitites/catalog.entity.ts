import { ApiProperty } from '@nestjs/swagger';
import { Catalog } from '@prisma/client';
import { VerticalEntity } from '../../vertical/entities/vertical.entity';
import { LocaleEntity } from '../../locale/entities/locale.entity';
import { Exclude } from 'class-transformer';

export class CatalogEntity implements Catalog {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  isPrimary: boolean;

  locales: LocaleEntity[];

  @Exclude()
  localeIds: string[];

  @ApiProperty({ type: VerticalEntity })
  vertical?: VerticalEntity;

  @Exclude()
  verticalId: string;

  @Exclude()
  userId: string;

  @ApiProperty()
  isMultiLocale: boolean;

  constructor({ locales, vertical, ...partial }: Partial<CatalogEntity>) {
    Object.assign(this, partial);
    if (locales) {
      this.locales = locales.map((locale) => new LocaleEntity(locale));
    }
    if (vertical) {
      this.vertical = new VerticalEntity(vertical);
    }
  }
}
