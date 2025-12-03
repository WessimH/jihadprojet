import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetDto } from './dto/create-bet.dto';
import { UpdateBetDto } from './dto/update-bet.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Bets')
@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post()
  @ApiOperation({
    summary: 'Place a bet',
    description:
      'Create a new bet. Provide user_id, match_id, team_id (must belong to the match), amount > 0, and odds ≥ 1. potential_payout is calculated by backend.',
  })
  @ApiResponse({ status: 201, description: 'Bet created successfully.' })
  @ApiBody({
    description: 'Bet payload',
    schema: {
      example: {
        user_id: '00000000-0000-0000-0000-000000000010',
        match_id: '00000000-0000-0000-0000-000000000020',
        team_id: '00000000-0000-0000-0000-000000000002',
        amount: 25,
        odds: 1.85,
      },
    },
  })
  create(@Body() createBetDto: CreateBetDto) {
    return this.betsService.create(createBetDto);
  }

  @Get()
  @ApiOperation({ summary: 'List bets', description: 'Return all bets.' })
  @ApiResponse({ status: 200, description: 'List of bets.' })
  findAll() {
    return this.betsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a bet',
    description: 'Return a single bet by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Bet ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Bet found.' })
  findOne(@Param('id') id: string) {
    return this.betsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a bet',
    description: 'Update fields of a bet by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Bet ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Bet updated.' })
  update(@Param('id') id: string, @Body() updateBetDto: UpdateBetDto) {
    return this.betsService.update(id, updateBetDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a bet', description: 'Delete a bet by ID.' })
  @ApiParam({
    name: 'id',
    description: 'Bet ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Bet removed.' })
  remove(@Param('id') id: string) {
    return this.betsService.remove(id);
  }
}
