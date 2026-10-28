import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenuesTable, UsersTable } from '../database/database.types';
import { CreateVenueDto, UpdateVenueDto } from './dto/venue.dto';
import { AuthGuard, Public } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) {}

  @Public()
  @Get()
  public async listVenues(
    @Query('district') district?: string,
    @Query('sport') sportSlug?: string,
  ): Promise<VenuesTable[]> {
    return this.venuesService.listVenues({ district, sportSlug });
  }

  @Public()
  @Get(':id')
  public async getVenue(@Param('id') id: string): Promise<VenuesTable> {
    return this.venuesService.getVenueById(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  public async createVenue(
    @Req() req: { user: UsersTable },
    @Body() dto: CreateVenueDto,
  ): Promise<VenuesTable> {
    return this.venuesService.createVenue(dto, req.user.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id')
  public async updateVenue(
    @Param('id') id: string,
    @Req() req: { user: UsersTable },
    @Body() dto: UpdateVenueDto,
  ): Promise<VenuesTable> {
    return this.venuesService.updateVenue(id, dto, req.user.id);
  }
}

