#!/bin/bash
tsx -e "import { checkMigration } from './db/check.ts'; checkMigration().then(s => process.exit(s ? 0 : 1));"
