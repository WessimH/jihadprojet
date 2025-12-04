import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import Decimal from 'decimal.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    if (createUserDto.password) {
      user.passwordHash = await bcrypt.hash(createUserDto.password, 10);
    }
    user.balance = new Decimal(createUserDto.balance ?? 0);
    user.totalBet = new Decimal(0);
    user.totalWon = new Decimal(0);
    return this.repo.save(user);
  }

  findAll() {
    return this.repo.find();
  }

  findOne(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException();
    if (updateUserDto.password) {
      existing.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (typeof updateUserDto.balance !== 'undefined') {
      existing.balance = new Decimal(updateUserDto.balance);
    }
    // apply other updates if present
    if (updateUserDto.email) existing.email = updateUserDto.email;
    if (updateUserDto.username) existing.username = updateUserDto.username;
    return this.repo.save(existing);
  }

  async remove(id: string) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException();
    await this.repo.remove(existing);
    return { removed: true };
  }
}
