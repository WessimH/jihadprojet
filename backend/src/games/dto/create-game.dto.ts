import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, IsIn } from 'class-validator';

export class CreateGameDto {
  @ApiProperty({ example: 'Counter-Strike 2' })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiProperty({
    example: 'FPS',
    enum: ['FPS', 'MOBA', 'Sports', 'Fighting', 'Battle Royale'],
  })
  @IsIn(['FPS', 'MOBA', 'Sports', 'Fighting', 'Battle Royale'])
  category!: 'FPS' | 'MOBA' | 'Sports' | 'Fighting' | 'Battle Royale';
}
