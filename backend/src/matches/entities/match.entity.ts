import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Team } from '../../teams/entities/team.entity';
import { Game } from '../../games/entities/game.entity';

@Entity({ name: 'matches' })
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Team)
  team1: Team;

  @ManyToOne(() => Team)
  team2: Team;

  @ManyToOne(() => Game)
  game: Game;

  @Column({ name: 'match_date', type: 'timestamp', nullable: true })
  matchDate: Date | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'scheduled',
  })
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';

  @Column({ name: 'team1_score', type: 'int', default: 0 })
  team1Score: number;

  @Column({ name: 'team2_score', type: 'int', default: 0 })
  team2Score: number;

  @ManyToOne(() => Team)
  winner: Team;

  @Column({ length: 50, nullable: true })
  format: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
