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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthResponseDto } from '@modules/dtos/auth-response.dto';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { CurrentUser } from '@commons/decorators/current-user.decorator';
import { CurrentUserDto } from '@commons/dtos/current-user.dto';
import { ErrorResponseDto } from '@commons/dtos/error-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthServiceInterface,
  ) {}

  @UseGuards(UserAuthGuard)
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user' })
  @ApiBody({
    description: 'User credentials',
    schema: {
      properties: {
        email: { type: 'string', description: 'Valid email' },
        password: { type: 'string', description: 'Valid password' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully authenticated',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  async signIn(@CurrentUser() user: CurrentUserDto) {
    this.logger.log(`API Request: Sign in - ${user.email}`);
    return this.authService.signIn(user);
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successfully registered',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  async signUp(@Body() body: RegisterUserDto) {
    this.logger.log(`API Request: Sign up - ${body.email}`);
    return this.authService.signUp(body);
  }
}
