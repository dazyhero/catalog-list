import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import JwtAuthenticationGuard from '../authentication/guards/jwt-authentication.guard';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import RequestWithUser from 'src/authentication/interfaces/request-with-user.interface';
import { CatalogEntity } from './enitites/catalog.entity';
import { UpdatePrimaryDto } from './dto/update-primary.dto';
import { UpdateLocalesDto } from './dto/update-locales.dto';

@Controller('catalog')
@UseGuards(JwtAuthenticationGuard)
@ApiTags('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Post()
  @ApiOkResponse({ type: CatalogEntity })
  @ApiBody({ type: CreateCatalogDto })
  async create(
    @Body() catalogData: CreateCatalogDto,
    @Req() request: RequestWithUser,
  ) {
    const catalog = await this.catalogService.create(
      catalogData,
      request.user.id,
    );
    return new CatalogEntity(catalog);
  }

  @Patch('primary/:id')
  @ApiBody({ type: UpdatePrimaryDto })
  @ApiResponse({ type: CatalogEntity })
  async update(
    @Body() { isPrimary }: UpdatePrimaryDto,
    @Req() request: RequestWithUser,
  ) {
    const catalog = await this.catalogService.updatePrimary(
      request.params.id,
      isPrimary,
      request.user.id,
    );
    return new CatalogEntity(catalog);
  }

  @Patch('locales/:id')
  @ApiBody({ type: UpdateLocalesDto })
  @ApiResponse({ type: CatalogEntity })
  async updateLocales(
    @Body() { locales }: UpdateLocalesDto,
    @Req() request: RequestWithUser,
  ) {
    const catalog = await this.catalogService.updateLocales(
      request.params.id,
      locales,
      request.user.id,
    );
    return new CatalogEntity(catalog);
  }

  @Delete(':id')
  @ApiOkResponse()
  async delete(@Req() request: RequestWithUser) {
    return this.catalogService.delete(request.params.id, request.user.id);
  }

  @Delete('bulk/:ids')
  @ApiOkResponse()
  async deleteBatch(@Req() request: RequestWithUser) {
    return this.catalogService.deleteMany(
      request.params.ids.split(','),
      request.user.id,
    );
  }

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: CatalogEntity, isArray: true })
  async findAll(@Req() request: RequestWithUser) {
    const catalogs = await this.catalogService.findAll(request.user.id);

    const catalogsEntities = catalogs.map(
      ({ _count, ...catalog }) =>
        new CatalogEntity({
          ...catalog,
          isMultiLocale: _count.locales > 1,
        }),
    );
    return catalogsEntities;
  }
}
