FROM node:lts-gallium

WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
COPY . .

RUN yarn
