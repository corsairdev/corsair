# @corsair-dev/github

Github plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/github
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.delete` | `github.api.comments.delete` | `write` | Delete a comment |
| `comments.get` | `github.api.comments.get` | `read` | Get a specific comment |
| `comments.list` | `github.api.comments.list` | `read` | List all comments in a repository |
| `comments.listForIssue` | `github.api.comments.listForIssue` | `read` | List comments on a specific issue or pull request |
| `comments.update` | `github.api.comments.update` | `write` | Update a comment |
| `discussions.get` | `github.api.discussions.get` | `read` | Get a specific discussion |
| `discussions.list` | `github.api.discussions.list` | `read` | List discussions in a repository |
| `events.list` | `github.api.events.list` | `read` | List public GitHub events |
| `events.listForNetwork` | `github.api.events.listForNetwork` | `read` | List public events for a repository network |
| `events.listForOrg` | `github.api.events.listForOrg` | `read` | List public events for an organization |
| `events.listForRepository` | `github.api.events.listForRepository` | `read` | List events for a repository |
| `events.listForUser` | `github.api.events.listForUser` | `read` | List events for a user |
| `events.listForUserOrg` | `github.api.events.listForUserOrg` | `read` | List organization events for a user |
| `events.listPublicForUser` | `github.api.events.listPublicForUser` | `read` | List public events for a user |
| `events.listPublicReceivedForUser` | `github.api.events.listPublicReceivedForUser` | `read` | List public events received by a user |
| `events.listReceivedForUser` | `github.api.events.listReceivedForUser` | `read` | List events received by a user |
| `forks.list` | `github.api.forks.list` | `read` | List forks of a repository |
| `issues.create` | `github.api.issues.create` | `write` | Create a new issue |
| `issues.createComment` | `github.api.issues.createComment` | `write` | Post a comment on an issue |
| `issues.get` | `github.api.issues.get` | `read` | Get a specific issue |
| `issues.list` | `github.api.issues.list` | `read` | List issues in a repository |
| `issues.update` | `github.api.issues.update` | `write` | Update an existing issue |
| `pullRequests.createReview` | `github.api.pullRequests.createReview` | `write` | Submit a pull request review |
| `pullRequests.get` | `github.api.pullRequests.get` | `read` | Get a specific pull request |
| `pullRequests.list` | `github.api.pullRequests.list` | `read` | List pull requests |
| `pullRequests.listReviews` | `github.api.pullRequests.listReviews` | `read` | List reviews on a pull request |
| `releases.create` | `github.api.releases.create` | `write` | Create a new release |
| `releases.get` | `github.api.releases.get` | `read` | Get a specific release |
| `releases.list` | `github.api.releases.list` | `read` | List releases in a repository |
| `releases.update` | `github.api.releases.update` | `write` | Update an existing release |
| `repositories.checkStarred` | `github.api.repositories.checkStarred` | `read` | Check whether the authenticated user has starred a repository |
| `repositories.get` | `github.api.repositories.get` | `read` | Get a specific repository |
| `repositories.getContent` | `github.api.repositories.getContent` | `read` | Get file or directory content from a repository |
| `repositories.list` | `github.api.repositories.list` | `read` | List repositories for the authenticated user |
| `repositories.listBranches` | `github.api.repositories.listBranches` | `read` | List branches in a repository |
| `repositories.listCommits` | `github.api.repositories.listCommits` | `read` | List commits in a repository |
| `repositories.listStargazers` | `github.api.repositories.listStargazers` | `read` | List users who have starred a repository |
| `repositories.listStarred` | `github.api.repositories.listStarred` | `read` | List repositories starred by the authenticated user |
| `repositories.star` | `github.api.repositories.star` | `write` | Star a repository for the authenticated user |
| `repositories.unstar` | `github.api.repositories.unstar` | `write` | Unstar a repository for the authenticated user |
| `search.issues` | `github.api.search.issues` | `read` | Search GitHub issues and pull requests |
| `search.repositories` | `github.api.search.repositories` | `read` | Search GitHub repositories |
| `search.users` | `github.api.search.users` | `read` | Search GitHub users and organizations |
| `users.get` | `github.api.users.get` | `read` | Get a user by username |
| `users.getAuthenticated` | `github.api.users.getAuthenticated` | `read` | Get the authenticated user |
| `users.getById` | `github.api.users.getById` | `read` | Get a user by account ID |
| `users.getHovercard` | `github.api.users.getHovercard` | `read` | Get contextual hovercard information for a user |
| `users.list` | `github.api.users.list` | `read` | List all GitHub users |
| `users.update` | `github.api.users.update` | `write` | Update the authenticated user profile |
| `workflows.get` | `github.api.workflows.get` | `read` | Get a specific workflow |
| `workflows.list` | `github.api.workflows.list` | `read` | List workflows in a repository |
| `workflows.listRuns` | `github.api.workflows.listRuns` | `read` | List workflow runs |

## Auth

Auth: API key, OAuth 2.0, Managed OAuth (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 100 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/github

## License

Apache-2.0
