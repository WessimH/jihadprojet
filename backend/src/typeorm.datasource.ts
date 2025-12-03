import 'reflect-metadata';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Team } from './teams/entities/team.entity';
import { Match } from './matches/entities/match.entity';
import { Bet } from './bets/entities/bet.entity';
import { Game } from './games/entities/game.entity';
import { MatchOdd } from './match-odds/entities/match-odd.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'app_db',
  entities: [User, Team, Match, Bet, Game, MatchOdd],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
});
