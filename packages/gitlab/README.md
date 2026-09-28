# @corsair-dev/gitlab

Gitlab plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/gitlab
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `branches.create` | `gitlab.api.branches.create` | `write` | Create a new branch |
| `branches.delete` | `gitlab.api.branches.delete` | `destructive` | Delete a branch [DESTRUCTIVE] |
| `branches.get` | `gitlab.api.branches.get` | `read` | Get a specific branch |
| `branches.list` | `gitlab.api.branches.list` | `read` | List branches in a repository |
| `commits.get` | `gitlab.api.commits.get` | `read` | Get a specific commit |
| `commits.getDiff` | `gitlab.api.commits.getDiff` | `read` | Get the diff of a commit |
| `commits.list` | `gitlab.api.commits.list` | `read` | List commits in a repository |
| `groups.create` | `gitlab.api.groups.create` | `write` | Create a new group |
| `groups.delete` | `gitlab.api.groups.delete` | `destructive` | Delete a group [DESTRUCTIVE · IRREVERSIBLE] |
| `groups.get` | `gitlab.api.groups.get` | `read` | Get a specific group |
| `groups.list` | `gitlab.api.groups.list` | `read` | List groups |
| `groups.listProjects` | `gitlab.api.groups.listProjects` | `read` | List projects in a group |
| `groups.update` | `gitlab.api.groups.update` | `write` | Update a group |
| `issues.create` | `gitlab.api.issues.create` | `write` | Create a new issue |
| `issues.createNote` | `gitlab.api.issues.createNote` | `write` | Add a comment to an issue |
| `issues.delete` | `gitlab.api.issues.delete` | `destructive` | Delete an issue [DESTRUCTIVE · IRREVERSIBLE] |
| `issues.get` | `gitlab.api.issues.get` | `read` | Get a specific issue |
| `issues.list` | `gitlab.api.issues.list` | `read` | List issues in a project |
| `issues.listNotes` | `gitlab.api.issues.listNotes` | `read` | List comments on an issue |
| `issues.update` | `gitlab.api.issues.update` | `write` | Update an existing issue |
| `labels.create` | `gitlab.api.labels.create` | `write` | Create a new label |
| `labels.delete` | `gitlab.api.labels.delete` | `destructive` | Delete a label [DESTRUCTIVE] |
| `labels.list` | `gitlab.api.labels.list` | `read` | List labels in a project |
| `labels.update` | `gitlab.api.labels.update` | `write` | Update a label |
| `mergeRequests.approve` | `gitlab.api.mergeRequests.approve` | `write` | Approve a merge request |
| `mergeRequests.create` | `gitlab.api.mergeRequests.create` | `write` | Create a new merge request |
| `mergeRequests.createNote` | `gitlab.api.mergeRequests.createNote` | `write` | Add a comment to a merge request |
| `mergeRequests.delete` | `gitlab.api.mergeRequests.delete` | `destructive` | Delete a merge request [DESTRUCTIVE · IRREVERSIBLE] |
| `mergeRequests.get` | `gitlab.api.mergeRequests.get` | `read` | Get a specific merge request |
| `mergeRequests.list` | `gitlab.api.mergeRequests.list` | `read` | List merge requests in a project |
| `mergeRequests.listNotes` | `gitlab.api.mergeRequests.listNotes` | `read` | List comments on a merge request |
| `mergeRequests.merge` | `gitlab.api.mergeRequests.merge` | `write` | Merge a merge request |
| `mergeRequests.update` | `gitlab.api.mergeRequests.update` | `write` | Update a merge request |
| `milestones.create` | `gitlab.api.milestones.create` | `write` | Create a new milestone |
| `milestones.delete` | `gitlab.api.milestones.delete` | `destructive` | Delete a milestone [DESTRUCTIVE] |
| `milestones.get` | `gitlab.api.milestones.get` | `read` | Get a specific milestone |
| `milestones.list` | `gitlab.api.milestones.list` | `read` | List milestones in a project |
| `milestones.update` | `gitlab.api.milestones.update` | `write` | Update a milestone |
| `pipelines.cancel` | `gitlab.api.pipelines.cancel` | `write` | Cancel a running pipeline |
| `pipelines.create` | `gitlab.api.pipelines.create` | `write` | Create a new pipeline |
| `pipelines.delete` | `gitlab.api.pipelines.delete` | `destructive` | Delete a pipeline [DESTRUCTIVE] |
| `pipelines.get` | `gitlab.api.pipelines.get` | `read` | Get a specific pipeline |
| `pipelines.list` | `gitlab.api.pipelines.list` | `read` | List pipelines for a project |
| `pipelines.listJobs` | `gitlab.api.pipelines.listJobs` | `read` | List jobs in a pipeline |
| `pipelines.retry` | `gitlab.api.pipelines.retry` | `write` | Retry a failed pipeline |
| `projects.create` | `gitlab.api.projects.create` | `write` | Create a new project |
| `projects.delete` | `gitlab.api.projects.delete` | `destructive` | Delete a project [DESTRUCTIVE · IRREVERSIBLE] |
| `projects.fork` | `gitlab.api.projects.fork` | `write` | Fork a project |
| `projects.get` | `gitlab.api.projects.get` | `read` | Get a specific project |
| `projects.list` | `gitlab.api.projects.list` | `read` | List projects |
| `projects.update` | `gitlab.api.projects.update` | `write` | Update an existing project |
| `releases.create` | `gitlab.api.releases.create` | `write` | Create a new release |
| `releases.delete` | `gitlab.api.releases.delete` | `destructive` | Delete a release [DESTRUCTIVE] |
| `releases.get` | `gitlab.api.releases.get` | `read` | Get a specific release |
| `releases.list` | `gitlab.api.releases.list` | `read` | List releases in a project |
| `releases.update` | `gitlab.api.releases.update` | `write` | Update a release |
| `repository.compare` | `gitlab.api.repository.compare` | `read` | Compare branches, tags, or commits |
| `repository.getFile` | `gitlab.api.repository.getFile` | `read` | Get a file from the repository |
| `repository.getTree` | `gitlab.api.repository.getTree` | `read` | List repository tree (files and directories) |
| `users.getCurrentUser` | `gitlab.api.users.getCurrentUser` | `read` | Get the authenticated user |
| `users.getUser` | `gitlab.api.users.getUser` | `read` | Get a specific user by ID |
| `users.list` | `gitlab.api.users.list` | `read` | List users |

## Auth

Auth: API key, OAuth 2.0, Managed OAuth (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 5 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gitlab

## License

Apache-2.0
