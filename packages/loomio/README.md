# @corsair-dev/loomio

Group decision making with Loomio - browse groups, threads and discussions, read thread timelines and markdown exports, start discussions and comments, and create polls.

## Install

```bash
pnpm add @corsair-dev/loomio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.create` | `loomio.api.comments.create` | `write` | Post a comment on a discussion, in markdown or html |
| `discussions.create` | `loomio.api.discussions.create` | `write` | Start a discussion in a group, optionally notifying members or inviting email recipients |
| `discussions.get` | `loomio.api.discussions.get` | `read` | Read one discussion by numeric id or url key, with its author and thread record |
| `discussions.list` | `loomio.api.discussions.list` | `read` | List discussions in one group, filtered by open or closed status, ordered by latest activity |
| `groups.get` | `loomio.api.groups.get` | `read` | Read one group by numeric id, url key, or handle, with its settings and member counts |
| `groups.list` | `loomio.api.groups.list` | `read` | List the groups the API key user belongs to, including subgroups, oldest first |
| `polls.create` | `loomio.api.polls.create` | `write` | Create a poll in a group or on a discussion: proposal, poll, count, score, ranked_choice, meeting, or dot_vote |
| `polls.get` | `loomio.api.polls.get` | `read` | Read one poll by numeric id or url key, with vote counts and its options |
| `polls.list` | `loomio.api.polls.list` | `read` | List polls in one group, filtered by active or closed status, newest first, with current outcomes |
| `threads.items` | `loomio.api.threads.items` | `read` | Read one thread timeline in sequence order: comments, polls, votes, and outcomes as one event stream |
| `threads.list` | `loomio.api.threads.list` | `read` | List the threads the key user can see, ordered by latest activity, across all groups |
| `threads.markdown` | `loomio.api.threads.markdown` | `read` | Export one thread as a single markdown document; needs export permission on the thread |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/loomio

## License

Apache-2.0
