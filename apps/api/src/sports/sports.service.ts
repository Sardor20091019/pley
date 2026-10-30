import { Injectable, NotFoundException } from '@nestjs/common';
import { SportsRepository } from './sports.repository';
import { SportsTable } from '../database/database.types';

@Injectable()
export class SportsService {
  constructor(private readonly sportsRepository: SportsRepository) {}

  public async listActiveSports(): Promise<SportsTable[]> {
    return this.sportsRepository.findAllActive();
  }

  public async getSportById(id: string): Promise<SportsTable> {
    const sport = await this.sportsRepository.findById(id);
    if (!sport) {
      throw new NotFoundException(`Sport with id ${id} not found`);
    }
    return sport;
  }

  public async getSportBySlug(slug: string): Promise<SportsTable> {
    const sport = await this.sportsRepository.findBySlug(slug);
    if (!sport) {
      throw new NotFoundException(`Sport with slug ${slug} not found`);
    }
    return sport;
  }
}
