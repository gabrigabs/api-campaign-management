import { COMPANIES_SERVICE } from '@commons/consts/consts';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CompaniesServiceInterface } from '../interfaces/companies.service.interface';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompanyResponseDto } from '../dtos/company-response.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  private readonly logger = new Logger(CompaniesController.name);

  constructor(
    @Inject(COMPANIES_SERVICE)
    private readonly companiesService: CompaniesServiceInterface,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create company' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Company created successfully',
    type: CompanyResponseDto,
  })
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    this.logger.log(
      `API Request: Create company - ${JSON.stringify(createCompanyDto)}`,
    );
    const result = await this.companiesService.create(createCompanyDto);

    return result;
  }

  @Get()
  @ApiOperation({ summary: 'List all companies' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Companies retrieved successfully',
    type: [CompanyResponseDto],
  })
  async findAll() {
    this.logger.log('API Request: Get all companies');
    const companies = await this.companiesService.findAll();

    return companies;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company retrieved successfully',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  async findById(@Param('id') id: string) {
    this.logger.log(`API Request: Get company by ID - ${id}`);
    const company = await this.companiesService.findBy({ id });

    return company;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company updated successfully',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    this.logger.log(
      `API Request: Update company ID ${id} - ${JSON.stringify(updateCompanyDto)}`,
    );
    const updatedCompany = await this.companiesService.update(
      id,
      updateCompanyDto,
    );

    return updatedCompany;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Company deleted successfully',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  async delete(@Param('id') id: string) {
    this.logger.log(`API Request: Delete company - ${id}`);
    const deletedCompany = await this.companiesService.delete(id);

    return deletedCompany;
  }
}
