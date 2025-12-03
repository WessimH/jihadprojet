import {
  Entity as ORMEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Bet } from '../../bets/entities/bet.entity';

@ORMEntity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ name: 'password_hash', length: 255, nullable: true })
  passwordHash?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: string;

  @Column({
    name: 'total_bet',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalBet: string;

  @Column({
    name: 'total_won',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalWon: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Bet, (bet) => bet.user)
  bets: Bet[];
}
