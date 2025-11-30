# API Dockerfile
FROM node:20-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy shared packages
COPY shared ./shared

# Copy API package
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared packages
RUN pnpm --filter "@fuga-catalog/constants" build
RUN pnpm --filter "@fuga-catalog/types" build

# Generate Prisma client (with dummy DATABASE_URL for build)
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" pnpm --filter "@fuga-catalog/api" db:generate

# Build API
RUN pnpm --filter "@fuga-catalog/api" build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace configuration
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy shared packages (built)
COPY --from=base /app/shared ./shared

# Copy API package
COPY --from=base /app/apps/api/package.json ./apps/api/
COPY --from=base /app/apps/api/dist ./apps/api/dist
COPY --from=base /app/apps/api/prisma ./apps/api/prisma
COPY --from=base /app/apps/api/src/generated ./apps/api/src/generated

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --filter "@fuga-catalog/api"

# Set working directory to API
WORKDIR /app/apps/api

# Expose port
EXPOSE 4000

# Start the API
CMD ["pnpm", "start"]


