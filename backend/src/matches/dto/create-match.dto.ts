import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsDateString,
  IsInt,
  Min,
  IsOptional,
  IsIn,
} from 'class-validator';

export class CreateMatchDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  tournament_id!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  team1_id!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  team2_id!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  game_id!: string;

  @ApiProperty({ format: 'date-time' })
  @IsDateString()
  match_date!: string;

  @ApiProperty({ enum: ['scheduled', 'live', 'completed', 'cancelled'] })
  @IsIn(['scheduled', 'live', 'completed', 'cancelled'])
  status!: 'scheduled' | 'live' | 'completed' | 'cancelled';

  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  team1_score!: number;

  @ApiProperty({ minimum: 0 })
  @IsInt()
  @Min(0)
  team2_score!: number;

  @ApiProperty({ format: 'uuid', required: false })
  @IsOptional()
  @IsUUID()
  winner_id?: string;

  @ApiProperty({ enum: ['Bo1', 'Bo3', 'Bo5'] })
  @IsIn(['Bo1', 'Bo3', 'Bo5'])
  format!: 'Bo1' | 'Bo3' | 'Bo5';
}
