import { Controller, Get, Param } from '@nestjs/common';
import { SportsService } from './sports.service';
import { SportsTable } from '../database/database.types';
import { Public } from '../auth/auth.guard';

@Controller('sports')
export class SportsController {
  constructor(private readonly sportsService: SportsService) {}

  @Public()
  @Get()
  public async listSports(): Promise<SportsTable[]> {
    return this.sportsService.listActiveSports();
  }

  @Public()
  @Get(':idOrSlug')
  public async getSport(
    @Param('idOrSlug') idOrSlug: string,
  ): Promise<SportsTable> {
    try {
      return await this.sportsService.getSportById(idOrSlug);
    } catch {
      return this.sportsService.getSportBySlug(idOrSlug);
    }
  }
}

