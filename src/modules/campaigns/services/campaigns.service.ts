import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CampaignsServiceInterface } from '../interfaces/campaigns.service.interface';
import { CreateCampaignDto } from '../dtos/create-campaign.dto';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto';
import {
  CAMPAIGNS_REPOSITORY,
  COMPANIES_SERVICE,
} from '@commons/consts/consts';
import { CampaignsRepositoryInterface } from '../interfaces/campaigns.repository.interface';
import { Campaign } from '@prisma/client';
import { GetCampaignsQueryDto } from '../dtos/get-campaigns-query.dto';
import {
  mountPaginateAndSearchParams,
  mountPaginatedResponse,
} from '@commons/utils/pagination.utils';
import { PaginatedCampaignsResponseDto } from '../dtos/campaign-response.dto';
import { CompaniesServiceInterface } from '@modules/companies/interfaces/companies.service.interface';

@Injectable()
export class CampaignsService implements CampaignsServiceInterface {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    @Inject(CAMPAIGNS_REPOSITORY)
    private readonly campaignsRepository: CampaignsRepositoryInterface,
    @Inject(COMPANIES_SERVICE)
    private readonly companiesService: CompaniesServiceInterface,
  ) {}

  async create(data: CreateCampaignDto): Promise<Campaign> {
    this.logger.log(`Creating campaign with name: ${data.name}`);

    await this.companiesService.verifyIfCompanyExistsById(data.company_id);
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

  async update(id: string, data: UpdateCampaignDto): Promise<Campaign> {
    this.logger.log(`Updating campaign with ID: ${id}`);

    await this.findById(id);
    return this.campaignsRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting campaign with ID: ${id}`);

    await this.findById(id);
    await this.campaignsRepository.delete(id);
  }

  async paginateResults(
    query: GetCampaignsQueryDto,
  ): Promise<PaginatedCampaignsResponseDto> {
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

  async findById(id: string): Promise<Campaign> {
    this.logger.log(`Finding campaign by ID: ${id}`);
    const campaign = await this.campaignsRepository.findBy({ id });

    if (!campaign) {
      this.logger.warn(`Campaign with ID: ${id} not found`);
      throw new HttpException('Campaign not found!', HttpStatus.NOT_FOUND);
    }

    return campaign;
  }
}
