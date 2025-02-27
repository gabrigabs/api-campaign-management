import { AuthResponseDto } from '@modules/dtos/auth-response.dto';
import { RegisterUserDto } from '@modules/dtos/register-user.dto';
import { UserLoginDto } from '@modules/dtos/user-login.dto';
import { User } from '@prisma/client';

export interface AuthServiceInterface {
  validateUser(user: UserLoginDto): Promise<Omit<User, 'password'> | null>;
  signUp(user: RegisterUserDto): Promise<AuthResponseDto>;
  signIn(email: string, id: string): Promise<AuthResponseDto>;
}
