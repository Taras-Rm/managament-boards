import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { EditBoardDto } from './dto/edit-board.dto';
import { COLUMNS } from './constants/constants';

@Injectable()
export class BoardsService {
  constructor(private prisma: PrismaService) {}

  async createBoard(dto: CreateBoardDto) {
    return await this.prisma.$transaction(async (tx) => {
      const createdBoard = await tx.board.create({
        data: {
          name: dto.name,
        },
      });

      await tx.column.createMany({
        data: [
          { boardId: createdBoard.id, name: COLUMNS.TO_DO },
          { boardId: createdBoard.id, name: COLUMNS.IN_PROGRESS },
          { boardId: createdBoard.id, name: COLUMNS.DONE },
        ],
      });

      const createdColumns = await tx.column.findMany({
        where: {
          boardId: createdBoard.id,
        },
      });

      return { board: createdBoard, columns: createdColumns };
    });
  }

  async deleteBoard(boardId: number) {
    // check if board with such id already exists
    const board = await this.prisma.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      throw new NotFoundException('Board with such id does not exists');
    }

    const deletedBoard = await this.prisma.board.delete({
      where: {
        id: boardId,
      },
    });

    return deletedBoard;
  }

  async editBoard(boardId: number, dto: EditBoardDto) {
    // check if board with such id already exists
    const board = await this.prisma.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      throw new NotFoundException('Board with such id does not exists');
    }

    const updatedBoard = await this.prisma.board.update({
      where: {
        id: boardId,
      },
      data: {
        ...dto,
      },
    });

    return updatedBoard;
  }

  async getBoardById(boardId: number) {
    const board = await this.prisma.board.findUnique({
      where: {
        id: boardId,
      },
    });

    if (!board) {
      throw new NotFoundException('Board with such id does not exists');
    }

    return board;
  }

  async getBoardColumns(boardId: number) {
    const columns = await this.prisma.column.findMany({
      where: {
        boardId: boardId,
      },
    });

    return columns ? columns : [];
  }

  async getBoardColumnCards(columnId: number) {
    const cards = await this.prisma.card.findMany({
      where: {
        columnId: columnId,
      },
    });

    return cards;
  }
}
