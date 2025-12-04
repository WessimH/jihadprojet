import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from './admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  health(): string {
    return 'ok';
  }

  // Public login endpoint
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() body: LoginDto) {
    // coerce incoming DTO properties to strings to satisfy strict lint rules
    const username = body.username;
    const password = body.password;

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      return { error: 'invalid_credentials' };
    }
    return this.authService.login(user);
  }

  // Example protected route to test the guard
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: Request & { user?: unknown }) {
    // JwtAuthGuard attaches the token payload to req.user
    return { user: req.user };
  }

  // Example admin-only route
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin')
  adminOnly() {
    return { admin: true };
  }
}
