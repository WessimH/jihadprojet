import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity({ name: 'teams' })
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 10, unique: true })
  tag: string;

  @Column({ length: 3, default: 'FR' })
  country: string;

  @Column({ name: 'logo_url', length: 255, nullable: true })
  logoUrl?: string;

  @Column({ name: 'founded_year', type: 'int', nullable: true })
  foundedYear?: number;

  @Column({
    name: 'total_earnings',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalEarnings: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
