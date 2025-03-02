import { IsValidCnpj } from '@commons/decorators/is-valid-cnpj.decorator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
      return value.replace(/[^\d]/g, '');
    }
  })
  @IsValidCnpj()
  document: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
