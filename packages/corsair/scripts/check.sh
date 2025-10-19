#!/bin/bash
tsx -e "import { checkMigration } from './db/pool.ts'; checkMigration().then(s => process.exit(s ? 0 : 1));"
