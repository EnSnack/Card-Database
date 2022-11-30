FROM node:alpine

RUN apk add git

RUN git clone --depth 1 https://github.com/EnSnack/Card-Database /apps/db

WORKDIR /apps/db
RUN npm install --production

EXPOSE 3000

RUN npm run build
CMD npm run start