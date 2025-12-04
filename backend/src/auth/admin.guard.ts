import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const user = req.user as { isAdmin?: unknown } | undefined;
    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }
    // explicit boolean check for admin flag
    if (user.isAdmin === true) {
      return true;
    }
    throw new ForbiddenException('Admin privileges required');
  }
}
