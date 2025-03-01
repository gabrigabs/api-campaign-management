import { Module } from '@nestjs/common';
import { CampaignsRepository } from './repositories/campaigns.repository';
import { PrismaService } from '@infra/databases/prisma/services/prisma.service';
import {
  CAMPAIGNS_REPOSITORY,
  CAMPAIGNS_SERVICE,
  COMPANIES_SERVICE,
} from '@commons/consts/consts';
import { CampaignsService } from './services/campaigns.service';
import { CampaignsRepositoryInterface } from './interfaces/campaigns.repository.interface';
import { CampaignsController } from './controllers/campaigns.controller';
import { CompaniesServiceInterface } from '@modules/companies/interfaces/companies.service.interface';
import { CompaniesModule } from '@modules/companies/companies.module';

@Module({
  imports: [CompaniesModule],
  controllers: [CampaignsController],
  providers: [
    PrismaService,
    { provide: CAMPAIGNS_REPOSITORY, useClass: CampaignsRepository },
    {
      provide: CAMPAIGNS_SERVICE,
      useFactory: (
        campaignsRepository: CampaignsRepositoryInterface,
        companiesService: CompaniesServiceInterface,
      ) => new CampaignsService(campaignsRepository, companiesService),
      inject: [CAMPAIGNS_REPOSITORY, COMPANIES_SERVICE],
    },
    {
      provide: CampaignsService,
      useExisting: CAMPAIGNS_SERVICE,
    },
  ],
  exports: [CAMPAIGNS_SERVICE, CampaignsService],
})
export class CampaignsModule {}
