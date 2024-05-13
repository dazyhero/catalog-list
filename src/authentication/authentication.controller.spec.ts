import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthenticationController } from './authentication.controller';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';

describe('The AuthenticationController', () => {
  let createUserMock: jest.Mock;
  let app: INestApplication;
  beforeEach(async () => {
    createUserMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: createUserMock,
            },
          },
        },
      ],
      controllers: [AuthenticationController],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secretOrPrivateKey: 'Secret key',
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });
  describe('when the register endpoint is called', () => {
    describe('and valid data is provided', () => {
      let user: UserEntity;
      beforeEach(async () => {
        user = {
          id: '1',
          email: 'john@smith.com',
          password: 'strongPassword',
        };
      });
      describe('and the user is successfully created in the database', () => {
        beforeEach(() => {
          createUserMock.mockResolvedValue(user);
        });
        it('should return the new user without the password', async () => {
          return request(app.getHttpServer())
            .post('/authentication/register')
            .send({
              email: user.email,
              password: user.password,
            })
            .expect({
              id: user.id,
              email: user.email,
            });
        });
      });
    });
  });
});
