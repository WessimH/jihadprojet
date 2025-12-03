import { Injectable } from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

@Injectable()
export class TeamsService {
  create(_createTeamDto: CreateTeamDto) {
    void _createTeamDto;
    return 'This action adds a new team';
  }

  findAll() {
    return `This action returns all teams`;
  }

  findOne(id: string) {
    return `This action returns a #${id} team`;
  }

  update(id: string, _updateTeamDto: UpdateTeamDto) {
    void _updateTeamDto;
    return `This action updates a #${id} team`;
  }

  remove(id: string) {
    return `This action removes a #${id} team`;
  }
}
