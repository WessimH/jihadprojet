import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsInt,
  Min,
  Max,
  Matches,
  Length,
  IsNumber,
} from 'class-validator';

export class CreateTeamDto {
  @ApiProperty({ example: 'Team Liquid' })
  @IsString()
  @Length(1, 100)
  name!: string;

  @ApiProperty({
    example: 'TL',
    description: 'Uppercase short tag (2-5 chars)',
  })
  @IsString()
  @Length(2, 5)
  @Matches(/^[A-Z]{2,5}$/)
  tag!: string;

  @ApiProperty({
    example: 'US',
    description: 'ISO country code (e.g., FR, USA)',
  })
  @IsString()
  @Length(2, 3)
  @Matches(/^[A-Z]{2,3}$/)
  country!: string;

  @ApiProperty({ example: 'https://example.com/logo.png', required: false })
  @IsOptional()
  @IsUrl()
  logo_url?: string;

  @ApiProperty({
    example: 2000,
    minimum: 1970,
    maximum: new Date().getFullYear(),
  })
  @IsInt()
  @Min(1970)
  @Max(new Date().getFullYear())
  founded_year!: number;

  @ApiProperty({ example: 500000.5, minimum: 0 })
  @IsNumber()
  @Min(0)
  total_earnings!: number;
}
