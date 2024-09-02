FROM node:20-alpine3.17 as builder
WORKDIR /app
COPY . /app
# COPY ./package.json ./package-lock.json ./
RUN yarn install

COPY . .
RUN yarn build