import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Match } from '../../matches/entities/match.entity';
import { Team } from '../../teams/entities/team.entity';

@Entity({ name: 'bets' })
export class Bet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bets)
  user: User;

  @ManyToOne(() => Match)
  match: Match;

  @ManyToOne(() => Team)
  team: Team;

  @Column({ type: 'decimal', precision: 8, scale: 2 })
  amount: string;

  @Column({ type: 'decimal', precision: 4, scale: 2 })
  odds: string;

  @Column({
    name: 'potential_payout',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  potentialPayout: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'pending',
  })
  status: 'pending' | 'won' | 'lost' | 'cancelled';

  @CreateDateColumn({ name: 'placed_at' })
  placedAt: Date;
}
