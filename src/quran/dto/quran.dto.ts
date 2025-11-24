import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
export class CreateQuranDto {
  @IsNotEmpty()
  @IsString()
  surah: string;

  @IsNotEmpty()
  @IsNumber()
  verse: number;

  @IsNotEmpty()
  @IsString()
  translation: string;

  @IsNotEmpty()
  @IsString()
  transliteration: string;

  @IsNotEmpty()
  @IsString()
  text: string;
}
export class UpdateQuranDto extends PartialType(CreateQuranDto) {}
