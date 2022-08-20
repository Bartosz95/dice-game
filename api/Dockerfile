FROM node
RUN mkdir -p /opt/dice-game-api
WORKDIR /opt/dice-game-api
COPY . .
RUN yarn install --production
# todo Remove later for production
RUN ls /usr/bin/
EXPOSE 3000