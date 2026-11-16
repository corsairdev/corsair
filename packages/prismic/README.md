# @corsair-dev/prismic

Headless CMS API for querying published documents and migrating content into a repository.

## Install

```bash
pnpm add @corsair-dev/prismic
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `documents.get` | `prismic.api.documents.get` | `read` | Read one published document by id, optionally at a ref |
| `documents.search` | `prismic.api.documents.search` | `read` | Query published documents with Prismic predicates, ordering, tags and locale, paged by number or by a `next_page` cursor |
| `migration.create` | `prismic.api.migration.create` | `write` | Create one page as a draft in a migration release. It is not published until the release is published, and Prismic accepts one page per request at one request per second |
| `migration.update` | `prismic.api.migration.update` | `write` | Update one existing page. The type, locale and translation link cannot be changed, and omitting `tags` deletes them all |
| `repository.info` | `prismic.api.repository.info` | `read` | Read the repository's refs, custom types, languages and tags, which a document query needs since it is pinned to a ref |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/prismic

## License

Apache-2.0
