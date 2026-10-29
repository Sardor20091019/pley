import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ValidationPipe } from '@nestjs/common';
import { DatabaseService } from '../src/database/database.service';
import { TurnstileService } from '../src/auth/turnstile.service';
import { PartnershipService } from '../src/partnership/partnership.service';
import { CreatePartnershipInquiryDto } from '../src/partnership/dto/partnership.dto';

describe('Partnership Integration Test', () => {
  let dbService: DatabaseService;
  let turnstileService: TurnstileService;
  let partnershipService: PartnershipService;

  beforeEach(async () => {
    process.env.SQLITE_PATH = ':memory:';
    dbService = new DatabaseService();
    await dbService.onModuleInit();
    turnstileService = new TurnstileService();
    partnershipService = new PartnershipService(dbService, turnstileService);
  });

  afterEach(async () => {
    await dbService.onModuleDestroy();
  });

  it('safely handles inquiries with empty optional fields and ValidationPipe', async () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    });

    const payload = {
      contactName: '  Alisher  ',
      phone: '  +998901234567  ',
      venueName: '  Arena Club  ',
      district: '  Yunusobod  ',
      sportTypes: '  table-tennis  ',
      message: '',
      inquiryType: 'VENUE',
      imageUrl: '',
      scheduledAt: '',
      pricePerSlot: 28000,
    };

    const transformed = await pipe.transform(payload, {
      type: 'body',
      metatype: CreatePartnershipInquiryDto,
    });

    const res = await partnershipService.submitInquiry(transformed);
    expect(res).toBeDefined();
    expect(res.contact_name).toBe('Alisher');
    expect(res.venue_name).toBe('Arena Club');
    expect(res.status).toBe('PENDING');
    expect(res.message).toBeNull();
    expect(res.image_url).toBeNull();
    expect(res.scheduled_at).toBeNull();
  });

  it('accepts large image payloads without error', async () => {
    const pipe = new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    });

    const largeBase64 = 'data:image/jpeg;base64,' + 'A'.repeat(500 * 1024);

    const payload = {
      contactName: 'Dilshod',
      phone: '+998935555555',
      venueName: 'Tashkent Tennis Club',
      district: 'Mirzo Ulugbek',
      sportTypes: 'tennis',
      inquiryType: 'SESSION',
      imageUrl: largeBase64,
      scheduledAt: '2026-11-01T15:00:00Z',
      pricePerSlot: 45000,
    };

    const transformed = await pipe.transform(payload, {
      type: 'body',
      metatype: CreatePartnershipInquiryDto,
    });

    const res = await partnershipService.submitInquiry(transformed);
    expect(res).toBeDefined();
    expect(res.contact_name).toBe('Dilshod');
    expect(res.image_url).toBe(largeBase64);
    expect(res.price_per_slot).toBe(45000);
  });

  it('updates inquiry status and deletes inquiry', async () => {
    const inquiry = await partnershipService.submitInquiry({
      contactName: 'Rustam',
      phone: '+998911111111',
      venueName: 'Dynamo',
      district: 'Chilonzor',
      sportTypes: 'football',
    });

    expect(inquiry.status).toBe('PENDING');

    const accepted = await partnershipService.updateInquiryStatus(inquiry.id, 'ACCEPTED');
    expect(accepted.status).toBe('ACCEPTED');

    const deleteRes = await partnershipService.deleteInquiry(inquiry.id);
    expect(deleteRes.success).toBe(true);

    const all = await partnershipService.listInquiries();
    expect(all.find((i) => i.id === inquiry.id)).toBeUndefined();
  });
});
