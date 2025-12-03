import { Injectable } from '@nestjs/common';
import { CreateMatchOddDto } from './dto/create-match-odd.dto';
import { UpdateMatchOddDto } from './dto/update-match-odd.dto';

@Injectable()
export class MatchOddsService {
  create(_createMatchOddDto: CreateMatchOddDto) {
    void _createMatchOddDto;
    return 'This action adds a new matchOdd';
  }

  findAll() {
    return `This action returns all matchOdds`;
  }

  findOne(id: string) {
    return `This action returns a #${id} matchOdd`;
  }

  update(id: string, _updateMatchOddDto: UpdateMatchOddDto) {
    void _updateMatchOddDto;
    return `This action updates a #${id} matchOdd`;
  }

  remove(id: string) {
    return `This action removes a #${id} matchOdd`;
  }
}
