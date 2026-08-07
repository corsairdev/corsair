# `@corsair-dev/huggingface`

Corsair plugin for the [Hugging Face Hub](https://huggingface.co) and related surfaces (Datasets Server, Inference Providers, Inference Endpoints).

- **Package id:** `huggingface` (OSS slug: `hugging_face`)
- **Auth:** API Key (`hf_…` access token) or OAuth 2.0 — both as `Authorization: Bearer`
- **Ops:** 100+ Hub / Datasets Server / Inference operations (models, datasets, spaces, collections, discussions, papers, docs, settings webhooks REST, jobs, endpoints)

## Install

```bash
pnpm add @corsair-dev/huggingface
```

## Auth

1. Create a token at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
2. Pass it as API key (or OAuth access token):

```ts
import { corsair } from 'corsair';
import { huggingface } from '@corsair-dev/huggingface';

const client = corsair({
  plugins: {
    huggingface: huggingface({
      authType: 'api_key',
      // or authType: 'oauth_2'
    }),
  },
});
```

Many **public Hub GETs** (list models/datasets, get public repos, trending, docs) work **without** a token. Write operations, whoami, settings, and private repos require a token.

## Quick examples

```ts
// List trending models (public)
await client.huggingface.models.list({ limit: 5, sort: 'downloads' });

// Model metadata
await client.huggingface.models.get({ repoId: 'openai-community/gpt2' });

// Dataset rows via Datasets Server
await client.huggingface.datasets.getRows({
  dataset: 'nyu-mll/glue',
  config: 'cola',
  split: 'train',
  offset: 0,
  length: 10,
});

// Chat completion (requires token + Inference access)
await client.huggingface.inference.chatCompletion({
  model: 'meta-llama/Meta-Llama-3-8B-Instruct',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

## Bases

| Surface | Base |
| --- | --- |
| Hub REST | `https://huggingface.co` |
| Datasets Server | `https://datasets-server.huggingface.co` |
| Inference Providers | `https://router.huggingface.co` |
| Inference Endpoints API | `https://api.endpoints.huggingface.cloud` |

## Local test / demo (for R4 Loom)

```powershell
cd D:\opensource\corsair

# Offline schema + handler tests (no key)
pnpm --filter @corsair-dev/huggingface test

# Optional live public GETs
$env:HUGGING_FACE_LIVE = "1"
pnpm --filter @corsair-dev/huggingface test

# Terminal demo (public; optional token)
pnpm --filter @corsair-dev/huggingface demo

# With token
$env:HUGGING_FACE_API_KEY = "hf_..."
pnpm --filter @corsair-dev/huggingface demo
```

### R4 demo video

[Loom — tests + live Hub demo](https://www.loom.com/share/e4151c6e3f31453880653d0b910e4eff)

## Issue

Implements [corsairdev/corsair#476](https://github.com/corsairdev/corsair/issues/476).
