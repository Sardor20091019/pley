import { ConflictException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DistrictsRepository } from './districts.repo';
import { CreateDistrictDto } from './dto/district.dto';
import { DistrictsTable } from '../database/database.types';

export interface DistrictResponse {
  id: string;
  name: string;
  slug: string;
  lat: number;
  lng: number;
  orderIndex: number;
  active: number;
}

@Injectable()
export class DistrictsService {
  constructor(private readonly districtsRepository: DistrictsRepository) {}

  public async listDistricts(): Promise<DistrictResponse[]> {
    const districts = await this.districtsRepository.findAllActive();
    return districts.map((d) => ({
      id: d.id,
      name: d.name,
      slug: d.slug,
      lat: d.lat,
      lng: d.lng,
      orderIndex: d.order_index,
      active: d.active,
    }));
  }

  public async createDistrict(dto: CreateDistrictDto): Promise<DistrictsTable> {
    const existing = await this.districtsRepository.findBySlug(dto.slug);
    if (existing) {
      throw new ConflictException(`District with slug ${dto.slug} already exists`);
    }

    const id = randomUUID();
    const now = new Date().toISOString();
    const newDistrict: DistrictsTable = {
      id,
      name: dto.name,
      slug: dto.slug,
      lat: dto.lat,
      lng: dto.lng,
      order_index: dto.orderIndex ?? 0,
      active: 1,
      created_at: now,
    };

    await this.districtsRepository.create(newDistrict);
    return newDistrict;
  }
}

