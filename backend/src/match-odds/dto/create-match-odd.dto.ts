import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateMatchOddDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  match_id!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  team_id!: string;

  @ApiProperty({ minimum: 1.01 })
  @IsNumber()
  @Min(1.01)
  odds!: number;
}
