# @corsair-dev/canny

Canny plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/canny
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `boards.list` | `canny.api.boards.list` | `read` | List all boards for your company in Canny |
| `boards.retrieve` | `canny.api.boards.retrieve` | `read` | Retrieve details of an existing Canny board by ID |
| `posts.list` | `canny.api.posts.list` | `read` | List posts in Canny with optional filtering and pagination |
| `posts.retrieve` | `canny.api.posts.retrieve` | `read` | Retrieve details of an existing Canny post by ID |
| `posts.create` | `canny.api.posts.create` | `write` | Create a new post in Canny |
| `posts.changeStatus` | `canny.api.posts.changeStatus` | `write` | Change an existing Canny post's status |
| `posts.delete` | `canny.api.posts.delete` | `destructive` | Delete a post in Canny [DESTRUCTIVE · IRREVERSIBLE] |
| `comments.list` | `canny.api.comments.list` | `read` | List comments in Canny with optional filtering and pagination |
| `comments.create` | `canny.api.comments.create` | `write` | Create a new comment on a Canny post |
| `comments.delete` | `canny.api.comments.delete` | `destructive` | Delete a comment in Canny [DESTRUCTIVE · IRREVERSIBLE] |
| `votes.list` | `canny.api.votes.list` | `read` | List votes in Canny with optional filtering and pagination |
| `votes.create` | `canny.api.votes.create` | `write` | Create a vote for a Canny post on behalf of a user |
| `votes.delete` | `canny.api.votes.delete` | `destructive` | Delete a vote on a Canny post [DESTRUCTIVE · IRREVERSIBLE] |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/canny

## License

Apache-2.0
