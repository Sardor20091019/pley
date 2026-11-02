import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsRepository } from './notifications.repo';
import { NotificationsService } from './notifications.service';

@Module({
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository],
  exports: [NotificationsService, NotificationsRepository],
})
export class NotificationsModule {}
