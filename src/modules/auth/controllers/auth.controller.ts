import { AUTH_SERVICE } from '@commons/consts/consts';

import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
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
    return this.authService.signUp(body);
  }
}
