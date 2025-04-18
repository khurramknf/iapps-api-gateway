// service/api-gateway/backend/src/app.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return { status: 'ok' };
  }

  @Post('api/auth/register')
  async register(@Body() body: any) {
    return this.appService.proxyRequest('auth', 'register', body);
  }

  @Post('api/auth/login')
  async login(@Body() body: any) {
    return this.appService.proxyRequest('auth', 'login', body);
  }

  @Get('api/users')
  async getUsers() {
    return this.appService.proxyRequest('users', 'getUsers');
  }

  @Get('api/users/email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.appService.proxyRequest('users', 'getUserByEmail', { email });
  }

  @Get('api/users/:id')
  async getUserById(@Param('id') id: string) {
    return this.appService.proxyRequest('users', 'getUserById', { id });
  }
}
