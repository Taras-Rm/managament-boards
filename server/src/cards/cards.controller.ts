import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { EditCardDto } from './dto/edit-card.dto';

@Controller('cards')
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Post('')
  createCard(@Body() dto: CreateCardDto) {
    return this.cardsService.createCard(dto);
  }

  @Delete(':id')
  deleteCard(@Param('id', ParseIntPipe) cardId: number) {
    return this.cardsService.deleteCard(cardId);
  }

  @Put(':id')
  editCard(
    @Param('id', ParseIntPipe) cardId: number,
    @Body() dto: EditCardDto,
  ) {
    return this.cardsService.editCard(cardId, dto);
  }
}
