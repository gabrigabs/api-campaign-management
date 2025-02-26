import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { PrismaService } from '@infra/databases/prisma/services/prisma.service';
import { USERS_REPOSITORY, USERS_SERVICE } from '@commons/consts/consts';
import { UsersService } from './services/users.service';
import { UsersRepositoryInterface } from './interfaces/users.repository.interface';

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    { provide: USERS_REPOSITORY, useClass: UsersRepository },
    {
      provide: USERS_SERVICE,
      useFactory: (usersRepository: UsersRepositoryInterface) =>
        new UsersService(usersRepository),
      inject: [USERS_REPOSITORY],
    },
    {
      provide: UsersService,
      useExisting: USERS_SERVICE,
    },
  ],
})
export class UsersModule {}
