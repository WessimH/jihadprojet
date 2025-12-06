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
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      useFactory: () => {
        if (
          process.env.NODE_ENV === 'test' ||
          process.env.USE_SQLITE === 'true'
        ) {
          return {
            type: 'sqlite',
            database: ':memory:',
            dropSchema: true,
            synchronize: true,
            entities: [User, Team, Match, Bet, Game, MatchOdd],
          } as const;
        }

        return {
          type: 'postgres',
          host: process.env.DB_HOST ?? 'localhost',
          port: Number(process.env.DB_PORT ?? 5432),
          username: process.env.DB_USER ?? 'postgres',
          password: process.env.DB_PASSWORD ?? 'postgres',
          database: process.env.DB_NAME ?? 'app_db',
          entities: [User, Team, Match, Bet, Game, MatchOdd],
          synchronize: process.env.NODE_ENV !== 'production', // auto-create tables in dev
        } as const;
      },
    }),

    AuthModule,
    UsersModule,
    TeamsModule,
    MatchesModule,
    BetsModule,
    GamesModule,
    MatchOddsModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
