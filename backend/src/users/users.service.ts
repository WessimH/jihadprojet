import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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
    // Check for existing username/email before insert
    const existingUsername = await this.repo.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await this.repo.findOne({
      where: { email: createUserDto.email },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const user = new User();
    user.username = createUserDto.username;
    user.email = createUserDto.email;
    if (createUserDto.password) {
      user.passwordHash = await bcrypt.hash(createUserDto.password, 10);
    }
    user.balance = new Decimal(createUserDto.balance ?? 0);
    user.totalBet = new Decimal(0);
    user.totalWon = new Decimal(0);

    try {
      return await this.repo.save(user);
    } catch (err) {
      // Handle race condition where duplicate was inserted between check and save
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException('Username or email already exists');
      }
      throw err;
    }
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

    // Check for duplicate username if changing
    if (
      updateUserDto.username &&
      updateUserDto.username !== existing.username
    ) {
      const dup = await this.repo.findOne({
        where: { username: updateUserDto.username },
      });
      if (dup) throw new ConflictException('Username already exists');
    }

    // Check for duplicate email if changing
    if (updateUserDto.email && updateUserDto.email !== existing.email) {
      const dup = await this.repo.findOne({
        where: { email: updateUserDto.email },
      });
      if (dup) throw new ConflictException('Email already exists');
    }

    if (updateUserDto.password) {
      existing.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (typeof updateUserDto.balance !== 'undefined') {
      existing.balance = new Decimal(updateUserDto.balance);
    }
    if (updateUserDto.email) existing.email = updateUserDto.email;
    if (updateUserDto.username) existing.username = updateUserDto.username;
    if (typeof updateUserDto.isAdmin !== 'undefined') {
      existing.isAdmin = updateUserDto.isAdmin;
    }

    try {
      return await this.repo.save(existing);
    } catch (err) {
      if ((err as { code?: string }).code === '23505') {
        throw new ConflictException('Username or email already exists');
      }
      throw err;
    }
  }

  async remove(id: string) {
    const existing = await this.repo.findOne({ where: { id } });
    if (!existing) throw new NotFoundException();
    await this.repo.remove(existing);
    return { removed: true };
  }
}
