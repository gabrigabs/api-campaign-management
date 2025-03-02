import { Company } from '@prisma/client';
import { BaseRepositoryInterface } from '@commons/interfaces/base.repository.interface';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';

export interface CompaniesRepositoryInterface
  extends BaseRepositoryInterface<
    Company,
    CreateCompanyDto,
    UpdateCompanyDto
  > {}
