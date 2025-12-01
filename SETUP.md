# Setup Guide

## Prerequisites

- Node.js 20.9+
- pnpm

## Installation

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Set up database (generate client + push schema + seed)
pnpm db:setup

# Start both API (port 4000) and web (port 3000)
pnpm dev
```

Visit `http://localhost:3000` and log in with the admin credentials from your `.env`.

## Useful Commands

```bash
# Run tests for both API and web
pnpm test

# Type check for both API and web
pnpm type-check

# Fix linting issues for both API and web
pnpm lint:fix

# Format code for both API and web
pnpm format
```
