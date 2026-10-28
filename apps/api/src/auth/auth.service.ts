import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UsersTable, UserRole } from '../database/database.types';
import { GoogleAuthService, GoogleUserProfile } from './google.service';
import { TurnstileService } from './turnstile.service';
import { GoogleCallbackDto, GoogleCredentialDto } from './dto/auth.dto';
import * as crypto from 'crypto';

export interface AuthSessionResponse {
  token: string;
  user: UsersTable;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly turnstileService: TurnstileService,
  ) {}

  public getGoogleAuthUrl(redirectUri: string, state?: string): string {
    return this.googleAuthService.getAuthorizationUrl(redirectUri, state);
  }

  public async loginWithGoogleCode(
    dto: GoogleCallbackDto,
    remoteIp?: string,
  ): Promise<AuthSessionResponse> {
    if (dto.turnstileToken) {
      await this.turnstileService.verifyToken(dto.turnstileToken, remoteIp);
    }

    const googleUser = await this.googleAuthService.exchangeCode(
      dto.code,
      dto.redirectUri,
    );

    return this.findOrCreateGoogleUser(googleUser);
  }

  public async loginWithGoogleCredential(
    dto: GoogleCredentialDto,
    remoteIp?: string,
  ): Promise<AuthSessionResponse> {
    if (dto.turnstileToken) {
      await this.turnstileService.verifyToken(dto.turnstileToken, remoteIp);
    }

    const googleUser = await this.googleAuthService.verifyCredential(
      dto.credential,
    );

    return this.findOrCreateGoogleUser(googleUser);
  }

  public async findOrCreateGoogleUser(
    profile: GoogleUserProfile,
  ): Promise<AuthSessionResponse> {
    const db = this.databaseService.getDb();

    let user = await db
      .selectFrom('users')
      .selectAll()
      .where((eb) =>
        eb.or([
          eb('google_id', '=', profile.sub),
          eb('email', '=', profile.email),
        ]),
      )
      .executeTakeFirst();

    const now = new Date().toISOString();

    if (user) {
      if (!user.google_id) {
        await db
          .updateTable('users')
          .set({
            google_id: profile.sub,
            updated_at: now,
          })
          .where('id', '=', user.id)
          .execute();
      }

      user = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', user.id)
        .executeTakeFirstOrThrow();
    } else {
      const newUserId = `usr_g_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const adminEmails = (process.env.ADMIN_EMAILS || 'admin@pley.uz')
        .split(',')
        .map((e) => e.trim().toLowerCase());

      const assignedRole: UserRole = adminEmails.includes(
        profile.email.toLowerCase(),
      )
        ? 'ADMIN'
        : 'USER';

      const firstName = profile.given_name || profile.name || 'Player';
      const lastName = profile.family_name || null;

      await db
        .insertInto('users')
        .values({
          id: newUserId,
          google_id: profile.sub,
          email: profile.email,
          telegram_id: null,
          telegram_username: null,
          first_name: firstName,
          last_name: lastName,
          avatar_url: profile.picture || null,
          age_bracket: '18-24',
          skill_level: 'BEGINNER',
          preferred_sports: JSON.stringify(['table-tennis']),
          preferred_neighborhoods: JSON.stringify(['Yunusobod']),
          profile_visibility: 'PUBLIC',
          role: assignedRole,
          status: 'ACTIVE',
          created_at: now,
          updated_at: now,
        })
        .execute();

      user = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', newUserId)
        .executeTakeFirstOrThrow();
    }

    const token = `pley_tok_${user.id}_${Buffer.from(now).toString('base64')}`;
    return { token, user };
  }

  public async validateTelegramInitData(
    initDataString: string,
  ): Promise<AuthSessionResponse> {
    const params = new URLSearchParams(initDataString);
    const hash = params.get('hash');

    if (!hash) {
      throw new BadRequestException('Missing hash parameter in Telegram initData');
    }

    params.delete('hash');
    const dataCheckArr: string[] = [];
    params.sort();
    params.forEach((val, key) => {
      dataCheckArr.push(`${key}=${val}`);
    });
    const dataCheckString = dataCheckArr.join('\n');

    const botToken = process.env.TELEGRAM_BOT_TOKEN;

    if (botToken) {
      const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(botToken)
        .digest();

      const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

      if (calculatedHash !== hash) {
        throw new UnauthorizedException('Telegram initData signature verification failed');
      }
    } else if (process.env.NODE_ENV === 'production') {
      throw new UnauthorizedException('TELEGRAM_BOT_TOKEN is not configured in production environment');
    }

    const userRaw = params.get('user');
    if (!userRaw) {
      throw new BadRequestException('Missing user object in Telegram initData');
    }

    let parsedTelegramUser: {
      id: number | string;
      first_name: string;
      last_name?: string;
      username?: string;
      photo_url?: string;
    };

    try {
      parsedTelegramUser = JSON.parse(userRaw);
    } catch {
      throw new BadRequestException('Malformed user JSON in Telegram initData');
    }

    const db = this.databaseService.getDb();
    const telegramId = String(parsedTelegramUser.id);

    let user = await db
      .selectFrom('users')
      .selectAll()
      .where('telegram_id', '=', telegramId)
      .executeTakeFirst();

    const now = new Date().toISOString();

    if (!user) {
      const newUserId = `usr_tg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db
        .insertInto('users')
        .values({
          id: newUserId,
          google_id: null,
          email: null,
          telegram_id: telegramId,
          telegram_username: parsedTelegramUser.username || null,
          first_name: parsedTelegramUser.first_name || 'Player',
          last_name: parsedTelegramUser.last_name || null,
          avatar_url: parsedTelegramUser.photo_url || null,
          age_bracket: '18-24',
          skill_level: 'BEGINNER',
          preferred_sports: JSON.stringify(['table-tennis']),
          preferred_neighborhoods: JSON.stringify(['Yunusobod']),
          profile_visibility: 'PUBLIC',
          role: 'USER',
          status: 'ACTIVE',
          created_at: now,
          updated_at: now,
        })
        .execute();

      user = await db
        .selectFrom('users')
        .selectAll()
        .where('id', '=', newUserId)
        .executeTakeFirstOrThrow();
    }

    return {
      token: `pley_tok_${user.id}_${Buffer.from(now).toString('base64')}`,
      user,
    };
  }

  public async devLogin(userId: string): Promise<AuthSessionResponse> {
    const db = this.databaseService.getDb();
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', userId)
      .executeTakeFirst();

    if (!user) {
      throw new UnauthorizedException(`User not found with id: ${userId}`);
    }

    const token = `pley_tok_${user.id}_${Buffer.from(new Date().toISOString()).toString('base64')}`;
    return {
      token,
      user,
    };
  }

  public async getUserFromToken(token: string): Promise<UsersTable | null> {
    if (!token || !token.startsWith('pley_tok_')) {
      return null;
    }

    const cleanUserId = token.replace('pley_tok_', '').split(/_[A-Za-z0-9+/=]+$/)[0];

    const db = this.databaseService.getDb();
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', cleanUserId)
      .executeTakeFirst();

    return user || null;
  }
}
