import { Injectable } from '@nestjs/common';
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
    const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    await db
      .insertInto('partnership_inquiries')
      .values({
        id,
        contact_name: dto.contactName,
        phone: dto.phone,
        venue_name: dto.venueName,
        district: dto.district,
        sport_types: dto.sportTypes,
        message: dto.message || null,
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
}
