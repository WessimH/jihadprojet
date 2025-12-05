import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { MatchOddsService } from './match-odds.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MatchOdd } from './entities/match-odd.entity';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('MatchOddsService', () => {
  let service: MatchOddsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchOddsService,
        { provide: getRepositoryToken(MatchOdd), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<MatchOddsService>(MatchOddsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of odds', async () => {
      const result = await service.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
