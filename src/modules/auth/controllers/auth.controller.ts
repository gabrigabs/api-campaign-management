import { AUTH_SERVICE } from '@commons/consts/consts';

import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AuthServiceInterface } from '../interfaces/auth.service.interface';
import { RegisterUserDto } from '@modules/dtos/register-user.dto';
import { UserLoginDto } from '@modules/dtos/user-login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthServiceInterface,
  ) {}

  @Post('sign-in')
  async signIn(@Body() body: UserLoginDto) {
    return this.authService.signIn(body.email, body.password);
  }
  @Post('sign-up')
  async signUp(@Body() body: RegisterUserDto) {
    return this.authService.signUp(body);
  }
}
