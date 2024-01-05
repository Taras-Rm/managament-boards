import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { CreateBoardDto } from 'src/boards/dto/create-board.dto';
import { EditBoardDto } from 'src/boards/dto/edit-board.dto';
import { CreateCardDto } from 'src/cards/dto/create-card.dto';
import { EditCardDto } from 'src/cards/dto/edit-card.dto';

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
          .stores('boardId', 'board.id');
      });
    });

    describe('Get board', () => {
      const notExistingBoardId: number = 99999;

      it('not existing board id', () => {
        return pactum
          .spec()
          .get('/boards/{id}')
          .withPathParams('id', notExistingBoardId)
          .expectStatus(404);
      });

      it('ok', () => {
        return pactum
          .spec()
          .get('/boards/{id}')
          .withPathParams('id', '$S{boardId}')
          .expectStatus(200)
          .expectBodyContains('$S{boardId}');
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

    describe('Get board columns', () => {
      it('ok', () => {
        return pactum
          .spec()
          .get('/boards/{id}/columns')
          .withPathParams('id', '$S{boardId}')
          .expectStatus(200)
          .expectJsonLength(3)
          .stores('columnId1', '[0].id')
          .stores('columnId2', '[1].id')
          .stores('columnId3', '[2].id');
      });
    });

    describe('Get board column cards', () => {
      it('ok', () => {
        return pactum
          .spec()
          .get('/boards/{id}/columns/{columnId}/cards')
          .withPathParams('id', '$S{boardId}')
          .withPathParams('columnId', '$S{columnId1}')
          .expectStatus(200)
          .expectJsonLength(0);
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
          .expectStatus(400);
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
          .expectStatus(400);
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

    describe('Delete card', () => {
      it('get column cards', () => {
        return pactum
          .spec()
          .get('/boards/{id}/columns/{columnId}/cards')
          .withPathParams('id', '$S{boardId}')
          .withPathParams('columnId', '$S{columnId1}')
          .expectStatus(200)
          .expectJsonLength(1);
      });

      it('ok', () => {
        return pactum
          .spec()
          .delete('/cards/{id}')
          .withPathParams('id', '$S{cardId}')
          .expectStatus(200);
      });

      it('get empty column cards', () => {
        return pactum
          .spec()
          .get('/boards/{id}/columns/{columnId}/cards')
          .withPathParams('id', '$S{boardId}')
          .withPathParams('columnId', '$S{columnId1}')
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
