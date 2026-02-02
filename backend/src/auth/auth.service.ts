import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService} from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { access } from 'fs';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any>{
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result} = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id};
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    async createUser(email: string, name: string, pass: string){
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (user) {
             throw new UnauthorizedException('Este email ja existe');
        }
        const passwordHashed = await bcrypt.hash(pass, 10);
        const result = await this.prisma.user.create.createUser({
            email: email,
            name: name,
            pass: passwordHashed,
        });
    }
}
