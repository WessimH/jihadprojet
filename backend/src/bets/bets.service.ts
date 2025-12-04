import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import { Bet } from './entities/bet.entity';
import Decimal from 'decimal.js';

@Injectable()
export class BetsService {
  constructor(@InjectRepository(Bet) private readonly repo: Repository<Bet>) {}

  async create(createBetDto: CreateBetDto) {
    const amount = new Decimal(createBetDto.amount);
    const odds = new Decimal(createBetDto.odds);
    const potentialPayout = amount.mul(odds);

    const bet = this.repo.create({
      user: { id: createBetDto.user_id },
      match: { id: createBetDto.match_id },
      team: { id: createBetDto.team_id },
      amount,
      potentialPayout,
      status: 'PENDING',
    });
    return this.repo.save(bet);
  }

  findAll() {
    return this.repo.find({
      relations: ['user', 'match', 'team'],
    });
  }

  async findOne(id: string) {
    const bet = await this.repo.findOne({
      where: { id },
      relations: ['user', 'match', 'team'],
    });
    if (!bet) throw new NotFoundException('Bet not found');
    return bet;
  }

  async update(id: string, updateBetDto: UpdateBetDto) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Bet not found');

    if (updateBetDto.amount !== undefined) {
      existing.amount = new Decimal(updateBetDto.amount);
    }
    if (updateBetDto.odds !== undefined && updateBetDto.amount !== undefined) {
      existing.potentialPayout = existing.amount.mul(
        new Decimal(updateBetDto.odds),
      );
    }

    return this.repo.save(existing);
  }

  async remove(id: string) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Bet not found');
    await this.repo.remove(existing);
    return { removed: true };
  }
}
