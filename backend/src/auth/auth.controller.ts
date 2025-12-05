import {
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
  Body,
  ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Session } from './auth.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminGuard } from './admin.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import type { AuthenticatedUser } from './decorators/current-user.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns ok if service is running.',
  })
  @ApiResponse({ status: 200, description: 'Service is healthy.' })
  health(): string {
    return 'ok';
  }

  // Public login endpoint - uses LocalAuthGuard (Passport local strategy)
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description:
      'Authenticate with username and password. Returns a JWT access token.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, returns access_token.',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(
    @Req()
    req: Request & {
      user: { id: string; username: string; isAdmin?: boolean };
    },
  ) {
    // LocalAuthGuard validates credentials and attaches user to req.user
    return this.authService.login(req.user);
  }

  // Example protected route to test the guard
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get profile',
    description: 'Returns the authenticated user profile from the JWT payload.',
  })
  @ApiResponse({ status: 200, description: 'User profile.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  profile(@CurrentUser() user: AuthenticatedUser) {
    // JwtAuthGuard attaches the token payload to req.user
    return { user };
  }

  // Session CRUD (protected) - endpoints under /auth/login
  @UseGuards(JwtAuthGuard)
  @Get('login')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'List sessions',
    description: 'List all active sessions for the authenticated user.',
  })
  @ApiResponse({ status: 200, description: 'List of sessions.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  listSessions(@CurrentUser() user: AuthenticatedUser) {
    const userId = user.sub;
    const sessions = this.authService.listSessions();
    return sessions.filter((s) => s.userId === userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('login/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get session',
    description: 'Get a specific session by jti (session ID).',
  })
  @ApiParam({
    name: 'id',
    description: 'Session ID (jti)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Session details.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getSession(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    const userId = user.sub;
    const session = this.authService.getSession(id);
    if (!session) return { error: 'not_found' };
    if (session.userId !== userId && !user.isAdmin) {
      throw new ForbiddenException();
    }
    return session;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('login/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update session',
    description: 'Update session metadata (e.g., label).',
  })
  @ApiParam({
    name: 'id',
    description: 'Session ID (jti)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    description: 'Session update payload',
    schema: {
      example: { label: 'My Laptop' },
    },
  })
  @ApiResponse({ status: 200, description: 'Session updated.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  updateSession(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() patch: Partial<Session>,
  ) {
    const userId = user.sub;
    const session = this.authService.getSession(id);
    if (!session) return { error: 'not_found' };
    if (session.userId !== userId && !user.isAdmin) {
      throw new ForbiddenException();
    }

    const updated = this.authService.updateSession(id, patch);
    return updated || { error: 'not_found' };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('login/:id')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete session',
    description: 'Revoke a session (logout from that device/token).',
  })
  @ApiParam({
    name: 'id',
    description: 'Session ID (jti)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Session deleted (token revoked).' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  deleteSession(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const userId = user.sub;
    const session = this.authService.getSession(id);
    if (!session) return { error: 'not_found' };
    if (session.userId !== userId && !user.isAdmin) {
      throw new ForbiddenException();
    }
    const ok = this.authService.deleteSession(id);
    return { ok };
  }

  // Example admin-only route
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin only',
    description: 'Example admin-only endpoint. Requires isAdmin=true in token.',
  })
  @ApiResponse({ status: 200, description: 'Admin access granted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden (not admin).' })
  adminOnly() {
    return { admin: true };
  }
}
