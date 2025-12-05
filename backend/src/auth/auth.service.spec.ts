import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

const jwtServiceMock = {
  signAsync: jest.fn().mockResolvedValue('signed-token'),
  verifyAsync: jest.fn(),
};

const mockPasswordHash = bcrypt.hashSync('password123', 10);

const usersServiceMock = {
  findByUsername: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: UsersService, useValue: usersServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      usersServiceMock.findByUsername.mockResolvedValue({
        id: 'u1',
        username: 'testuser',
        passwordHash: mockPasswordHash,
        isAdmin: false,
      });

      const result = await service.validateUser('testuser', 'password123');

      expect(result).toEqual({
        id: 'u1',
        username: 'testuser',
        isAdmin: false,
      });
    });

    it('should return null when user not found', async () => {
      usersServiceMock.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');

      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      usersServiceMock.findByUsername.mockResolvedValue({
        id: 'u1',
        username: 'testuser',
        passwordHash: mockPasswordHash,
      });

      const result = await service.validateUser('testuser', 'wrongpassword');

      expect(result).toBeNull();
    });

    it('should return null when user has no passwordHash', async () => {
      usersServiceMock.findByUsername.mockResolvedValue({
        id: 'u1',
        username: 'testuser',
        passwordHash: null,
      });

      const result = await service.validateUser('testuser', 'password123');

      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and jti', async () => {
      const user = { id: 'u1', username: 'testuser' };

      const result = await service.login(user);

      expect(result).toHaveProperty('access_token', 'signed-token');
      expect(result).toHaveProperty('jti');
      expect(typeof result.jti).toBe('string');
    });

    it('should create a session', async () => {
      const user = { id: 'u1', username: 'testuser' };

      const result = await service.login(user);
      const session = service.getSession(result.jti);

      expect(session).toBeDefined();
      expect(session?.userId).toBe('u1');
      expect(session?.username).toBe('testuser');
    });

    it('should include isAdmin in session when provided', async () => {
      const user = { id: 'u1', username: 'admin', isAdmin: true };

      const result = await service.login(user);
      const session = service.getSession(result.jti);

      expect(session?.isAdmin).toBe(true);
    });
  });

  describe('listSessions', () => {
    it('should return all sessions', async () => {
      await service.login({ id: 'u1', username: 'user1' });
      await service.login({ id: 'u2', username: 'user2' });

      const sessions = service.listSessions();

      expect(sessions.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getSession', () => {
    it('should return session by id', async () => {
      const result = await service.login({ id: 'u1', username: 'test' });

      const session = service.getSession(result.jti);

      expect(session).toBeDefined();
      expect(session?.id).toBe(result.jti);
    });

    it('should return undefined for non-existent session', () => {
      const session = service.getSession('non-existent-id');

      expect(session).toBeUndefined();
    });
  });

  describe('updateSession', () => {
    it('should update session metadata', async () => {
      const result = await service.login({ id: 'u1', username: 'test' });

      const updated = service.updateSession(result.jti, {
        username: 'updated',
      });

      expect(updated?.username).toBe('updated');
    });

    it('should return undefined for non-existent session', () => {
      const updated = service.updateSession('non-existent', {
        username: 'updated',
      });

      expect(updated).toBeUndefined();
    });
  });

  describe('deleteSession', () => {
    it('should delete session and return true', async () => {
      const result = await service.login({ id: 'u1', username: 'test' });

      const deleted = service.deleteSession(result.jti);

      expect(deleted).toBe(true);
      expect(service.getSession(result.jti)).toBeUndefined();
    });

    it('should return false for non-existent session', () => {
      const deleted = service.deleteSession('non-existent');

      expect(deleted).toBe(false);
    });
  });
});
