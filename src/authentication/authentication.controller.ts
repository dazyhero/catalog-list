import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RegisteredEntity } from './entity/registered.entity';
import { LocalAuthenticationGuard } from './guards/local-authentication.guard';
import RequestWithUser from './interfaces/request-with-user.interface';
import { UserEntity } from '../user/entities/user.entity';

@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  @ApiCreatedResponse({ type: RegisteredEntity })
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  @ApiOkResponse({ type: RegisteredEntity })
  @ApiBody({ type: RegisterDto })
  @UseInterceptors(ClassSerializerInterceptor)
  async logIn(@Req() request: RequestWithUser) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
    request.res.setHeader('Set-Cookie', cookie);
    return new UserEntity(user);
  }
}
