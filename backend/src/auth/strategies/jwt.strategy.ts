import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

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
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'placeholder',
    });
  }

  validate(payload: JwtPayload) {
    // Vérifier que la session existe (pour la révocation de tokens)
    const session = this.authService.getSession(payload.jti);
    if (!session) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // Retourner l'utilisateur qui sera attaché à req.user
    return {
      userId: payload.sub,
      username: payload.username,
      jti: payload.jti,
      isAdmin: payload.isAdmin,
    };
  }
}
