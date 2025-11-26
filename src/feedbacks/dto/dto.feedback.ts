import { IsNotEmpty, IsString } from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

export class CreateFeedbackDto {
  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  notes: string;
}
export class UpdateFeedbackDto extends PartialType(CreateFeedbackDto) {}
