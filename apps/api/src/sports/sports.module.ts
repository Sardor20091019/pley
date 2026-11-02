import { Module } from '@nestjs/common';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';
import { SportsRepository } from './sports.repo';

@Module({
  controllers: [SportsController],
  providers: [SportsService, SportsRepository],
  exports: [SportsService, SportsRepository],
})
export class SportsModule {}
