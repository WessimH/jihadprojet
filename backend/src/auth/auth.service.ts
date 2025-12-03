import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Synchronous stub until a real user store is added
  validateUser(username: string, pass: string) {
    // TODO: implement user validation logic
    // For now, return a simple object when a non-empty username/pass is provided
    if (username && pass) {
      return { id: 1, username };
    }
    return null;
  }

  async login(user: { id: number; username: string }) {
    // Use JwtService to sign a token; include minimal claims
    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);
    return { access_token: accessToken };
  }
}
