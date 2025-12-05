import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';

const mockTeamsService = {
  create: jest.fn(),
  findAll: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('TeamsController', () => {
  let controller: TeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamsController],
      providers: [
        { provide: TeamsService, useValue: mockTeamsService },
        { provide: getRepositoryToken(Team), useValue: {} },
      ],
    }).compile();

    controller = module.get<TeamsController>(TeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      const result = await controller.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
