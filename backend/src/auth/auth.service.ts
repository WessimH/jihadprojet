import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  // Validate credentials against the UsersService and bcrypt hash
  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user || !user.passwordHash) return null;
    const ok = await bcrypt.compare(pass, user.passwordHash);
    if (!ok) return null;
    // return safe user object (no passwordHash)
    // include isAdmin flag so tokens/guards can use it
    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
  }

  async login(user: { id: string; username: string }) {
    // include isAdmin in the token when available
    const payload: Record<string, unknown> = {
      sub: user.id,
      username: user.username,
    };
    if ((user as unknown as { isAdmin?: boolean }).isAdmin === true) {
      payload.isAdmin = true;
    }
    const accessToken = await this.jwtService.signAsync(payload);
    return { access_token: accessToken };
  }
}
