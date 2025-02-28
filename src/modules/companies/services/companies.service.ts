import { Inject, Injectable, Logger } from '@nestjs/common';
import { CompaniesServiceInterface } from '../interfaces/companies.service.interface';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { COMPANIES_REPOSITORY } from '@commons/consts/consts';
import { CompaniesRepositoryInterface } from '../interfaces/companies.repository.interface';
import { Company } from '@prisma/client';

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

  findAll(): Promise<Company[]> {
    this.logger.log('Fetching all companies');
    return this.companiesRepository.findAll();
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
}
