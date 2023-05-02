FROM node:19-alpine as develop-stage

WORKDIR /app

COPY ./package*.json ./tsconfig.json ./

RUN npm install && npm cache clean --force

COPY . .

RUN npx prisma generate

RUN npm run build

FROM develop-stage as prod-stage

RUN npx prisma db push

WORKDIR /app

CMD [ "npm", "run", "startjs", "--offline", "--logs-max=0" ]