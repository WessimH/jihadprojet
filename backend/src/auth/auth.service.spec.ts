import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

const jwtServiceMock = {
  signAsync: jest.fn().mockResolvedValue('signed-token'),
  verifyAsync: jest.fn(),
};

const usersServiceMock = {
  findByUsername: jest.fn().mockResolvedValue({
    id: 'u1',
    username: 'test',
    passwordHash: '$2b$10$abc',
  }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
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
});
