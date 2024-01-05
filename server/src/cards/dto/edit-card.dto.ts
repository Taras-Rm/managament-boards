import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;
}
