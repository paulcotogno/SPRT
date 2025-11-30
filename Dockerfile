FROM node:22-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV CI=true

COPY package.json /app/

WORKDIR /app

COPY . /app
COPY private_key.pem /app

RUN apt-get update -y && apt-get install -y openssl

RUN pnpm install

ENV DATABASE_URL="postgresql://postgres:example@db:5432/SPRT?schema=public"

RUN npx prisma generate

RUN pnpm build

EXPOSE 3000
CMD ["pnpm", "launch"]
