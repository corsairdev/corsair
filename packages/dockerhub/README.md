# `@corsair-dev/dockerhub`

Corsair plugin for [Docker Hub](https://hub.docker.com) API v2.

- **Package id:** `dockerhub` (OSS slug: `docker_hub`)
- **Auth:** API Key (Personal Access Token as Bearer); optional username for JWT login on create-org
- **Ops:** 25 — repositories, tags, images (from tags), organizations, teams, repo webhooks (REST)
- **Docs:** [Hub API reference](https://docs.docker.com/reference/api/hub/latest/)

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

## Tests

```bash
# Offline schema + handler tests
pnpm --filter @corsair-dev/dockerhub test

# Optional live public GETs against hub.docker.com
DOCKER_HUB_LIVE=1 pnpm --filter @corsair-dev/dockerhub test
```

### R4 demo video

[Loom — tests + live Hub demo](https://www.loom.com/share/8321f25934ef45a2bf0bfd23dbd1f7f0)

## Notes

- Repo/tag reads + create use official `/v2/namespaces/...` routes.
- Org invites use official `POST /v2/invites/bulk`.
- Hub retired `POST /v2/namespaces/{ns}/delete-images` (Advanced Image Management) — use `tags.delete` or the Hub UI / Registry delete API.
- Some org/webhook/delete routes are live Hub REST not listed in the public OpenAPI; handlers note that where relevant.

## Issue

Implements [corsairdev/corsair#481](https://github.com/corsairdev/corsair/issues/481).
