#!/bin/bash

echo "Fixing consolidation..."

# Recreate services.ts without the problematic sed replacements
cat > services.ts << 'HEADER'
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * This file contains all service classes used by the GitHub API client.
 * Consolidated from 9 individual service files for optimal performance.
 */

import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { CancelablePromise } from './core/CancelablePromise';

// Import all types from models
import type * as Models from './models';

HEADER

# Merge services and update type references
cd services
for file in *.ts; do
  echo "" >> ../services.ts
  echo "// ============================================================================" >> ../services.ts
  echo "// ${file%.ts}" >> ../services.ts
  echo "// ============================================================================" >> ../services.ts
  
  # Extract the service class, skipping imports and headers
  # Replace model imports with Models.* references
  tail -n +6 "$file" | \
    grep -v "^import" | \
    sed 's/: \([a-z_][a-z_0-9]*\)\>/: Models.\1/g' | \
    sed 's/Array<\([a-z_][a-z_0-9]*\)>/Array<Models.\1>/g' | \
    sed 's/<\([a-z_][a-z_0-9]*\)>/<Models.\1>/g' | \
    sed "s/: Models\.\('GET'\|'POST'\|'PUT'\|'DELETE'\|'PATCH'\|'HEAD'\|'OPTIONS'\)/: \1/g" | \
    sed "s/Array<Models\.'\([^']*\)'>/Array<'\1'>/g" | \
    sed 's/Models\.\([0-9]\)/\1/g' >> ../services.ts
done

echo "✓ Services consolidated and fixed"
