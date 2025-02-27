import { UserResponseDto } from '@modules/users/dtos/user-response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class CompanyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  document: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ isArray: true, type: () => UserResponseDto })
  users: User[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}
