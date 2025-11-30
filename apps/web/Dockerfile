# Web Dockerfile
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

# Copy web package
COPY apps/web ./apps/web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build shared packages
RUN pnpm --filter "@fuga-catalog/constants" build
RUN pnpm --filter "@fuga-catalog/types" build

# Build argument for API URL (can be overridden at build time)
ARG NEXT_PUBLIC_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build web app
RUN pnpm --filter "@fuga-catalog/web" build

# Create next.config.mjs from next.config.ts for production (to avoid needing TypeScript at runtime)
RUN echo 'export default { compiler: { styledComponents: true } };' > ./apps/web/next.config.mjs

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

# Copy web package
COPY --from=base /app/apps/web/package.json ./apps/web/
COPY --from=base /app/apps/web/.next ./apps/web/.next
COPY --from=base /app/apps/web/next.config.mjs ./apps/web/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --filter "@fuga-catalog/web"

# Expose port
EXPOSE 3000

# Set working directory to web app
WORKDIR /app/apps/web

# Start Next.js
CMD ["pnpm", "start"]


