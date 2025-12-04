import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { Match } from './entities/match.entity';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match) private readonly repo: Repository<Match>,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    const match = this.repo.create({
      team1: { id: createMatchDto.team1_id },
      team2: { id: createMatchDto.team2_id },
      game: { id: createMatchDto.game_id },
      matchDate: createMatchDto.match_date,
      status: createMatchDto.status,
      team1Score: createMatchDto.team1_score,
      team2Score: createMatchDto.team2_score,
      winner: createMatchDto.winner_id
        ? { id: createMatchDto.winner_id }
        : undefined,
      format: createMatchDto.format,
    });
    return this.repo.save(match);
  }

  findAll() {
    return this.repo.find({
      relations: ['team1', 'team2', 'game', 'winner'],
    });
  }

  async findOne(id: string) {
    const match = await this.repo.findOne({
      where: { id },
      relations: ['team1', 'team2', 'game', 'winner'],
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }

  async update(id: string, updateMatchDto: UpdateMatchDto) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Match not found');

    if (updateMatchDto.team1_id)
      existing.team1 = { id: updateMatchDto.team1_id } as Match['team1'];
    if (updateMatchDto.team2_id)
      existing.team2 = { id: updateMatchDto.team2_id } as Match['team2'];
    if (updateMatchDto.game_id)
      existing.game = { id: updateMatchDto.game_id } as Match['game'];
    if (updateMatchDto.match_date)
      existing.matchDate = updateMatchDto.match_date;
    if (updateMatchDto.status) existing.status = updateMatchDto.status;
    if (updateMatchDto.team1_score !== undefined)
      existing.team1Score = updateMatchDto.team1_score;
    if (updateMatchDto.team2_score !== undefined)
      existing.team2Score = updateMatchDto.team2_score;
    if (updateMatchDto.winner_id)
      existing.winner = { id: updateMatchDto.winner_id } as Match['winner'];
    if (updateMatchDto.format) existing.format = updateMatchDto.format;

    return this.repo.save(existing);
  }

  async remove(id: string) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Match not found');
    await this.repo.remove(existing);
    return { removed: true };
  }
}
