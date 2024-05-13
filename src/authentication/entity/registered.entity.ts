import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class RegisteredEntity implements Partial<User> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;
}
