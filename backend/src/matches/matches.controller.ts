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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a match',
    description:
      'Create a new match. Enums are uppercase (status: SCHEDULED|LIVE|COMPLETED|CANCELLED, format: BO1|BO3|BO5). match_date accepts an ISO string and is converted to a Date.',
  })
  @ApiResponse({ status: 201, description: 'Match created successfully.' })
  @ApiBody({
    description: 'Match payload',
    schema: {
      example: {
        tournament_id: '00000000-0000-0000-0000-000000000001',
        team1_id: '00000000-0000-0000-0000-000000000002',
        team2_id: '00000000-0000-0000-0000-000000000003',
        game_id: '00000000-0000-0000-0000-000000000004',
        match_date: '2025-12-03T18:45:00.000Z',
        status: 'SCHEDULED',
        team1_score: 0,
        team2_score: 0,
        format: 'BO3',
      },
    },
  })
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchesService.create(createMatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'List matches', description: 'Return all matches.' })
  @ApiResponse({ status: 200, description: 'List of matches.' })
  findAll() {
    return this.matchesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a match',
    description: 'Return a single match by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Match ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Match found.' })
  findOne(@Param('id') id: string) {
    return this.matchesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a match',
    description: 'Update fields of a match by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Match ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Match updated.' })
  update(@Param('id') id: string, @Body() updateMatchDto: UpdateMatchDto) {
    return this.matchesService.update(id, updateMatchDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a match',
    description: 'Delete a match by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Match ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Match removed.' })
  remove(@Param('id') id: string) {
    return this.matchesService.remove(id);
  }
}
