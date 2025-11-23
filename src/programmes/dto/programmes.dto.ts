import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateProgrammeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  heading?: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  time: string;

  @IsInt()
  @IsNotEmpty()
  year: number;

  @IsDateString()
  @IsNotEmpty()
  start_date: string;

  @IsDateString()
  @IsNotEmpty()
  end_date: string;
}
export class UpdateProgrammeDto extends PartialType(CreateProgrammeDto) {}
export class UpdateProgrammeImagesDto {
  @IsOptional()
  @IsString()
  image1?: string;

  @IsOptional()
  @IsString()
  image1_public_id?: string;

  @IsOptional()
  @IsString()
  image2?: string;

  @IsOptional()
  @IsString()
  image2_public_id?: string;

  @IsOptional()
  @IsString()
  image3?: string;

  @IsOptional()
  @IsString()
  image3_public_id?: string;
}
export class UpdateProgrammeOutcomesDto {
  @IsOptional()
  @IsString()
  outcome1?: string;

  @IsOptional()
  @IsString()
  outcome2?: string;

  @IsOptional()
  @IsString()
  outcome3?: string;
}
