import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: { username: string; email: string; password: string }) {
    return this.authService.register(body.username, body.email, body.password);
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }

  @Post('check-email-exists')
  checkEmail(@Body() body: { email: string }) {
    return this.authService.checkEmailExists(body.email);
  }

  @Post('reset-password')
  resetPassword(@Body() body: { email: string; newPassword: string; confirmPassword: string }) {
    return this.authService.resetPassword(body.email, body.newPassword, body.confirmPassword);
  }
}
