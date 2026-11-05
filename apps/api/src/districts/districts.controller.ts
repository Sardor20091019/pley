import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { DistrictsService, DistrictResponse } from './districts.service';
import { CreateDistrictDto } from './dto/district.dto';
import { DistrictsTable } from '../database/database.types';
import { AuthGuard, Public } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Public()
  @Get()
  public async listDistricts(): Promise<DistrictResponse[]> {
    return this.districtsService.listDistricts();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  public async createDistrict(
    @Body() dto: CreateDistrictDto,
  ): Promise<DistrictsTable> {
    return this.districtsService.createDistrict(dto);
  }
}

