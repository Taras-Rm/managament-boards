# Managament Boards API

This is basic managament boards API.

## Tech stack

- Server: Node.js, Nest.js, TypeScript, Prisma.
- Database: PostgreSQL.

## Run app

Clone repository
``` bash
git clone https://github.com/Taras-Rm/managament-boards-api.git
```

Install dependencies
``` bash
npm install
```

Start database and run migrations
``` bash
npm run db:dev:restart
```

Start the server
``` bash
npm run start:dev
```

## Environmebt variables

To run project, you will need to add such environment variable in ```.env``` file:

`DATABASE_URL="postgresql://user:password@host:port/dbname"`

## API References

- **POST** - /boards (_create new board)
#### Request (example):
```sh
{
    "name": "Board name",
}
```
#### Response (example):
```sh
{
    "board": {
        "id": 1,
        "name": "Board name"
    },
    "columns": [
        {
            "id": 1,
            "name": "To Do",
            "boardId": 1
        },
        {
            "id": 2,
            "name": "In Progress",
            "boardId": 1
        },
        {
            "id": 3,
            "name": "Done",
            "boardId": 1
        }
    ]
}
```
---
- **PUT** - /boards/_:boardId_ (_get board_)
#### Response (example):
```sh
{
    "id": 1,
    "name": "My first board"
}
```