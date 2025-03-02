import { Module } from '@nestjs/common';
import { CompaniesRepository } from './repositories/companies.repository';
import { PrismaService } from '@infra/databases/prisma/services/prisma.service';
import {
  COMPANIES_REPOSITORY,
  COMPANIES_SERVICE,
} from '@commons/consts/consts';
import { CompaniesService } from './services/companies.service';
import { CompaniesRepositoryInterface } from './interfaces/companies.repository.interface';
import { CompaniesController } from './controllers/companies.controller';

@Module({
  imports: [],
  controllers: [CompaniesController],
  providers: [
    PrismaService,
    { provide: COMPANIES_REPOSITORY, useClass: CompaniesRepository },
    {
      provide: COMPANIES_SERVICE,
      useFactory: (companiesRepository: CompaniesRepositoryInterface) =>
        new CompaniesService(companiesRepository),
      inject: [COMPANIES_REPOSITORY],
    },
    {
      provide: CompaniesService,
      useExisting: COMPANIES_SERVICE,
    },
  ],
  exports: [COMPANIES_SERVICE, CompaniesService],
})
export class CompaniesModule {}
