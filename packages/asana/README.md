# @corsair-dev/asana

Asana plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/asana
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `projects.addFollowers` | `asana.api.projects.addFollowers` | `write` | Add followers to a project |
| `projects.addMembers` | `asana.api.projects.addMembers` | `write` | Add members to a project |
| `projects.create` | `asana.api.projects.create` | `write` | Create a project |
| `projects.createForTeam` | `asana.api.projects.createForTeam` | `write` | Create a project for a team |
| `projects.createForWorkspace` | `asana.api.projects.createForWorkspace` | `write` | Create a project for a workspace |
| `projects.delete` | `asana.api.projects.delete` | `destructive` | Delete a project [DESTRUCTIVE] |
| `projects.duplicate` | `asana.api.projects.duplicate` | `write` | Duplicate a project |
| `projects.get` | `asana.api.projects.get` | `read` | Get a project by GID |
| `projects.getTaskCounts` | `asana.api.projects.getTaskCounts` | `read` | Get task counts for a project |
| `projects.getTasks` | `asana.api.projects.getTasks` | `read` | Get tasks in a project |
| `projects.list` | `asana.api.projects.list` | `read` | List projects |
| `projects.listForWorkspace` | `asana.api.projects.listForWorkspace` | `read` | List projects in a workspace |
| `projects.removeFollowers` | `asana.api.projects.removeFollowers` | `write` | Remove followers from a project |
| `projects.removeMembers` | `asana.api.projects.removeMembers` | `write` | Remove members from a project |
| `projects.update` | `asana.api.projects.update` | `write` | Update a project |
| `sections.create` | `asana.api.sections.create` | `write` | Create a section in a project |
| `sections.delete` | `asana.api.sections.delete` | `destructive` | Delete a section [DESTRUCTIVE] |
| `sections.get` | `asana.api.sections.get` | `read` | Get a section by GID |
| `sections.insert` | `asana.api.sections.insert` | `write` | Insert a section at a specific position |
| `sections.list` | `asana.api.sections.list` | `read` | List sections in a project |
| `sections.update` | `asana.api.sections.update` | `write` | Update a section |
| `stories.createComment` | `asana.api.stories.createComment` | `write` | Create a comment on a task |
| `stories.delete` | `asana.api.stories.delete` | `destructive` | Delete a story [DESTRUCTIVE] |
| `stories.get` | `asana.api.stories.get` | `read` | Get a story by GID |
| `stories.listForTask` | `asana.api.stories.listForTask` | `read` | List stories for a task |
| `stories.update` | `asana.api.stories.update` | `write` | Update a story |
| `tags.create` | `asana.api.tags.create` | `write` | Create a tag |
| `tags.createInWorkspace` | `asana.api.tags.createInWorkspace` | `write` | Create a tag in a workspace |
| `tags.delete` | `asana.api.tags.delete` | `destructive` | Delete a tag [DESTRUCTIVE] |
| `tags.get` | `asana.api.tags.get` | `read` | Get a tag by GID |
| `tags.getTasks` | `asana.api.tags.getTasks` | `read` | Get tasks with a specific tag |
| `tags.list` | `asana.api.tags.list` | `read` | List tags |
| `tags.listForTask` | `asana.api.tags.listForTask` | `read` | List tags on a task |
| `tags.listForWorkspace` | `asana.api.tags.listForWorkspace` | `read` | List tags in a workspace |
| `tags.update` | `asana.api.tags.update` | `write` | Update a tag |
| `tasks.addDependencies` | `asana.api.tasks.addDependencies` | `write` | Add task dependencies |
| `tasks.addFollowers` | `asana.api.tasks.addFollowers` | `write` | Add followers to a task |
| `tasks.addProject` | `asana.api.tasks.addProject` | `write` | Add a task to a project |
| `tasks.addTag` | `asana.api.tasks.addTag` | `write` | Add a tag to a task |
| `tasks.addToSection` | `asana.api.tasks.addToSection` | `write` | Add a task to a section |
| `tasks.create` | `asana.api.tasks.create` | `write` | Create a new task |
| `tasks.createSubtask` | `asana.api.tasks.createSubtask` | `write` | Create a subtask |
| `tasks.delete` | `asana.api.tasks.delete` | `destructive` | Delete a task [DESTRUCTIVE] |
| `tasks.duplicate` | `asana.api.tasks.duplicate` | `write` | Duplicate a task |
| `tasks.get` | `asana.api.tasks.get` | `read` | Get a task by GID |
| `tasks.getAttachments` | `asana.api.tasks.getAttachments` | `read` | Get attachments for a task |
| `tasks.getStories` | `asana.api.tasks.getStories` | `read` | Get stories (activity) for a task |
| `tasks.getSubtasks` | `asana.api.tasks.getSubtasks` | `read` | Get subtasks of a task |
| `tasks.getTags` | `asana.api.tasks.getTags` | `read` | Get tags on a task |
| `tasks.list` | `asana.api.tasks.list` | `read` | List tasks |
| `tasks.removeFollower` | `asana.api.tasks.removeFollower` | `write` | Remove a follower from a task |
| `tasks.removeProject` | `asana.api.tasks.removeProject` | `write` | Remove a task from a project |
| `tasks.removeTag` | `asana.api.tasks.removeTag` | `write` | Remove a tag from a task |
| `tasks.search` | `asana.api.tasks.search` | `read` | Search tasks in a workspace |
| `tasks.setParent` | `asana.api.tasks.setParent` | `write` | Set the parent of a task |
| `tasks.update` | `asana.api.tasks.update` | `write` | Update a task |
| `teams.addUser` | `asana.api.teams.addUser` | `write` | Add a user to a team |
| `teams.create` | `asana.api.teams.create` | `write` | Create a team |
| `teams.get` | `asana.api.teams.get` | `read` | Get a team by GID |
| `teams.listForUser` | `asana.api.teams.listForUser` | `read` | List teams for a user |
| `teams.listForWorkspace` | `asana.api.teams.listForWorkspace` | `read` | List teams in a workspace |
| `teams.membershipsGet` | `asana.api.teams.membershipsGet` | `read` | Get a team membership |
| `teams.membershipsList` | `asana.api.teams.membershipsList` | `read` | List team memberships |
| `teams.membershipsListForTeam` | `asana.api.teams.membershipsListForTeam` | `read` | List memberships for a team |
| `teams.membershipsListForUser` | `asana.api.teams.membershipsListForUser` | `read` | List team memberships for a user |
| `teams.removeUser` | `asana.api.teams.removeUser` | `write` | Remove a user from a team |
| `teams.update` | `asana.api.teams.update` | `write` | Update a team |
| `users.get` | `asana.api.users.get` | `read` | Get a user by GID |
| `users.getCurrent` | `asana.api.users.getCurrent` | `read` | Get the currently authenticated user |
| `users.getFavorites` | `asana.api.users.getFavorites` | `read` | Get a user's favorites |
| `users.getTaskList` | `asana.api.users.getTaskList` | `read` | Get a user's task list |
| `users.getUserTaskList` | `asana.api.users.getUserTaskList` | `read` | Get a user task list by GID |
| `users.list` | `asana.api.users.list` | `read` | List users |
| `users.listForTeam` | `asana.api.users.listForTeam` | `read` | List users in a team |
| `users.listForWorkspace` | `asana.api.users.listForWorkspace` | `read` | List users in a workspace |
| `webhookManagement.create` | `asana.api.webhookManagement.create` | `write` | Register a new webhook |
| `webhookManagement.delete` | `asana.api.webhookManagement.delete` | `destructive` | Delete a webhook [DESTRUCTIVE] |
| `webhookManagement.getList` | `asana.api.webhookManagement.getList` | `read` | List webhooks |
| `webhookManagement.update` | `asana.api.webhookManagement.update` | `write` | Update a webhook |
| `workspaces.get` | `asana.api.workspaces.get` | `read` | Get a workspace by GID |
| `workspaces.list` | `asana.api.workspaces.list` | `read` | List workspaces |
| `workspaces.membershipsGet` | `asana.api.workspaces.membershipsGet` | `read` | Get a workspace membership |
| `workspaces.membershipsList` | `asana.api.workspaces.membershipsList` | `read` | List workspace memberships |
| `workspaces.membershipsListForUser` | `asana.api.workspaces.membershipsListForUser` | `read` | List workspace memberships for a user |

## Auth

Auth: API key, OAuth 2.0, Managed OAuth (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/asana

## License

Apache-2.0
