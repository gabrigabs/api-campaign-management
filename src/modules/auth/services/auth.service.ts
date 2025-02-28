import { USERS_SERVICE } from '@commons/consts/consts';
import { UsersServiceInterface } from '@modules/users/interfaces/users.service.interface';
import { HttpException, HttpStatus, Inject, Logger } from '@nestjs/common';
import { AuthServiceInterface } from '../interfaces/auth.service.interface';
import { UserLoginDto } from '@modules/dtos/user-login.dto';
import { comparePassword, hashPassword } from '@commons/utils/password.util';
import { User } from '@prisma/client';
import { AuthResponseDto } from '@modules/dtos/auth-response.dto';
import { JwtService } from '@nestjs/jwt';
import { CurrentUserDto } from '@commons/dtos/current-user.dto';

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

  async signUp(user: UserLoginDto): Promise<AuthResponseDto> {
    this.logger.log(`Signing up user with email: ${user.email}`);

    const userExists = await this.usersService.findBy({
      email: user.email,
    });

    if (userExists) {
      this.logger.warn(`User with email ${user.email} already exists`);
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await hashPassword(user.password);
    const userCreated = await this.usersService.create({
      ...user,
      password: hashedPassword,
    });

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
