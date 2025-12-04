import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AdminGuard } from './admin.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? 'placeholder',
      signOptions: { expiresIn: '3600s' },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtAuthGuard, AdminGuard],
  controllers: [AuthController],
  exports: [JwtModule, AuthService, JwtAuthGuard, AdminGuard],
})
export class AuthModule {}
