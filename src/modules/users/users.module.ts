import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { PrismaService } from '@infra/databases/prisma/services/prisma.service';
import {
  COMPANIES_SERVICE,
  USERS_REPOSITORY,
  USERS_SERVICE,
} from '@commons/consts/consts';
import { UsersService } from './services/users.service';
import { UsersRepositoryInterface } from './interfaces/users.repository.interface';
import { CompaniesModule } from '@modules/companies/companies.module';
import { CompaniesServiceInterface } from '@modules/companies/interfaces/companies.service.interface';
@Module({
  imports: [CompaniesModule],
  controllers: [],
  providers: [
    PrismaService,
    { provide: USERS_REPOSITORY, useClass: UsersRepository },
    {
      provide: USERS_SERVICE,
      useFactory: (
        usersRepository: UsersRepositoryInterface,
        companiesService: CompaniesServiceInterface,
      ) => new UsersService(usersRepository, companiesService),
      inject: [USERS_REPOSITORY, COMPANIES_SERVICE],
    },
    {
      provide: UsersService,
      useExisting: USERS_SERVICE,
    },
  ],
  exports: [USERS_SERVICE, UsersService],
})
export class UsersModule {}
