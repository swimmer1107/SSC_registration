#!/bin/sh
set -e

echo ">>> Pushing database schema to Supabase..."
npx prisma db push --accept-data-loss

echo ">>> Seeding initial data..."
node scripts/seed.mjs

echo ">>> Starting Next.js..."
exec npm start
