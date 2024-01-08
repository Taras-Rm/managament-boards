import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { CreateBoardDto } from 'src/boards/dto/create-board.dto';
import { EditBoardDto } from 'src/boards/dto/edit-board.dto';
import { CreateCardDto } from 'src/cards/dto/create-card.dto';
import { EditCardDto } from 'src/cards/dto/edit-card.dto';
import { ChangeCardPositionDto } from 'src/cards/dto/change-card-position.dto';

describe('API e2e tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const testModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testModule.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();

    await app.listen(3333);

    prisma = app.get(PrismaService);

    await prisma.cleanDb();

    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Boards', () => {
    describe('Create board', () => {
      const dto: CreateBoardDto = {
        name: 'Super',
      };

      it('should return an error if name is absent', () => {
        return pactum.spec().post('/boards').withBody({}).expectStatus(400);
      });

      it('should return an error if name is empty', () => {
        return pactum
          .spec()
          .post('/boards')
          .withBody({ name: '' })
          .expectStatus(400);
      });

      it('ok', () => {
        return pactum
          .spec()
          .post('/boards')
          .withBody(dto)
          .expectStatus(201)
          .expect((response) => {
            expect(response.res.body.columns).toHaveLength(3);
          })
          .stores('boardId', 'board.id')
          .stores('boardAlias', 'board.alias');
      });
    });

    describe('Get board by alias', () => {
      const notExistingBoardAlias: string = 'dhy48jdkdj';

      it('not existing board alias', () => {
        return pactum
          .spec()
          .get('/boards/{alias}')
          .withPathParams('alias', notExistingBoardAlias)
          .expectStatus(404);
      });

      it('ok', () => {
        return pactum
          .spec()
          .get('/boards/{alias}')
          .withPathParams('alias', '$S{boardAlias}')
          .expectStatus(200)
          .expectBodyContains('$S{boardId}')
          .expectBodyContains('$S{boardAlias}');
      });
    });

    describe('Edit board', () => {
      const dto: EditBoardDto = {
        name: 'Edited name',
      };

      it('should return an error if name is absent', () => {
        return pactum
          .spec()
          .put('/boards/{id}')
          .withPathParams('id', '$S{boardId}')
          .withBody({})
          .expectStatus(400);
      });

      it('should return an error if name is empty', () => {
        return pactum
          .spec()
          .put('/boards/{id}')
          .withPathParams('id', '$S{boardId}')
          .withBody({ name: '' })
          .expectStatus(400);
      });

      it('ok', () => {
        return pactum
          .spec()
          .put('/boards/{id}')
          .withPathParams('id', '$S{boardId}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('$S{boardId}')
          .expectBodyContains(dto.name);
      });
    });

    describe('Delete board', () => {
      it('ok', () => {
        return pactum
          .spec()
          .delete('/boards/{id}')
          .withPathParams('id', '$S{boardId}')
          .expectStatus(200);
      });

      it('should not find board', () => {
        return pactum
          .spec()
          .get('/boards/{id}')
          .withPathParams('id', '$S{boardId}')
          .expectStatus(404);
      });
    });
  });

  describe('Cards', () => {
    describe('Create card', () => {
      const dto: CreateCardDto = {
        title: 'My card title',
        description: 'My card description',
        boardId: 0,
        columnId: 0,
      };

      it('create new board', async () => {
        const dto: CreateBoardDto = {
          name: 'My test board',
        };
        return pactum
          .spec()
          .post('/boards')
          .withBody(dto)
          .expectStatus(201)
          .stores('boardId', 'board.id')
          .stores('columnId1', 'columns[0].id')
          .stores('columnId2', 'columns[1].id')
          .stores('columnId3', 'columns[2].id');
      });

      it('should return an error if not existing column id', () => {
        return pactum
          .spec()
          .post('/cards')
          .withBody({
            dto,
            boardId: '$S{boardId}',
            columnId: 0,
          })
          .expectStatus(404);
      });

      it('should return an error if not existing board id', () => {
        return pactum
          .spec()
          .post('/cards')
          .withBody({
            dto,
            boardId: 0,
            columnId: '$S{columnId1}',
          })
          .expectStatus(403);
      });

      it('ok', () => {
        return pactum
          .spec()
          .post('/cards')
          .withBody({
            ...dto,
            boardId: '$S{boardId}',
            columnId: '$S{columnId1}',
          })
          .expectStatus(201)
          .expectBodyContains('My card title')
          .expectBodyContains('My card description')
          .stores('cardId', 'id');
      });
    });

    describe('Edit card', () => {
      const dto: EditCardDto = {
        title: 'My updated card title',
        description: 'My updated card description',
      };

      it('ok', () => {
        return pactum
          .spec()
          .put('/cards/{id}')
          .withPathParams('id', '$S{cardId}')
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains('My updated card title')
          .expectBodyContains('My updated card description');
      });
    });

    describe('Change card position', () => {
      const dto: ChangeCardPositionDto = {
        toPosition: 1,
        toColumnId: 0,
        boardId: 0,
      };

      it('should return an error if boardId is empty', () => {
        const reqDto = dto;
        delete reqDto['boardId'];
        return pactum
          .spec()
          .put('/cards/{id}/position')
          .withPathParams('id', '$S{cardId}')
          .withBody({
            ...reqDto,
          })
          .expectStatus(400);
      });

      it('should return an error if toColumnId is empty', () => {
        const reqDto = dto;
        delete reqDto['toColumnId'];
        return pactum
          .spec()
          .put('/cards/{id}/position')
          .withPathParams('id', '$S{cardId}')
          .withBody({
            ...reqDto,
          })
          .expectStatus(400);
      });

      it('ok', () => {
        return pactum
          .spec()
          .put('/cards/{id}/position')
          .withPathParams('id', '$S{cardId}')
          .withBody({
            ...dto,
            boardId: '$S{boardId}',
            toColumnId: '$S{columnId3}',
          })
          .expectStatus(200);
      });
    });
  });

  describe('Delete card', () => {
    it('ok', () => {
      return pactum
        .spec()
        .delete('/cards/{id}')
        .withPathParams('id', '$S{cardId}')
        .expectStatus(200);
    });
  });
});
