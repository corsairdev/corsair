# @corsair-dev/sourcegraph

Sourcegraph plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/sourcegraph
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `repository.compareCommits` | `sourcegraph.api.repository.compareCommits` | `read` | Compare two commits and list file diffs |
| `repository.getCommitDetails` | `sourcegraph.api.repository.getCommitDetails` | `read` | Get details for a commit, branch, or tag |
| `repository.getFileContents` | `sourcegraph.api.repository.getFileContents` | `read` | Fetch file contents on the default branch (HEAD) |
| `repository.list` | `sourcegraph.api.repository.list` | `read` | List repositories on the Sourcegraph instance |
| `repository.listFiles` | `sourcegraph.api.repository.listFiles` | `read` | List files and directories in a repository path |
| `repository.listLanguages` | `sourcegraph.api.repository.listLanguages` | `read` | List languages used in a repository |
| `site.checkSettingsEditPermission` | `sourcegraph.api.site.checkSettingsEditPermission` | `read` | Check whether the viewer can edit site settings through the GraphQL API |
| `user.getCurrent` | `sourcegraph.api.user.getCurrent` | `read` | Retrieve the currently authenticated Sourcegraph user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/sourcegraph

## License

Apache-2.0
