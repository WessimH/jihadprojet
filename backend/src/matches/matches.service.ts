import { Injectable } from '@nestjs/common';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';

@Injectable()
export class MatchesService {
  create(_createMatchDto: CreateMatchDto) {
    void _createMatchDto;
    return 'This action adds a new match';
  }

  findAll() {
    return `This action returns all matches`;
  }

  findOne(id: string) {
    return `This action returns a #${id} match`;
  }

  update(id: string, _updateMatchDto: UpdateMatchDto) {
    void _updateMatchDto;
    return `This action updates a #${id} match`;
  }

  remove(id: string) {
    return `This action removes a #${id} match`;
  }
}
