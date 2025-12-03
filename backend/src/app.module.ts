import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { MatchesModule } from './matches/matches.module';
import { BetsModule } from './bets/bets.module';
import { GamesModule } from './games/games.module';
import { MatchOddsModule } from './match-odds/match-odds.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, TeamsModule, MatchesModule, BetsModule, GamesModule, MatchOddsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
