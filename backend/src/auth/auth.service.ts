import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        };
    }

    async createUser(email: string, name: string, pass: string) {
        const userExists = await this.prisma.user.findUnique({
            where: { email },
        });

        if (userExists) {
            throw new ConflictException('Este e-mail já está cadastrado');
        }
        const saltOrRounds = 10;
        const passwordHashed = await bcrypt.hash(pass, saltOrRounds);
        const newUser = await this.prisma.user.create({
            data: {
                email,
                name,
                password: passwordHashed, 
            },
        });

        return this.login(newUser);
    }
}