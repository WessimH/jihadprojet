import { PartialType } from '@nestjs/swagger';
import { CreateMatchOddDto } from './create-match-odd.dto';

export class UpdateMatchOddDto extends PartialType(CreateMatchOddDto) {}
