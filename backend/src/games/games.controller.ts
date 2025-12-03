import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GamesService } from './games.service';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Games')
@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a game',
    description:
      'Create a new game. category must be one of: FPS | MOBA | Sports | Fighting | Battle Royale.',
  })
  @ApiResponse({ status: 201, description: 'Game created successfully.' })
  @ApiBody({
    description: 'Game payload',
    schema: {
      example: {
        name: 'Counter-Strike 2',
        category: 'FPS',
      },
    },
  })
  create(@Body() createGameDto: CreateGameDto) {
    return this.gamesService.create(createGameDto);
  }

  @Get()
  @ApiOperation({ summary: 'List games', description: 'Return all games.' })
  @ApiResponse({ status: 200, description: 'List of games.' })
  findAll() {
    return this.gamesService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a game',
    description: 'Return a game by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Game ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Game found.' })
  findOne(@Param('id') id: string) {
    return this.gamesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a game',
    description: 'Update a game by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Game ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Game updated.' })
  update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(id, updateGameDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a game',
    description: 'Delete a game by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Game ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Game removed.' })
  remove(@Param('id') id: string) {
    return this.gamesService.remove(id);
  }
}
