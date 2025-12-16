#!/bin/bash

echo "=== Consolidating Models and Services ==="
echo

# Step 1: Create consolidated models file
echo "Step 1: Merging all models into models.ts..."
cat > models.ts << 'HEADER'
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * This file contains all model type definitions used by the GitHub API client.
 * Consolidated from 206 individual model files for optimal performance.
 */

HEADER

# Merge all model files
model_count=0
cd models
for file in *.ts; do
  model_count=$((model_count + 1))
  echo "" >> ../models.ts
  echo "// ============================================================================" >> ../models.ts
  echo "// Model: ${file%.ts}" >> ../models.ts
  echo "// ============================================================================" >> ../models.ts
  tail -n +6 "$file" >> ../models.ts  # Skip the header comments
done
cd ..

echo "   ✓ Merged $model_count models into models.ts"

# Step 2: Create consolidated services file
echo "Step 2: Merging all services into services.ts..."
cat > services.ts << 'HEADER'
/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

/**
 * This file contains all service classes used by the GitHub API client.
 * Consolidated from 9 individual service files for optimal performance.
 */

import type * as models from './models';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';

HEADER

# Merge all service files
service_count=0
cd services
for file in *.ts; do
  service_count=$((service_count + 1))
  echo "" >> ../services.ts
  echo "// ============================================================================" >> ../services.ts
  echo "// Service: ${file%.ts}" >> ../services.ts
  echo "// ============================================================================" >> ../services.ts
  # Skip imports and header, keep only the class definition
  tail -n +6 "$file" | grep -v "^import" >> ../services.ts
done
cd ..

echo "   ✓ Merged $service_count services into services.ts"

# Step 3: Update imports in services.ts to use consolidated models
echo "Step 3: Updating model references in services.ts..."
sed -i.bak "s/: '\([^']*\)'/: 'models.\1'/g" services.ts
rm services.ts.bak

echo "   ✓ Updated model references"

echo
echo "✅ Consolidation complete!"
echo "   Created: models.ts (all $model_count models)"
echo "   Created: services.ts (all $service_count services)"
