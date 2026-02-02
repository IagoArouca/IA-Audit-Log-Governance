import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'sentinel-secret-key-2026',
      signOptions: { expiresIn: '1d' }, // Token vale por 1 dia
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService], // Adicione o JwtStrategy aqui
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
