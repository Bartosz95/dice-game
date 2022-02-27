FROM node:14-alpine
RUN mkdir -p /opt/dice-game/dice-game-api
WORKDIR /opt/dice-game/dice-game-api
COPY . .
RUN yarn install
ENV APP_HOST='localhost'
ENV APP_PORT='3000'
ENV APP_URL='/api/v1/game'
ENV DB_HOST='database'
ENV DB_PORT='27017'
ENV NODE_ENV='production'
EXPOSE 3000
CMD [ "npm", "start" ]