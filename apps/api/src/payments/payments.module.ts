import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';
import { ClickProvider } from './providers/click.provider';
import { PaymeProvider } from './providers/payme.provider';
import { SimulatedProvider } from './providers/simulated.provider';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    PaymentsRepository,
    ClickProvider,
    PaymeProvider,
    SimulatedProvider,
  ],
  exports: [PaymentsService, PaymentsRepository],
})
export class PaymentsModule {}
