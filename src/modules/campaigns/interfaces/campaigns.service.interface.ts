import { BaseServiceInterface } from '@commons/interfaces/base.service.interface';
import { Campaign } from '@prisma/client';
import { CreateCampaignDto } from '../dtos/create-campaign.dto';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto';
import { GetCampaignsQueryDto } from '../dtos/get-campaigns-query.dto';
import { PaginatedQueryDto } from '@commons/dtos/paginated-query.dto';

export interface CampaignsServiceInterface
  extends BaseServiceInterface<Campaign, CreateCampaignDto, UpdateCampaignDto> {
  paginateResults(query: GetCampaignsQueryDto): Promise<PaginatedQueryDto>;
}
