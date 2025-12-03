import { Injectable } from '@nestjs/common';
import { CreateMatchOddDto } from './dto/create-match-odd.dto';
import { UpdateMatchOddDto } from './dto/update-match-odd.dto';

@Injectable()
export class MatchOddsService {
  create(createMatchOddDto: CreateMatchOddDto) {
    return 'This action adds a new matchOdd';
  }

  findAll() {
    return `This action returns all matchOdds`;
  }

  findOne(id: number) {
    return `This action returns a #${id} matchOdd`;
  }

  update(id: number, updateMatchOddDto: UpdateMatchOddDto) {
    return `This action updates a #${id} matchOdd`;
  }

  remove(id: number) {
    return `This action removes a #${id} matchOdd`;
  }
}
