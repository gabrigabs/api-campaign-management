import { BaseServiceInterface } from '@commons/interfaces/base.service.interface';
import { Campaign } from '@prisma/client';
import { CreateCampaignDto } from '../dtos/create-campaign.dto';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto';
import { GetCampaignsQueryDto } from '../dtos/get-campaigns-query.dto';
import { PaginatedCampaignsResponseDto } from '../dtos/campaign-response.dto';

export interface CampaignsServiceInterface
  extends BaseServiceInterface<Campaign, CreateCampaignDto, UpdateCampaignDto> {
  paginateResults(
    query: GetCampaignsQueryDto,
  ): Promise<PaginatedCampaignsResponseDto>;

  findById(id: string): Promise<Campaign>;
}
