import { COMPANIES_SERVICE } from '@commons/consts/consts';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CompaniesServiceInterface } from '../interfaces/companies.service.interface';
import { CreateCompanyDto } from '../dtos/create-company.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CompanyResponseDto,
  PaginatedCompaniesResponseDto,
} from '../dtos/company-response.dto';
import { GetCompaniesQueryDto } from '../dtos/get-companies-query.dto';

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
    type: [PaginatedCompaniesResponseDto],
  })
  async findAll(@Query() query: GetCompaniesQueryDto) {
    this.logger.log('API Request: Get all companies');
    const companies = await this.companiesService.paginateResults(query);

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
    const company = await this.companiesService.findById(id);

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
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Company deleted successfully',
    type: CompanyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Company not found',
  })
  async delete(@Param('id') id: string) {
    this.logger.log(`API Request: Delete company - ${id}`);
    await this.companiesService.delete(id);
  }
}
