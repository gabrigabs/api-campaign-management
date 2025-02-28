import { IsValidCuid2 } from '@commons/decorators/is-valid-cuid2.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsValidCuid2({ message: 'company_id must be a valid cuid2' })
  @IsNotEmpty()
  company_id: string;
}
