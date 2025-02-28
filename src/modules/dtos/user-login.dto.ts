import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import { OmitType } from '@nestjs/swagger';

export class UserLoginDto extends OmitType(CreateUserDto, ['company_id']) {}
