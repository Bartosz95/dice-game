FROM node:14-alpine
RUN mkdir -p /opt/dice-game/dice-game-api
WORKDIR /opt/dice-game/dice-game-api
COPY . .
RUN yarn install
ENV PORT='3000'
ENV HOST='localhost'
ENV URL='/api/v1/game'
ENV NODE_ENV='production'
EXPOSE 3000
CMD [ "npm", "start" ]