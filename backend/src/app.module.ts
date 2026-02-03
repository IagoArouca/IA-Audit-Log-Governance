import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ApiKeyModule } from './api-key/api-key.module';
import { ProxyModule } from './proxy/proxy.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthModule, AuditLogsModule, ApiKeyModule, ProxyModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
