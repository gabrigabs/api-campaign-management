import { IsValidCuid2 } from '@commons/decorators/is-valid-cuid2.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty()
  @IsValidCuid2({ message: 'company_id must be a valid cuid2' })
  @IsNotEmpty()
  company_id: string;
}
