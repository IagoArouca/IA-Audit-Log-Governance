import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes } from 'crypto';

@Injectable()
export class ApiKeysService {
    constructor(private prisma: PrismaService){}

    async create(userId: string, name: string) {
        const randomString = randomBytes(24).toString('hex');

        const apiKey = `IA_audit_${randomString}`

        return this.prisma.apiKey.create({
            data: {
                key: apiKey,
                name: name, 
                userId: userId,
            },
            select: {
                id: true,
                key: true,
                name: true,
                createdAt: true,
            }
        });
    }

    async findAll(userId: string) {
        return this.prisma.apiKey.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
    
    async revoke(id:string, userId: string){
        return this.prisma.apiKey.deleteMany({
            where: { id, userId },
        });
    }
}
