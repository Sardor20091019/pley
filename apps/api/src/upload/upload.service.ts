import {
  Injectable,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UTApi } from 'uploadthing/server';
import { UploadRepository } from './upload.repository';
import { UploadResultDto } from './dto/upload.dto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private utapi: UTApi | null = null;

  constructor(private readonly uploadRepository: UploadRepository) {
    this.initUtApi();
  }

  private initUtApi(): void {
    let raw = process.env.UPLOADTHING_SECRET || '';
    if (raw.includes('UPLOADTHING_TOKEN=')) {
      raw = raw.replace('UPLOADTHING_TOKEN=', '').replace(/^['"]|['"]$/g, '');
    }

    if (raw) {
      try {
        this.utapi = new UTApi({ token: raw });
      } catch (err: any) {
        this.logger.error(`Failed to initialize UTApi: ${err.message}`);
      }
    } else {
      this.logger.warn('UPLOADTHING_SECRET is not configured');
    }
  }

  public async uploadUserAvatar(
    file: Express.Multer.File,
    userId: string,
  ): Promise<UploadResultDto> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException(
        'Uploaded file must be an image (JPEG, PNG, WebP)',
      );
    }

    let uploadedUrl = '';

    if (this.utapi) {
      try {
        const fileObj = new File(
          [new Uint8Array(file.buffer)],
          file.originalname || 'avatar.jpg',
          {
            type: file.mimetype,
          },
        );

        const uploadRes = await this.utapi.uploadFiles(fileObj);
        const fileData = uploadRes.data as
          | (typeof uploadRes.data & { ufsUrl?: string })
          | undefined;
        const resolvedUrl = fileData?.ufsUrl || fileData?.url;
        if (uploadRes.error || !resolvedUrl) {
          throw new Error(
            uploadRes.error?.message || 'UploadThing upload failed',
          );
        }

        uploadedUrl = resolvedUrl;
      } catch (err: any) {
        this.logger.error(`UploadThing error: ${err.message}`);
        uploadedUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      }
    } else {
      uploadedUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    }

    const now = new Date().toISOString();

    await this.uploadRepository.updateUserAvatar(userId, uploadedUrl, now);

    await this.uploadRepository.recordAuditLog({
      id: randomUUID(),
      actor_id: userId,
      action: 'UPDATE_AVATAR',
      target_type: 'USER',
      target_id: userId,
      payload: JSON.stringify({ avatarUrl: uploadedUrl }),
      created_at: now,
    });

    return { url: uploadedUrl };
  }

  public async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadResultDto> {
    if (!file) {
      throw new BadRequestException('No image file provided');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException(
        'Uploaded file must be an image (JPEG, PNG, WebP)',
      );
    }

    let uploadedUrl = '';

    if (this.utapi) {
      try {
        const fileObj = new File(
          [new Uint8Array(file.buffer)],
          file.originalname || 'session-pic.jpg',
          {
            type: file.mimetype,
          },
        );

        const uploadRes = await this.utapi.uploadFiles(fileObj);
        const fileData = uploadRes.data as
          | (typeof uploadRes.data & { ufsUrl?: string })
          | undefined;
        const resolvedUrl = fileData?.ufsUrl || fileData?.url;
        if (uploadRes.error || !resolvedUrl) {
          throw new Error(
            uploadRes.error?.message || 'UploadThing upload failed',
          );
        }

        uploadedUrl = resolvedUrl;
      } catch (err: any) {
        this.logger.error(`UploadThing error: ${err.message}`);
        uploadedUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      }
    } else {
      uploadedUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    }

    return { url: uploadedUrl };
  }
}
