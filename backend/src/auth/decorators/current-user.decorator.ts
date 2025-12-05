import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  sub: string;
  username: string;
  jti: string;
  isAdmin?: boolean;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
