import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly repo: Repository<Game>,
  ) {}

  async create(createGameDto: CreateGameDto) {
    // Check for duplicate name
    const existing = await this.repo.findOne({
      where: { name: createGameDto.name },
    });
    if (existing) {
      throw new ConflictException('Game with this name already exists');
    }

    const game = this.repo.create(createGameDto);
    return this.repo.save(game);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: string) {
    const game = await this.repo.findOne({ where: { id } });
    if (!game) throw new NotFoundException('Game not found');
    return game;
  }

  async update(id: string, updateGameDto: UpdateGameDto) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Game not found');

    // Check for duplicate name if changing
    if (updateGameDto.name && updateGameDto.name !== existing.name) {
      const dup = await this.repo.findOne({
        where: { name: updateGameDto.name },
      });
      if (dup)
        throw new ConflictException('Game with this name already exists');
    }

    Object.assign(existing, updateGameDto);
    return this.repo.save(existing);
  }

  async remove(id: string) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException('Game not found');
    await this.repo.remove(existing);
    return { removed: true };
  }
}
