import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { AuthGuard, Public } from '../auth/auth.guard';
import { UsersTable } from '../database/database.types';

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  public async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: UsersTable },
  ): Promise<{ url: string }> {
    return this.uploadService.uploadUserAvatar(file, req.user.id);
  }

  @Public()
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  public async uploadImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<{ url: string }> {
    return this.uploadService.uploadImage(file);
  }
}

