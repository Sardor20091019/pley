import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DatabaseService } from '../database/database.service';
import { TurnstileService } from '../auth/turnstile.service';
import { CreatePartnershipInquiryDto } from './dto/partnership.dto';
import { PartnershipInquiriesTable } from '../database/database.types';

@Injectable()
export class PartnershipService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly turnstileService: TurnstileService,
  ) {}

  public async submitInquiry(
    dto: CreatePartnershipInquiryDto,
    remoteIp?: string,
  ): Promise<PartnershipInquiriesTable> {
    if (dto.turnstileToken) {
      await this.turnstileService.verifyToken(dto.turnstileToken, remoteIp);
    }

    const db = this.databaseService.getDb();
    const id = randomUUID();
    const now = new Date().toISOString();

    const inquiryType = dto.inquiryType === 'SESSION' ? 'SESSION' : 'VENUE';
    const message = dto.message && dto.message.trim() ? dto.message.trim() : null;
    const imageUrl = dto.imageUrl && dto.imageUrl.trim() ? dto.imageUrl.trim() : null;
    const scheduledAt = dto.scheduledAt && dto.scheduledAt.trim() ? dto.scheduledAt.trim() : null;
    const pricePerSlot = dto.pricePerSlot ? Number(dto.pricePerSlot) : null;

    await db
      .insertInto('partnership_inquiries')
      .values({
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
      })
      .execute();

    return db
      .selectFrom('partnership_inquiries')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  public async listInquiries(): Promise<PartnershipInquiriesTable[]> {
    const db = this.databaseService.getDb();
    return db
      .selectFrom('partnership_inquiries')
      .selectAll()
      .orderBy('created_at', 'desc')
      .execute();
  }

  public async updateInquiryStatus(
    id: string,
    status: 'PENDING' | 'ACCEPTED' | 'REJECTED',
  ): Promise<PartnershipInquiriesTable> {
    const db = this.databaseService.getDb();
    await db
      .updateTable('partnership_inquiries')
      .set({ status })
      .where('id', '=', id)
      .execute();

    return db
      .selectFrom('partnership_inquiries')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  public async deleteInquiry(id: string): Promise<{ success: boolean }> {
    const db = this.databaseService.getDb();
    await db
      .deleteFrom('partnership_inquiries')
      .where('id', '=', id)
      .execute();

    return { success: true };
  }
}
