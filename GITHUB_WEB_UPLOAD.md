# How to Upload Better Proposals Plugin via GitHub Web Interface

## Steps:

1. Go to: https://github.com/Priyanka-247/corsair
2. Click **Code** button (green) → Select **main** branch
3. Create new branch: Click **main** dropdown and type: `feature/add-better-proposals-integration` then click **Create branch**

4. Now you're in the new branch. Click **Add file** → **Create new file**

5. Enter path and create these files in order:

### File 1: packages/betterproposals/package.json
```json
{
  "name": "@corsair-dev/betterproposals",
  "version": "0.1.0",
  "description": "Better Proposals plugin for Corsair",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "dev-source": "./index.ts",
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "rm -rf dist && tsc --build --force && tsup",
    "typecheck": "tsc --noEmit",
    "test": "jest"
  },
  "peerDependencies": {
    "corsair": ">=0.1.0",
    "zod": "^4.1.13"
  },
  "devDependencies": {
    "@types/jest": "^29.5.14",
    "corsair": "workspace:*",
    "ts-jest": "^29.4.9",
    "tsup": "^8.0.1",
    "typescript": "catalog:",
    "zod": "^4.1.13",
    "jest": "^29.7.0"
  },
  "keywords": [
    "corsair",
    "better-proposals",
    "proposals",
    "plugin"
  ],
  "author": "",
  "license": "Apache-2.0",
  "files": [
    "dist"
  ]
}
```

**Commit message:** `Add package.json`

---

### File 2: packages/betterproposals/tsconfig.json
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": ".",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": [
    "index.ts",
    "*.ts",
    "**/*.ts"
  ],
  "exclude": [
    "dist",
    "node_modules",
    "jest.config.cjs"
  ]
}
```

**Commit message:** `Add tsconfig.json`

---

### File 3: packages/betterproposals/jest.config.cjs
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
```

**Commit message:** `Add jest.config.cjs`

---

### File 4: packages/betterproposals/tsup.config.ts
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: false,
  splitting: false,
  shims: true,
});
```

**Commit message:** `Add tsup.config.ts`

---

### File 5: packages/betterproposals/endpoints/types.ts
```typescript
import { z } from 'zod';

export const BetterProposalsEndpointInputSchemas = {
  GetProposals: z.object({
    status: z.enum(['sent', 'viewed', 'accepted', 'declined']).optional(),
    limit: z.number().optional(),
  }),
  GetProposal: z.object({
    proposalId: z.string(),
  }),
  CreateProposal: z.object({
    title: z.string(),
    clientEmail: z.string().email(),
    content: z.string(),
    amount: z.number().optional(),
  }),
  UpdateProposal: z.object({
    proposalId: z.string(),
    title: z.string().optional(),
    content: z.string().optional(),
    amount: z.number().optional(),
  }),
};

export const BetterProposalsEndpointOutputSchemas = {
  GetProposals: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: z.string(),
      clientEmail: z.string(),
      amount: z.number().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
  GetProposal: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    clientEmail: z.string(),
    content: z.string(),
    amount: z.number().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  CreateProposal: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    clientEmail: z.string(),
    amount: z.number().nullable(),
    createdAt: z.string(),
  }),
  UpdateProposal: z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    amount: z.number().nullable(),
    updatedAt: z.string(),
  }),
};

export type BetterProposalsEndpointInputs = {
  GetProposals: z.infer<typeof BetterProposalsEndpointInputSchemas.GetProposals>;
  GetProposal: z.infer<typeof BetterProposalsEndpointInputSchemas.GetProposal>;
  CreateProposal: z.infer<typeof BetterProposalsEndpointInputSchemas.CreateProposal>;
  UpdateProposal: z.infer<typeof BetterProposalsEndpointInputSchemas.UpdateProposal>;
};

export type BetterProposalsEndpointOutputs = {
  GetProposals: z.infer<typeof BetterProposalsEndpointOutputSchemas.GetProposals>;
  GetProposal: z.infer<typeof BetterProposalsEndpointOutputSchemas.GetProposal>;
  CreateProposal: z.infer<typeof BetterProposalsEndpointOutputSchemas.CreateProposal>;
  UpdateProposal: z.infer<typeof BetterProposalsEndpointOutputSchemas.UpdateProposal>;
};
```

**Commit message:** `Add endpoint types`

Continue with remaining files...

