import { Controller, Get, Post, Body } from '@nestjs/common';

import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators/auth.decorator';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { Client } from './entities/client.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() createClientDto: CreateClientDto) {
    return this.authService.create(createClientDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get()
  @Auth()
  checkAuthStatus(
    @GetUser() client: Client
  ) {
    return this.authService.checkAuthStatus(client)
  }

}
