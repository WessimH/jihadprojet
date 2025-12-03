import { Test, TestingModule } from '@nestjs/testing';
import { MatchOddsController } from './match-odds.controller';
import { MatchOddsService } from './match-odds.service';

describe('MatchOddsController', () => {
  let controller: MatchOddsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchOddsController],
      providers: [MatchOddsService],
    }).compile();

    controller = module.get<MatchOddsController>(MatchOddsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
