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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

// shape of the JWT payload we attach in JwtAuthGuard
interface AuthPayload {
  sub?: string;
  username?: string;
  jti?: string;
  isAdmin?: boolean;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  @ApiOperation({
    summary: 'Health check',
    description: 'Returns ok if service is running.',
  })
  @ApiResponse({ status: 200, description: 'Service is healthy.' })
  health(): string {
    return 'ok';
  }

  // Public login endpoint
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get profile',
    description: 'Returns the authenticated user profile from the JWT payload.',
  })
  @ApiResponse({ status: 200, description: 'User profile.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  profile(@Req() req: Request & { user?: unknown }) {
    // JwtAuthGuard attaches the token payload to req.user
    return { user: req.user };
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
  listSessions(@Req() req: Request & { user?: AuthPayload }) {
    const userId = req.user?.sub as string;
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
