import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UsersServiceInterface } from '../interfaces/users.service.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { COMPANIES_SERVICE, USERS_REPOSITORY } from '@commons/consts/consts';
import { UsersRepositoryInterface } from '../interfaces/users.repository.interface';
import { User } from '@prisma/client';
import { hashPassword } from '@commons/utils/password.util';
import { CompaniesServiceInterface } from '@modules/companies/interfaces/companies.service.interface';

@Injectable()
export class UsersService implements UsersServiceInterface {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepositoryInterface,
    @Inject(COMPANIES_SERVICE)
    private readonly companiesService: CompaniesServiceInterface,
  ) {}

  async create(data: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with email: ${data.email}`);

    await this.verifyIfUserAlreadyExistsByEmail(data.email);

    await this.companiesService.verifyIfCompanyExistsById(data.company_id);

    const hashedPassword = await hashPassword(data.password);

    return this.usersRepository.create({ ...data, password: hashedPassword });
  }

  findBy(params: Partial<User>): Promise<User | null> {
    this.logger.log(`Finding user by: ${JSON.stringify(params)}`);
    return this.usersRepository.findBy(params);
  }

  private async verifyIfUserAlreadyExistsByEmail(email: string): Promise<void> {
    const userExists = await this.findBy({
      email,
    });

    if (userExists) {
      this.logger.warn(`User with email ${email} already exists`);
      throw new HttpException('User already exists!', HttpStatus.BAD_REQUEST);
    }
  }
}
