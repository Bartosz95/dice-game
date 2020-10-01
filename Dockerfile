FROM node:12
RUN mkdir -p /opt/dice-game/dice-game-api
WORKDIR /opt/dice-game/dice-game-api
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]