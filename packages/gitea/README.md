# @corsair-dev/gitea

Gitea integration for Corsair: manage repos, issues, comments, releases and webhook registrations through the Gitea API of any self-hosted or gitea.com instance. Inbound webhook deliveries are not handled.

## Install

```bash
pnpm add @corsair-dev/gitea
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `branches.list` | `gitea.api.branches.list` | `read` | List a repository's branches with their latest commit and protection status |
| `comments.create` | `gitea.api.comments.create` | `write` | Add a markdown comment to an issue or pull request |
| `comments.list` | `gitea.api.comments.list` | `read` | List every comment on an issue, oldest first, optionally within an updated-at window; this route takes no paging |
| `commits.list` | `gitea.api.commits.list` | `read` | List a repository's commits, newest first, optionally from a ref, path or time window; a repository with no commits answers an error rather than an empty list |
| `issues.create` | `gitea.api.issues.create` | `write` | Create an issue with a title, body, labels, assignees, milestone and optional deadline, optionally already closed |
| `issues.get` | `gitea.api.issues.get` | `read` | Get one issue or pull request by its number, including labels, assignees and the comment count |
| `issues.list` | `gitea.api.issues.list` | `read` | List a repository's issues and pull requests, filterable by state, labels, milestone, assignee and time window |
| `issues.update` | `gitea.api.issues.update` | `write` | Edit an issue: set title, body, labels, assignees, milestone or deadline, or close and reopen it through state |
| `releases.create` | `gitea.api.releases.create` | `write` | Create a release for a tag, creating the tag on the target commit when it does not exist yet; a tag that already has a release answers 409 |
| `releases.list` | `gitea.api.releases.list` | `read` | List a repository's releases with their assets, filterable by draft, prerelease and tag |
| `repos.create` | `gitea.api.repos.create` | `write` | Create a repository owned by the authenticated user, optionally seeded with a README, license and gitignore |
| `repos.delete` | `gitea.api.repos.delete` | `destructive` | Permanently delete a repository together with its issues, pull requests, releases and wiki; no API call can restore it |
| `repos.get` | `gitea.api.repos.get` | `read` | Get one repository, including its counts, permissions and feature flags |
| `repos.list` | `gitea.api.repos.list` | `read` | List the repositories the authenticated user owns, one page at a time |
| `user.me` | `gitea.api.user.me` | `read` | Get the authenticated user, as the account token sees it |
| `webhooks.create` | `gitea.api.webhooks.create` | `write` | Register a webhook on a repository: a target URL and payload type, the events to subscribe, and an optional signing secret. Deliveries are sent by Gitea to that URL; this plugin does not receive them |
| `webhooks.delete` | `gitea.api.webhooks.delete` | `destructive` | Permanently remove a webhook registration; deliveries stop immediately and the hook id is not reused |
| `webhooks.list` | `gitea.api.webhooks.list` | `read` | List the webhook registrations on a repository, with their target URLs, events and active flag |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gitea

## License

Apache-2.0
