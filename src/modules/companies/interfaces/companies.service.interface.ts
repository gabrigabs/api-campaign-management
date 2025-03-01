import { BaseServiceInterface } from '@commons/interfaces/base.service.interface';
import { Company } from '@prisma/client';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { PaginatedCompaniesResponseDto } from '../dtos/company-response.dto';
import { GetCompaniesQueryDto } from '../dtos/get-companies-query.dto';

export interface CompaniesServiceInterface
  extends BaseServiceInterface<Company, CreateCompanyDto, UpdateCompanyDto> {
  paginateResults(
    query: GetCompaniesQueryDto,
  ): Promise<PaginatedCompaniesResponseDto>;
  verifyIfCompanyExistsById(companyId: string): Promise<void>;
  findById(id: string): Promise<Company>;
}
