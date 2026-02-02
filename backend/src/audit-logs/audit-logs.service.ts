import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogsService {
    constructor(private prisma: PrismaService) {}

    async getStats(userId: string) {
        const stats = await this.prisma.auditLog.aggregate({
            where: { userId },
            _count: {
                _all: true,                  
                sensitiveDataFound: true,   
            },
            _sum: {
                cost: true,  
            },
        });

        return {
            totalCalls: stats._count._all,
            totalCost: stats._sum.cost || 0,
            sensitiveDataAlerts: stats._count.sensitiveDataFound || 0,
        };
    }
}
