import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsUUID, IsDate, IsInt, Min, IsOptional, IsIn } from 'class-validator';

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

  @ApiProperty({
    format: 'date-time',
    description:
      'Match start time. Send an ISO-8601 string; it will be converted to a Date object.',
  })
  @Type(() => Date)
  @IsDate()
  match_date!: Date;

  @ApiProperty({
    enum: ['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'],
    description:
      'Uppercase enum only: SCHEDULED | LIVE | COMPLETED | CANCELLED',
  })
  @IsIn(['SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED'])
  status!: 'SCHEDULED' | 'LIVE' | 'COMPLETED' | 'CANCELLED';

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

  @ApiProperty({
    enum: ['BO1', 'BO3', 'BO5'],
    description: 'Uppercase enum only: BO1 | BO3 | BO5',
  })
  @IsIn(['BO1', 'BO3', 'BO5'])
  format!: 'BO1' | 'BO3' | 'BO5';
}
