FROM node:17-alpine
RUN mkdir -p /opt/dice-game/dice-game-api
WORKDIR /opt/dice-game/dice-game-api
COPY . .
RUN yarn install --production
EXPOSE 3000