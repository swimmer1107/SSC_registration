#!/bin/sh
set -e

echo ">>> Running Prisma migrations..."
npx prisma migrate deploy

echo ">>> Seeding initial data..."
node scripts/seed.mjs

echo ">>> Starting Next.js..."
exec npm start
