import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { BetsService } from './bets.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bet } from './entities/bet.entity';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('BetsService', () => {
  let service: BetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BetsService,
        { provide: getRepositoryToken(Bet), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<BetsService>(BetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bets', async () => {
      const result = await service.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
