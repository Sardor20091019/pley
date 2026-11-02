import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsRepository } from './sessions.repo';
import { SessionsService } from './sessions.service';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService, SessionsRepository],
  exports: [SessionsService, SessionsRepository],
})
export class SessionsModule {}
