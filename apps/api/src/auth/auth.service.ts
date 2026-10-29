import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { UsersTable, UserRole } from '../database/database.types';
import { GoogleAuthService, GoogleUserProfile } from './google.service';
import { TurnstileService } from './turnstile.service';
import { GoogleCallbackDto, GoogleCredentialDto } from './dto/auth.dto';

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
    await this.turnstileService.verifyToken(dto.turnstileToken, remoteIp);

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
    await this.turnstileService.verifyToken(dto.turnstileToken, remoteIp);

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
      const newUserId = randomUUID();
      const adminEmails = (process.env.ADMIN_EMAILS || 'admin@pley.uz,sardor@pley.uz')
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
