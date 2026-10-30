import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadRepository } from './upload.repository';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, UploadRepository],
  exports: [UploadService, UploadRepository],
})
export class UploadModule {}
