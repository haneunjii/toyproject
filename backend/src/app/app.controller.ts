import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Hello World를 반환합니다.' })
  async getHello(): Promise<string> {
    return 'Hello World';
  }
}
