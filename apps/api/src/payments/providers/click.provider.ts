import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { randomUUID } from 'node:crypto';
import {
  PaymentProvider,
  PaymentInitiationResult,
  PaymentVerificationResult,
} from './payment-provider.interface';

@Injectable()
export class ClickProvider implements PaymentProvider {
  public readonly name = 'CLICK';
  private readonly logger = new Logger(ClickProvider.name);

  public async initiatePayment(params: {
    bookingId: string;
    amount: number;
    currency: string;
    returnUrl: string;
  }): Promise<PaymentInitiationResult> {
    const serviceId = process.env.CLICK_SERVICE_ID;
    const merchantId = process.env.CLICK_MERCHANT_ID;

    if (!serviceId || !merchantId) {
      this.logger.warn('CLICK_SERVICE_ID or CLICK_MERCHANT_ID not configured');
      return {
        paymentId: randomUUID(),
        redirectUrl: null,
        providerTransactionId: null,
        status: 'FAILED',
        isSimulated: false,
      };
    }

    const clickUrl = `https://my.click.uz/services/pay?service_id=${serviceId}&merchant_id=${merchantId}&amount=${params.amount}&transaction_param=${params.bookingId}&return_url=${encodeURIComponent(params.returnUrl)}`;

    return {
      paymentId: randomUUID(),
      redirectUrl: clickUrl,
      providerTransactionId: null,
      status: 'PENDING',
      isSimulated: false,
    };
  }

  public async verifyWebhook(
    payload: Record<string, any>,
    _signature?: string,
  ): Promise<PaymentVerificationResult> {
    const secretKey = process.env.CLICK_SECRET_KEY;
    if (!secretKey) {
      return {
        success: false,
        providerTransactionId: '',
        errorMessage: 'CLICK_SECRET_KEY is not configured',
      };
    }

    const clickTransId = String(payload.click_trans_id || '');
    const serviceId = String(payload.service_id || '');
    const merchantTransId = String(payload.merchant_trans_id || '');
    const amount = String(payload.amount || '');
    const action = String(payload.action || '');
    const signTime = String(payload.sign_time || '');
    const signString = `${clickTransId}${serviceId}${secretKey}${merchantTransId}${amount}${action}${signTime}`;
    const calculatedHash = crypto.createHash('md5').update(signString).digest('hex');

    if (calculatedHash !== payload.sign_string) {
      return {
        success: false,
        providerTransactionId: clickTransId,
        errorMessage: 'Invalid signature for Click payment callback',
      };
    }

    return {
      success: Number(payload.error) === 0,
      providerTransactionId: clickTransId,
    };
  }
}

