import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateBetDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  user_id!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  match_id!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  team_id!: string;

  @ApiProperty({ minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ minimum: 1 })
  @IsNumber()
  @Min(1)
  odds!: number;

  // Must not be provided by client; calculated by backend
  @IsOptional()
  potential_payout?: never;
}
