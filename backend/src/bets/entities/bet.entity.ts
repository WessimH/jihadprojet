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
import Decimal from 'decimal.js';
import { DecimalTransformer } from '../../common/transformers/decimal.transformer';

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

  @Column({
    type: 'decimal',
    precision: 8,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  amount: Decimal;

  @Column({
    name: 'potential_payout',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  potentialPayout: Decimal;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'PENDING',
  })
  status: 'PENDING' | 'WON' | 'LOST' | 'CANCELLED';

  @CreateDateColumn({ name: 'placed_at' })
  placedAt: Date;
}
