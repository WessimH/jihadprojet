import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'johndoe',
    minLength: 3,
    maxLength: 50,
    description: 'No spaces',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^\S+$/, { message: 'username must not contain spaces' })
  username!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'SecurePass1',
    minLength: 8,
    description: 'At least 1 upper, 1 lower, 1 digit',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'password must include upper, lower, and a digit',
  })
  password!: string;

  @ApiProperty({ example: 100, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  balance?: number;
}
