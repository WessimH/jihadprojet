import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { JWT_SECRET } from '../auth.module';

export interface JwtPayload {
  sub: string;
  username: string;
  jti: string;
  isAdmin?: boolean;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
    this.logger.log('JwtStrategy initialized');
  }

  validate(payload: JwtPayload) {
    this.logger.log(`Validating token with jti: ${payload.jti}`);
    // Check that the session exists (for token revocation)
    const session = this.authService.getSession(payload.jti);
    this.logger.log(
      `Session lookup result: ${session ? 'found' : 'NOT FOUND'}`,
    );
    if (!session) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Return the user that will be attached to req.user
    return {
      userId: payload.sub,
      username: payload.username,
      jti: payload.jti,
      isAdmin: payload.isAdmin,
    };
  }
}
