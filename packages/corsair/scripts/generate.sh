#!/bin/bash

drizzle-kit pull

drizzle-kit generate

mkdir -p ./sql

cp drizzle/*.sql ./sql/

rm -rf drizzle/

echo "Done! Migration applied and SQL saved."

echo "Checking for conflicts..."

pnpm run check