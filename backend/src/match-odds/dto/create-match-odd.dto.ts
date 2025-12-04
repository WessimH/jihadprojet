import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, Min } from 'class-validator';

export class CreateMatchOddDto {
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

  @ApiProperty({ example: 1.65, minimum: 1.01 })
  @IsNumber()
  @Min(1.01)
  odds!: number;
}
