# @corsair-dev/gitea

Gitea integration for Corsair: git hosting on Gitea, Forgejo and Codeberg (gitea.com or any self-hosted instance): repositories, branches and protections, commits and statuses, files, tags and releases, issues, comments, labels, milestones and time tracking, pull requests and reviews, wikis, projects, Actions (runs, jobs, artifacts, secrets, variables, runners, workflows), packages, organizations and teams, users, keys, notifications and site admin, plus signed webhooks for pushes, issues, pull requests, reviews and releases (530 operations).

## Install

```bash
pnpm add @corsair-dev/gitea
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actions.artifacts.delete` | `gitea.api.actions.artifacts.delete` | `destructive` | Deletes a specific artifact for a workflow run |
| `actions.artifacts.download` | `gitea.api.actions.artifacts.download` | `read` | Downloads a specific artifact for a workflow run redirects to blob url (returned as a file) |
| `actions.artifacts.get` | `gitea.api.actions.artifacts.get` | `read` | Gets a specific artifact for a workflow run |
| `actions.artifacts.list` | `gitea.api.actions.artifacts.list` | `read` | Lists all artifacts for a repository |
| `actions.jobs.downloadLogs` | `gitea.api.actions.jobs.downloadLogs` | `read` | Downloads the job logs for a workflow run (returned as a file) |
| `actions.jobs.get` | `gitea.api.actions.jobs.get` | `read` | Gets a specific workflow job for a workflow run |
| `actions.jobs.list` | `gitea.api.actions.jobs.list` | `read` | Lists all jobs for a repository |
| `actions.runners.createRegistrationToken` | `gitea.api.actions.runners.createRegistrationToken` | `write` | Get a repository's actions runner registration token |
| `actions.runners.delete` | `gitea.api.actions.runners.delete` | `destructive` | Delete a repo-level runner |
| `actions.runners.get` | `gitea.api.actions.runners.get` | `read` | Get a repo-level runner |
| `actions.runners.list` | `gitea.api.actions.runners.list` | `read` | Get repo-level runners |
| `actions.runners.update` | `gitea.api.actions.runners.update` | `write` | Update a repo-level runner |
| `actions.runs.approve` | `gitea.api.actions.runs.approve` | `write` | Approve a workflow run that requires approval |
| `actions.runs.artifacts.list` | `gitea.api.actions.runs.artifacts.list` | `read` | Lists all artifacts for a repository run |
| `actions.runs.attempts.get` | `gitea.api.actions.runs.attempts.get` | `read` | Gets a specific workflow run attempt |
| `actions.runs.attempts.jobs.list` | `gitea.api.actions.runs.attempts.jobs.list` | `read` | Lists all jobs for a workflow run attempt |
| `actions.runs.cancel` | `gitea.api.actions.runs.cancel` | `write` | Cancel a workflow run and its jobs |
| `actions.runs.delete` | `gitea.api.actions.runs.delete` | `destructive` | Delete a workflow run |
| `actions.runs.downloadLogs` | `gitea.api.actions.runs.downloadLogs` | `read` | Download workflow run logs as archive (returned as a file) |
| `actions.runs.forceCancel` | `gitea.api.actions.runs.forceCancel` | `write` | Force-cancel a workflow run |
| `actions.runs.get` | `gitea.api.actions.runs.get` | `read` | Gets a specific workflow run |
| `actions.runs.jobs.list` | `gitea.api.actions.runs.jobs.list` | `read` | Lists all jobs for a workflow run |
| `actions.runs.jobs.rerun` | `gitea.api.actions.runs.jobs.rerun` | `write` | Reruns a specific workflow job in a run |
| `actions.runs.list` | `gitea.api.actions.runs.list` | `read` | Lists all runs for a repository run |
| `actions.runs.rerun` | `gitea.api.actions.runs.rerun` | `write` | Reruns an entire workflow run |
| `actions.runs.rerunFailed` | `gitea.api.actions.runs.rerunFailed` | `write` | Reruns all failed jobs in a workflow run |
| `actions.secrets.delete` | `gitea.api.actions.secrets.delete` | `destructive` | Delete a secret in a repository |
| `actions.secrets.list` | `gitea.api.actions.secrets.list` | `read` | List a repo's actions secrets, one page at a time |
| `actions.secrets.set` | `gitea.api.actions.secrets.set` | `destructive` | Create or Update a secret value in a repository |
| `actions.tasks.list` | `gitea.api.actions.tasks.list` | `read` | List a repository's action tasks |
| `actions.variables.create` | `gitea.api.actions.variables.create` | `write` | Create a repo-level variable |
| `actions.variables.delete` | `gitea.api.actions.variables.delete` | `destructive` | Delete a repo-level variable |
| `actions.variables.get` | `gitea.api.actions.variables.get` | `read` | Get a repo-level variable |
| `actions.variables.list` | `gitea.api.actions.variables.list` | `read` | Get repo-level variables list, one page at a time |
| `actions.variables.update` | `gitea.api.actions.variables.update` | `write` | Update a repo-level variable |
| `actions.workflows.disable` | `gitea.api.actions.workflows.disable` | `write` | Disable a workflow |
| `actions.workflows.dispatch` | `gitea.api.actions.workflows.dispatch` | `write` | Create a workflow dispatch event |
| `actions.workflows.enable` | `gitea.api.actions.workflows.enable` | `write` | Enable a workflow |
| `actions.workflows.get` | `gitea.api.actions.workflows.get` | `read` | Get a workflow |
| `actions.workflows.list` | `gitea.api.actions.workflows.list` | `read` | List repository workflows |
| `actions.workflows.runs.list` | `gitea.api.actions.workflows.runs.list` | `read` | List runs for a workflow |
| `admin.actions.jobs.list` | `gitea.api.admin.actions.jobs.list` | `read` | Lists all jobs (site admins only) |
| `admin.actions.runners.createRegistrationToken` | `gitea.api.admin.actions.runners.createRegistrationToken` | `destructive` | Get a global actions runner registration token (site admins only) |
| `admin.actions.runners.delete` | `gitea.api.admin.actions.runners.delete` | `destructive` | Delete a global runner (site admins only) |
| `admin.actions.runners.get` | `gitea.api.admin.actions.runners.get` | `read` | Get a global runner (site admins only) |
| `admin.actions.runners.list` | `gitea.api.admin.actions.runners.list` | `read` | Get all runners (site admins only) |
| `admin.actions.runners.update` | `gitea.api.admin.actions.runners.update` | `destructive` | Update a global runner (site admins only) |
| `admin.actions.runs.list` | `gitea.api.admin.actions.runs.list` | `read` | Lists all runs (site admins only) |
| `admin.cron.list` | `gitea.api.admin.cron.list` | `read` | List cron tasks, one page at a time (site admins only) |
| `admin.cron.run` | `gitea.api.admin.cron.run` | `destructive` | Run one of the instance cron tasks now (site admins only) |
| `admin.emails.list` | `gitea.api.admin.emails.list` | `read` | List all emails, one page at a time (site admins only) |
| `admin.emails.search` | `gitea.api.admin.emails.search` | `read` | Search all emails, one page at a time (site admins only) |
| `admin.hooks.create` | `gitea.api.admin.hooks.create` | `destructive` | Create a hook (site admins only) |
| `admin.hooks.delete` | `gitea.api.admin.hooks.delete` | `destructive` | Delete a hook (site admins only) |
| `admin.hooks.get` | `gitea.api.admin.hooks.get` | `read` | Get a hook (site admins only) |
| `admin.hooks.list` | `gitea.api.admin.hooks.list` | `read` | List system's webhooks, one page at a time (site admins only) |
| `admin.hooks.update` | `gitea.api.admin.hooks.update` | `destructive` | Update a hook (site admins only) |
| `admin.orgs.list` | `gitea.api.admin.orgs.list` | `read` | List all organizations, one page at a time (site admins only) |
| `admin.packages.list` | `gitea.api.admin.packages.list` | `read` | List all packages, one page at a time (site admins only) |
| `admin.unadopted.adopt` | `gitea.api.admin.unadopted.adopt` | `destructive` | Adopt unadopted files as a repository (site admins only) |
| `admin.unadopted.delete` | `gitea.api.admin.unadopted.delete` | `destructive` | Delete unadopted files (site admins only) |
| `admin.unadopted.list` | `gitea.api.admin.unadopted.list` | `read` | List unadopted repositories, one page at a time (site admins only) |
| `admin.users.badges.add` | `gitea.api.admin.users.badges.add` | `destructive` | Add a badge to a user (site admins only) |
| `admin.users.badges.delete` | `gitea.api.admin.users.badges.delete` | `destructive` | Remove a badge from a user (site admins only) |
| `admin.users.badges.list` | `gitea.api.admin.users.badges.list` | `read` | List a user's badges (site admins only) |
| `admin.users.create` | `gitea.api.admin.users.create` | `destructive` | Create a user (site admins only) |
| `admin.users.delete` | `gitea.api.admin.users.delete` | `destructive` | Delete a user (site admins only) |
| `admin.users.keys.create` | `gitea.api.admin.users.keys.create` | `destructive` | Add a public key on behalf of a user (site admins only) |
| `admin.users.keys.delete` | `gitea.api.admin.users.keys.delete` | `destructive` | Delete a user's public key (site admins only) |
| `admin.users.list` | `gitea.api.admin.users.list` | `read` | Search users according filter conditions, one page at a time (site admins only) |
| `admin.users.orgs.create` | `gitea.api.admin.users.orgs.create` | `destructive` | Create an organization (site admins only) |
| `admin.users.rename` | `gitea.api.admin.users.rename` | `destructive` | Rename a user (site admins only) |
| `admin.users.repos.create` | `gitea.api.admin.users.repos.create` | `destructive` | Create a repository on behalf of a user (site admins only) |
| `admin.users.update` | `gitea.api.admin.users.update` | `destructive` | Edit an existing user (site admins only) |
| `branches.create` | `gitea.api.branches.create` | `write` | Create a branch |
| `branches.delete` | `gitea.api.branches.delete` | `destructive` | Delete a specific branch from a repository |
| `branches.get` | `gitea.api.branches.get` | `read` | Retrieve a specific branch from a repository, including its effective branch protection |
| `branches.list` | `gitea.api.branches.list` | `read` | List a repository's branches with their latest commit and protection status, one page at a time |
| `branches.rename` | `gitea.api.branches.rename` | `write` | Rename a branch |
| `branches.setCommit` | `gitea.api.branches.setCommit` | `destructive` | Point a branch at another commit; when the new commit is not a descendant this rewrites the branch's history like a force-push |
| `branchProtections.create` | `gitea.api.branchProtections.create` | `write` | Create a branch protections for a repository |
| `branchProtections.delete` | `gitea.api.branchProtections.delete` | `destructive` | Delete a specific branch protection for the repository |
| `branchProtections.get` | `gitea.api.branchProtections.get` | `read` | Get a specific branch protection for the repository |
| `branchProtections.list` | `gitea.api.branchProtections.list` | `read` | List branch protections for a repository |
| `branchProtections.setPriority` | `gitea.api.branchProtections.setPriority` | `write` | Update the priorities of branch protections for a repository |
| `branchProtections.update` | `gitea.api.branchProtections.update` | `write` | Edit a branch protections for a repository. Only fields that are set will be changed |
| `comments.attachments.create` | `gitea.api.comments.attachments.create` | `write` | Create a comment attachment |
| `comments.attachments.delete` | `gitea.api.comments.attachments.delete` | `destructive` | Delete a comment attachment |
| `comments.attachments.get` | `gitea.api.comments.attachments.get` | `read` | Get a comment attachment |
| `comments.attachments.list` | `gitea.api.comments.attachments.list` | `read` | List comment's attachments |
| `comments.attachments.update` | `gitea.api.comments.attachments.update` | `write` | Edit a comment attachment |
| `comments.create` | `gitea.api.comments.create` | `write` | Add a markdown comment to an issue or pull request |
| `comments.delete` | `gitea.api.comments.delete` | `destructive` | Delete a comment |
| `comments.get` | `gitea.api.comments.get` | `read` | Get a comment |
| `comments.list` | `gitea.api.comments.list` | `read` | List every comment on an issue or pull request, oldest first, optionally within an updated-at window (this route takes no paging) |
| `comments.listForRepo` | `gitea.api.comments.listForRepo` | `read` | List all comments in a repository, one page at a time |
| `comments.reactions.add` | `gitea.api.comments.reactions.add` | `write` | Add a reaction to a comment of an issue |
| `comments.reactions.list` | `gitea.api.comments.reactions.list` | `read` | Get a list of reactions from a comment of an issue |
| `comments.reactions.remove` | `gitea.api.comments.reactions.remove` | `destructive` | Remove a reaction from a comment of an issue |
| `comments.update` | `gitea.api.comments.update` | `write` | Edit a comment |
| `commits.compare` | `gitea.api.commits.compare` | `read` | Get commit comparison information |
| `commits.downloadDiff` | `gitea.api.commits.downloadDiff` | `read` | Get a commit's diff or patch (returned as text) |
| `commits.get` | `gitea.api.commits.get` | `read` | Get a single commit from a repository, it has a GitHub-compatible alias "/repos/{owner}/{repo}/commits/{ref}" |
| `commits.list` | `gitea.api.commits.list` | `read` | List a repository's commits, newest first, optionally from a ref, path or time window, one page at a time; a repository with no commits answers 409 |
| `commits.pullRequest` | `gitea.api.commits.pullRequest` | `read` | Get the merged pull request of the commit |
| `commits.statuses.combined` | `gitea.api.commits.statuses.combined` | `read` | Get a commit's combined status, by branch/tag/commit reference |
| `commits.statuses.create` | `gitea.api.commits.statuses.create` | `write` | Create a commit status |
| `commits.statuses.list` | `gitea.api.commits.statuses.list` | `read` | Get a commit's statuses, one page at a time |
| `commits.statuses.listByRef` | `gitea.api.commits.statuses.listByRef` | `read` | Get a commit's statuses, by branch/tag/commit reference, one page at a time |
| `contents.applyPatch` | `gitea.api.contents.applyPatch` | `destructive` | Apply a unified diff to the repository as a new commit on a branch |
| `contents.changeFiles` | `gitea.api.contents.changeFiles` | `write` | Modify multiple files in a repository |
| `contents.create` | `gitea.api.contents.create` | `write` | Create a file in a repository |
| `contents.delete` | `gitea.api.contents.delete` | `destructive` | Delete a file in a repository |
| `contents.editorConfig` | `gitea.api.contents.editorConfig` | `read` | Get the EditorConfig definitions of a file in a repository |
| `contents.get` | `gitea.api.contents.get` | `read` | Gets the metadata and contents (if a file) of an entry in a repository, or a list of entries if a dir |
| `contents.getExt` | `gitea.api.contents.getExt` | `read` | The extended "contents" API, to get file metadata and/or content, or list a directory |
| `contents.getMany` | `gitea.api.contents.getMany` | `read` | Get the metadata and contents of requested files |
| `contents.getManyByPost` | `gitea.api.contents.getManyByPost` | `read` | Get the metadata and contents of requested files |
| `contents.list` | `gitea.api.contents.list` | `read` | Gets the metadata of all the entries of the root dir |
| `contents.media` | `gitea.api.contents.media` | `read` | Get a file or it's LFS object from a repository (returned as a file) |
| `contents.raw` | `gitea.api.contents.raw` | `read` | Get a file from a repository (returned as a file) |
| `contents.update` | `gitea.api.contents.update` | `write` | Update a file in a repository if SHA is set, or create the file if SHA is not set |
| `git.blobs.get` | `gitea.api.git.blobs.get` | `read` | Gets the blob of a repository |
| `git.notes.get` | `gitea.api.git.notes.get` | `read` | Get a note corresponding to a single commit from a repository |
| `git.refs.list` | `gitea.api.git.refs.list` | `read` | Get specified ref or filtered repository's refs |
| `git.refs.listMatching` | `gitea.api.git.refs.listMatching` | `read` | Get specified ref or filtered repository's refs |
| `git.tags.get` | `gitea.api.git.tags.get` | `read` | Gets the tag object of an annotated tag (not lightweight tags) |
| `git.trees.get` | `gitea.api.git.trees.get` | `read` | Gets the tree of a repository |
| `issues.assignees.add` | `gitea.api.issues.assignees.add` | `write` | Add assignees to an issue |
| `issues.assignees.check` | `gitea.api.issues.assignees.check` | `read` | Check if a user can be assigned to an issue |
| `issues.assignees.remove` | `gitea.api.issues.assignees.remove` | `destructive` | Remove assignees from an issue |
| `issues.attachments.create` | `gitea.api.issues.attachments.create` | `write` | Create an issue attachment |
| `issues.attachments.delete` | `gitea.api.issues.attachments.delete` | `destructive` | Delete an issue attachment |
| `issues.attachments.get` | `gitea.api.issues.attachments.get` | `read` | Get an issue attachment |
| `issues.attachments.list` | `gitea.api.issues.attachments.list` | `read` | List issue's attachments |
| `issues.attachments.update` | `gitea.api.issues.attachments.update` | `write` | Edit an issue attachment |
| `issues.blocks.add` | `gitea.api.issues.blocks.add` | `write` | Block the issue given in the body by the issue in path |
| `issues.blocks.list` | `gitea.api.issues.blocks.list` | `read` | List issues that are blocked by this issue, one page at a time |
| `issues.blocks.remove` | `gitea.api.issues.blocks.remove` | `destructive` | Unblock the issue given in the body by the issue in path |
| `issues.config.get` | `gitea.api.issues.config.get` | `read` | Returns the issue config for a repo |
| `issues.config.validate` | `gitea.api.issues.config.validate` | `read` | Returns the validation information for a issue config |
| `issues.create` | `gitea.api.issues.create` | `write` | Create an issue with a title, body, labels, assignees, milestone and optional deadline, optionally already closed |
| `issues.delete` | `gitea.api.issues.delete` | `destructive` | Delete an issue |
| `issues.dependencies.add` | `gitea.api.issues.dependencies.add` | `write` | Make the issue in the url depend on the issue in the form |
| `issues.dependencies.list` | `gitea.api.issues.dependencies.list` | `read` | List an issue's dependencies, i.e all issues that block this issue, one page at a time |
| `issues.dependencies.remove` | `gitea.api.issues.dependencies.remove` | `destructive` | Remove an issue dependency |
| `issues.get` | `gitea.api.issues.get` | `read` | Get one issue or pull request by its number, including labels, assignees and the comment count |
| `issues.labels.add` | `gitea.api.issues.labels.add` | `write` | Add a label to an issue |
| `issues.labels.clear` | `gitea.api.issues.labels.clear` | `destructive` | Remove all labels from an issue |
| `issues.labels.list` | `gitea.api.issues.labels.list` | `read` | Get an issue's labels |
| `issues.labels.remove` | `gitea.api.issues.labels.remove` | `destructive` | Remove a label from an issue |
| `issues.labels.replace` | `gitea.api.issues.labels.replace` | `write` | Replace an issue's labels |
| `issues.list` | `gitea.api.issues.list` | `read` | List a repository's issues and pull requests, filterable by state, labels, milestone, assignee and time window, one page at a time; pass type 'issues' to leave pull requests out |
| `issues.listPinned` | `gitea.api.issues.listPinned` | `read` | List a repo's pinned issues |
| `issues.lock` | `gitea.api.issues.lock` | `write` | Lock an issue |
| `issues.movePin` | `gitea.api.issues.movePin` | `write` | Moves the Pin to the given Position |
| `issues.pin` | `gitea.api.issues.pin` | `write` | Pin an Issue |
| `issues.reactions.add` | `gitea.api.issues.reactions.add` | `write` | Add a reaction to an issue |
| `issues.reactions.list` | `gitea.api.issues.reactions.list` | `read` | Get a list reactions of an issue, one page at a time |
| `issues.reactions.remove` | `gitea.api.issues.reactions.remove` | `destructive` | Remove a reaction from an issue |
| `issues.search` | `gitea.api.issues.search` | `read` | Search for issues across the repositories that the user has access to, one page at a time |
| `issues.setDeadline` | `gitea.api.issues.setDeadline` | `write` | Set an issue deadline. If set to null, the deadline is deleted. If using deadline only the date will be taken into account, and time of day ignored |
| `issues.stopwatch.delete` | `gitea.api.issues.stopwatch.delete` | `destructive` | Delete an issue's existing stopwatch |
| `issues.stopwatch.start` | `gitea.api.issues.stopwatch.start` | `write` | Start stopwatch on an issue |
| `issues.stopwatch.stop` | `gitea.api.issues.stopwatch.stop` | `write` | Stop an issue's existing stopwatch |
| `issues.subscriptions.add` | `gitea.api.issues.subscriptions.add` | `write` | Subscribe user to issue |
| `issues.subscriptions.check` | `gitea.api.issues.subscriptions.check` | `read` | Check if user is subscribed to an issue |
| `issues.subscriptions.list` | `gitea.api.issues.subscriptions.list` | `read` | Get users who subscribed on an issue, one page at a time |
| `issues.subscriptions.remove` | `gitea.api.issues.subscriptions.remove` | `destructive` | Unsubscribe user from issue |
| `issues.templates.list` | `gitea.api.issues.templates.list` | `read` | Get available issue templates for a repository |
| `issues.timeline` | `gitea.api.issues.timeline` | `read` | List all comments and events on an issue, one page at a time |
| `issues.times.add` | `gitea.api.issues.times.add` | `write` | Add tracked time to a issue |
| `issues.times.delete` | `gitea.api.issues.times.delete` | `destructive` | Delete specific tracked time |
| `issues.times.list` | `gitea.api.issues.times.list` | `read` | List an issue's tracked times, one page at a time |
| `issues.times.reset` | `gitea.api.issues.times.reset` | `destructive` | Reset a tracked time of an issue |
| `issues.unlock` | `gitea.api.issues.unlock` | `destructive` | Unlock an issue |
| `issues.unpin` | `gitea.api.issues.unpin` | `destructive` | Unpin an Issue |
| `issues.update` | `gitea.api.issues.update` | `write` | Edit an issue: set title, body, labels, assignees, milestone or deadline, or close and reopen it through state |
| `labels.create` | `gitea.api.labels.create` | `write` | Create a label |
| `labels.delete` | `gitea.api.labels.delete` | `destructive` | Delete a label |
| `labels.get` | `gitea.api.labels.get` | `read` | Get a single label |
| `labels.list` | `gitea.api.labels.list` | `read` | Get all of a repository's labels, one page at a time |
| `labels.update` | `gitea.api.labels.update` | `write` | Update a label |
| `milestones.create` | `gitea.api.milestones.create` | `write` | Create a milestone |
| `milestones.delete` | `gitea.api.milestones.delete` | `destructive` | Delete a milestone |
| `milestones.get` | `gitea.api.milestones.get` | `read` | Get a milestone |
| `milestones.list` | `gitea.api.milestones.list` | `read` | Get all of a repository's opened milestones, one page at a time |
| `milestones.update` | `gitea.api.milestones.update` | `write` | Update a milestone |
| `misc.gitignoreTemplates.get` | `gitea.api.misc.gitignoreTemplates.get` | `read` | Returns information about a gitignore template |
| `misc.gitignoreTemplates.list` | `gitea.api.misc.gitignoreTemplates.list` | `read` | Returns a list of all gitignore templates |
| `misc.labelTemplates.get` | `gitea.api.misc.labelTemplates.get` | `read` | Returns all labels in a template |
| `misc.labelTemplates.list` | `gitea.api.misc.labelTemplates.list` | `read` | Returns a list of all label templates |
| `misc.licenseTemplates.get` | `gitea.api.misc.licenseTemplates.get` | `read` | Returns information about a license template |
| `misc.licenseTemplates.list` | `gitea.api.misc.licenseTemplates.list` | `read` | Returns a list of all license templates |
| `misc.markdown.render` | `gitea.api.misc.markdown.render` | `read` | Render a markdown document as HTML (returned as text) |
| `misc.markdown.renderRaw` | `gitea.api.misc.markdown.renderRaw` | `read` | Render raw markdown text as HTML (the text is the whole body) |
| `misc.markup.render` | `gitea.api.misc.markup.render` | `read` | Render a markup document as HTML (returned as text) |
| `misc.signingKey.gpg` | `gitea.api.misc.signingKey.gpg` | `read` | Get default signing-key.gpg (returned as text) |
| `misc.signingKey.ssh` | `gitea.api.misc.signingKey.ssh` | `read` | Get default signing-key.pub (returned as text) |
| `misc.topics.search` | `gitea.api.misc.topics.search` | `read` | Search topics via keyword |
| `misc.version` | `gitea.api.misc.version` | `read` | Returns the version of the Gitea application |
| `notifications.countNew` | `gitea.api.notifications.countNew` | `read` | Check if unread notifications exist |
| `notifications.list` | `gitea.api.notifications.list` | `read` | List users's notification threads, one page at a time |
| `notifications.listForRepo` | `gitea.api.notifications.listForRepo` | `read` | List users's notification threads on a specific repo, one page at a time |
| `notifications.markRead` | `gitea.api.notifications.markRead` | `write` | Mark notification threads as read, pinned or unread |
| `notifications.markReadForRepo` | `gitea.api.notifications.markReadForRepo` | `write` | Mark notification threads as read, pinned or unread on a specific repo |
| `notifications.threads.get` | `gitea.api.notifications.threads.get` | `read` | Get notification thread by ID |
| `notifications.threads.markRead` | `gitea.api.notifications.threads.markRead` | `write` | Mark notification thread as read by ID |
| `orgs.actions.jobs.list` | `gitea.api.orgs.actions.jobs.list` | `read` | Get org-level workflow jobs |
| `orgs.actions.runners.createRegistrationToken` | `gitea.api.orgs.actions.runners.createRegistrationToken` | `write` | Get an organization's actions runner registration token |
| `orgs.actions.runners.delete` | `gitea.api.orgs.actions.runners.delete` | `destructive` | Delete an org-level runner |
| `orgs.actions.runners.get` | `gitea.api.orgs.actions.runners.get` | `read` | Get an org-level runner |
| `orgs.actions.runners.list` | `gitea.api.orgs.actions.runners.list` | `read` | Get org-level runners |
| `orgs.actions.runners.update` | `gitea.api.orgs.actions.runners.update` | `write` | Update an org-level runner |
| `orgs.actions.runs.list` | `gitea.api.orgs.actions.runs.list` | `read` | Get org-level workflow runs |
| `orgs.actions.secrets.delete` | `gitea.api.orgs.actions.secrets.delete` | `destructive` | Delete a secret in an organization |
| `orgs.actions.secrets.list` | `gitea.api.orgs.actions.secrets.list` | `read` | List an organization's actions secrets, one page at a time |
| `orgs.actions.secrets.set` | `gitea.api.orgs.actions.secrets.set` | `destructive` | Create or Update a secret value in an organization |
| `orgs.actions.variables.create` | `gitea.api.orgs.actions.variables.create` | `write` | Create an org-level variable |
| `orgs.actions.variables.delete` | `gitea.api.orgs.actions.variables.delete` | `destructive` | Delete an org-level variable |
| `orgs.actions.variables.get` | `gitea.api.orgs.actions.variables.get` | `read` | Get an org-level variable |
| `orgs.actions.variables.list` | `gitea.api.orgs.actions.variables.list` | `read` | Get an org-level variables list, one page at a time |
| `orgs.actions.variables.update` | `gitea.api.orgs.actions.variables.update` | `write` | Update an org-level variable |
| `orgs.activityFeeds.list` | `gitea.api.orgs.activityFeeds.list` | `read` | List an organization's activity feeds, one page at a time |
| `orgs.avatar.delete` | `gitea.api.orgs.avatar.delete` | `destructive` | Delete Avatar |
| `orgs.avatar.update` | `gitea.api.orgs.avatar.update` | `write` | Update Avatar |
| `orgs.blocks.add` | `gitea.api.orgs.blocks.add` | `write` | Block a user |
| `orgs.blocks.check` | `gitea.api.orgs.blocks.check` | `read` | Check if a user is blocked by the organization |
| `orgs.blocks.list` | `gitea.api.orgs.blocks.list` | `read` | List users blocked by the organization, one page at a time |
| `orgs.blocks.remove` | `gitea.api.orgs.blocks.remove` | `destructive` | Unblock a user |
| `orgs.create` | `gitea.api.orgs.create` | `write` | Create an organization |
| `orgs.delete` | `gitea.api.orgs.delete` | `destructive` | Delete an organization |
| `orgs.get` | `gitea.api.orgs.get` | `read` | Get an organization |
| `orgs.hooks.create` | `gitea.api.orgs.hooks.create` | `write` | Create a hook |
| `orgs.hooks.delete` | `gitea.api.orgs.hooks.delete` | `destructive` | Delete a hook |
| `orgs.hooks.get` | `gitea.api.orgs.hooks.get` | `read` | Get a hook |
| `orgs.hooks.list` | `gitea.api.orgs.hooks.list` | `read` | List an organization's webhooks, one page at a time |
| `orgs.hooks.update` | `gitea.api.orgs.hooks.update` | `write` | Update a hook |
| `orgs.labels.create` | `gitea.api.orgs.labels.create` | `write` | Create a label for an organization |
| `orgs.labels.delete` | `gitea.api.orgs.labels.delete` | `destructive` | Delete a label |
| `orgs.labels.get` | `gitea.api.orgs.labels.get` | `read` | Get a single label |
| `orgs.labels.list` | `gitea.api.orgs.labels.list` | `read` | List an organization's labels, one page at a time |
| `orgs.labels.update` | `gitea.api.orgs.labels.update` | `write` | Update a label |
| `orgs.list` | `gitea.api.orgs.list` | `read` | Get list of organizations, one page at a time |
| `orgs.members.check` | `gitea.api.orgs.members.check` | `read` | Check if a user is a member of an organization |
| `orgs.members.list` | `gitea.api.orgs.members.list` | `read` | List an organization's members, one page at a time |
| `orgs.members.remove` | `gitea.api.orgs.members.remove` | `destructive` | Remove a member from an organization |
| `orgs.projects.columns.create` | `gitea.api.orgs.projects.columns.create` | `write` | Create a column in a project |
| `orgs.projects.columns.delete` | `gitea.api.orgs.projects.columns.delete` | `destructive` | Delete a project column |
| `orgs.projects.columns.get` | `gitea.api.orgs.projects.columns.get` | `read` | Get a project column |
| `orgs.projects.columns.issues.add` | `gitea.api.orgs.projects.columns.issues.add` | `write` | Add an issue to a project column |
| `orgs.projects.columns.issues.list` | `gitea.api.orgs.projects.columns.issues.list` | `read` | List the issues in a project column, one page at a time |
| `orgs.projects.columns.issues.remove` | `gitea.api.orgs.projects.columns.issues.remove` | `destructive` | Remove an issue from a project column |
| `orgs.projects.columns.list` | `gitea.api.orgs.projects.columns.list` | `read` | List a project's columns, one page at a time |
| `orgs.projects.columns.move` | `gitea.api.orgs.projects.columns.move` | `write` | Reorder a project's columns |
| `orgs.projects.columns.setDefault` | `gitea.api.orgs.projects.columns.setDefault` | `write` | Set a project's default column |
| `orgs.projects.columns.update` | `gitea.api.orgs.projects.columns.update` | `write` | Edit a project column |
| `orgs.projects.create` | `gitea.api.orgs.projects.create` | `write` | Create a project owned by an organization |
| `orgs.projects.delete` | `gitea.api.orgs.projects.delete` | `destructive` | Delete a project |
| `orgs.projects.get` | `gitea.api.orgs.projects.get` | `read` | Get a project |
| `orgs.projects.issues.move` | `gitea.api.orgs.projects.issues.move` | `write` | Move an issue between a project's columns |
| `orgs.projects.list` | `gitea.api.orgs.projects.list` | `read` | List an organization's projects, one page at a time |
| `orgs.projects.update` | `gitea.api.orgs.projects.update` | `write` | Edit a project |
| `orgs.publicMembers.check` | `gitea.api.orgs.publicMembers.check` | `read` | Check if a user is a public member of an organization |
| `orgs.publicMembers.conceal` | `gitea.api.orgs.publicMembers.conceal` | `destructive` | Conceal a user's membership |
| `orgs.publicMembers.list` | `gitea.api.orgs.publicMembers.list` | `read` | List an organization's public members, one page at a time |
| `orgs.publicMembers.publicize` | `gitea.api.orgs.publicMembers.publicize` | `write` | Publicize a user's membership |
| `orgs.rename` | `gitea.api.orgs.rename` | `destructive` | Rename an organization |
| `orgs.repos.create` | `gitea.api.orgs.repos.create` | `write` | Create a repository in an organization |
| `orgs.repos.deleteAll` | `gitea.api.orgs.repos.deleteAll` | `destructive` | Delete every repository in the organization (Gitea answers 202 and deletes in the background) |
| `orgs.repos.list` | `gitea.api.orgs.repos.list` | `read` | List an organization's repos, one page at a time |
| `orgs.teams.create` | `gitea.api.orgs.teams.create` | `write` | Create a team |
| `orgs.teams.list` | `gitea.api.orgs.teams.list` | `read` | List an organization's teams, one page at a time |
| `orgs.teams.search` | `gitea.api.orgs.teams.search` | `read` | Search for teams within an organization |
| `orgs.update` | `gitea.api.orgs.update` | `write` | Edit an organization |
| `packages.delete` | `gitea.api.packages.delete` | `destructive` | Delete a package |
| `packages.link` | `gitea.api.packages.link` | `write` | Link a package to a repository |
| `packages.list` | `gitea.api.packages.list` | `read` | Gets all packages of an owner, one page at a time |
| `packages.unlink` | `gitea.api.packages.unlink` | `write` | Unlink a package from a repository |
| `packages.versions.delete` | `gitea.api.packages.versions.delete` | `destructive` | Delete a package version |
| `packages.versions.files.list` | `gitea.api.packages.versions.files.list` | `read` | Gets all files of a package |
| `packages.versions.get` | `gitea.api.packages.versions.get` | `read` | Gets a package |
| `packages.versions.getLatest` | `gitea.api.packages.versions.getLatest` | `read` | Gets the latest version of a package |
| `packages.versions.list` | `gitea.api.packages.versions.list` | `read` | Gets all versions of a package, one page at a time |
| `projects.columns.create` | `gitea.api.projects.columns.create` | `write` | Create a column in a project |
| `projects.columns.delete` | `gitea.api.projects.columns.delete` | `destructive` | Delete a project column |
| `projects.columns.get` | `gitea.api.projects.columns.get` | `read` | Get a project column |
| `projects.columns.issues.add` | `gitea.api.projects.columns.issues.add` | `write` | Add an issue to a project column |
| `projects.columns.issues.list` | `gitea.api.projects.columns.issues.list` | `read` | List the issues in a project column, one page at a time |
| `projects.columns.issues.remove` | `gitea.api.projects.columns.issues.remove` | `destructive` | Remove an issue from a project column |
| `projects.columns.list` | `gitea.api.projects.columns.list` | `read` | List a project's columns, one page at a time |
| `projects.columns.move` | `gitea.api.projects.columns.move` | `write` | Reorder a project's columns |
| `projects.columns.setDefault` | `gitea.api.projects.columns.setDefault` | `write` | Set a project's default column |
| `projects.columns.update` | `gitea.api.projects.columns.update` | `write` | Edit a project column |
| `projects.create` | `gitea.api.projects.create` | `write` | Create a project owned by a repository |
| `projects.delete` | `gitea.api.projects.delete` | `destructive` | Delete a project |
| `projects.get` | `gitea.api.projects.get` | `read` | Get a project |
| `projects.issues.move` | `gitea.api.projects.issues.move` | `write` | Move an issue between a project's columns |
| `projects.list` | `gitea.api.projects.list` | `read` | List a repository's projects, one page at a time |
| `projects.update` | `gitea.api.projects.update` | `write` | Edit a project |
| `pulls.cancelAutoMerge` | `gitea.api.pulls.cancelAutoMerge` | `destructive` | Cancel the scheduled auto merge for the given pull request |
| `pulls.commits` | `gitea.api.pulls.commits` | `read` | Get commits for a pull request, one page at a time |
| `pulls.create` | `gitea.api.pulls.create` | `write` | Create a pull request |
| `pulls.downloadDiff` | `gitea.api.pulls.downloadDiff` | `read` | Get a pull request diff or patch (returned as text) |
| `pulls.files` | `gitea.api.pulls.files` | `read` | Get changed files for a pull request, one page at a time |
| `pulls.get` | `gitea.api.pulls.get` | `read` | Get a pull request |
| `pulls.getByBaseHead` | `gitea.api.pulls.getByBaseHead` | `read` | Get a pull request by base and head |
| `pulls.isMerged` | `gitea.api.pulls.isMerged` | `read` | Check if a pull request has been merged |
| `pulls.list` | `gitea.api.pulls.list` | `read` | List a repo's pull requests, one page at a time |
| `pulls.listPinned` | `gitea.api.pulls.listPinned` | `read` | List a repo's pinned pull requests |
| `pulls.merge` | `gitea.api.pulls.merge` | `destructive` | Merge a pull request with the chosen style (merge, rebase, rebase-merge, squash, fast-forward-only or manually-merged), optionally deleting the head branch, or schedule it to merge when checks pass |
| `pulls.requestedReviewers.add` | `gitea.api.pulls.requestedReviewers.add` | `write` | Create review requests for a pull request |
| `pulls.requestedReviewers.remove` | `gitea.api.pulls.requestedReviewers.remove` | `destructive` | Cancel review requests for a pull request |
| `pulls.reviewComments.reply` | `gitea.api.pulls.reviewComments.reply` | `write` | Reply to a pull request review comment |
| `pulls.reviewComments.resolve` | `gitea.api.pulls.reviewComments.resolve` | `write` | Resolve a pull request review comment |
| `pulls.reviewComments.unresolve` | `gitea.api.pulls.reviewComments.unresolve` | `write` | Unresolve a pull request review comment |
| `pulls.reviews.comments` | `gitea.api.pulls.reviews.comments` | `read` | Get a specific review for a pull request |
| `pulls.reviews.create` | `gitea.api.pulls.reviews.create` | `write` | Create a review to a pull request |
| `pulls.reviews.delete` | `gitea.api.pulls.reviews.delete` | `destructive` | Delete a specific review from a pull request |
| `pulls.reviews.dismiss` | `gitea.api.pulls.reviews.dismiss` | `write` | Dismiss a review for a pull request |
| `pulls.reviews.get` | `gitea.api.pulls.reviews.get` | `read` | Get a specific review for a pull request |
| `pulls.reviews.list` | `gitea.api.pulls.reviews.list` | `read` | List all reviews for a pull request, one page at a time |
| `pulls.reviews.submit` | `gitea.api.pulls.reviews.submit` | `write` | Submit a pending review to a pull request |
| `pulls.reviews.undismiss` | `gitea.api.pulls.reviews.undismiss` | `write` | Cancel to dismiss a review for a pull request |
| `pulls.update` | `gitea.api.pulls.update` | `write` | Update a pull request. If using deadline only the date will be taken into account, and time of day ignored |
| `pulls.updateBranch` | `gitea.api.pulls.updateBranch` | `write` | Merge PR's baseBranch into headBranch |
| `releases.assets.create` | `gitea.api.releases.assets.create` | `write` | Create a release attachment |
| `releases.assets.delete` | `gitea.api.releases.assets.delete` | `destructive` | Delete a release attachment |
| `releases.assets.get` | `gitea.api.releases.assets.get` | `read` | Get a release attachment |
| `releases.assets.list` | `gitea.api.releases.assets.list` | `read` | List release's attachments |
| `releases.assets.update` | `gitea.api.releases.assets.update` | `write` | Edit a release attachment |
| `releases.create` | `gitea.api.releases.create` | `write` | Create a release for a tag, creating the tag on the target commit when it does not exist yet; a tag that already has a release answers 409 |
| `releases.delete` | `gitea.api.releases.delete` | `destructive` | Delete a release |
| `releases.deleteByTag` | `gitea.api.releases.deleteByTag` | `destructive` | Delete a release by tag name |
| `releases.get` | `gitea.api.releases.get` | `read` | Get a release |
| `releases.getByTag` | `gitea.api.releases.getByTag` | `read` | Get a release by tag name |
| `releases.getLatest` | `gitea.api.releases.getLatest` | `read` | Gets the most recent non-prerelease, non-draft release of a repository, sorted by created_at |
| `releases.list` | `gitea.api.releases.list` | `read` | List a repository's releases with their assets, filterable by draft and prerelease, one page at a time |
| `releases.update` | `gitea.api.releases.update` | `write` | Update a release |
| `repos.acceptTransfer` | `gitea.api.repos.acceptTransfer` | `destructive` | Accept a repo transfer |
| `repos.activityFeeds.list` | `gitea.api.repos.activityFeeds.list` | `read` | List a repository's activity feeds, one page at a time |
| `repos.assignees.check` | `gitea.api.repos.assignees.check` | `read` | Check if a user can be assigned to issues in a repository |
| `repos.assignees.list` | `gitea.api.repos.assignees.list` | `read` | Return all users that have write access and can be assigned to issues |
| `repos.avatar.delete` | `gitea.api.repos.avatar.delete` | `destructive` | Delete avatar |
| `repos.avatar.update` | `gitea.api.repos.avatar.update` | `write` | Update avatar |
| `repos.collaborators.add` | `gitea.api.repos.collaborators.add` | `write` | Add or Update a collaborator to a repository |
| `repos.collaborators.check` | `gitea.api.repos.collaborators.check` | `read` | Check if a user is a collaborator of a repository |
| `repos.collaborators.list` | `gitea.api.repos.collaborators.list` | `read` | List a repository's collaborators, one page at a time |
| `repos.collaborators.permission` | `gitea.api.repos.collaborators.permission` | `read` | Get repository permissions for a user |
| `repos.collaborators.remove` | `gitea.api.repos.collaborators.remove` | `destructive` | Delete a collaborator from a repository |
| `repos.create` | `gitea.api.repos.create` | `write` | Create a repository owned by the authenticated user, optionally seeded with a README, license and gitignore |
| `repos.delete` | `gitea.api.repos.delete` | `destructive` | Permanently delete a repository together with its issues, pull requests, releases and wiki; no API call can restore it |
| `repos.deployKeys.create` | `gitea.api.repos.deployKeys.create` | `write` | Add a key to a repository |
| `repos.deployKeys.createToken` | `gitea.api.repos.deployKeys.createToken` | `write` | Add a deploy token to a repository, it authenticates git over HTTPS |
| `repos.deployKeys.delete` | `gitea.api.repos.deployKeys.delete` | `destructive` | Delete a key from a repository |
| `repos.deployKeys.get` | `gitea.api.repos.deployKeys.get` | `read` | Get a repository's key by id |
| `repos.deployKeys.list` | `gitea.api.repos.deployKeys.list` | `read` | List a repository's keys, one page at a time |
| `repos.downloadArchive` | `gitea.api.repos.downloadArchive` | `read` | Get an archive of a repository (returned as a file) |
| `repos.forks.create` | `gitea.api.repos.forks.create` | `write` | Fork a repository |
| `repos.forks.list` | `gitea.api.repos.forks.list` | `read` | List a repository's forks, one page at a time |
| `repos.generateFromTemplate` | `gitea.api.repos.generateFromTemplate` | `write` | Create a repository using a template |
| `repos.get` | `gitea.api.repos.get` | `read` | Get one repository, including its counts, permissions and feature flags |
| `repos.getById` | `gitea.api.repos.getById` | `read` | Get a repository by id |
| `repos.gitHooks.delete` | `gitea.api.repos.gitHooks.delete` | `destructive` | Delete a Git hook in a repository |
| `repos.gitHooks.get` | `gitea.api.repos.gitHooks.get` | `read` | Get a Git hook |
| `repos.gitHooks.list` | `gitea.api.repos.gitHooks.list` | `read` | List the Git hooks in a repository |
| `repos.gitHooks.update` | `gitea.api.repos.gitHooks.update` | `destructive` | Edit a Git hook in a repository |
| `repos.languages` | `gitea.api.repos.languages` | `read` | Get languages and number of bytes of code written |
| `repos.licenses` | `gitea.api.repos.licenses` | `read` | Get repo licenses |
| `repos.list` | `gitea.api.repos.list` | `read` | List the repositories the authenticated user owns or can access, one page at a time |
| `repos.mergeUpstream` | `gitea.api.repos.mergeUpstream` | `write` | Merge a branch from upstream |
| `repos.migrate` | `gitea.api.repos.migrate` | `write` | Migrate a remote git repository |
| `repos.mirrorSync` | `gitea.api.repos.mirrorSync` | `write` | Sync a mirrored repository |
| `repos.newPinAllowed` | `gitea.api.repos.newPinAllowed` | `read` | Returns if new Issue Pins are allowed |
| `repos.pushMirrors.add` | `gitea.api.repos.pushMirrors.add` | `write` | Add a push mirror to the repository |
| `repos.pushMirrors.delete` | `gitea.api.repos.pushMirrors.delete` | `destructive` | Deletes a push mirror from a repository by remoteName |
| `repos.pushMirrors.get` | `gitea.api.repos.pushMirrors.get` | `read` | Get push mirror of the repository by remoteName |
| `repos.pushMirrors.list` | `gitea.api.repos.pushMirrors.list` | `read` | Get all push mirrors of the repository, one page at a time |
| `repos.pushMirrors.sync` | `gitea.api.repos.pushMirrors.sync` | `write` | Sync all push mirrored repository |
| `repos.rejectTransfer` | `gitea.api.repos.rejectTransfer` | `write` | Reject a repo transfer |
| `repos.reviewers` | `gitea.api.repos.reviewers` | `read` | Return all users that can be requested to review in this repo |
| `repos.search` | `gitea.api.repos.search` | `read` | Search for repositories |
| `repos.signingKey.gpg` | `gitea.api.repos.signingKey.gpg` | `read` | Get signing-key.gpg for given repository (returned as text) |
| `repos.signingKey.ssh` | `gitea.api.repos.signingKey.ssh` | `read` | Get signing-key.pub for given repository (returned as text) |
| `repos.stargazers` | `gitea.api.repos.stargazers` | `read` | List a repo's stargazers, one page at a time |
| `repos.subscribers` | `gitea.api.repos.subscribers` | `read` | List a repo's watchers, one page at a time |
| `repos.subscription.get` | `gitea.api.repos.subscription.get` | `read` | Check if the current user is watching a repo |
| `repos.subscription.unwatch` | `gitea.api.repos.subscription.unwatch` | `destructive` | Unwatch a repo |
| `repos.subscription.watch` | `gitea.api.repos.subscription.watch` | `write` | Watch a repo |
| `repos.teams.add` | `gitea.api.repos.teams.add` | `write` | Add a team to a repository |
| `repos.teams.check` | `gitea.api.repos.teams.check` | `read` | Check if a team is assigned to a repository |
| `repos.teams.list` | `gitea.api.repos.teams.list` | `read` | List a repository's teams |
| `repos.teams.remove` | `gitea.api.repos.teams.remove` | `destructive` | Delete a team from a repository |
| `repos.topics.add` | `gitea.api.repos.topics.add` | `write` | Add a topic to a repository |
| `repos.topics.list` | `gitea.api.repos.topics.list` | `read` | Get list of topics that a repository has |
| `repos.topics.remove` | `gitea.api.repos.topics.remove` | `destructive` | Delete a topic from a repository |
| `repos.topics.replace` | `gitea.api.repos.topics.replace` | `write` | Replace list of topics for a repository |
| `repos.trackedTimes` | `gitea.api.repos.trackedTimes` | `read` | List a repo's tracked times, one page at a time |
| `repos.transfer` | `gitea.api.repos.transfer` | `destructive` | Transfer the repository to another user or organization (the new owner may have to accept it) |
| `repos.update` | `gitea.api.repos.update` | `write` | Edit a repository's properties. Only fields that are set will be changed |
| `settings.api` | `gitea.api.settings.api` | `read` | Get instance's global settings for api |
| `settings.attachment` | `gitea.api.settings.attachment` | `read` | Get instance's global settings for Attachment |
| `settings.repository` | `gitea.api.settings.repository` | `read` | Get instance's global settings for repositories |
| `settings.ui` | `gitea.api.settings.ui` | `read` | Get instance's global settings for ui |
| `tagProtections.create` | `gitea.api.tagProtections.create` | `write` | Create a tag protections for a repository |
| `tagProtections.delete` | `gitea.api.tagProtections.delete` | `destructive` | Delete a specific tag protection for the repository |
| `tagProtections.get` | `gitea.api.tagProtections.get` | `read` | Get a specific tag protection for the repository |
| `tagProtections.list` | `gitea.api.tagProtections.list` | `read` | List tag protections for a repository |
| `tagProtections.update` | `gitea.api.tagProtections.update` | `write` | Edit a tag protections for a repository. Only fields that are set will be changed |
| `tags.create` | `gitea.api.tags.create` | `write` | Create a new git tag in a repository |
| `tags.delete` | `gitea.api.tags.delete` | `destructive` | Delete a repository's tag by name |
| `tags.get` | `gitea.api.tags.get` | `read` | Get the tag of a repository by tag name |
| `tags.list` | `gitea.api.tags.list` | `read` | List a repository's tags, one page at a time |
| `teams.activityFeeds.list` | `gitea.api.teams.activityFeeds.list` | `read` | List a team's activity feeds, one page at a time |
| `teams.delete` | `gitea.api.teams.delete` | `destructive` | Delete a team |
| `teams.get` | `gitea.api.teams.get` | `read` | Get a team |
| `teams.members.add` | `gitea.api.teams.members.add` | `write` | Add a team member |
| `teams.members.get` | `gitea.api.teams.members.get` | `read` | List a particular member of team |
| `teams.members.list` | `gitea.api.teams.members.list` | `read` | List a team's members, one page at a time |
| `teams.members.remove` | `gitea.api.teams.members.remove` | `destructive` | Remove a team member |
| `teams.repos.add` | `gitea.api.teams.repos.add` | `write` | Add a repository to a team |
| `teams.repos.get` | `gitea.api.teams.repos.get` | `read` | List a particular repo of team |
| `teams.repos.list` | `gitea.api.teams.repos.list` | `read` | List a team's repos, one page at a time |
| `teams.repos.remove` | `gitea.api.teams.repos.remove` | `destructive` | Remove a repository from a team |
| `teams.update` | `gitea.api.teams.update` | `write` | Edit a team |
| `user.actions.jobs.list` | `gitea.api.user.actions.jobs.list` | `read` | Get workflow jobs |
| `user.actions.runners.createRegistrationToken` | `gitea.api.user.actions.runners.createRegistrationToken` | `write` | Get a user's actions runner registration token |
| `user.actions.runners.delete` | `gitea.api.user.actions.runners.delete` | `destructive` | Delete a user-level runner |
| `user.actions.runners.get` | `gitea.api.user.actions.runners.get` | `read` | Get a user-level runner |
| `user.actions.runners.list` | `gitea.api.user.actions.runners.list` | `read` | Get user-level runners |
| `user.actions.runners.update` | `gitea.api.user.actions.runners.update` | `write` | Update a user-level runner |
| `user.actions.runs.list` | `gitea.api.user.actions.runs.list` | `read` | Get workflow runs |
| `user.actions.secrets.delete` | `gitea.api.user.actions.secrets.delete` | `destructive` | Delete a secret in a user scope |
| `user.actions.secrets.set` | `gitea.api.user.actions.secrets.set` | `destructive` | Create or Update a secret value in a user scope |
| `user.actions.variables.create` | `gitea.api.user.actions.variables.create` | `write` | Create a user-level variable |
| `user.actions.variables.delete` | `gitea.api.user.actions.variables.delete` | `destructive` | Delete a user-level variable which is created by current doer |
| `user.actions.variables.get` | `gitea.api.user.actions.variables.get` | `read` | Get a user-level variable which is created by current doer |
| `user.actions.variables.list` | `gitea.api.user.actions.variables.list` | `read` | Get the user-level list of variables which is created by current doer, one page at a time |
| `user.actions.variables.update` | `gitea.api.user.actions.variables.update` | `write` | Update a user-level variable which is created by current doer |
| `user.avatar.delete` | `gitea.api.user.avatar.delete` | `destructive` | Delete Avatar |
| `user.avatar.update` | `gitea.api.user.avatar.update` | `write` | Update Avatar |
| `user.blocks.add` | `gitea.api.user.blocks.add` | `write` | Block a user |
| `user.blocks.check` | `gitea.api.user.blocks.check` | `read` | Check if a user is blocked by the authenticated user |
| `user.blocks.list` | `gitea.api.user.blocks.list` | `read` | List users blocked by the authenticated user, one page at a time |
| `user.blocks.remove` | `gitea.api.user.blocks.remove` | `destructive` | Unblock a user |
| `user.emails.add` | `gitea.api.user.emails.add` | `write` | Add email addresses |
| `user.emails.list` | `gitea.api.user.emails.list` | `read` | List the authenticated user's email addresses |
| `user.emails.remove` | `gitea.api.user.emails.remove` | `destructive` | Delete email addresses |
| `user.followers.list` | `gitea.api.user.followers.list` | `read` | List the authenticated user's followers, one page at a time |
| `user.following.check` | `gitea.api.user.following.check` | `read` | Check whether a user is followed by the authenticated user |
| `user.following.follow` | `gitea.api.user.following.follow` | `write` | Follow a user |
| `user.following.list` | `gitea.api.user.following.list` | `read` | List the users that the authenticated user is following, one page at a time |
| `user.following.unfollow` | `gitea.api.user.following.unfollow` | `destructive` | Unfollow a user |
| `user.gpgKeys.create` | `gitea.api.user.gpgKeys.create` | `write` | Create a GPG key |
| `user.gpgKeys.delete` | `gitea.api.user.gpgKeys.delete` | `destructive` | Remove a GPG key |
| `user.gpgKeys.get` | `gitea.api.user.gpgKeys.get` | `read` | Get a GPG key |
| `user.gpgKeys.list` | `gitea.api.user.gpgKeys.list` | `read` | List the authenticated user's GPG keys, one page at a time |
| `user.gpgKeys.verificationToken` | `gitea.api.user.gpgKeys.verificationToken` | `read` | Get a Token to verify (returned as text) |
| `user.gpgKeys.verify` | `gitea.api.user.gpgKeys.verify` | `write` | Verify a GPG key |
| `user.hooks.create` | `gitea.api.user.hooks.create` | `write` | Create a hook |
| `user.hooks.delete` | `gitea.api.user.hooks.delete` | `destructive` | Delete a hook |
| `user.hooks.get` | `gitea.api.user.hooks.get` | `read` | Get a hook |
| `user.hooks.list` | `gitea.api.user.hooks.list` | `read` | List the authenticated user's webhooks, one page at a time |
| `user.hooks.update` | `gitea.api.user.hooks.update` | `write` | Update a hook |
| `user.keys.create` | `gitea.api.user.keys.create` | `write` | Create a public key |
| `user.keys.delete` | `gitea.api.user.keys.delete` | `destructive` | Delete a public key |
| `user.keys.get` | `gitea.api.user.keys.get` | `read` | Get a public key |
| `user.keys.list` | `gitea.api.user.keys.list` | `read` | List the authenticated user's public keys, one page at a time |
| `user.me` | `gitea.api.user.me` | `read` | Get the authenticated user, as the account token sees it |
| `user.oauth2Apps.create` | `gitea.api.user.oauth2Apps.create` | `write` | Creates a new OAuth2 application |
| `user.oauth2Apps.delete` | `gitea.api.user.oauth2Apps.delete` | `destructive` | Delete an OAuth2 Application |
| `user.oauth2Apps.get` | `gitea.api.user.oauth2Apps.get` | `read` | Get an OAuth2 Application |
| `user.oauth2Apps.list` | `gitea.api.user.oauth2Apps.list` | `read` | List the authenticated user's oauth2 applications, one page at a time |
| `user.oauth2Apps.update` | `gitea.api.user.oauth2Apps.update` | `write` | Update an OAuth2 Application, this includes regenerating the client secret |
| `user.orgs.list` | `gitea.api.user.orgs.list` | `read` | List the current user's organizations, one page at a time |
| `user.projects.columns.create` | `gitea.api.user.projects.columns.create` | `write` | Create a column in a project |
| `user.projects.columns.delete` | `gitea.api.user.projects.columns.delete` | `destructive` | Delete a project column |
| `user.projects.columns.get` | `gitea.api.user.projects.columns.get` | `read` | Get a project column |
| `user.projects.columns.issues.add` | `gitea.api.user.projects.columns.issues.add` | `write` | Add an issue to a project column |
| `user.projects.columns.issues.list` | `gitea.api.user.projects.columns.issues.list` | `read` | List the issues in a project column, one page at a time |
| `user.projects.columns.issues.remove` | `gitea.api.user.projects.columns.issues.remove` | `destructive` | Remove an issue from a project column |
| `user.projects.columns.list` | `gitea.api.user.projects.columns.list` | `read` | List a project's columns, one page at a time |
| `user.projects.columns.move` | `gitea.api.user.projects.columns.move` | `write` | Reorder a project's columns |
| `user.projects.columns.setDefault` | `gitea.api.user.projects.columns.setDefault` | `write` | Set a project's default column |
| `user.projects.columns.update` | `gitea.api.user.projects.columns.update` | `write` | Edit a project column |
| `user.projects.create` | `gitea.api.user.projects.create` | `write` | Create a project owned by the authenticated user |
| `user.projects.delete` | `gitea.api.user.projects.delete` | `destructive` | Delete a project |
| `user.projects.get` | `gitea.api.user.projects.get` | `read` | Get a project |
| `user.projects.issues.move` | `gitea.api.user.projects.issues.move` | `write` | Move an issue between a project's columns |
| `user.projects.list` | `gitea.api.user.projects.list` | `read` | List your projects, one page at a time |
| `user.projects.update` | `gitea.api.user.projects.update` | `write` | Edit a project |
| `user.settings.get` | `gitea.api.user.settings.get` | `read` | Get user settings |
| `user.settings.update` | `gitea.api.user.settings.update` | `write` | Update user settings |
| `user.starred.check` | `gitea.api.user.starred.check` | `read` | Whether the authenticated is starring the repo |
| `user.starred.list` | `gitea.api.user.starred.list` | `read` | The repos that the authenticated user has starred, one page at a time |
| `user.starred.star` | `gitea.api.user.starred.star` | `write` | Star the given repo |
| `user.starred.unstar` | `gitea.api.user.starred.unstar` | `destructive` | Unstar the given repo |
| `user.stopwatches.list` | `gitea.api.user.stopwatches.list` | `read` | Get list of all existing stopwatches, one page at a time |
| `user.subscriptions.list` | `gitea.api.user.subscriptions.list` | `read` | List repositories watched by the authenticated user, one page at a time |
| `user.teams.list` | `gitea.api.user.teams.list` | `read` | List all the teams a user belongs to, one page at a time |
| `user.token.delete` | `gitea.api.user.token.delete` | `destructive` | Revoke the access token this call is made with; every later call with it answers 401 |
| `user.token.get` | `gitea.api.user.token.get` | `read` | Get the access token this call is made with: its name, scopes and last-used time |
| `user.trackedTimes.list` | `gitea.api.user.trackedTimes.list` | `read` | List the current user's tracked times, one page at a time |
| `users.activityFeeds.list` | `gitea.api.users.activityFeeds.list` | `read` | List a user's activity feeds, one page at a time |
| `users.followers.list` | `gitea.api.users.followers.list` | `read` | List the given user's followers, one page at a time |
| `users.following.check` | `gitea.api.users.following.check` | `read` | Check if one user is following another user |
| `users.following.list` | `gitea.api.users.following.list` | `read` | List the users that the given user is following, one page at a time |
| `users.get` | `gitea.api.users.get` | `read` | Get a user |
| `users.gpgKeys.list` | `gitea.api.users.gpgKeys.list` | `read` | List the given user's GPG keys, one page at a time |
| `users.heatmap` | `gitea.api.users.heatmap` | `read` | Get a user's heatmap |
| `users.keys.list` | `gitea.api.users.keys.list` | `read` | List the given user's public keys, one page at a time |
| `users.orgs.list` | `gitea.api.users.orgs.list` | `read` | List a user's organizations, one page at a time |
| `users.orgs.permissions` | `gitea.api.users.orgs.permissions` | `read` | Get user permissions in organization |
| `users.projects.list` | `gitea.api.users.projects.list` | `read` | List a user's projects, one page at a time |
| `users.repos.list` | `gitea.api.users.repos.list` | `read` | List the repos owned by the given user, one page at a time |
| `users.search` | `gitea.api.users.search` | `read` | Search for users |
| `users.starred.list` | `gitea.api.users.starred.list` | `read` | The repos that the given user has starred, one page at a time |
| `users.subscriptions.list` | `gitea.api.users.subscriptions.list` | `read` | List the repositories watched by a user, one page at a time |
| `webhooks.create` | `gitea.api.webhooks.create` | `write` | Register a webhook on a repository: target URL, payload type, events and an optional signing secret. With type 'gitea' and a secret, the plugin's webhooks verify the deliveries |
| `webhooks.delete` | `gitea.api.webhooks.delete` | `destructive` | Permanently remove a webhook registration; deliveries stop immediately |
| `webhooks.get` | `gitea.api.webhooks.get` | `read` | Get a hook |
| `webhooks.list` | `gitea.api.webhooks.list` | `read` | List the webhooks registered on a repository, with their target URLs, events and active flag, one page at a time |
| `webhooks.test` | `gitea.api.webhooks.test` | `write` | Test a push webhook |
| `webhooks.update` | `gitea.api.webhooks.update` | `write` | Edit a hook in a repository |
| `wiki.create` | `gitea.api.wiki.create` | `write` | Create a wiki page |
| `wiki.delete` | `gitea.api.wiki.delete` | `destructive` | Delete a wiki page |
| `wiki.get` | `gitea.api.wiki.get` | `read` | Get a wiki page |
| `wiki.list` | `gitea.api.wiki.list` | `read` | Get all wiki pages, one page at a time |
| `wiki.revisions` | `gitea.api.wiki.revisions` | `read` | Get revisions of a wiki page |
| `wiki.update` | `gitea.api.wiki.update` | `write` | Edit a wiki page |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 15 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gitea

## License

Apache-2.0
