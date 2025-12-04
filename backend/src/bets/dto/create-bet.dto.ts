import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateBetDto {
  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000010',
    format: 'uuid',
  })
  @IsUUID()
  user_id!: string;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000020',
    format: 'uuid',
  })
  @IsUUID()
  match_id!: string;

  @ApiProperty({
    example: '00000000-0000-0000-0000-000000000002',
    format: 'uuid',
  })
  @IsUUID()
  team_id!: string;

  @ApiProperty({ example: 50, minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiProperty({ example: 1.85, minimum: 1 })
  @IsNumber()
  @Min(1)
  odds!: number;

  // Must not be provided by client; calculated by backend
  @IsOptional()
  potential_payout?: never;
}
