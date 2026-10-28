import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { CreatePartnershipInquiryDto } from './dto/partnership.dto';
import { Public, AuthGuard } from '../auth/auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { PartnershipInquiriesTable } from '../database/database.types';

@Controller('partnership')
export class PartnershipController {
  constructor(private readonly partnershipService: PartnershipService) {}

  @Public()
  @Post('inquiry')
  public async submitInquiry(
    @Body() dto: CreatePartnershipInquiryDto,
  ): Promise<PartnershipInquiriesTable> {
    return this.partnershipService.submitInquiry(dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('inquiries')
  public async listInquiries(): Promise<PartnershipInquiriesTable[]> {
    return this.partnershipService.listInquiries();
  }
}

