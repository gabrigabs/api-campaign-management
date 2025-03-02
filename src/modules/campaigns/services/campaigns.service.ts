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
} from '@commons/utils/pagination.util';
import { PaginatedCampaignsResponseDto } from '../dtos/campaign-response.dto';
import { CampaignStatusEnum } from '@commons/enums/campaign-status.enum';
import { getPhonesFromFile } from '@commons/utils/phone.util';
import { RabbitMQService } from '@infra/messaging/rabbitmq/services/rabbitmq.service';
import { CompaniesService } from '@modules/companies/services/companies.service';

@Injectable()
export class CampaignsService implements CampaignsServiceInterface {
  private readonly logger = new Logger(CampaignsService.name);

  constructor(
    @Inject(CAMPAIGNS_REPOSITORY)
    private readonly campaignsRepository: CampaignsRepositoryInterface,
    @Inject(COMPANIES_SERVICE)
    private readonly companiesService: CompaniesService,
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async create(
    data: CreateCampaignDto,
    userCompanyId: string,
    file: Express.Multer.File,
  ): Promise<Campaign> {
    this.logger.log(`Creating campaign with name: ${data.name}`);

    await this.companiesService.findById(userCompanyId);

    const phoneList = getPhonesFromFile(file);

    const campaignToCreate = {
      name: data.name,
      company_id: userCompanyId,
      status: CampaignStatusEnum.PENDING,
    };

    const campaign = await this.campaignsRepository.create(campaignToCreate);

    const messages = phoneList.map((phone) => {
      return {
        phone_number: phone,
        message: data.message,
        campaign_id: campaign.id,
        company_id: userCompanyId,
      };
    });

    await this.rabbitMQService.sendToQueueBatch(messages);

    return campaign;
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

  async update(
    id: string,
    data: UpdateCampaignDto,
    userCompanyId: string,
  ): Promise<Campaign> {
    this.logger.log(`Updating campaign with ID: ${id}`);

    const company = await this.findById(id);

    this.validateCompanyId(userCompanyId, company.company_id);

    return this.campaignsRepository.update(id, data);
  }

  async delete(id: string, userCompanyId: string): Promise<void> {
    this.logger.log(`Deleting campaign with ID: ${id}`);

    const company = await this.findById(id);

    this.validateCompanyId(userCompanyId, company.company_id);

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

  private validateCompanyId(userCompanyId: string, companyId: string): void {
    if (userCompanyId !== companyId) {
      this.logger.warn(
        `User company ID: ${userCompanyId} does not match campaign company ID: ${companyId}`,
      );
      throw new HttpException(
        'User company ID does not match provided company ID!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
