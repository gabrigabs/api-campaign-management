import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/databases/prisma/prisma.module';
import { RabbitMQModule } from './infra/messaging/rabbitmq/rabbitmq.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './infra/databases/mongodb/services/mongoose-config.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RabbitMQModule,
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
