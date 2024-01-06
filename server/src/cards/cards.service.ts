import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { EditCardDto } from './dto/edit-card.dto';

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
}
