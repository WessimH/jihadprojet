import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { MatchOddsController } from './match-odds.controller';
import { MatchOddsService } from './match-odds.service';
import { JwtService } from '@nestjs/jwt';

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

describe('MatchOddsController', () => {
  let controller: MatchOddsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchOddsController],
      providers: [
        { provide: MatchOddsService, useValue: matchOddsServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    controller = module.get<MatchOddsController>(MatchOddsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
