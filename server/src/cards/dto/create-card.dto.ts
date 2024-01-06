import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsNotEmpty()
  boardId: number;

  @IsInt()
  @IsNotEmpty()
  columnId: number;
}
