import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers?.authorization as string | undefined;
    if (!auth) {
      throw new UnauthorizedException('Missing Authorization header');
    }
    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
      throw new UnauthorizedException('Malformed Authorization header');
    }
    const token = parts[1];
    try {
      const payload = (await this.jwtService.verifyAsync(token)) as unknown;
      // ensure payload is an object and token has a jti and that the session is active
      if (typeof payload !== 'object' || payload === null) {
        throw new UnauthorizedException('Invalid token payload');
      }
      const jti = (payload as Record<string, unknown>)['jti'] as
        | string
        | undefined;
      if (!jti) {
        throw new UnauthorizedException('Missing jti in token');
      }
      const session = this.authService.getSession(jti);
      if (!session) {
        throw new UnauthorizedException('Token has been revoked');
      }
      // attach payload for controllers
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
