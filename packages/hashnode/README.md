# @corsair-dev/hashnode

Hashnode plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/hashnode
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.list` | `hashnode.api.comments.list` | `read` | List comments on a post |
| `drafts.create` | `hashnode.api.drafts.create` | `write` | Create a new draft |
| `drafts.delete` | `hashnode.api.drafts.delete` | `destructive` | Delete a draft [DESTRUCTIVE - IRREVERSIBLE] |
| `drafts.get` | `hashnode.api.drafts.get` | `read` | Get a draft by ID |
| `drafts.publish` | `hashnode.api.drafts.publish` | `write` | Publish a draft as a post |
| `drafts.update` | `hashnode.api.drafts.update` | `write` | Update an existing draft |
| `feed.list` | `hashnode.api.feed.list` | `read` | Get the global feed of posts |
| `images.createUploadURL` | `hashnode.api.images.createUploadURL` | `write` | Create a presigned image upload URL |
| `me` | `hashnode.api.me` | `read` | Get the current authenticated user |
| `pages.get` | `hashnode.api.pages.get` | `read` | Get a static page by slug |
| `pages.list` | `hashnode.api.pages.list` | `read` | List static pages in a publication |
| `posts.get` | `hashnode.api.posts.get` | `read` | Get a single post by ID |
| `posts.getBySlug` | `hashnode.api.posts.getBySlug` | `read` | Get a post by publication host and slug |
| `posts.list` | `hashnode.api.posts.list` | `read` | List posts in a publication |
| `posts.publish` | `hashnode.api.posts.publish` | `write` | Publish a new post |
| `posts.search` | `hashnode.api.posts.search` | `read` | Search posts within a publication |
| `posts.update` | `hashnode.api.posts.update` | `write` | Update an existing post |
| `publications.get` | `hashnode.api.publications.get` | `read` | Get a publication by host |
| `publications.list` | `hashnode.api.publications.list` | `read` | List publications for the authenticated user |
| `series.get` | `hashnode.api.series.get` | `read` | Get a series by slug |
| `series.list` | `hashnode.api.series.list` | `read` | List series in a publication |
| `tags.get` | `hashnode.api.tags.get` | `read` | Get a tag by slug |
| `users.get` | `hashnode.api.users.get` | `read` | Get a user by username |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/hashnode

## License

Apache-2.0
