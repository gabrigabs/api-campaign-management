import { PrismaService } from '@infra/databases/prisma/services/prisma.service';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Campaign } from '@prisma/client';
import { CampaignsRepositoryInterface } from '../interfaces/campaigns.repository.interface';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class CampaignsRepository implements CampaignsRepositoryInterface {
  private readonly logger = new Logger(CampaignsRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<Campaign, 'id'>): Promise<Campaign> {
    try {
      this.logger.log(`Creating campaign with name: ${data.name}`);

      const campaign = await this.prisma.campaign.create({
        data: {
          id: createId(),
          ...data,
        },
      });

      this.logger.log(`Campaign created successfully with ID: ${campaign.id}`);
      return campaign;
    } catch (error) {
      this.logger.error('Failed to create campaign', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(
    skip: number,
    take: number,
    where?: Partial<Campaign>,
  ): Promise<Campaign[]> {
    try {
      this.logger.log('Fetching all campaigns');

      const campaigns = await this.prisma.campaign.findMany({
        skip,
        take,
        where,
      });

      this.logger.log(`Retrieved ${campaigns.length} campaigns`);
      return campaigns;
    } catch (error) {
      this.logger.error('Failed to fetch campaigns', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBy(params: Partial<Campaign>): Promise<Campaign | null> {
    try {
      this.logger.log(`Finding campaign by: ${JSON.stringify(params)}`);

      const campaign = await this.prisma.campaign.findFirst({
        where: params,
      });

      this.logger.log(
        campaign
          ? `Campaign found with params: ${JSON.stringify(params)}`
          : 'Campaign not found',
      );
      return campaign;
    } catch (error) {
      this.logger.error('Failed to find campaign', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateCampaignDto): Promise<Campaign> {
    try {
      this.logger.log(`Updating campaign with ID: ${id}`);

      const campaign = await this.prisma.campaign.update({
        where: { id },
        data,
        include: {
          company: true,
        },
      });

      this.logger.log(`Campaign updated successfully`);
      return campaign;
    } catch (error) {
      this.logger.error('Failed to update campaign', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting campaign with ID: ${id}`);

      await this.prisma.campaign.delete({
        where: { id },
        include: {
          company: true,
        },
      });

      this.logger.log(`Campaign deleted successfully`);
    } catch (error) {
      this.logger.error('Failed to delete campaign', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
