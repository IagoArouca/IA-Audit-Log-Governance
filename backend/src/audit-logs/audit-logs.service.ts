import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prima.service';

@Injectable()
export class AuditLogsService {
    constructor(private prisma: PrismaService){}

    async getStats(userId: string) {
        const [totalLogs, costStats, sensitiveCount] = await Promise.all([
            this.prisma.auditLog.count({
                where: { userId },
            }),

            this.prisma.auditLog.aggregate({
                where: { userId },
                _sum: {
                    cost: true,
                },
            }),

            this.prisma.auditLog.count({
                where: {
                    userId,
                    sensitiveDataFound: true,
                },
            }),
        ]);

        return {
            totalCalls: totalLogs,
            totalCost: costStats._sum.cost || 0,
            sensitiveDataAlerts: sensitiveCount,
        };
    }
}
