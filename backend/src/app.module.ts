import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ApiKeyModuleModule } from './api-key-module/api-key-module.module';
import { ApiKeyModule } from './api-key/api-key.module';

@Module({
  imports: [AuthModule, AuditLogsModule, ApiKeyModuleModule, ApiKeyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
