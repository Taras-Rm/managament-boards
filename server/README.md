# Managament Boards API

This is basic managament boards API.

## Tech stack

- Server: Node.js, Nest.js, TypeScript, Prisma.
- Database: PostgreSQL.

## Run app

Clone repository (move to /server)
``` bash
git clone https://github.com/Taras-Rm/managament-boards.git
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

## Run tests

``` bash
npm run test:e2e
```

## Environmebt variables

To run project, you will need to add such environment variable in ```.env``` file:

`DATABASE_URL="postgresql://user:password@host:port/dbname"`