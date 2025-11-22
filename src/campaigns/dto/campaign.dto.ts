import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';

import { campaigns_aim_status } from '@prisma/client';

export class CreateCampaignDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  donation_url: string;

  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;

  @IsEnum(campaigns_aim_status)
  @IsNotEmpty()
  status: campaigns_aim_status;
}
export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {}