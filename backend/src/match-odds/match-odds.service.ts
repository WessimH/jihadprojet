import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchOddDto } from './dto/create-match-odd.dto';
import { UpdateMatchOddDto } from './dto/update-match-odd.dto';
import { MatchOdd } from './entities/match-odd.entity';
import Decimal from 'decimal.js';

@Injectable()
export class MatchOddsService {
  constructor(
    @InjectRepository(MatchOdd) private readonly repo: Repository<MatchOdd>,
  ) {}

  async create(createMatchOddDto: CreateMatchOddDto) {
    const matchOdd = this.repo.create({
      match: { id: createMatchOddDto.match_id },
      team: { id: createMatchOddDto.team_id },
      odds: new Decimal(createMatchOddDto.odds),
    });
    return this.repo.save(matchOdd);
  }

  findAll() {
    return this.repo.find({
      relations: ['match', 'team'],
    });
  }

  async findOne(id: string) {
    const matchOdd = await this.repo.findOne({
      where: { id },
      relations: ['match', 'team'],
    });
    if (!matchOdd) throw new NotFoundException('Match odd not found');
    return matchOdd;
  }

  async update(id: string, updateMatchOddDto: UpdateMatchOddDto) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Match odd not found');

    if (updateMatchOddDto.odds !== undefined) {
      existing.odds = new Decimal(updateMatchOddDto.odds);
    }
    if (updateMatchOddDto.match_id) {
      existing.match = { id: updateMatchOddDto.match_id } as MatchOdd['match'];
    }
    if (updateMatchOddDto.team_id) {
      existing.team = { id: updateMatchOddDto.team_id } as MatchOdd['team'];
    }

    return this.repo.save(existing);
  }

  async remove(id: string) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Match odd not found');
    await this.repo.remove(existing);
    return { removed: true };
  }
}
