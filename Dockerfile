# Stage 1: Install dependencies
FROM oven/bun:1 AS deps
WORKDIR /app
COPY package.json bun.lock ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
RUN bun install --frozen-lockfile
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" bunx prisma generate

# Stage 2: Build
FROM oven/bun:1 AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/generated ./generated
COPY . .
RUN bun run build

# Stage 3: Runtime
FROM oven/bun:1-slim AS runtime
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/generated ./generated
COPY --from=build /app/dist ./dist
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY package.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["bun", "dist/server.js"]
