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

RUN yarn run build

FROM node:20-alpine AS runtime

WORKDIR /root

COPY --from=builder ./app/.yarnrc.yml ./.yarnrc.yml
COPY --from=builder ./app/build ./build
COPY --from=builder ./app/package.json .
COPY --from=builder ./app/yarn.lock ./yarn.lock
COPY --from=builder ./app/node_modules ./node_modules

CMD ["npm", "run", "start"]
