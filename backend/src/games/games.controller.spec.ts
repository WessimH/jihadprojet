import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { GamesController } from './games.controller';
import { GamesService } from './games.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';

const mockGamesService = {
  create: jest.fn(),
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('GamesController', () => {
  let controller: GamesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        { provide: GamesService, useValue: mockGamesService },
        { provide: getRepositoryToken(Game), useValue: {} },
      ],
    }).compile();

    controller = module.get<GamesController>(GamesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of games', async () => {
      const result = await controller.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
