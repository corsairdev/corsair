# `@corsair-dev/dockerhub`

Corsair plugin for [Docker Hub](https://hub.docker.com) API v2.

- **Package id:** `dockerhub` (OSS slug: `docker_hub`)
- **Auth:** API Key (Personal Access Token as Bearer); optional username for JWT login on create-org
- **Ops:** 26 — repositories, tags, images, organizations, teams, repo webhooks (REST)

## Install

```bash
pnpm add @corsair-dev/dockerhub
```

## Auth

1. Create a token at [hub.docker.com/settings/security](https://hub.docker.com/settings/security)
2. Pass it as API key:

```ts
import { corsair } from 'corsair';
import { dockerhub } from '@corsair-dev/dockerhub';

const client = corsair({
  plugins: {
    dockerhub: dockerhub({
      authType: 'api_key',
      // username optional — used for JWT exchange on organizations.create
      // username: 'myuser',
    }),
  },
});
```

Many **public** GETs (`library/*` tags/repos) work **without** a token.

## Quick examples

```ts
await client.dockerhub.repositories.get({
  namespace: 'library',
  name: 'hello-world',
});

await client.dockerhub.tags.list({
  namespace: 'library',
  name: 'alpine',
  pageSize: 10,
});

await client.dockerhub.images.list({
  namespace: 'library',
  name: 'alpine',
});
```

## Local test / demo (R4 Loom)

```powershell
cd D:\opensource\corsair

# Offline schema + handler tests (no key)
pnpm --filter @corsair-dev/dockerhub test

# Optional live public GETs
$env:DOCKER_HUB_LIVE = "1"
pnpm --filter @corsair-dev/dockerhub test

# Terminal demo
pnpm --filter @corsair-dev/dockerhub demo

# With PAT
$env:DOCKER_HUB_TOKEN = "dckr_pat_..."
pnpm --filter @corsair-dev/dockerhub demo
```

### R4 demo video

[Loom — tests + live Hub demo](https://www.loom.com/share/8321f25934ef45a2bf0bfd23dbd1f7f0)

## Issue

Implements [corsairdev/corsair#481](https://github.com/corsairdev/corsair/issues/481).
