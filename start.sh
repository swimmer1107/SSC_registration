#!/bin/sh
set -e

echo ">>> Ensuring database directory exists..."
mkdir -p /data

echo ">>> Running Prisma migrations..."
npx prisma migrate deploy

echo ">>> Starting Next.js..."
exec npm start
