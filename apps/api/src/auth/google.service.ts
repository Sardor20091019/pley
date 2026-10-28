import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';

export interface GoogleUserProfile {
  sub: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email_verified?: boolean;
}

@Injectable()
export class GoogleAuthService {
  private readonly logger = new Logger(GoogleAuthService.name);

  public getAuthorizationUrl(redirectUri: string, state?: string): string {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new BadRequestException('GOOGLE_CLIENT_ID is not configured');
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    if (state) {
      params.set('state', state);
    }

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  public async exchangeCode(
    code: string,
    redirectUri: string,
  ): Promise<GoogleUserProfile> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new BadRequestException('Google OAuth client credentials are not configured');
    }

    const bodyParams = new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      this.logger.error(`Google token exchange failed: ${errorText}`);
      throw new UnauthorizedException('Failed to exchange Google authorization code');
    }

    const tokenData = (await tokenResponse.json()) as {
      access_token: string;
      id_token?: string;
    };

    return this.fetchUserInfo(tokenData.access_token);
  }

  public async verifyCredential(
    credentialToken: string,
  ): Promise<GoogleUserProfile> {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credentialToken)}`,
    );

    if (!response.ok) {
      throw new UnauthorizedException('Invalid Google ID token credential');
    }

    const payload = (await response.json()) as {
      sub: string;
      email: string;
      name?: string;
      given_name?: string;
      family_name?: string;
      picture?: string;
      aud?: string;
    };

    if (clientId && payload.aud !== clientId) {
      throw new UnauthorizedException('Google ID token audience mismatch');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      given_name: payload.given_name,
      family_name: payload.family_name,
      picture: payload.picture,
    };
  }

  private async fetchUserInfo(accessToken: string): Promise<GoogleUserProfile> {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      throw new UnauthorizedException('Failed to retrieve user profile from Google');
    }

    return (await response.json()) as GoogleUserProfile;
  }
}

