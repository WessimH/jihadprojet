import {
  Entity as ORMEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import Decimal from 'decimal.js';
import { DecimalTransformer } from '../../common/transformers/decimal.transformer';
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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalTransformer(),
  })
  balance: Decimal;

  @Column({
    name: 'total_bet',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Column({
    name: 'total_bet',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalTransformer(),
  })
  totalBet: Decimal;

  @Column({
    name: 'total_won',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @Column({
    name: 'total_won',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalTransformer(),
  })
  totalWon: Decimal;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_admin', type: 'boolean', default: false })
  isAdmin: boolean;

  @OneToMany(() => Bet, (bet) => bet.user)
  bets: Bet[];
}
