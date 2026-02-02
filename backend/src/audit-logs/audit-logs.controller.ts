import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard} from '../auth/guards/jwt-auth.guard';


@Controller('audit-logs')
export class AuditLogsController {
    constructor(private auditLogService: AuditLogsService){}

    @UseGuards(JwtAuthGuard)
    @Get('stats')
    async getDashboardStats(@Request() req) {
        return this.auditLogService.getStats(req.user.sub);
    }
}
