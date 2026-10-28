import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { DatabaseService } from '../src/database/database.service';
import { UploadService } from '../src/upload/upload.service';
import { TurnstileService } from '../src/auth/turnstile.service';

describe('UploadService & TurnstileService', () => {
  let dbService: DatabaseService;
  let uploadService: UploadService;
  let turnstileService: TurnstileService;

  beforeEach(async () => {
    process.env.SQLITE_PATH = ':memory:';
    dbService = new DatabaseService();
    await dbService.onModuleInit();
    uploadService = new UploadService(dbService);
    turnstileService = new TurnstileService();
  });

  afterEach(async () => {
    await dbService.onModuleDestroy();
  });

  it('should accept simulated bypass token in non-production mode', async () => {
    const isValid = await turnstileService.verifyToken('test_bypass_token');
    expect(isValid).toBe(true);
  });

  it('should reject missing token when secret key is set', async () => {
    process.env.CLOUDFLARE_SECRET_KEY = '0x4AAAAAA_test';
    await expect(turnstileService.verifyToken(undefined)).rejects.toThrow(
      'Cloudflare Turnstile captcha token is required',
    );
  });

  it('should process avatar upload and update users table', async () => {
    const now = new Date().toISOString();
    await dbService.getDb().insertInto('users').values({
      id: 'cceebc99-9c0b-4ef8-bb6d-6bb9bd380d44',
      google_id: 'g_upload_test',
      email: 'uploadtest@pley.uz',
      first_name: 'Upload',
      last_name: 'User',
      avatar_url: null,
      age_bracket: '18-24',
      skill_level: 'BEGINNER',
      preferred_sports: JSON.stringify(['table-tennis']),
      preferred_neighborhoods: JSON.stringify(['Chilonzor']),
      profile_visibility: 'PUBLIC',
      role: 'USER',
      status: 'ACTIVE',
      created_at: now,
      updated_at: now,
    }).execute();

    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'avatar.png',
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: Buffer.from('fake_image_data_bytes'),
      size: 21,
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    };

    const res = await uploadService.uploadUserAvatar(mockFile, 'cceebc99-9c0b-4ef8-bb6d-6bb9bd380d44');
    expect(res.url).toBeDefined();

    const db = dbService.getDb();
    const updatedUser = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', 'cceebc99-9c0b-4ef8-bb6d-6bb9bd380d44')
      .executeTakeFirst();

    expect(updatedUser?.avatar_url).toBe(res.url);
  });
});

