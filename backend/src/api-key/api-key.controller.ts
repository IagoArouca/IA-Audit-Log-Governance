import { Controller, Post, Get, Delete, Body, UseGuards, Request, Param } from '@nestjs/common';
import { ApiKeysService } from './api-key.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api-keys')
@UseGuards(JwtAuthGuard) 
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  async generate(@Request() req, @Body('name') name: string) {
    return this.apiKeysService.create(req.user.userId, name || 'Nova Chave');
  }

  @Get()
  async list(@Request() req) {
    return this.apiKeysService.findAll(req.user.userId);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    return this.apiKeysService.revoke(id, req.user.userId);
  }
}