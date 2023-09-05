FROM node:18 as dependencies

WORKDIR /app
COPY ./package*.json ./tsconfig.json ./
RUN npm install && npm cache clean --force

FROM node:18 AS build

WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
# COPY startup.sh .
RUN chmod +x startup.sh

FROM node:18 AS deploy

ENV NODE_ENV production

COPY --from=build /app/package.json ./package.json
COPY --from=build /app/dist/ ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/startup.sh .

CMD ["./startup.sh"]