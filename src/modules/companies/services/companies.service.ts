import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CompaniesServiceInterface } from '../interfaces/companies.service.interface';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { COMPANIES_REPOSITORY } from '@commons/consts/consts';
import { CompaniesRepositoryInterface } from '../interfaces/companies.repository.interface';
import { Company } from '@prisma/client';
import {
  mountPaginateAndSearchParams,
  mountPaginatedResponse,
} from '@commons/utils/pagination.utils';
import { GetCompaniesQueryDto } from '../dtos/get-companies-query.dto';
import { PaginatedCompaniesResponseDto } from '../dtos/company-response.dto';

@Injectable()
export class CompaniesService implements CompaniesServiceInterface {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    @Inject(COMPANIES_REPOSITORY)
    private readonly companiesRepository: CompaniesRepositoryInterface,
  ) {}

  create(data: CreateCompanyDto): Promise<Company> {
    this.logger.log(`Creating company with name: ${data.name}`);
    return this.companiesRepository.create(data);
  }

  findAll(query: GetCompaniesQueryDto): Promise<Company[]> {
    this.logger.log('Fetching all companies');

    const { skip, take, where } =
      mountPaginateAndSearchParams<GetCompaniesQueryDto>(query);

    return this.companiesRepository.findAll(skip, take, where);
  }

  findBy(params: Partial<Company>): Promise<Company | null> {
    this.logger.log(`Finding company by: ${JSON.stringify(params)}`);
    return this.companiesRepository.findBy(params);
  }

  update(id: string, data: UpdateCompanyDto): Promise<Company> {
    this.logger.log(`Updating company with ID: ${id}`);
    return this.companiesRepository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting company with ID: ${id}`);
    await this.companiesRepository.delete(id);
  }

  async paginateResults(
    query: GetCompaniesQueryDto,
  ): Promise<PaginatedCompaniesResponseDto> {
    const results = await this.findAll(query);
    const total = results.length;

    this.logger.log(`Paginating ${total} items`);

    const paginatedResults = mountPaginatedResponse<Company>(
      query,
      results,
      total,
    );

    return paginatedResults;
  }

  async verifyIfCompanyExistsById(companyId: string): Promise<void> {
    this.logger.log(`Verifying if company exists with ID: ${companyId}`);
    const company = await this.findBy({ id: companyId });

    if (!company) {
      this.logger.warn(`Company with ID ${companyId} does not exist`);
      throw new HttpException(
        'Provided company id does not exist!',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
