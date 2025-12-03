import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  // Minimal handler to satisfy lint rule; replace with real endpoints later
  @Get('health')
  health(): string {
    return 'ok';
  }
}
