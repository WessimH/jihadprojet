import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
// note: use Node's built-in crypto.randomUUID() instead of the 'uuid' package

export type Session = {
  id: string; // jti
  userId: string;
  username: string;
  isAdmin?: boolean;
  createdAt: Date;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  // in-memory session store (jti -> session). For production use a persistent store.
  private readonly sessions = new Map<string, Session>();

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
    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
  }

  // Create a session and return an access token (with jti)
  async login(user: { id: string; username: string; isAdmin?: boolean }) {
    const jti = randomUUID();
    const payload: Record<string, unknown> = {
      sub: user.id,
      username: user.username,
      jti,
    };
    if (user.isAdmin === true) payload.isAdmin = true;

    // sign token
    const accessToken = await this.jwtService.signAsync(payload);

    // store session
    const session: Session = {
      id: jti,
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      createdAt: new Date(),
    };
    this.sessions.set(jti, session);
    this.logger.log(
      `Session created: jti=${jti}, total sessions=${this.sessions.size}`,
    );

    return { access_token: accessToken, jti };
  }

  // Session CRUD
  listSessions(): Session[] {
    return Array.from(this.sessions.values());
  }

  getSession(id: string): Session | undefined {
    const session = this.sessions.get(id);
    this.logger.log(
      `getSession called: jti=${id}, found=${!!session}, total sessions=${this.sessions.size}`,
    );
    return session;
  }

  // update session metadata (e.g., renew createdAt or set flags)
  updateSession(id: string, patch: Partial<Session>): Session | undefined {
    const existing = this.sessions.get(id);
    if (!existing) return undefined;
    const updated = { ...existing, ...patch };
    this.sessions.set(id, updated);
    return updated;
  }

  deleteSession(id: string): boolean {
    return this.sessions.delete(id);
  }

  // Get user with balance from database
  getUserWithBalance(userId: string) {
    return this.usersService.findOne(userId);
  }
}
