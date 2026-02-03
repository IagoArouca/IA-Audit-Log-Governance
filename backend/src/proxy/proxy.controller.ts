import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiKeyGuard } from '../api-key/guards/api-key.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('proxy')
export class ProxyController {
  constructor(private prisma: PrismaService) {}

  @UseGuards(ApiKeyGuard)
  @Post('chat')
  async proxyChat(@Request() req, @Body('prompt') prompt: string) {
    
    const sensitiveRegex = /(\d{3}\.\d{3}\.\d{3}-\d{2})|(\d{4}-\d{4}-\d{4}-\d{4})/;
    const hasSensitiveData = sensitiveRegex.test(prompt);

    const mockAiResponse = "Esta é uma resposta segura processada pelo Sentinel.io.";
    const mockTokens = prompt.length / 4; 
    const mockCost = (mockTokens * 0.00002); 

    await this.prisma.auditLog.create({
      data: {
        prompt: prompt,
        response: mockAiResponse,
        tokensUsed: Math.ceil(mockTokens),
        cost: mockCost,
        sensitiveDataFound: hasSensitiveData,
        provider: 'OpenAI-Simulated',
        userId: req.user.id, 
      }
    });

    return {
      status: 'audited',
      data: mockAiResponse,
      security_check: {
        sensitive_data_leaked: hasSensitiveData,
        action: hasSensitiveData ? 'Flagged' : 'Cleared'
      }
    };
  }
}