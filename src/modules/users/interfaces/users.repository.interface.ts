import { User } from '@prisma/client';
import { BaseRepositoryInterface } from '@commons/interfaces/base.repository.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

export interface UsersRepositoryInterface
  extends Omit<
    BaseRepositoryInterface<User, CreateUserDto, UpdateUserDto>,
    'findAll' | 'delete' | 'update'
  > {}
