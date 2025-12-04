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

  @Column({
    name: 'match_date',
    type: process.env.NODE_ENV === 'test' ? 'datetime' : 'timestamp',
    nullable: true,
  })
  matchDate: Date | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'SCHEDULED',
  })
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

  @Column({ name: 'team1_score', type: 'int', default: 0 })
  team1Score: number;

  @Column({ name: 'team2_score', type: 'int', default: 0 })
  team2Score: number;

  @ManyToOne(() => Team)
  winner: Team;

  @Column(
    process.env.NODE_ENV === 'test'
      ? { type: 'varchar', length: 3, nullable: true }
      : {
          type: 'enum',
          enum: ['BO1', 'BO3', 'BO5'],
          enumName: 'match_format',
          nullable: true,
        },
  )
  format: 'BO1' | 'BO3' | 'BO5' | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
