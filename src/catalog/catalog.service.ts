import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { PrismaClient, VerticalEnum } from '@prisma/client';

type TransactionalPrismaClient = Parameters<
  Parameters<PrismaClient['$transaction']>[0]
>[0];

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  async deleteMany(ids: string[], userId: string) {
    await this.prisma.catalog.deleteMany({
      where: { id: { in: ids }, userId },
    });
  }

  async delete(id: string, userId: string) {
    await this.prisma.catalog.delete({ where: { id, userId } });
  }

  async getAll(userId: string) {
    return this.prisma.catalog.findMany({ where: { userId } });
  }

  private async _updatePrimary(
    tx: TransactionalPrismaClient,
    vertical: VerticalEnum,
    userId: string,
    currentId?: string,
  ) {
    const where = currentId
      ? { id: { not: currentId } }
      : { userId, isPrimary: true, vertical: { name: vertical } };
    const existingPrimaryCatalog = await tx.catalog.findFirst({
      where,
    });

    if (existingPrimaryCatalog) {
      await tx.catalog.update({
        where: { id: existingPrimaryCatalog.id },
        data: { isPrimary: false },
      });
    }
  }

  async updateLocales(id: string, locales: string[], userId: string) {
    const catalog = await this.prisma.catalog.update({
      where: { id, userId },
      data: {
        locales: {
          deleteMany: {},
          create: locales.map((locale) => ({
            locale: {
              connectOrCreate: {
                where: { name: locale },
                create: { name: locale },
              },
            },
          })),
        },
      },
    });
    return catalog;
  }

  async updatePrimary(id: string, isPrimary: boolean, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      if (isPrimary) {
        const { vertical } = await tx.catalog.findUnique({
          where: { id },
          include: {
            vertical: {
              select: { name: true },
            },
          },
        });

        await this._updatePrimary(tx, vertical.name, userId, id);
      }

      const catalog = await tx.catalog.update({
        where: { id, userId },
        data: { isPrimary },
      });

      return catalog;
    });
  }

  async create(data: CreateCatalogDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const { vertical, locales, ...catalogData } = data;
      if (data.isPrimary) {
        await this._updatePrimary(tx, vertical, userId, null);
      }

      const catalog = await tx.catalog.create({
        data: {
          ...catalogData,
          user: { connect: { id: userId } },
          vertical: { connect: { name: vertical } },
          locales: {
            create: locales.map((locale) => ({
              locale: {
                connectOrCreate: {
                  where: { name: locale },
                  create: { name: locale },
                },
              },
            })),
          },
        },
      });
      return catalog;
    });
  }

  async findAll(userId: string) {
    return this.prisma.catalog.findMany({
      where: { userId },
      include: {
        vertical: true,
        _count: {
          select: { locales: true },
        },
      },
    });
  }
}
