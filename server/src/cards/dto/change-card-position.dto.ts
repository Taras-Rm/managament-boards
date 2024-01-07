import { IsInt, IsNotEmpty } from 'class-validator';

export class ChangeCardPositionDto {
  @IsInt()
  @IsNotEmpty()
  toColumnId: number;

  @IsInt()
  @IsNotEmpty()
  toPosition: number;

  @IsInt()
  @IsNotEmpty()
  boardId: number;
}
