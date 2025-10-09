import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Client } from './entities/client.entity';
import { CreateClientDto } from './dto/create-client.dto';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService')

  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,

    private readonly jwtService: JwtService,
  ) { }

  async create(createClientDto: CreateClientDto) {
    try {
      const { password, ...restData } = createClientDto
      const client = this.clientRepository.create({
        ...restData,
        password: bcrypt.hashSync(password, 10)
      })
      await this.clientRepository.save(client);

      return {
        ...client,
        token: this.getJwtToken({ id: client.id })
      }
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto

    const userDb = await this.clientRepository.findOne({
      where: { email },
      select: { password: true, email: true, id: true }
    })

    if (!userDb || !bcrypt.compareSync(password, userDb.password))
      throw new UnauthorizedException('Credenciales incorrectas')

    return {
      ...userDb,
      token: this.getJwtToken({ id: userDb.id })
    }

  }

  async checkAuthStatus(client: Client) {

    return {
      ...client,
      token: this.getJwtToken({ id: client.id })
    }
  }


  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign({ payload });
    return token;
  }

  private handleExceptions(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server log', error.detail)
  }
}
