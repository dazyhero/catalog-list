import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { CatalogModule } from '../src/catalog/catalog.module';
import { PrismaClient } from '@prisma/client';
import * as cookieParser from 'cookie-parser';
import { HttpAdapterHost, Reflector } from '@nestjs/core';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaClient: PrismaClient;
  let cookie: string;
  let catalogId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, CatalogModule, PrismaClient],
    }).compile();

    prismaClient = moduleFixture.get<PrismaClient>(PrismaClient);

    await prismaClient.$executeRaw`TRUNCATE TABLE "Catalog" CASCADE;`;
    await prismaClient.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;

    app = moduleFixture.createNestApplication();

    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(
      new PrismaClientExceptionFilter(httpAdapter, {
        P2000: HttpStatus.BAD_REQUEST,
        P2002: HttpStatus.CONFLICT,
        P2025: HttpStatus.NOT_FOUND,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prismaClient.$disconnect();
  }, 30000);

  describe('/authentication', () => {
    it('shoud register a new user', async () => {
      const user = {
        email: 'newuser@e2e.test',
        password: '12345678',
      };

      const response = await request(app.getHttpServer())
        .post('/authentication/register')
        .send(user)
        .expect(201);

      expect(response.body).toEqual({
        id: expect.any(String),
        email: user.email,
      });
    });
    it('should login the user', async () => {
      const user = {
        email: 'newuser@e2e.test',
        password: '12345678',
      };

      const response = await request(app.getHttpServer())
        .post('/authentication/log-in')
        .send(user)
        .expect(200);

      cookie = response.header['set-cookie'][0];

      expect(response.body).toEqual({
        email: user.email,
        id: expect.any(String),
      });
      expect(response.header['set-cookie']).toBeDefined();
    });
  });
  describe('/catalog', () => {
    it('should create a new catalog', async () => {
      const catalog = {
        name: 'Test',
        locales: ['en', 'es'],
        vertical: 'FASHION',
        isPrimary: true,
      };

      const response = await request(app.getHttpServer())
        .post('/catalog')
        .set('Cookie', cookie)
        .send(catalog)
        .expect(201);

      catalogId = response.body.id;

      expect(response.body).toEqual({
        id: expect.any(String),
        name: catalog.name,
        isPrimary: catalog.isPrimary,
      });
    });
    it('should not create catalog if not authenticated', async () => {
      const catalog = {
        name: 'Test',
        locales: ['en', 'es'],
        vertical: 'FASHION',
        isPrimary: true,
      };
      await request(app.getHttpServer())
        .post('/catalog')
        .send(catalog)
        .expect(401);
    });

    it('should not create catalog if name is not unique', async () => {
      const catalog = {
        name: 'Test',
        locales: ['en', 'es'],
        vertical: 'FASHION',
        isPrimary: true,
      };

      await request(app.getHttpServer())
        .post('/catalog')
        .set('Cookie', cookie)
        .send(catalog)
        .expect(409);
    });

    it('should retrieve all catalogs', async () => {
      const catalogs = {
        name: 'Test',
        locales: ['en', 'es'],
        vertical: 'FASHION',
        isPrimary: true,
      };

      await request(app.getHttpServer())
        .get('/catalog')
        .set('Cookie', cookie)
        .expect(200);

      expect(catalogs.locales).toEqual(['en', 'es']);
      expect(catalogs.vertical).toEqual('FASHION');
    });

    it('should update a catalog', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/catalog/primary/${catalogId}`)
        .set('Cookie', cookie)
        .send({ isPrimary: false })
        .expect(200);

      expect(response.body.isPrimary).toBe(false);
    });

    it('should delete a catalog', async () => {
      await request(app.getHttpServer())
        .delete(`/catalog/${catalogId}`)
        .set('Cookie', cookie)
        .expect(200);
    });

    it('should delete multiple catalogs', async () => {
      const catalog2 = {
        name: 'Test1',
        locales: ['en', 'es'],
        vertical: 'HOME',
        isPrimary: true,
      };

      const response = await request(app.getHttpServer())
        .post('/catalog')
        .set('Cookie', cookie)
        .send(catalog2);

      await request(app.getHttpServer())
        .delete(`/catalog/bulk/${catalogId},${response.body.id}`)
        .set('Cookie', cookie)
        .expect(200);
    });
  });
});
