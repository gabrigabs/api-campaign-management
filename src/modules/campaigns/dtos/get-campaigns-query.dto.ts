import { PaginatedQueryDto } from '@commons/dtos/paginated-query.dto';
import { CampaignStatusEnum } from '@commons/enums/campaign-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetCampaignsQueryDto extends PaginatedQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ enum: CampaignStatusEnum })
  @Transform((status: { value: string }) => status.value.toUpperCase())
  @IsEnum(CampaignStatusEnum)
  @IsOptional()
  status?: CampaignStatusEnum;
}
