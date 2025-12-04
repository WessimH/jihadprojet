import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const jwtServiceMock = {
  signAsync: jest.fn().mockResolvedValue('signed-token'),
  verifyAsync: jest.fn(),
};

const usersServiceMock = { findByUsername: jest.fn() };

describe('AuthController', () => {
  let controller: AuthController;

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
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
