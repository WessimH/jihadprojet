import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Vérifier si la route est marquée comme publique
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }

  handleRequest<TUser = unknown>(
    err: Error | null,
    user: TUser | false,
    info: Error | null,
  ): TUser {
    this.logger.log(`handleRequest - err: ${err}, user: ${!!user}, info: ${info}`);
    // Vous pouvez lancer une exception sur la base des arguments "info" ou "err"
    if (err || !user) {
      this.logger.error(`Auth failed - err: ${err?.message}, info: ${info}`);
      throw err || new UnauthorizedException('Invalid or expired token');
    }
    return user;
  }
}
