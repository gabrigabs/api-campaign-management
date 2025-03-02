import { USERS_SERVICE } from '@commons/consts/consts';
import { UsersServiceInterface } from '@modules/users/interfaces/users.service.interface';
import { Inject, Logger } from '@nestjs/common';
import { AuthServiceInterface } from '../interfaces/auth.service.interface';
import { UserLoginDto } from '@modules/dtos/user-login.dto';
import { comparePassword } from '@commons/utils/password.util';
import { User } from '@prisma/client';
import { AuthResponseDto } from '@modules/dtos/auth-response.dto';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserDto } from '@commons/dtos/current-user.dto';
import { CreateUserDto } from '@modules/users/dtos/create-user.dto';

export class AuthService implements AuthServiceInterface {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(USERS_SERVICE) private readonly usersService: UsersServiceInterface,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(
    user: UserLoginDto,
  ): Promise<Omit<User, 'password'> | null> {
    this.logger.log(`Validating user with email: ${user.email}`);

    const userFound = await this.usersService.findBy({ email: user.email });

    if (!userFound) {
      this.logger.warn(`Invalid email for user with email ${user.email}`);
      return null;
    }

    const isPasswordValid = await comparePassword(
      user.password,
      userFound.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(`Invalid password  for user with email ${user.email}`);
      return null;
    }

    Object.assign(userFound, { password: undefined });

    return userFound;
  }

  async signUp(user: CreateUserDto): Promise<AuthResponseDto> {
    this.logger.log(`Signing up user with email: ${user.email}`);

    const userCreated = await this.usersService.create(user);

    return this.signIn({
      id: userCreated.id,
      email: userCreated.email,
      company_id: userCreated.company_id,
    });
  }

  async signIn(user: CurrentUserDto): Promise<AuthResponseDto> {
    this.logger.log(`Signing in user: ${user.email}`);

    const payload = {
      id: user.id,
      email: user.email,
      company_id: user.company_id,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return { access_token: accessToken };
  }
}
