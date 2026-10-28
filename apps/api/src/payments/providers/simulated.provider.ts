import { Injectable } from '@nestjs/common';
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
    const simTransId = `sim_tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return {
      paymentId: `pay_sim_${Date.now()}`,
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
      providerTransactionId: payload.transactionId || `sim_tx_${Date.now()}`,
    };
  }
}

