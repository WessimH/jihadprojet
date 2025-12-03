import { Injectable } from '@nestjs/common';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';

@Injectable()
export class BetsService {
  create(_createBetDto: CreateBetDto) {
    void _createBetDto;
    return 'This action adds a new bet';
  }

  findAll() {
    return `This action returns all bets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bet`;
  }

  update(id: number, _updateBetDto: UpdateBetDto) {
    void _updateBetDto;
    return `This action updates a #${id} bet`;
  }

  remove(id: number) {
    return `This action removes a #${id} bet`;
  }
}
