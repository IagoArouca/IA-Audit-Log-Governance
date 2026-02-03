import { Module } from '@nestjs/common';
import { ApiKeysController } from './api-key.controller';
import { ApiKeysService } from './api-key.service';

@Module({
  controllers: [ApiKeysController],
  providers: [ApiKeysService]
})
export class ApiKeyModule {}
