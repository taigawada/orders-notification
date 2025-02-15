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

FROM node:20-bullseye-slim

RUN apt-get update \
    && apt-get install -y libsqlite3-dev sqlite3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /root
ENV NODE_ENV production
COPY --from=builder ./app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder ./app/build ./build
COPY --from=builder ./app/package.json .
COPY --from=builder ./app/entrypoint.sh ./entrypoint.sh
COPY --from=builder ./app/yarn.lock ./yarn.lock
COPY --from=builder ./app/node_modules ./node_modules
COPY --from=builder ./app/prisma ./prisma

RUN npx prisma generate

ENTRYPOINT ["/root/entrypoint.sh"]
CMD ["npm", "start"]
