import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class DistrictItemDto {
  public id!: string;
  public name!: string;
  public slug!: string;
  public lat!: number;
  public lng!: number;
  public orderIndex!: number;
  public active!: number;
}

export class CreateDistrictDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsNotEmpty()
  public slug!: string;

  @IsNumber()
  public lat!: number;

  @IsNumber()
  public lng!: number;

  @IsNumber()
  @IsOptional()
  public orderIndex?: number;
}

