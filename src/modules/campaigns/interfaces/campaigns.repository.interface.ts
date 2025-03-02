import { Campaign } from '@prisma/client';
import { BaseRepositoryInterface } from '@commons/interfaces/base.repository.interface';
import { CreateCampaignDto } from '../dtos/create-campaign.dto';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto';

export interface CampaignsRepositoryInterface
  extends BaseRepositoryInterface<
    Campaign,
    CreateCampaignDto,
    UpdateCampaignDto
  > {}
