import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) {
      throw new UnauthorizedException('API Key ausente no header x-api-key');
    }
    const keyRecord = await this.prisma.apiKey.findUnique({
      where: { key: apiKey },
      include: { user: true }, 
    });

    if (!keyRecord || !keyRecord.isActive) {
      throw new UnauthorizedException('API Key inválida ou revogada');
    }

    request.user = keyRecord.user;
    request.apiKeyId = keyRecord.id;

    return true;
  }
}