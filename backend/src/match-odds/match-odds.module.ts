import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchOddsService } from './match-odds.service';
import { MatchOddsController } from './match-odds.controller';
import { AuthModule } from '../auth/auth.module';
import { MatchOdd } from './entities/match-odd.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MatchOdd]), AuthModule],
  controllers: [MatchOddsController],
  providers: [MatchOddsService],
  exports: [MatchOddsService],
})
export class MatchOddsModule {}
