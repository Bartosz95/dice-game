FROM node as builder

WORKDIR /usr/share/builder
COPY public public
COPY src src
COPY package.json .
COPY package-lock.json .
RUN npm install --production
RUN npm run build

FROM nginx

WORKDIR /usr/share/nginx/html
RUN rm -rf *
COPY --from=builder /usr/share/builder/build/. .
EXPOSE 80