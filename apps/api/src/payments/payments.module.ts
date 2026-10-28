import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ClickProvider } from './providers/click.provider';
import { PaymeProvider } from './providers/payme.provider';
import { SimulatedProvider } from './providers/simulated.provider';

@Module({
  controllers: [PaymentsController],
  providers: [
    PaymentsService,
    ClickProvider,
    PaymeProvider,
    SimulatedProvider,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}

