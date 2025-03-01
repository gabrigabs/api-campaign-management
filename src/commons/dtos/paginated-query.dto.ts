import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginatedQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
