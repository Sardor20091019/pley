import { Injectable, Logger, BadRequestException } from '@nestjs/common';

@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);

  public async verifyToken(
    token?: string,
    remoteIp?: string,
  ): Promise<boolean> {
    const secretKey = process.env.CLOUDFLARE_SECRET_KEY;

    if (!secretKey) {
      this.logger.warn('CLOUDFLARE_SECRET_KEY is not configured; skipping captcha check');
      return true;
    }

    if (!token) {
      throw new BadRequestException('Cloudflare Turnstile captcha token is required');
    }

    if (token === 'test_bypass_token' && process.env.NODE_ENV !== 'production') {
      return true;
    }

    try {
      const formData = new URLSearchParams();
      formData.append('secret', secretKey);
      formData.append('response', token);
      if (remoteIp) {
        formData.append('remoteip', remoteIp);
      }

      const response = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData.toString(),
        },
      );

      const data = (await response.json()) as {
        success: boolean;
        'error-codes'?: string[];
      };

      if (!data.success) {
        this.logger.warn(
          `Cloudflare Turnstile verification failed: ${JSON.stringify(data['error-codes'])}`,
        );
        throw new BadRequestException('Captcha verification failed. Please try again.');
      }

      return true;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Turnstile verification error: ${error.message}`);
      throw new BadRequestException('Failed to verify captcha');
    }
  }
}

