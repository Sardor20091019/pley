import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import {
  PaymentProvider,
  PaymentInitiationResult,
  PaymentVerificationResult,
} from './payment-provider.interface';

@Injectable()
export class SimulatedProvider implements PaymentProvider {
  public readonly name = 'SIMULATED';

  public async initiatePayment(params: {
    bookingId: string;
    amount: number;
    currency: string;
    returnUrl: string;
  }): Promise<PaymentInitiationResult> {
    const simTransId = randomUUID();

    return {
      paymentId: randomUUID(),
      redirectUrl: null,
      providerTransactionId: simTransId,
      status: 'SUCCESS',
      isSimulated: true,
    };
  }

  public async verifyWebhook(
    payload: Record<string, any>,
  ): Promise<PaymentVerificationResult> {
    return {
      success: true,
      providerTransactionId: payload.transactionId || randomUUID(),
    };
  }
}

