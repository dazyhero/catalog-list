import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserDto): Promise<UserEntity> {
    return this.prisma.user.create({ data: user });
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) {
      return user;
    }

    throw new HttpException(
      "User with this email doesn't  exist",
      HttpStatus.NOT_FOUND,
    );
  }

  async getById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException(
      "User with this id doesn't exist",
      HttpStatus.NOT_FOUND,
    );
  }
}
