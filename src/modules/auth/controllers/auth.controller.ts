import { AUTH_SERVICE } from '@commons/consts/consts';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthServiceInterface } from '../interfaces/auth.service.interface';
import { RegisterUserDto } from '@modules/dtos/register-user.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from '@modules/dtos/auth-response.dto';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { CurrentUser } from '@commons/decorators/current-user.decorator';
import { CurrentUserDto } from '@commons/dtos/current-user.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthServiceInterface,
  ) {}

  @UseGuards(UserAuthGuard)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autenticar usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso',
    type: AuthResponseDto,
  })
  async signIn(@CurrentUser() user: CurrentUserDto) {
    this.logger.log(`API Request: Sign in - ${user.email}`);
    return this.authService.signIn(user);
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Registrar usuário' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Registro realizado com sucesso',
    type: AuthResponseDto,
  })
  async signUp(@Body() body: RegisterUserDto) {
    this.logger.log(`API Request: Sign up - ${body.email}`);
    return this.authService.signUp(body);
  }
}
