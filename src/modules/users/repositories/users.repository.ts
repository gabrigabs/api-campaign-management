import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersRepositoryInterface } from '../interfaces/users.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { PrismaService } from '@infra/databases/prisma/services/prisma.service';
import { User } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
  private readonly logger = new Logger(UsersRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    try {
      this.logger.log(`Creating user with email: ${data.email}`);

      const user = await this.prismaService.user.create({
        data: { id: createId(), ...data },
      });
      this.logger.log(`User created successfully with ID: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error('Failed to create user', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBy(params: Partial<User>): Promise<User | null> {
    try {
      this.logger.log(`Finding user by: ${JSON.stringify(params)}`);
      const user = await this.prismaService.user.findFirst({ where: params });
      this.logger.log(
        user ? `User found with ID: ${user.id}` : 'User not found',
      );
      return user;
    } catch (error) {
      this.logger.error('Failed to find User', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
