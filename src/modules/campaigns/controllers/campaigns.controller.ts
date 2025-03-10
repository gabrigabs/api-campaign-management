import { CAMPAIGNS_SERVICE } from '@commons/consts/consts';
import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Logger,
  Param,
  ParseFilePipe,
  Put,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CampaignsServiceInterface } from '../interfaces/campaigns.service.interface';
import { CreateCampaignDto } from '../dtos/create-campaign.dto';
import { UpdateCampaignDto } from '../dtos/update-campaign.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CampaignResponseDto,
  PaginatedCampaignsResponseDto,
} from '../dtos/campaign-response.dto';
import { GetCampaignsQueryDto } from '../dtos/get-campaigns-query.dto';
import { ErrorResponseDto } from '@commons/dtos/error-response.dto';
import { CurrentUserDto } from '@commons/dtos/current-user.dto';
import { CurrentUser } from '@commons/decorators/current-user.decorator';
import { JwtAuthGuard } from '@commons/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('campaigns')
@ApiBearerAuth()
@Controller('campaigns')
export class CampaignsController {
  private readonly logger = new Logger(CampaignsController.name);

  constructor(
    @Inject(CAMPAIGNS_SERVICE)
    private readonly campaignsService: CampaignsServiceInterface,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('phones-list'))
  @ApiOperation({ summary: 'Create campaign' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        'phones-list': {
          type: 'string',
          format: 'binary',
          description:
            'Text file containing phone numbers in format XX XXXXX-XXXX, one phone for line',
        },
        name: {
          type: 'string',
          description: 'Name of the campaign',
        },
        message: {
          type: 'string',
          description: 'Campaign message content',
        },
      },
      required: ['phones-list', 'name', 'message'],
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Campaign created successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation Error',
    type: ErrorResponseDto,
  })
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
    @CurrentUser() user: CurrentUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: 'text/plain',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    this.logger.log(
      `API Request: Create campaign - ${JSON.stringify(createCampaignDto)}`,
    );
    const result = await this.campaignsService.create(
      createCampaignDto,
      user.company_id,
      file,
    );

    return result;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'List all campaigns' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Campaigns retrieved successfully',
    type: [PaginatedCampaignsResponseDto],
  })
  async findAll(
    @Query() query: GetCampaignsQueryDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    this.logger.log('API Request: Get all campaigns');
    const campaigns = await this.campaignsService.paginateResults(
      query,
      user.company_id,
    );

    return campaigns;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get campaign by ID' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Campaign retrieved successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Campaign not found',
    type: ErrorResponseDto,
  })
  async findById(@Param('id') id: string) {
    this.logger.log(`API Request: Get campaign by ID - ${id}`);
    const campaign = await this.campaignsService.findById(id);

    return campaign;
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Campaign updated successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Campaign not found',
    type: ErrorResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    this.logger.log(
      `API Request: Update campaign ID ${id} - ${JSON.stringify(updateCampaignDto)}`,
    );
    const updatedCampaign = await this.campaignsService.update(
      id,
      updateCampaignDto,
      user.company_id,
    );

    return updatedCampaign;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Campaign deleted successfully',
    type: CampaignResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Campaign not found',
    type: ErrorResponseDto,
  })
  async delete(@Param('id') id: string, @CurrentUser() user: CurrentUserDto) {
    this.logger.log(`API Request: Delete campaign - ${id}`);
    await this.campaignsService.delete(id, user.company_id);
  }
}
