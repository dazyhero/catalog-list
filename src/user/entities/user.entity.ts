import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';
import { CatalogEntity } from '../../catalog/enitites/catalog.entity';

export class UserEntity implements User {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @ApiProperty({ required: false, nullable: true })
  catalogId?: string;

  @ApiProperty({ required: false, type: CatalogEntity })
  catalog?: CatalogEntity;

  constructor({ catalog, ...partial }: Partial<UserEntity>) {
    Object.assign(this, partial);
    if (catalog) {
      this.catalog = new CatalogEntity(catalog);
    }
  }
}
