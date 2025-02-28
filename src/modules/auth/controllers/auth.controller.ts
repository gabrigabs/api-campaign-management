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
import { UserLoginDto } from '@modules/dtos/user-login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthResponseDto } from '@modules/dtos/auth-response.dto';
import { UserAuthGuard } from '../guards/user-auth.guard';

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
  async signIn(@Body() body: UserLoginDto) {
    this.logger.log(`API Request: Sign in - ${body.email}`);
    return this.authService.signIn(body.email, body.password);
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
    this.logger.log(`API Request: Sign up - ${JSON.stringify(body)}`);
    return this.authService.signUp(body);
  }
}
