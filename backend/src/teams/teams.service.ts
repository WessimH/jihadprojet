import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';
import Decimal from 'decimal.js';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team) private readonly repo: Repository<Team>,
  ) {}

  async create(createTeamDto: CreateTeamDto) {
    // Check for duplicate tag
    const existing = await this.repo.findOne({
      where: { tag: createTeamDto.tag },
    });
    if (existing) {
      throw new ConflictException('Team with this tag already exists');
    }

    const team = this.repo.create({
      ...createTeamDto,
      totalEarnings: new Decimal(createTeamDto.total_earnings ?? 0),
    });
    return this.repo.save(team);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const team = await this.repo.findOne({ where: { id } });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async update(id: string, updateTeamDto: UpdateTeamDto) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Team not found');

    // Check for duplicate tag if changing
    if (updateTeamDto.tag && updateTeamDto.tag !== existing.tag) {
      const dup = await this.repo.findOne({
        where: { tag: updateTeamDto.tag },
      });
      if (dup) throw new ConflictException('Team with this tag already exists');
    }

    if (updateTeamDto.name) existing.name = updateTeamDto.name;
    if (updateTeamDto.tag) existing.tag = updateTeamDto.tag;
    if (updateTeamDto.country) existing.country = updateTeamDto.country;
    if (updateTeamDto.logo_url !== undefined)
      existing.logoUrl = updateTeamDto.logo_url;
    if (updateTeamDto.founded_year !== undefined)
      existing.foundedYear = updateTeamDto.founded_year;
    if (updateTeamDto.total_earnings !== undefined) {
      existing.totalEarnings = new Decimal(updateTeamDto.total_earnings);
    }

    return this.repo.save(existing);
  }

  async remove(id: string) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Team not found');
    await this.repo.remove(existing);
    return { removed: true };
  }
}
