import { PrismaService } from '@infra/databases/prisma/services/prisma.service';
import { Injectable } from '@nestjs/common';
import { Campaign } from '@prisma/client';
import { CampaignsRepositoryInterface } from '../interfaces/campaigns.repository.interface';
import { CreateCampaignDto } from '../dtos/create-campaign.dto';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CampaignsRepository implements CampaignsRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCampaignDto): Promise<Campaign> {
    return this.prisma.campaign.create({
      data: {
        id: randomUUID(),
        status: 'PENDING',
        ...data,
      },
    });
  }

  async findAll(): Promise<Campaign[]> {
    return this.prisma.campaign.findMany({
      include: {
        company: true,
      },
    });
  }

  async findBy(params: Partial<Campaign>): Promise<Campaign | null> {
    return this.prisma.campaign.findFirst({
      where: params,
    });
  }

  async update(id: string, data: UpdateCampaignDto): Promise<Campaign> {
    return this.prisma.campaign.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Campaign> {
    return this.prisma.campaign.delete({
      where: { id },
    });
  }
}
