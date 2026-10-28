export interface PaymentInitiationResult {
  paymentId: string;
  redirectUrl: string | null;
  providerTransactionId: string | null;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  isSimulated: boolean;
}

export interface PaymentVerificationResult {
  success: boolean;
  providerTransactionId: string;
  errorMessage?: string;
}

export interface PaymentProvider {
  readonly name: string;
  initiatePayment(params: {
    bookingId: string;
    amount: number;
    currency: string;
    returnUrl: string;
  }): Promise<PaymentInitiationResult>;
  verifyWebhook(payload: Record<string, any>, signature?: string): Promise<PaymentVerificationResult>;
}

