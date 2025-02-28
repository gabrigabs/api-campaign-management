import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CompaniesRepositoryInterface } from '../interfaces/companies.repository.interface';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { PrismaService } from '@infra/databases/prisma/services/prisma.service';
import { Company } from '@prisma/client';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { createId } from '@paralleldrive/cuid2';

@Injectable()
export class CompaniesRepository implements CompaniesRepositoryInterface {
  private readonly logger = new Logger(CompaniesRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(data: CreateCompanyDto): Promise<Company> {
    try {
      this.logger.log(`Creating company with name: ${data.name}`);

      const company = await this.prismaService.company.create({
        data: { id: createId(), ...data },
      });
      this.logger.log(`Company created successfully with ID: ${company.id}`);
      return company;
    } catch (error) {
      this.logger.error('Failed to create company', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<Company[]> {
    try {
      this.logger.log('Fetching all companies');
      const companies = await this.prismaService.company.findMany({
        include: { users: true, campaigns: true },
      });
      this.logger.log(`Retrieved ${companies.length} companies`);
      return companies;
    } catch (error) {
      this.logger.error('Failed to fetch companies', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findBy(params: Partial<Company>): Promise<Company | null> {
    try {
      this.logger.log(`Finding company by: ${JSON.stringify(params)}`);
      const company = await this.prismaService.company.findFirst({
        where: params,
        include: { users: true, campaigns: true },
      });
      this.logger.log(
        company
          ? `Company found with params: ${JSON.stringify(params)}`
          : 'Company not found',
      );
      return company;
    } catch (error) {
      this.logger.error('Failed to find company', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateCompanyDto): Promise<Company> {
    try {
      this.logger.log(`Updating company with ID: ${id}`);
      const company = await this.prismaService.company.update({
        where: { id },
        data,
      });
      this.logger.log(`Company updated successfully`);
      return company;
    } catch (error) {
      this.logger.error('Failed to update company', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.logger.log(`Deleting company with ID: ${id}`);
      await this.prismaService.company.delete({
        where: { id },
      });
      this.logger.log(`Company deleted successfully`);
    } catch (error) {
      this.logger.error('Failed to delete company', error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
