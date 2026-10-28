import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { GoogleAuthService } from './google.service';
import { TurnstileService } from './turnstile.service';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthGuard,
    RolesGuard,
    GoogleAuthService,
    TurnstileService,
  ],
  exports: [
    AuthService,
    AuthGuard,
    RolesGuard,
    GoogleAuthService,
    TurnstileService,
  ],
})
export class AuthModule {}
