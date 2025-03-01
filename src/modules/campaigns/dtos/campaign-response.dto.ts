import { ApiProperty } from '@nestjs/swagger';

export class CampaignResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  company_id: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}

export class PaginatedCampaignsResponseDto {
  @ApiProperty({ type: [CampaignResponseDto] })
  data: CampaignResponseDto[];

  @ApiProperty()
  page: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  totalItems: number;
}
