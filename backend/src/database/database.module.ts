import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { User } from '../users/entities/user.entity';
import { Game } from '../games/entities/game.entity';
import { Team } from '../teams/entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Game, Team])],
  providers: [SeederService],
  exports: [SeederService],
})
export class DatabaseModule {}
