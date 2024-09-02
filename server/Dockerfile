# Build Stage
FROM node:20.10-bullseye-slim as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn prisma generate
RUN yarn build

# Production Stage
FROM node:20.10-bullseye-slim as production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/prisma ./prisma

ENV NODE_ENV production

EXPOSE 8000

CMD ["node", "dist/index.js"]
