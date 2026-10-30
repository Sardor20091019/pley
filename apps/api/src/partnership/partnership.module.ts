import { Module } from '@nestjs/common';
import { PartnershipController } from './partnership.controller';
import { PartnershipRepository } from './partnership.repository';
import { PartnershipService } from './partnership.service';

@Module({
  controllers: [PartnershipController],
  providers: [PartnershipService, PartnershipRepository],
  exports: [PartnershipService, PartnershipRepository],
})
export class PartnershipModule {}
