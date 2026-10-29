import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleCallbackDto {
  @IsNotEmpty()
  @IsString()
  code!: string;

  @IsNotEmpty()
  @IsString()
  redirectUri!: string;

  @IsNotEmpty()
  @IsString()
  turnstileToken!: string;
}

export class GoogleCredentialDto {
  @IsNotEmpty()
  @IsString()
  credential!: string;

  @IsNotEmpty()
  @IsString()
  turnstileToken!: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  ageBracket?: string;

  @IsOptional()
  @IsString()
  skillLevel?: 'BEGINNER' | 'CASUAL' | 'INTERMEDIATE' | 'ADVANCED';

  @IsOptional()
  @IsString()
  preferredSports?: string;

  @IsOptional()
  @IsString()
  preferredNeighborhoods?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}
