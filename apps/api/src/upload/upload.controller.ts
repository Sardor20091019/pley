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
import { AuthGuard } from '../auth/auth.guard';
import { UsersTable } from '../database/database.types';

@Controller('upload')
@UseGuards(AuthGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: { user: UsersTable },
  ): Promise<{ url: string }> {
    return this.uploadService.uploadUserAvatar(file, req.user.id);
  }
}
