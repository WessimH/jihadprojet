import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { MatchOddsController } from './match-odds.controller';
import { MatchOddsService } from './match-odds.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';

const jwtServiceMock = {
  verifyAsync: jest.fn().mockResolvedValue({ sub: 'u1' }),
};

const matchOddsServiceMock = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const authServiceMock = {
  getSession: jest.fn().mockReturnValue({
    id: 's1',
    userId: 'u1',
    username: 'u1',
    createdAt: new Date(),
  }),
};

describe('MatchOddsController', () => {
  let controller: MatchOddsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchOddsController],
      providers: [
        { provide: MatchOddsService, useValue: matchOddsServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        { provide: AuthService, useValue: authServiceMock },
      ],
    }).compile();

    controller = module.get<MatchOddsController>(MatchOddsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
