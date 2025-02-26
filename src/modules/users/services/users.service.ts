import { Inject, Injectable, Logger } from '@nestjs/common';
import { UsersServiceInterface } from '../interfaces/users.service.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { USERS_REPOSITORY } from '@commons/consts/consts';
import { UsersRepositoryInterface } from '../interfaces/users.repository.interface';
import { User } from '@prisma/client';

@Injectable()
export class UsersService implements UsersServiceInterface {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
  ) {}
  create(data: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with email: ${data.email}`);
    return this.usersRepository.create(data);
  }
  findAll(): Promise<User[]> {
    this.logger.log('Fetching all users');
    return this.usersRepository.findAll();
  }
  findBy(params: Partial<User>): Promise<User | null> {
    this.logger.log(`Finding user by: ${JSON.stringify(params)}`);
    return this.usersRepository.findBy(params);
  }
  update(id: string, data: UpdateUserDto): Promise<User> {
    this.logger.log(`Updating user with ID: ${id}`);
    return this.usersRepository.update(id, data);
  }
  delete(id: string): Promise<User> {
    this.logger.log(`Deleting user with ID: ${id}`);
    return this.usersRepository.delete(id);
  }
}
