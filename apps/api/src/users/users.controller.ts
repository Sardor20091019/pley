import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService, UserAchievement } from './users.service';
import { UpdateProfileDto } from '../auth/dto/auth.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UsersTable } from '../database/database.types';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  public async getMyProfile(
    @Req() req: { user: UsersTable },
  ): Promise<UsersTable> {
    return this.usersService.getUserById(req.user.id);
  }

  @Patch('profile')
  public async updateProfile(
    @Req() req: { user: UsersTable },
    @Body() dto: UpdateProfileDto,
  ): Promise<UsersTable> {
    return this.usersService.updateProfile(req.user.id, dto);
  }

  @Get('achievements')
  public async getAchievements(
    @Req() req: { user: UsersTable },
  ): Promise<UserAchievement[]> {
    return this.usersService.getUserAchievements(req.user.id);
  }

  @Get(':id')
  public async getUserPublicProfile(
    @Param('id') id: string,
  ): Promise<Partial<UsersTable>> {
    const user = await this.usersService.getUserById(id);
    return {
      id: user.id,
      first_name: user.first_name,
      avatar_url: user.avatar_url,
      skill_level: user.skill_level,
      age_bracket: user.age_bracket,
      preferred_sports: user.preferred_sports,
    };
  }
}

