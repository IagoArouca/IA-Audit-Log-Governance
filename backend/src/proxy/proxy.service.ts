import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProxyService {
  constructor(private prisma: PrismaService) {}

  async processAiCall(userId: string, prompt: string) {
    const sensitiveRegex = /(\d{3}\.\d{3}\.\d{3}-\d{2})|(\d{4}-\d{4}-\d{4}-\d{4})/;
    const hasSensitiveData = sensitiveRegex.test(prompt);
    const mockAiResponse = "Esta resposta foi auditada e processada pelo Sentinel.io para garantir a conformidade com as políticas de dados da empresa.";
    
    const tokens = Math.ceil(prompt.length / 4) + 20; 
    const cost = tokens * 0.00002;

    const log = await this.prisma.auditLog.create({
      data: {
        prompt,
        response: mockAiResponse,
        tokensUsed: tokens,
        cost: cost,
        sensitiveDataFound: hasSensitiveData,
        provider: 'OpenAI-Simulated',
        userId: userId,
      }
    });

    return {
      id: log.id,
      content: mockAiResponse,
      audit: {
        sensitive_data_detected: hasSensitiveData,
        cost_usd: cost,
        timestamp: log.createdAt
      }
    };
  }
}