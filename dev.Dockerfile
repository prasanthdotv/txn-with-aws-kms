FROM node:17-alpine3.14 as builder
WORKDIR /usr/app
COPY package.json .
RUN npm install
CMD ["npm", "run", "dev"]