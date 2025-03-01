import { BaseServiceInterface } from '@commons/interfaces/base.service.interface';
import { Company } from '@prisma/client';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';

export interface CompaniesServiceInterface
  extends BaseServiceInterface<Company, CreateCompanyDto, UpdateCompanyDto> {
  verifyIfCompanyExistsById(companyId: string): Promise<void>;
}
