import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { BetsController } from './bets.controller';
import { BetsService } from './bets.service';

const mockBetsService = {
  create: jest.fn(),
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  findByUser: jest.fn().mockResolvedValue([]),
};

describe('BetsController', () => {
  let controller: BetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetsController],
      providers: [{ provide: BetsService, useValue: mockBetsService }],
    }).compile();

    controller = module.get<BetsController>(BetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of bets', async () => {
      const result = await controller.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
