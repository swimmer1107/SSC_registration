#!/bin/sh
set -e

echo ">>> Ensuring database directory exists..."
mkdir -p /data

echo ">>> Pushing database schema..."
npx prisma db push --accept-data-loss

echo ">>> Seeding database..."
npx prisma db seed

echo ">>> Starting Next.js..."
exec npm start
