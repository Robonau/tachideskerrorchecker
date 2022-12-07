FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm ci
COPY . .
RUN npm run build
RUN chown -R node /usr/src/app
USER node
CMD ["npm","run", "start","--offline","--logs-max=0"]
