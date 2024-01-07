import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { EditCardDto } from './dto/edit-card.dto';
import { ChangeCardPositionDto } from './dto/change-card-position.dto';

const defaultCardTitle = 'Title';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  async createCard(dto: CreateCardDto) {
    // check if column exists
    const column = await this.prisma.column.findUnique({
      where: {
        id: dto.columnId,
      },
    });

    if (!column) {
      throw new NotFoundException('Column with such id does not exists');
    }

    if (column.boardId !== dto.boardId) {
      throw new ForbiddenException('Access to this column denied');
    }

    const cardWithMaxPosition = await this.prisma.card.findFirst({
      where: {
        columnId: dto.columnId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const cardTitle = dto.title ? dto.title : defaultCardTitle;

    const cardPosition = cardWithMaxPosition
      ? cardWithMaxPosition.position + 1
      : 1;

    const createdCard = await this.prisma.card.create({
      data: {
        title: cardTitle,
        description: dto.description,
        boardId: dto.boardId,
        columnId: dto.columnId,
        position: cardPosition,
      },
    });

    return createdCard;
  }

  async deleteCard(cardId: number) {
    // check if card with such id already exists
    const card = await this.prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) {
      throw new NotFoundException('Card with such id does not exists');
    }

    const deletedCard = await this.prisma.card.delete({
      where: {
        id: cardId,
      },
    });

    return deletedCard;
  }

  async editCard(cardId: number, dto: EditCardDto) {
    // check if card with such id already exists
    const card = await this.prisma.card.findUnique({
      where: {
        id: cardId,
      },
    });

    if (!card) {
      throw new NotFoundException('Card with such id does not exists');
    }

    const updatedCard = await this.prisma.card.update({
      where: {
        id: cardId,
      },
      data: {
        ...dto,
      },
    });

    return updatedCard;
  }

  async changeCardPosition(cardId: number, dto: ChangeCardPositionDto) {
    return await this.prisma.$transaction(async (tx) => {
      const card = await this.prisma.card.findUnique({
        where: {
          id: cardId,
        },
      });

      // Update from column cards
      await tx.card.updateMany({
        where: {
          position: {
            gt: card.position,
          },
          boardId: dto.boardId,
          columnId: card.columnId,
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });

      // Update to column cards
      await tx.card.updateMany({
        where: {
          position: {
            gte: dto.toPosition,
          },
          boardId: dto.boardId,
          columnId: dto.toColumnId,
        },
        data: {
          position: {
            increment: 1,
          },
        },
      });

      await tx.card.update({
        where: {
          id: cardId,
        },
        data: {
          columnId: dto.toColumnId,
          position: dto.toPosition,
        },
      });
    });
  }
}
