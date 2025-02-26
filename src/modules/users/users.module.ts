import { Module } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { PrismaService } from '@infra/databases/prisma/services/prisma.service';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaService, UsersRepository],
})
export class UsersModule {}
