import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsDateString,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { events_status } from '@prisma/client';
export class CreateEventDto {
  // REQUIRED
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  event_url: string;

  // OPTIONAL / NULLABLE FIELDS
  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsDateString()
  event_date?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  organizer?: string;

  @IsOptional()
  @IsEmail()
  contact_email?: string;

  @IsOptional()
  @IsString()
  contact_phone?: string;

  @IsEnum(events_status)
  @IsOptional()
  @IsString()
  status?: events_status;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}