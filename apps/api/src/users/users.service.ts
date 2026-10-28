import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UsersTable, UserStatus } from '../database/database.types';
import { UpdateProfileDto } from '../auth/dto/auth.dto';

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  isUnlocked: boolean;
  unlockedAt: string | null;
}

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async getUserById(id: string): Promise<UsersTable> {
    const db = this.databaseService.getDb();
    const user = await db
      .selectFrom('users')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  public async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
  ): Promise<UsersTable> {
    const db = this.databaseService.getDb();
    const existing = await this.getUserById(userId);

    const now = new Date().toISOString();

    await db
      .updateTable('users')
      .set({
        first_name: dto.firstName !== undefined ? dto.firstName : existing.first_name,
        last_name: dto.lastName !== undefined ? dto.lastName : existing.last_name,
        age_bracket: dto.ageBracket !== undefined ? dto.ageBracket : existing.age_bracket,
        skill_level: dto.skillLevel !== undefined ? dto.skillLevel : existing.skill_level,
        preferred_sports:
          dto.preferredSports !== undefined
            ? dto.preferredSports
            : existing.preferred_sports,
        preferred_neighborhoods:
          dto.preferredNeighborhoods !== undefined
            ? dto.preferredNeighborhoods
            : existing.preferred_neighborhoods,
        updated_at: now,
      })
      .where('id', '=', userId)
      .execute();

    return this.getUserById(userId);
  }

  public async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const db = this.databaseService.getDb();
    const confirmedBookings = await db
      .selectFrom('bookings')
      .innerJoin('sessions', 'bookings.session_id', 'sessions.id')
      .innerJoin('venues', 'sessions.venue_id', 'venues.id')
      .select([
        'bookings.id as booking_id',
        'bookings.status as booking_status',
        'bookings.booked_at as booked_at',
        'sessions.sport_id as sport_id',
        'venues.district as district',
      ])
      .where('bookings.user_id', '=', userId)
      .where('bookings.status', 'in', ['CONFIRMED', 'COMPLETED'])
      .execute();

    const totalCount = confirmedBookings.length;
    const distinctSports = new Set(confirmedBookings.map((b) => b.sport_id));
    const distinctDistricts = new Set(confirmedBookings.map((b) => b.district));

    const firstBookingDate = confirmedBookings[0]?.booked_at || null;

    return [
      {
        id: 'ach_first_game',
        title: 'First Step on Court',
        description: 'Joined your very first Pley session in Tashkent.',
        badge: '🎾',
        isUnlocked: totalCount >= 1,
        unlockedAt: firstBookingDate,
      },
      {
        id: 'ach_five_games',
        title: 'Regular Contender',
        description: 'Completed 5 active recreational sessions.',
        badge: '⚡',
        isUnlocked: totalCount >= 5,
        unlockedAt: totalCount >= 5 ? confirmedBookings[4].booked_at : null,
      },
      {
        id: 'ach_multi_sport',
        title: 'Versatile Athlete',
        description: 'Participated in at least 2 distinct sports.',
        badge: '🏀',
        isUnlocked: distinctSports.size >= 2,
        unlockedAt: distinctSports.size >= 2 ? confirmedBookings[confirmedBookings.length - 1].booked_at : null,
      },
      {
        id: 'ach_neighborhood_explorer',
        title: 'Tashkent Explorer',
        description: 'Played in at least 2 different city districts.',
        badge: '📍',
        isUnlocked: distinctDistricts.size >= 2,
        unlockedAt: distinctDistricts.size >= 2 ? confirmedBookings[confirmedBookings.length - 1].booked_at : null,
      },
    ];
  }

  public async listAllUsers(): Promise<UsersTable[]> {
    const db = this.databaseService.getDb();
    return db.selectFrom('users').selectAll().orderBy('created_at', 'desc').execute();
  }

  public async updateUserStatus(
    userId: string,
    status: UserStatus,
  ): Promise<UsersTable> {
    const db = this.databaseService.getDb();
    await this.getUserById(userId);

    const now = new Date().toISOString();
    await db
      .updateTable('users')
      .set({
        status,
        updated_at: now,
      })
      .where('id', '=', userId)
      .execute();

    return this.getUserById(userId);
  }
}

