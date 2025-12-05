import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { MatchOddsController } from './match-odds.controller';
import { MatchOddsService } from './match-odds.service';

const matchOddsServiceMock = {
  create: jest.fn(),
  findAll: jest.fn().mockResolvedValue([]),
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
      ],
    }).compile();

    controller = module.get<MatchOddsController>(MatchOddsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of odds', async () => {
      const result = await controller.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
