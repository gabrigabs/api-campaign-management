import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/databases/prisma/prisma.module';
import { RabbitMQModule } from './infra/messaging/rabbitmq/rabbitmq.module';

import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RabbitMQModule,
    UsersModule,
    AuthModule,
    CompaniesModule,
    CampaignsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
