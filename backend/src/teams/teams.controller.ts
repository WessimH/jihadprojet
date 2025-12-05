import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/admin.guard';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Teams')
@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a team',
    description:
      'Create a new team. tag must be 2–5 uppercase letters. country is ISO2 or ISO3 uppercase. total_earnings ≥ 0.',
  })
  @ApiResponse({ status: 201, description: 'Team created successfully.' })
  @ApiBody({
    description: 'Team payload',
    schema: {
      example: {
        name: 'Team Liquid',
        tag: 'TL',
        country: 'US',
        logo_url: 'https://example.com/logo.png',
        founded_year: 2000,
        total_earnings: 123456.78,
      },
    },
  })
  create(@Body() createTeamDto: CreateTeamDto) {
    try {
      return this.teamsService.create(createTeamDto);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to create team';

      const details =
        err && typeof err === 'object' && 'details' in err
          ? (err as Record<string, unknown>)['details']
          : undefined;

      throw new BadRequestException({ error: 'bad_request', message, details });
    }
  }

  @Get()
  @ApiOperation({ summary: 'List teams', description: 'Return all teams.' })
  @ApiResponse({ status: 200, description: 'List of teams.' })
  findAll() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a team', description: 'Return a team by ID.' })
  @ApiParam({
    name: 'id',
    description: 'Team ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Team found.' })
  findOne(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.teamsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a team',
    description: 'Update a team by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Team ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Team updated.' })
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ) {
    return this.teamsService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a team',
    description: 'Delete a team by ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Team ID (UUID)',
    schema: { format: 'uuid' },
  })
  @ApiResponse({ status: 200, description: 'Team removed.' })
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.teamsService.remove(id);
  }
}
