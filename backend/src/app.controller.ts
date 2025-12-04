import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Hello', description: 'Returns a hello message.' })
  @ApiResponse({ status: 200, description: 'Hello message.' })
  getHello(): string {
    return this.appService.getHello();
  }
}
