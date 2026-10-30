import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  public userId!: string;

  @IsNotEmpty()
  @IsString()
  public type!: string;

  @IsNotEmpty()
  @IsString()
  public title!: string;

  @IsNotEmpty()
  @IsString()
  public message!: string;
}

export class NotificationResponseDto {
  public id!: string;
  public userId!: string;
  public type!: string;
  public title!: string;
  public message!: string;
  public isRead!: number;
  public createdAt!: string;
}

