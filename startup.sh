#!/bin/bash
if [ $DATABASE_URL ]
then
    npx --offline --logs-max=0 prisma db push --skip-generate;
fi
node dist/index.js;
