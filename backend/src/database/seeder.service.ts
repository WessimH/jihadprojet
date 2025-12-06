import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Game } from '../games/entities/game.entity';
import { Team } from '../teams/entities/team.entity';
import * as bcrypt from 'bcrypt';
import Decimal from 'decimal.js';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Team) private readonly teamRepo: Repository<Team>,
  ) {}

  async onModuleInit() {
    await this.seedUsers();
    await this.seedGames();
    await this.seedTeams();
  }

  private async seedUsers() {
    const defaultUsers = [
      {
        username: 'admin',
        email: 'admin@betis.com',
        password: 'Admin123',
        isAdmin: true,
        balance: 10000,
      },
      {
        username: 'user',
        email: 'user@betis.com',
        password: 'User123',
        isAdmin: false,
        balance: 1000,
      },
    ];

    for (const userData of defaultUsers) {
      const existing = await this.userRepo.findOne({
        where: { username: userData.username },
      });

      if (!existing) {
        const user = new User();
        user.username = userData.username;
        user.email = userData.email;
        user.passwordHash = await bcrypt.hash(userData.password, 10);
        user.isAdmin = userData.isAdmin;
        user.balance = new Decimal(userData.balance);
        user.totalBet = new Decimal(0);
        user.totalWon = new Decimal(0);

        await this.userRepo.save(user);
        this.logger.log(
          `Created ${userData.isAdmin ? 'admin' : 'user'} account: ${userData.username}`,
        );
      } else {
        this.logger.log(`Account already exists: ${userData.username}`);
      }
    }
  }

  private async seedGames() {
    const defaultGames = [
      { name: 'League of Legends', category: 'MOBA' },
      { name: 'Counter-Strike 2', category: 'FPS' },
      { name: 'Valorant', category: 'FPS' },
      { name: 'Dota 2', category: 'MOBA' },
    ];

    for (const gameData of defaultGames) {
      const existing = await this.gameRepo.findOne({
        where: { name: gameData.name },
      });

      if (!existing) {
        const game = this.gameRepo.create(gameData);
        await this.gameRepo.save(game);
        this.logger.log(`Created game: ${gameData.name}`);
      }
    }
  }

  private async seedTeams() {
    const defaultTeams = [
      { name: 'Team Liquid', tag: 'TL', country: 'US', totalEarnings: 0 },
      { name: 'G2 Esports', tag: 'G2', country: 'EU', totalEarnings: 0 },
      { name: 'Fnatic', tag: 'FNC', country: 'EU', totalEarnings: 0 },
      { name: 'Cloud9', tag: 'C9', country: 'US', totalEarnings: 0 },
      { name: 'T1', tag: 'T1', country: 'KR', totalEarnings: 0 },
      { name: 'Gen.G', tag: 'GEN', country: 'KR', totalEarnings: 0 },
    ];

    for (const teamData of defaultTeams) {
      const existing = await this.teamRepo.findOne({
        where: { tag: teamData.tag },
      });

      if (!existing) {
        const team = this.teamRepo.create(teamData);
        await this.teamRepo.save(team);
        this.logger.log(`Created team: ${teamData.name}`);
      }
    }
  }
}
