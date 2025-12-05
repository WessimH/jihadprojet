import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { GamesService } from './games.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('GamesService', () => {
  let service: GamesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GamesService,
        { provide: getRepositoryToken(Game), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<GamesService>(GamesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of games', async () => {
      const result = await service.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
