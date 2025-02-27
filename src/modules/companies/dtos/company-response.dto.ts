import { ApiProperty } from '@nestjs/swagger';

export class CompanyResponseDto {
  @ApiProperty({ description: 'Company ID' })
  id: string;

  @ApiProperty({ description: 'Company name' })
  name: string;

  @ApiProperty({ description: 'Company email address' })
  email: string;

  @ApiProperty({ description: 'Company phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'Company address', required: false })
  address?: string;

  @ApiProperty({ description: 'Company website', required: false })
  website?: string;

  @ApiProperty({ description: 'Company description', required: false })
  description?: string;

  @ApiProperty({ description: 'Company creation timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Company last update timestamp' })
  updated_at: Date;
}
