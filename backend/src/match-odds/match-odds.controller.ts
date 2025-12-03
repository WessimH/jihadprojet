import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MatchOddsService } from './match-odds.service';
import { CreateMatchOddDto } from './dto/create-match-odd.dto';
import { UpdateMatchOddDto } from './dto/update-match-odd.dto';

@Controller('match-odds')
export class MatchOddsController {
  constructor(private readonly matchOddsService: MatchOddsService) {}

  @Post()
  create(@Body() createMatchOddDto: CreateMatchOddDto) {
    return this.matchOddsService.create(createMatchOddDto);
  }

  @Get()
  findAll() {
    return this.matchOddsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.matchOddsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMatchOddDto: UpdateMatchOddDto) {
    return this.matchOddsService.update(+id, updateMatchOddDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.matchOddsService.remove(+id);
  }
}
