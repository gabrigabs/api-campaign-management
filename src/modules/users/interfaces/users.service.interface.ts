import { BaseServiceInterface } from '@commons/interfaces/base.service.interface';
import { User } from '@prisma/client';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

export interface UsersServiceInterface
  extends BaseServiceInterface<User, CreateUserDto, UpdateUserDto> {}
