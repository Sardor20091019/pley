import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { VenuesTable } from '../database/database.types';
import { CreateVenueDto, UpdateVenueDto } from './dto/venue.dto';

@Injectable()
export class VenuesService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async listVenues(params?: {
    district?: string;
    sportSlug?: string;
  }): Promise<VenuesTable[]> {
    const db = this.databaseService.getDb();
    let query = db.selectFrom('venues').selectAll().where('active', '=', 1);

    if (params?.district) {
      query = query.where('district', '=', params.district);
    }

    const venues = await query.orderBy('name', 'asc').execute();

    if (params?.sportSlug) {
      return venues.filter((venue) => {
        try {
          const sports = JSON.parse(venue.supported_sports);
          return Array.isArray(sports) && sports.includes(params.sportSlug);
        } catch {
          return venue.supported_sports.includes(params.sportSlug!);
        }
      });
    }

    return venues;
  }

  public async getVenueById(id: string): Promise<VenuesTable> {
    const db = this.databaseService.getDb();
    const venue = await db
      .selectFrom('venues')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();

    if (!venue) {
      throw new NotFoundException(`Venue with id ${id} not found`);
    }

    return venue;
  }

  public async createVenue(
    dto: CreateVenueDto,
    actorId: string,
  ): Promise<VenuesTable> {
    const db = this.databaseService.getDb();
    const id = `ven_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    await db
      .insertInto('venues')
      .values({
        id,
        name: dto.name,
        district: dto.district,
        address: dto.address,
        description: dto.description,
        supported_sports: dto.supportedSports,
        hourly_rate: dto.hourlyRate,
        is_partner: dto.isPartner ? 1 : 0,
        active: 1,
        contact_phone: dto.contactPhone || null,
        amenities: dto.amenities || '[]',
        created_at: now,
        updated_at: now,
      })
      .execute();

    await db
      .insertInto('audit_logs')
      .values({
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        actor_id: actorId,
        action: 'CREATE_VENUE',
        target_type: 'VENUE',
        target_id: id,
        payload: JSON.stringify(dto),
        created_at: now,
      })
      .execute();

    return this.getVenueById(id);
  }

  public async updateVenue(
    id: string,
    dto: UpdateVenueDto,
    actorId: string,
  ): Promise<VenuesTable> {
    const db = this.databaseService.getDb();
    const existing = await this.getVenueById(id);
    const now = new Date().toISOString();

    await db
      .updateTable('venues')
      .set({
        name: dto.name !== undefined ? dto.name : existing.name,
        district: dto.district !== undefined ? dto.district : existing.district,
        address: dto.address !== undefined ? dto.address : existing.address,
        description:
          dto.description !== undefined ? dto.description : existing.description,
        supported_sports:
          dto.supportedSports !== undefined
            ? dto.supportedSports
            : existing.supported_sports,
        hourly_rate:
          dto.hourlyRate !== undefined ? dto.hourlyRate : existing.hourly_rate,
        is_partner:
          dto.isPartner !== undefined
            ? dto.isPartner
              ? 1
              : 0
            : existing.is_partner,
        active:
          dto.active !== undefined ? (dto.active ? 1 : 0) : existing.active,
        contact_phone:
          dto.contactPhone !== undefined
            ? dto.contactPhone
            : existing.contact_phone,
        amenities:
          dto.amenities !== undefined ? dto.amenities : existing.amenities,
        updated_at: now,
      })
      .where('id', '=', id)
      .execute();

    await db
      .insertInto('audit_logs')
      .values({
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        actor_id: actorId,
        action: 'UPDATE_VENUE',
        target_type: 'VENUE',
        target_id: id,
        payload: JSON.stringify(dto),
        created_at: now,
      })
      .execute();

    return this.getVenueById(id);
  }
}

