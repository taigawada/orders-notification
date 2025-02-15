FROM node:20-alpine AS builder
WORKDIR /app

ARG GITHUB_PACKAGE_TOKEN

COPY .npmrc .
COPY .yarnrc.yml .
COPY ./.yarn ./.yarn
COPY package.json .
COPY yarn.lock .

RUN yarn install --immutable

COPY . .

RUN yarn build
RUN yarn prisma

FROM node:20-bullseye-slim

RUN apt-get update && apt-get upgrade openssl livsqlite3-dev sqlite3 -y \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /root
ENV NODE_ENV production
COPY --from=builder ./app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder ./app/build ./build
COPY --from=builder ./app/package.json .
COPY --from=builder ./app/yarn.lock ./yarn.lock
COPY --from=builder ./app/node_modules ./node_modules
COPY --from=builder ./app/prisma ./prisma

CMD ["npm", "start"]
