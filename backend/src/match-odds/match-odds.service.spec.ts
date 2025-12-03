import { Test, TestingModule } from '@nestjs/testing';
import { MatchOddsService } from './match-odds.service';

describe('MatchOddsService', () => {
  let service: MatchOddsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchOddsService],
    }).compile();

    service = module.get<MatchOddsService>(MatchOddsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
