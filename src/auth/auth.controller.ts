import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerivce: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: any) {
    return this.authSerivce.login(loginDto.email, loginDto.password);
  }
}
