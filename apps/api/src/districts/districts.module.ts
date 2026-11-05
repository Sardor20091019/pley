import { Module } from '@nestjs/common';
import { DistrictsController } from './districts.controller';
import { DistrictsService } from './districts.service';
import { DistrictsRepository } from './districts.repo';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DistrictsController],
  providers: [DistrictsService, DistrictsRepository],
  exports: [DistrictsService, DistrictsRepository],
})
export class DistrictsModule {}

