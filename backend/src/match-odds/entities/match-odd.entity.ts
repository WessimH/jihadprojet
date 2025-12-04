import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Match } from '../../matches/entities/match.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity({ name: 'match_odds' })
export class MatchOdd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Match)
  match: Match;

  @ManyToOne(() => Team)
  team: Team;

  @Column({ type: 'decimal', precision: 4, scale: 2 }) // todo : fix this asap wtf ia
  odds: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
