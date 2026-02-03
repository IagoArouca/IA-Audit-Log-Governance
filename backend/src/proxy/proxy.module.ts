import { Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { PrismaService } from '../prisma/prisma.service';
import { ApiKeysService } from '../api-key/api-key.service';

@Module({
  controllers: [ProxyController],
  providers: [ProxyService, PrismaService, ApiKeysService],
})
export class ProxyModule {}