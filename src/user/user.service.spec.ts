import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { HttpException } from '@nestjs/common';

describe('The UsersService', () => {
  let usersService: UserService;
  let findUniqueMock: jest.Mock;
  beforeEach(async () => {
    findUniqueMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: findUniqueMock,
            },
          },
        },
      ],
    }).compile();

    usersService = await module.get(UserService);
  });
  describe('when the getByEmail function is called', () => {
    describe('and the findUnique method returns the user', () => {
      let user: User;
      beforeEach(() => {
        user = {
          id: '1',
          email: 'john@smith.com',
          password: 'strongPassword123',
        };
        findUniqueMock.mockResolvedValue(user);
      });
      it('should return the user', async () => {
        const result = await usersService.getByEmail(user.email);
        expect(result).toBe(user);
      });
    });
    describe('and the findUnique method does not return the user', () => {
      beforeEach(() => {
        findUniqueMock.mockResolvedValue(undefined);
      });
      it('should throw the UserNotFoundException', async () => {
        return expect(async () => {
          await usersService.getByEmail('john@smith.com');
        }).rejects.toThrow(HttpException);
      });
    });
  });
});
