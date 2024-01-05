import { IsNotEmpty, IsString } from 'class-validator';

export class EditBoardDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
