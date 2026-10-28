import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  SessionsService,
  SessionListItem,
  SessionDetail,
} from './sessions.service';
import {
  CreateSessionDto,
  FilterSessionsDto,
  UpdateSessionDto,
} from './dto/session.dto';
import { AuthGuard, Public } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UsersTable } from '../database/database.types';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Public()
  @Get()
  public async listSessions(
    @Query() filters: FilterSessionsDto,
    @Req() req: { user?: UsersTable },
  ): Promise<SessionListItem[]> {
    return this.sessionsService.listSessions(filters, req.user?.id);
  }

  @Public()
  @Get(':id')
  public async getSession(
    @Param('id') id: string,
    @Req() req: { user?: UsersTable },
  ): Promise<SessionDetail> {
    return this.sessionsService.getSessionById(id, req.user?.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  public async createSession(
    @Req() req: { user: UsersTable },
    @Body() dto: CreateSessionDto,
  ): Promise<SessionDetail> {
    return this.sessionsService.createSession(dto, req.user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  public async updateSession(
    @Param('id') id: string,
    @Req() req: { user: UsersTable },
    @Body() dto: UpdateSessionDto,
  ): Promise<SessionDetail> {
    return this.sessionsService.updateSession(id, dto, req.user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  public async cancelSession(
    @Param('id') id: string,
    @Req() req: { user: UsersTable },
  ): Promise<{ success: boolean; message: string }> {
    return this.sessionsService.cancelSession(id, req.user.id);
  }
}

