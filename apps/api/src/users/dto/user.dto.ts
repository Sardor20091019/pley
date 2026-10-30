import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../database/database.types';

export class UpdateUserStatusDto {
  @IsNotEmpty()
  @IsEnum(['ACTIVE', 'SUSPENDED'])
  public status!: UserStatus;
}
