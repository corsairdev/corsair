# @corsair-dev/jira

Jira plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/jira
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `comments.add` | `jira.api.comments.add` | `write` | Add a comment to a Jira issue |
| `comments.delete` | `jira.api.comments.delete` | `destructive` | Delete a comment from a Jira issue [DESTRUCTIVE] |
| `comments.get` | `jira.api.comments.get` | `read` | Get a specific comment on a Jira issue |
| `comments.list` | `jira.api.comments.list` | `read` | List all comments on a Jira issue |
| `comments.update` | `jira.api.comments.update` | `write` | Update a comment on a Jira issue |
| `groups.create` | `jira.api.groups.create` | `write` | Create a new Jira group |
| `groups.getAll` | `jira.api.groups.getAll` | `read` | Get all Jira groups |
| `issues.addAttachment` | `jira.api.issues.addAttachment` | `write` | Add an attachment to a Jira issue |
| `issues.addWatcher` | `jira.api.issues.addWatcher` | `write` | Add a watcher to a Jira issue |
| `issues.assign` | `jira.api.issues.assign` | `write` | Assign a Jira issue to a user |
| `issues.bulkCreate` | `jira.api.issues.bulkCreate` | `write` | Bulk create multiple Jira issues |
| `issues.bulkFetch` | `jira.api.issues.bulkFetch` | `read` | Bulk fetch multiple Jira issues by ID or key |
| `issues.create` | `jira.api.issues.create` | `write` | Create a new Jira issue |
| `issues.delete` | `jira.api.issues.delete` | `destructive` | Delete a Jira issue [DESTRUCTIVE] |
| `issues.edit` | `jira.api.issues.edit` | `write` | Edit an existing Jira issue |
| `issues.get` | `jira.api.issues.get` | `read` | Get a Jira issue by ID or key |
| `issues.getTransitions` | `jira.api.issues.getTransitions` | `read` | Get available transitions for a Jira issue |
| `issues.linkIssues` | `jira.api.issues.linkIssues` | `write` | Link two Jira issues together |
| `issues.removeWatcher` | `jira.api.issues.removeWatcher` | `write` | Remove a watcher from a Jira issue |
| `issues.search` | `jira.api.issues.search` | `read` | Search issues using JQL |
| `issues.transition` | `jira.api.issues.transition` | `write` | Transition a Jira issue to a new status |
| `projects.create` | `jira.api.projects.create` | `write` | Create a new Jira project |
| `projects.get` | `jira.api.projects.get` | `read` | Get a Jira project by ID or key |
| `projects.getRoles` | `jira.api.projects.getRoles` | `read` | Get project roles for a Jira project |
| `projects.list` | `jira.api.projects.list` | `read` | List Jira projects |
| `sprints.create` | `jira.api.sprints.create` | `write` | Create a new sprint on a Jira board |
| `sprints.list` | `jira.api.sprints.list` | `read` | List sprints for a Jira board |
| `sprints.listBoards` | `jira.api.sprints.listBoards` | `read` | List Jira boards |
| `sprints.moveIssues` | `jira.api.sprints.moveIssues` | `write` | Move issues to a sprint |
| `users.find` | `jira.api.users.find` | `read` | Search for Jira users |
| `users.getAll` | `jira.api.users.getAll` | `read` | Get all Jira users |
| `users.getCurrent` | `jira.api.users.getCurrent` | `read` | Get the currently authenticated Jira user |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 3 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/jira

## License

Apache-2.0
