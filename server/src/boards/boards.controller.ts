import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { EditBoardDto } from './dto/edit-board.dto';

@Controller('boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post('')
  createBoard(@Body() dto: CreateBoardDto) {
    return this.boardsService.createBoard(dto);
  }

  @Put(':id')
  editBoard(
    @Param('id', ParseIntPipe) boardId: number,
    @Body() dto: EditBoardDto,
  ) {
    return this.boardsService.editBoard(boardId, dto);
  }

  @Get(':alias')
  getBoardByAlias(@Param('alias') boardAlias: string) {
    return this.boardsService.getBoardByAlias(boardAlias);
  }

  @Delete(':id')
  deleteBoard(@Param('id', ParseIntPipe) boardId: number) {
    return this.boardsService.deleteBoard(boardId);
  }

  @Get(':id/cards')
  getBoardColumnsCards(
    @Param('id', ParseIntPipe) boardId: number,
  ) {
    return this.boardsService.getBoardColumnsCards(boardId);
  }
}
