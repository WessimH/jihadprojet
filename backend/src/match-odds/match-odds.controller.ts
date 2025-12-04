import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MatchOddsService } from './match-odds.service';
import { CreateMatchOddDto } from './dto/create-match-odd.dto';
import { UpdateMatchOddDto } from './dto/update-match-odd.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@ApiTags('Match Odds')
@Controller('match-odds')
export class MatchOddsController {
  constructor(private readonly matchOddsService: MatchOddsService) {}

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @ApiOperation({
    summary: 'Create match odds',
    description:
      'Create odds entry for a match and team. Provide match_id, team_id (must be in the match), and odds ≥ 1.01. Exactly two entries per match are expected (team1 and team2).',
  })
  @ApiResponse({ status: 201, description: 'Match odds created.' })
  @ApiBody({
    description: 'Match odd payload',
    schema: {
      example: {
        match_id: '00000000-0000-0000-0000-000000000020',
        team_id: '00000000-0000-0000-0000-000000000002',
        odds: 1.65,
      },
    },
  })
  create(@Body() createMatchOddDto: CreateMatchOddDto) {
    return this.matchOddsService.create(createMatchOddDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List match odds',
    description: 'Return all match odds.',
  })
  @ApiResponse({ status: 200, description: 'List of match odds.' })
  findAll() {
    return this.matchOddsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get match odds',
    description: 'Return odds by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Match odd ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Odds found.' })
  findOne(@Param('id') id: string) {
    return this.matchOddsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update match odds',
    description: 'Update odds by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Match odd ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Odds updated.' })
  update(
    @Param('id') id: string,
    @Body() updateMatchOddDto: UpdateMatchOddDto,
  ) {
    return this.matchOddsService.update(id, updateMatchOddDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete match odds',
    description: 'Delete odds by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Match odd ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Odds removed.' })
  remove(@Param('id') id: string) {
    return this.matchOddsService.remove(id);
  }
}
