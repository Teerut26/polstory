# ##### DEPENDENCIES

# FROM node:20-alpine AS deps
# RUN apk add --no-cache \
#     build-base \
#     g++ \
#     cairo-dev \
#     jpeg-dev \
#     pango-dev \
#     giflib-dev
# RUN apk add --no-cache libc6-compat openssl
# WORKDIR /app

# # Install dependencies based on the preferred package manager

# COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml\* ./

# RUN \
#     if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#     elif [ -f package-lock.json ]; then npm ci; \
#     elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
#     else echo "Lockfile not found." && exit 1; \
#     fi

# ##### BUILDER

# FROM node:20-alpine AS builder
# ARG DATABASE_URL
# ARG NEXT_PUBLIC_CLIENTVAR
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# # ENV NEXT_TELEMETRY_DISABLED 1

# RUN \
#     if [ -f yarn.lock ]; then SKIP_ENV_VALIDATION=1 yarn build; \
#     elif [ -f package-lock.json ]; then SKIP_ENV_VALIDATION=1 npm run build; \
#     elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && SKIP_ENV_VALIDATION=1 pnpm run build; \
#     else echo "Lockfile not found." && exit 1; \
#     fi

# ##### RUNNER

# FROM node:20-alpine AS runner
# RUN apk add --no-cache \
#     build-base \
#     g++ \
#     cairo-dev \
#     jpeg-dev \
#     pango-dev \
#     giflib-dev
# WORKDIR /app

# ENV NODE_ENV production

# # ENV NEXT_TELEMETRY_DISABLED 1

# COPY --from=builder /app/next.config.js ./
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/package.json ./package.json

# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

# FROM node:20.11.1
FROM node:20.11.1

WORKDIR /app

COPY . /app

RUN yarn install

RUN yarn build

EXPOSE 3000
ENV PORT 3000

CMD ["yarn", "start"]