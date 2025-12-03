import { Module } from '@nestjs/common';
import { MatchOddsService } from './match-odds.service';
import { MatchOddsController } from './match-odds.controller';

@Module({
  controllers: [MatchOddsController],
  providers: [MatchOddsService],
})
export class MatchOddsModule {}
