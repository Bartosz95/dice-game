FROM node:14-alpine
RUN mkdir -p /opt/dice-game/dice-game-api
WORKDIR /opt/dice-game/dice-game-api
COPY . .
RUN yarn install
# Add env if needed ENV APP_HOST='localhost'
# APP_PORT='3000'
# APP_HOST='0.0.0.0'
# APP_URL='/api/v1/game'
# NODE_ENV='development'
# DB_HOST='database'
# DB_PORT='27017'
# DB_USER='root'
# DB_PASSWORD='password'
EXPOSE 3000
CMD [ "npm", "start" ]