import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  SessionStatus,
  SessionVibe,
  SkillLevel,
} from '../../database/database.types';

export class CreateSessionDto {
  @IsNotEmpty()
  @IsString()
  venueId!: string;

  @IsNotEmpty()
  @IsString()
  sportId!: string;

  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsISO8601()
  scheduledAt!: string;

  @IsInt()
  @Min(15)
  durationMinutes!: number;

  @IsInt()
  @Min(2)
  maxSlots!: number;

  @IsInt()
  @Min(1)
  minParticipants!: number;

  @IsInt()
  @Min(0)
  pricePerSlot!: number;

  @IsInt()
  @Min(0)
  serviceFee!: number;

  @IsNotEmpty()
  @IsString()
  skillLevel!: SkillLevel;

  @IsNotEmpty()
  @IsString()
  sessionVibe!: SessionVibe;

  @IsOptional()
  @IsBoolean()
  equipmentProvided?: boolean;

  @IsOptional()
  @IsString()
  equipmentDetails?: string;

  @IsOptional()
  @IsString()
  rulesNotes?: string;

  @IsNotEmpty()
  @IsISO8601()
  bookingDeadline!: string;

  @IsInt()
  @Min(1)
  cancellationDeadlineHours!: number;

  @IsOptional()
  @IsString()
  status?: SessionStatus;
}

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsISO8601()
  scheduledAt?: string;

  @IsOptional()
  @IsInt()
  @Min(15)
  durationMinutes?: number;

  @IsOptional()
  @IsInt()
  @Min(2)
  maxSlots?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  pricePerSlot?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  serviceFee?: number;

  @IsOptional()
  @IsString()
  skillLevel?: SkillLevel;

  @IsOptional()
  @IsString()
  sessionVibe?: SessionVibe;

  @IsOptional()
  @IsString()
  equipmentDetails?: string;

  @IsOptional()
  @IsString()
  rulesNotes?: string;

  @IsOptional()
  @IsString()
  status?: SessionStatus;
}

export class FilterSessionsDto {
  @IsOptional()
  @IsString()
  sport?: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  skillLevel?: string;

  @IsOptional()
  @IsString()
  sessionVibe?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  onlyAvailable?: boolean;
}

