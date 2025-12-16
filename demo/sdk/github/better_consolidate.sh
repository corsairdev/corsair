#!/bin/bash

echo "Creating properly consolidated services.ts..."

# Create header
cat > services.ts << 'HEADER'
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * This file contains all service classes.
 * All model imports are from the consolidated models.ts file.
 */

import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { CancelablePromise } from './core/CancelablePromise';

HEADER

# First, extract all unique model imports from all services
cd services
grep "^import type" *.ts | grep "from '../models/" | sed "s/.*{\s*//" | sed "s/\s*}.*//" | tr ',' '\n' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | sort -u > /tmp/all_model_imports.txt

# Add them as a single import
echo "// Model imports" >> ../services.ts
echo -n "import type {" >> ../services.ts
first=true
while read model; do
  if [ -n "$model" ]; then
    if [ "$first" = true ]; then
      echo -n " $model" >> ../services.ts
      first=false
    else
      echo -n ", $model" >> ../services.ts
    fi
  fi
done < /tmp/all_model_imports.txt
echo " } from './models';" >> ../services.ts
echo "" >> ../services.ts

# Also handle non-type imports (enums, classes)
grep "^import {" *.ts | grep "from '../models/" | sed "s/.*{\s*//" | sed "s/\s*}.*//" | tr ',' '\n' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | sort -u > /tmp/all_model_value_imports.txt

if [ -s /tmp/all_model_value_imports.txt ]; then
  echo -n "import {" >> ../services.ts
  first=true
  while read model; do
    if [ -n "$model" ]; then
      if [ "$first" = true ]; then
        echo -n " $model" >> ../services.ts
        first=false
      else
        echo -n ", $model" >> ../services.ts
      fi
    fi
  done < /tmp/all_model_value_imports.txt
  echo " } from './models';" >> ../services.ts
  echo "" >> ../services.ts
fi

# Now merge service classes (skip imports)
for file in *.ts; do
  echo "" >> ../services.ts
  echo "// ============================================================================" >> ../services.ts  
  echo "// ${file%.ts}" >> ../services.ts
  echo "// ============================================================================" >> ../services.ts
  
  # Skip header comments and imports, keep only the export class
  awk '/^export class/,0' "$file" >> ../services.ts
done

echo "✓ Services properly consolidated"
