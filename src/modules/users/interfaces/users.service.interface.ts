import { BaseServiceInterface } from '@commons/interfaces/base.service.interface';
import { User } from '@prisma/client';

import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

export interface UsersServiceInterface
  extends Omit<
    BaseServiceInterface<User, CreateUserDto, UpdateUserDto>,
    'findAll' | 'delete' | 'update'
  > {}
