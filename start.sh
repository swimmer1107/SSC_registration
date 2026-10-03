#!/bin/sh
set -e

echo ">>> DATABASE_URL prefix: ${DATABASE_URL%%@*}"
echo ">>> Pushing database schema..."
npx prisma db push --accept-data-loss --skip-generate 2>&1
echo ">>> Schema push exit code: $?"

echo ">>> Seeding initial data..."
node scripts/seed.mjs 2>&1

echo ">>> Starting Next.js..."
exec npm start
