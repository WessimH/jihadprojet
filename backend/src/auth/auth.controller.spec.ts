import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ForbiddenException } from '@nestjs/common';
import type { AuthenticatedUser } from './decorators/current-user.decorator';

const jwtServiceMock = {
  signAsync: jest.fn().mockResolvedValue('signed-token'),
  verifyAsync: jest.fn(),
};

const usersServiceMock = { findByUsername: jest.fn() };

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('health', () => {
    it('should return ok', () => {
      expect(controller.health()).toBe('ok');
    });
  });

  describe('login', () => {
    it('should return access token when LocalAuthGuard passes user', async () => {
      // Simulate what LocalAuthGuard does - attaches user to request
      const mockUser = { id: 'user-1', username: 'testuser', isAdmin: false };
      const result = await authService.login(mockUser);

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('jti');
    });
  });

  describe('profile', () => {
    it('should return user profile', () => {
      const mockUser: AuthenticatedUser = {
        sub: 'user-1',
        username: 'testuser',
        jti: 'session-1',
        isAdmin: false,
      };

      const result = controller.profile(mockUser);

      expect(result).toEqual({ user: mockUser });
    });
  });

  describe('listSessions', () => {
    it('should return only sessions for the authenticated user', async () => {
      // Create a session first
      await authService.login({ id: 'user-1', username: 'test' });
      await authService.login({ id: 'user-2', username: 'other' });

      const mockUser: AuthenticatedUser = {
        sub: 'user-1',
        username: 'test',
        jti: 'session-1',
      };

      const result = controller.listSessions(mockUser);

      expect(Array.isArray(result)).toBe(true);
      result.forEach((session) => {
        expect(session.userId).toBe('user-1');
      });
    });
  });

  describe('getSession', () => {
    it('should return session if user owns it', async () => {
      const loginResult = await authService.login({
        id: 'user-1',
        username: 'test',
      });

      const mockUser: AuthenticatedUser = {
        sub: 'user-1',
        username: 'test',
        jti: loginResult.jti,
      };

      const result = controller.getSession(mockUser, loginResult.jti);

      expect(result).toHaveProperty('id', loginResult.jti);
    });

    it('should return error for non-existent session', () => {
      const mockUser: AuthenticatedUser = {
        sub: 'user-1',
        username: 'test',
        jti: 'session-1',
      };

      const result = controller.getSession(mockUser, 'non-existent');

      expect(result).toEqual({ error: 'not_found' });
    });

    it('should throw ForbiddenException if user does not own session', async () => {
      const loginResult = await authService.login({
        id: 'user-2',
        username: 'other',
      });

      const mockUser: AuthenticatedUser = {
        sub: 'user-1',
        username: 'test',
        jti: 'session-1',
        isAdmin: false,
      };

      expect(() => controller.getSession(mockUser, loginResult.jti)).toThrow(
        ForbiddenException,
      );
    });

    it('should allow admin to access any session', async () => {
      const loginResult = await authService.login({
        id: 'user-2',
        username: 'other',
      });

      const mockAdmin: AuthenticatedUser = {
        sub: 'admin-1',
        username: 'admin',
        jti: 'admin-session',
        isAdmin: true,
      };

      const result = controller.getSession(mockAdmin, loginResult.jti);

      expect(result).toHaveProperty('id', loginResult.jti);
    });
  });

  describe('deleteSession', () => {
    it('should delete session if user owns it', async () => {
      const loginResult = await authService.login({
        id: 'user-1',
        username: 'test',
      });

      const mockUser: AuthenticatedUser = {
        sub: 'user-1',
        username: 'test',
        jti: loginResult.jti,
      };

      const result = controller.deleteSession(mockUser, loginResult.jti);

      expect(result).toEqual({ ok: true });
    });

    it('should return error for non-existent session', () => {
      const mockUser: AuthenticatedUser = {
        sub: 'user-1',
        username: 'test',
        jti: 'session-1',
      };

      const result = controller.deleteSession(mockUser, 'non-existent');

      expect(result).toEqual({ error: 'not_found' });
    });
  });

  describe('adminOnly', () => {
    it('should return admin true', () => {
      const result = controller.adminOnly();
      expect(result).toEqual({ admin: true });
    });
  });
});
