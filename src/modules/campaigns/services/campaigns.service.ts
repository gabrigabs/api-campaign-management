import { Inject, Injectable, Logger } from '@nestjs/common';
import { CampaignsServiceInterface } from '../interfaces/campaigns.service.interface';
import { CreateCampaignDto } from '../dtos/create-campaign.dto';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto';
import { CAMPAIGNS_REPOSITORY } from '@commons/consts/consts';
import { CampaignsRepositoryInterface } from '../interfaces/campaigns.repository.interface';
import { Campaign } from '@prisma/client';

@Injectable()
export class CampaignsService implements CampaignsServiceInterface {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    @Inject(CAMPAIGNS_REPOSITORY)
    private readonly campaignsRepository: CampaignsRepositoryInterface,
  ) {}

  create(data: CreateCampaignDto): Promise<Campaign> {
    this.logger.log(`Creating campaign with name: ${data.name}`);
    return this.campaignsRepository.create(data);
  }

  findAll(): Promise<Campaign[]> {
    this.logger.log('Fetching all campaigns');
    return this.campaignsRepository.findAll();
  }

  findBy(params: Partial<Campaign>): Promise<Campaign | null> {
    this.logger.log(`Finding campaign by: ${JSON.stringify(params)}`);
    return this.campaignsRepository.findBy(params);
  }

  update(id: string, data: UpdateCampaignDto): Promise<Campaign> {
    this.logger.log(`Updating campaign with ID: ${id}`);
    return this.campaignsRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting campaign with ID: ${id}`);
    await this.campaignsRepository.delete(id);
  }
}
