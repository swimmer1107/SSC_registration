#!/bin/sh
set -e

echo ">>> Seeding initial data..."
node scripts/seed.mjs

echo ">>> Starting Next.js..."
exec npm start
