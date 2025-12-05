import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';

const mockRepository = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('TeamsService', () => {
  let service: TeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: getRepositoryToken(Team), useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TeamsService>(TeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of teams', async () => {
      const result = await service.findAll();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
