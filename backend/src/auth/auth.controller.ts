import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor( private authservice: AuthService){}

    @Post('login')
    async login(@Body() body: any) {
        const user = await this.authservice.validateUser(body.email, body.password);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
        return this.authservice.login(user)
    }

    @Post('register')
    async register(@Body() body: any) {
        return this.authservice.createUser(body.email, body.name, body.password);
    }
    
}
