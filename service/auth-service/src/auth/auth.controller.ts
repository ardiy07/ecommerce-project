import { Body, Get, Controller, HttpCode, Post, Req } from '@nestjs/common';
import {
  AuthResponse,
  LogoutUserRespon,
  RegisterUserRequest,
  VerifyEmailRequest,
  VerifyOTPRequest,
} from '../model/auth.model';
import { AuthService } from './auth.service';
import { WebResponse } from 'src/model/web.model';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/verify-email')
  @HttpCode(200)
  async verifyEmail(@Body() request: VerifyEmailRequest) {
    return await this.authService.verifyEmail(request);
  }

  @Post('/verify-otp')
  @HttpCode(200)
  async verifyToken(@Body() request: VerifyOTPRequest) {
    return await this.authService.verifyOTP(request);
  }

  @Post('/register')
  @HttpCode(201)
  async register(
    @Body() request: RegisterUserRequest,
  ): Promise<WebResponse<AuthResponse>> {
    const result = await this.authService.RegisterUser(request);
    return {
      status: 'success',
      message: 'Registration successful',
      data: result,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() request: RegisterUserRequest, @Req() req: Request): Promise<WebResponse<AuthResponse>> {
    const result = await this.authService.LoginUser(request, req);
    return {
      status: 'success',
      message: 'Login successful',
      data: result,
    }
  }

  @Post('/logout')
  @HttpCode(200)
  async logout(@Body() request: LogoutUserRespon) {
    return await this.authService.LogoutUser(request);
  }
}