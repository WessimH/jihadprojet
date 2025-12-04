import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  UseGuards,
  Param,
  Patch,
  Delete,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Session } from './auth.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from './admin.guard';

// shape of the JWT payload we attach in JwtAuthGuard
interface AuthPayload {
  sub?: string;
  username?: string;
  jti?: string;
  isAdmin?: boolean;
}

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

  // Session CRUD (protected) - endpoints under /auth/login
  @UseGuards(JwtAuthGuard)
  @Get('login')
  listSessions(@Req() req: Request & { user?: AuthPayload }) {
    const userId = req.user?.sub as string;
    const sessions = this.authService.listSessions();
    return sessions.filter((s) => s.userId === userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('login/:id')
  getSession(
    @Req() req: Request & { user?: AuthPayload },
    @Param('id') id: string,
  ) {
    const userId = req.user?.sub as string;
    const session = this.authService.getSession(id);
    if (!session) return { error: 'not_found' };
    if (session.userId !== userId && !req.user?.isAdmin) {
      throw new ForbiddenException();
    }
    return session;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('login/:id')
  updateSession(
    @Req() req: Request & { user?: AuthPayload },
    @Param('id') id: string,
    @Body() patch: Partial<Session>,
  ) {
    const userId = req.user?.sub as string;
    const session = this.authService.getSession(id);
    if (!session) return { error: 'not_found' };
    if (session.userId !== userId && !req.user?.isAdmin) {
      throw new ForbiddenException();
    }

    const updated = this.authService.updateSession(id, patch);
    return updated || { error: 'not_found' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('login/:id')
  deleteSession(
    @Req() req: Request & { user?: AuthPayload },
    @Param('id') id: string,
  ) {
    const userId = req.user?.sub as string;
    const session = this.authService.getSession(id);
    if (!session) return { error: 'not_found' };
    if (session.userId !== userId && !req.user?.isAdmin) {
      throw new ForbiddenException();
    }
    const ok = this.authService.deleteSession(id);
    return { ok };
  }

  // Example admin-only route
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin')
  adminOnly() {
    return { admin: true };
  }
}
