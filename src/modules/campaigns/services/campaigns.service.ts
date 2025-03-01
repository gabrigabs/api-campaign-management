import { Inject, Injectable, Logger } from '@nestjs/common';
import { CampaignsServiceInterface } from '../interfaces/campaigns.service.interface';
import { CreateCampaignDto } from '../dtos/create-campaign.dto';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto';
import { CAMPAIGNS_REPOSITORY } from '@commons/consts/consts';
import { CampaignsRepositoryInterface } from '../interfaces/campaigns.repository.interface';
import { Campaign } from '@prisma/client';
import { GetCampaignsQueryDto } from '../dtos/get-campaigns-query.dto';
import {
  mountPaginateAndSearchParams,
  mountPaginatedResponse,
} from '@commons/utils/pagination.utils';
import { PaginatedQueryDto } from '@commons/dtos/paginated-query.dto';

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

  findAll(query: GetCampaignsQueryDto): Promise<Campaign[]> {
    const { skip, take, where } = mountPaginateAndSearchParams(query);
    this.logger.log('Fetching all campaigns');
    return this.campaignsRepository.findAll(skip, take, where);
  }

  findBy(params: Partial<Campaign>): Promise<Campaign | null> {
    this.logger.log(`Finding campaign by: ${JSON.stringify(params)}`);
    return this.campaignsRepository.findBy(params);
  }

  update(id: string, data: UpdateCampaignDto): Promise<Campaign> {
    this.logger.log(`Updating campaign with ID: ${id}`);
    return this.campaignsRepository.update(id, data);
  }

  async paginateResults(
    query: GetCampaignsQueryDto,
  ): Promise<PaginatedQueryDto> {
    const results = await this.findAll(query);
    const total = results.length;

    this.logger.log(`Paginating ${total} items`);

    const paginatedResults = mountPaginatedResponse<Campaign>(
      query,
      results,
      total,
    );

    return paginatedResults;
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting campaign with ID: ${id}`);
    await this.campaignsRepository.delete(id);
  }
}
