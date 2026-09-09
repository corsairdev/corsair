# @corsair-dev/northflank

Northflank integration plugin for Corsair.

## Installation

\`\`\`bash
pnpm add @corsair-dev/northflank
\`\`\`

## Authentication

Northflank uses an API token passed as a Bearer token:

\`\`\`typescript
import { corsair } from 'corsair';
import { northflank } from '@corsair-dev/northflank';

const app = corsair({
  plugins: [
    northflank({
      key: process.env.NORTHFLANK_API_TOKEN,
    }),
  ],
});
\`\`\`

## Supported Resources

- **Projects**: `list`, `get`, `create`, `update`
- **Services**: `list`, `get`, `createCombined`, `updateCombined`
- **Environments**: `listPreviews`
- **Secrets**: `list`, `get`, `create`, `update`
- **Plans**: `list`
- **Regions**: `list`

## Webhooks

Webhooks are not applicable for this plugin and are excluded.
