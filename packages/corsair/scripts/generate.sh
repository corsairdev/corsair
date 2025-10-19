#!/bin/bash

drizzle-kit pull

drizzle-kit generate

mkdir -p ./sql

cp drizzle/*.sql ./sql/

rm -rf drizzle/

echo "Done! Migration applied and SQL saved."

echo "Check now to see if there will be any conflicts."

pnpm run check