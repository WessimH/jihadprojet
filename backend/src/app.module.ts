import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { User } from './users/entities/user.entity';
import { Team } from './teams/entities/team.entity';
import { Match } from './matches/entities/match.entity';
import { Bet } from './bets/entities/bet.entity';
import { Game } from './games/entities/game.entity';
import { MatchOdd } from './match-odds/entities/match-odd.entity';

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
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USER ?? 'postgres',
        password: process.env.DB_PASSWORD ?? 'postgres',
        database: process.env.DB_NAME ?? 'app_db',
        entities: [User, Team, Match, Bet, Game, MatchOdd],
        synchronize: false,
      }),
    }),

    AuthModule,
    UsersModule,
    TeamsModule,
    MatchesModule,
    BetsModule,
    GamesModule,
    MatchOddsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
