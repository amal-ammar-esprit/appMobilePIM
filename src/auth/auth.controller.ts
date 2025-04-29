// auth.controller.ts
import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { RelatedDto } from './dtos/related.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200) // Change status code to 200 for successful login
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // New endpoint to fetch related users
  @Post('related-users')
  @HttpCode(200)
  async getRelatedUsers(@Body() relatedDto: RelatedDto) {
    return this.authService.getRelatedUsers(relatedDto);
  }
}
