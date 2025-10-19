#!/bin/bash
if tsx -e "import { runMigration } from './db/migrate.ts'; runMigration().then(s => process.exit(s ? 0 : 1));"; then
  echo "Migration succeeded, cleaning up SQL files..."
  rm -rf sql/
else
  echo "Migration failed (exit code: $?), keeping SQL files"
  exit 1
fi
