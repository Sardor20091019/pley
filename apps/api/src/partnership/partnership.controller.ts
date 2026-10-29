import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
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
    @Req() req: any,
  ): Promise<PartnershipInquiriesTable> {
    const remoteIp = req.ip || req.headers['x-forwarded-for'];
    return this.partnershipService.submitInquiry(dto, remoteIp);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('inquiries')
  public async listInquiries(): Promise<PartnershipInquiriesTable[]> {
    return this.partnershipService.listInquiries();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('inquiries/:id/status')
  public async updateInquiryStatus(
    @Param('id') id: string,
    @Body('status') status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  ): Promise<PartnershipInquiriesTable> {
    return this.partnershipService.updateInquiryStatus(id, status);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('inquiries/:id')
  public async deleteInquiry(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.partnershipService.deleteInquiry(id);
  }
}
