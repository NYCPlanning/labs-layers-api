FROM node:lts-hydrogen

WORKDIR /usr/app
COPY package.json .
COPY yarn.lock .
COPY . .

RUN yarn

CMD [ "yarn", "run", "dev" ]
