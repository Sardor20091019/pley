import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { TurnstileService } from '../auth/turnstile.service';
import { CreatePartnershipInquiryDto } from './dto/partnership.dto';
import { PartnershipInquiriesTable } from '../database/database.types';
import { PartnershipRepository } from './partnership.repository';

@Injectable()
export class PartnershipService {
  constructor(
    private readonly partnershipRepository: PartnershipRepository,
    private readonly turnstileService: TurnstileService,
  ) {}

  public async submitInquiry(
    dto: CreatePartnershipInquiryDto,
    remoteIp?: string,
  ): Promise<PartnershipInquiriesTable> {
    if (dto.turnstileToken) {
      await this.turnstileService.verifyToken(dto.turnstileToken, remoteIp);
    }

    const id = randomUUID();
    const now = new Date().toISOString();

    const inquiryType = dto.inquiryType === 'SESSION' ? 'SESSION' : 'VENUE';
    const message =
      dto.message && dto.message.trim() ? dto.message.trim() : null;
    const imageUrl =
      dto.imageUrl && dto.imageUrl.trim() ? dto.imageUrl.trim() : null;
    const scheduledAt =
      dto.scheduledAt && dto.scheduledAt.trim()
        ? dto.scheduledAt.trim()
        : null;
    const pricePerSlot = dto.pricePerSlot ? Number(dto.pricePerSlot) : null;

    return this.partnershipRepository.create({
      id,
      contact_name: dto.contactName.trim(),
      phone: dto.phone.trim(),
      venue_name: dto.venueName.trim(),
      district: dto.district.trim(),
      sport_types: dto.sportTypes.trim(),
      message,
      inquiry_type: inquiryType,
      image_url: imageUrl,
      scheduled_at: scheduledAt,
      price_per_slot: pricePerSlot,
      status: 'PENDING',
      created_at: now,
    });
  }

  public async listInquiries(): Promise<PartnershipInquiriesTable[]> {
    return this.partnershipRepository.findAll();
  }

  public async updateInquiryStatus(
    id: string,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  ): Promise<PartnershipInquiriesTable> {
    return this.partnershipRepository.updateStatus(id, status);
  }

  public async deleteInquiry(id: string): Promise<{ success: boolean }> {
    await this.partnershipRepository.delete(id);
    return { success: true };
  }
}
