FROM node
RUN mkdir -p /opt/dice-game-api
WORKDIR /opt/dice-game-api
COPY . .
RUN yarn install --production
EXPOSE 3000