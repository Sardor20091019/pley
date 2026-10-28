import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService, AuthSessionResponse } from './auth.service';
import {
  GoogleCallbackDto,
  GoogleCredentialDto,
} from './dto/auth.dto';
import { AuthGuard, Public } from './auth.guard';
import { UsersTable } from '../database/database.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Get('google/url')
  public getGoogleUrl(
    @Query('redirectUri') redirectUri: string,
    @Query('state') state?: string,
  ): { url: string } {
    const url = this.authService.getGoogleAuthUrl(redirectUri, state);
    return { url };
  }

  @Public()
  @Post('google/callback')
  @HttpCode(HttpStatus.OK)
  public async googleCallback(
    @Body() dto: GoogleCallbackDto,
    @Req() req: any,
  ): Promise<AuthSessionResponse> {
    const remoteIp = req.ip || req.headers['x-forwarded-for'];
    return this.authService.loginWithGoogleCode(dto, remoteIp);
  }

  @Public()
  @Post('google/credential')
  @HttpCode(HttpStatus.OK)
  public async googleCredential(
    @Body() dto: GoogleCredentialDto,
    @Req() req: any,
  ): Promise<AuthSessionResponse> {
    const remoteIp = req.ip || req.headers['x-forwarded-for'];
    return this.authService.loginWithGoogleCredential(dto, remoteIp);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  public async getCurrentUser(
    @Req() req: { user: UsersTable },
  ): Promise<{ user: UsersTable }> {
    return { user: req.user };
  }
}
