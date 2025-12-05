import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';

const mockMatchesService = {
  create: jest.fn(),
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('MatchesController', () => {
  let controller: MatchesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [{ provide: MatchesService, useValue: mockMatchesService }],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of matches', async () => {
      const result = await controller.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
