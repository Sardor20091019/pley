import { Injectable, Logger } from '@nestjs/common';
import {
  PaymentProvider,
  PaymentInitiationResult,
  PaymentVerificationResult,
} from './payment-provider.interface';

@Injectable()
export class PaymeProvider implements PaymentProvider {
  public readonly name = 'PAYME';
  private readonly logger = new Logger(PaymeProvider.name);

  public async initiatePayment(params: {
    bookingId: string;
    amount: number;
    currency: string;
    returnUrl: string;
  }): Promise<PaymentInitiationResult> {
    const merchantId = process.env.PAYME_MERCHANT_ID;

    if (!merchantId) {
      this.logger.warn('PAYME_MERCHANT_ID is not configured');
      return {
        paymentId: `payme_unconf_${Date.now()}`,
        redirectUrl: null,
        providerTransactionId: null,
        status: 'FAILED',
        isSimulated: false,
      };
    }

    const amountInTiyin = params.amount * 100;
    const rawParams = `m=${merchantId};ac.booking_id=${params.bookingId};a=${amountInTiyin};c=${encodeURIComponent(params.returnUrl)}`;
    const encodedParams = Buffer.from(rawParams).toString('base64');
    const paymeUrl = `https://checkout.paycom.uz/${encodedParams}`;

    return {
      paymentId: `payme_${Date.now()}_${params.bookingId}`,
      redirectUrl: paymeUrl,
      providerTransactionId: null,
      status: 'PENDING',
      isSimulated: false,
    };
  }

  public async verifyWebhook(
    payload: Record<string, any>,
    signature?: string,
  ): Promise<PaymentVerificationResult> {
    const paymeKey = process.env.PAYME_SECRET_KEY;
    if (!paymeKey) {
      return {
        success: false,
        providerTransactionId: '',
        errorMessage: 'PAYME_SECRET_KEY is not configured',
      };
    }

    if (!signature) {
      return {
        success: false,
        providerTransactionId: '',
        errorMessage: 'Missing Paycom Authorization header',
      };
    }

    const expectedAuth = `Basic ${Buffer.from(`Paycom:${paymeKey}`).toString('base64')}`;
    if (signature !== expectedAuth) {
      return {
        success: false,
        providerTransactionId: '',
        errorMessage: 'Invalid Paycom authentication signature',
      };
    }

    const transId = payload.params?.id || '';
    return {
      success: true,
      providerTransactionId: transId,
    };
  }
}

