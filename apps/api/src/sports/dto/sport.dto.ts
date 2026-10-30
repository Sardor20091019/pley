import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSportDto {
  @IsString()
  @IsNotEmpty()
  public name!: string;

  @IsString()
  @IsNotEmpty()
  public slug!: string;

  @IsString()
  @IsNotEmpty()
  public description!: string;

  @IsString()
  @IsNotEmpty()
  public icon!: string;

  @IsNumber()
  public minPlayersPerSlot!: number;

  @IsNumber()
  @IsOptional()
  public active?: number;
}
