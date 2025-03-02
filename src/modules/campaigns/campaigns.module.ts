import { Module } from '@nestjs/common';
import { CampaignsRepository } from './repositories/campaigns.repository';
import { PrismaService } from '@infra/databases/prisma/services/prisma.service';
import {
  CAMPAIGNS_REPOSITORY,
  CAMPAIGNS_SERVICE,
} from '@commons/consts/consts';
import { CampaignsService } from './services/campaigns.service';
import { CampaignsRepositoryInterface } from './interfaces/campaigns.repository.interface';
import { CampaignsController } from './controllers/campaigns.controller';
import { CompaniesModule } from '@modules/companies/companies.module';
import { RabbitMQModule } from '@infra/messaging/rabbitmq/rabbitmq.module';
import { RabbitMQService } from '@infra/messaging/rabbitmq/services/rabbitmq.service';

@Module({
  imports: [CompaniesModule, RabbitMQModule],
  controllers: [CampaignsController],
  providers: [
    PrismaService,
    { provide: CAMPAIGNS_REPOSITORY, useClass: CampaignsRepository },
    {
      provide: CAMPAIGNS_SERVICE,
      useFactory: (
        campaignsRepository: CampaignsRepositoryInterface,
        rabbitMQService: RabbitMQService,
      ) => new CampaignsService(campaignsRepository, rabbitMQService),
      inject: [CAMPAIGNS_REPOSITORY, RabbitMQService],
    },
    {
      provide: CampaignsService,
      useExisting: CAMPAIGNS_SERVICE,
    },
  ],
  exports: [CAMPAIGNS_SERVICE, CampaignsService],
})
export class CampaignsModule {}
