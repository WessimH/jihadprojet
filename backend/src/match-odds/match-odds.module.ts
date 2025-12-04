import { Module } from '@nestjs/common';
import { MatchOddsService } from './match-odds.service';
import { MatchOddsController } from './match-odds.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [MatchOddsController],
  providers: [MatchOddsService],
})
export class MatchOddsModule {}
