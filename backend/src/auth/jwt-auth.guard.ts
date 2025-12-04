import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

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
      const payload = await this.jwtService.verifyAsync(token);
      // attach payload for controllers
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
