# @corsair-dev/honeybadger

Honeybadger plugin for Corsair: error tracking, uptime, check-ins, deploys and Insights queries through the v3 API.

## Install

```bash
pnpm add @corsair-dev/honeybadger
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `honeybadger.api.account.get` | `read` | Read the account the token belongs to |
| `account.usage` | `honeybadger.api.account.usage` | `read` | Read the account quota and how much of it is used, for errors, uptime and check-ins |
| `checkIns.create` | `honeybadger.api.checkIns.create` | `write` | Create a check-in on a simple period or a cron schedule; a simple schedule needs `report_period` and a cron schedule needs `cron_schedule` |
| `checkIns.delete` | `honeybadger.api.checkIns.delete` | `destructive` | Delete a check-in, which stops monitoring that scheduled job |
| `checkIns.events` | `honeybadger.api.checkIns.events` | `read` | List a check-in's state changes newest first, paging backwards on a timestamp |
| `checkIns.get` | `honeybadger.api.checkIns.get` | `read` | Read one check-in with its schedule, last report and next expected report |
| `checkIns.list` | `honeybadger.api.checkIns.list` | `read` | List a project's check-ins with their state and next expected report |
| `checkIns.replace` | `honeybadger.api.checkIns.replace` | `destructive` | Replace the project's whole set of check-ins by slug; every check-in the list does not name is deleted |
| `checkIns.update` | `honeybadger.api.checkIns.update` | `write` | Change a check-in's name, slug, schedule or grace period; switching schedule type clears the other one's fields |
| `comments.create` | `honeybadger.api.comments.create` | `write` | Comment on a fault; `@mentions` notify the named project members |
| `comments.delete` | `honeybadger.api.comments.delete` | `destructive` | Permanently delete a comment from a fault |
| `comments.get` | `honeybadger.api.comments.get` | `read` | Read one comment on a fault, with its author and body |
| `comments.list` | `honeybadger.api.comments.list` | `read` | List a fault's comments newest first |
| `comments.update` | `honeybadger.api.comments.update` | `write` | Replace a comment's text |
| `deploys.delete` | `honeybadger.api.deploys.delete` | `destructive` | Delete a deploy record; the deploy is not re-read anywhere |
| `deploys.get` | `honeybadger.api.deploys.get` | `read` | Read one deploy record |
| `deploys.list` | `honeybadger.api.deploys.list` | `read` | List deploys oldest-page-first with cursors, optionally by exact environment or deploy username |
| `environments.bulkDelete` | `honeybadger.api.environments.bulkDelete` | `destructive` | Delete several environments at once; if any ID is not one of the project's, nothing is deleted |
| `environments.bulkUpdate` | `honeybadger.api.environments.bulkUpdate` | `write` | Turn notifications on or off for several environments at once; if any ID is not one of the project's, nothing changes |
| `environments.create` | `honeybadger.api.environments.create` | `write` | Create an environment; names are unique per project and case-sensitive |
| `environments.delete` | `honeybadger.api.environments.delete` | `destructive` | Delete an environment; its faults and notices stay, and the next notice under that name recreates it with notifications on |
| `environments.get` | `honeybadger.api.environments.get` | `read` | Read one environment and whether its errors send notifications |
| `environments.list` | `honeybadger.api.environments.list` | `read` | List a project's environments and whether each sends notifications |
| `environments.update` | `honeybadger.api.environments.update` | `write` | Change whether an environment notifies; an environment cannot be renamed |
| `faults.affectedUsers` | `honeybadger.api.faults.affectedUsers` | `read` | Read the 500 users a fault affected most, ranked by notice count |
| `faults.assign` | `honeybadger.api.faults.assign` | `write` | Assign a fault to a project member |
| `faults.delete` | `honeybadger.api.faults.delete` | `destructive` | Permanently delete a fault; its notices stay readable by ID until retention removes them |
| `faults.get` | `honeybadger.api.faults.get` | `read` | Read one fault by ID; a merged fault redirects to the fault it was merged into |
| `faults.ignore` | `honeybadger.api.faults.ignore` | `write` | Ignore faults, which stops data collection for them, by ID or by query with `all: true` |
| `faults.list` | `honeybadger.api.faults.list` | `read` | List faults with error search, sorting and time filters; occurrence counts cover the requested window |
| `faults.merge` | `honeybadger.api.faults.merge` | `destructive` | Merge one fault into another in the background; the merged fault keeps its tags, assignee and state on neither side, and its ID redirects for the retention period |
| `faults.occurrences` | `honeybadger.api.faults.occurrences` | `read` | Read occurrence counts for one fault over a window, one bucket per interval including empty ones |
| `faults.pauseRecording` | `honeybadger.api.faults.pauseRecording` | `write` | Stop recording a fault for an hour, a day or a week, discarding notices during the pause |
| `faults.resolve` | `honeybadger.api.faults.resolve` | `write` | Resolve named faults, or every fault a query and time filter match with `all: true`; `dry_run` reports what would change |
| `faults.resumeRecording` | `honeybadger.api.faults.resumeRecording` | `write` | Resume recording a fault; a fault that is not paused is unchanged |
| `faults.snooze` | `honeybadger.api.faults.snooze` | `write` | Snooze notifications for a duration or an occurrence count, replacing any existing snooze |
| `faults.summary` | `honeybadger.api.faults.summary` | `read` | Read fault counts grouped by environment and resolved or ignored state, with the same filters as the fault list |
| `faults.unassign` | `honeybadger.api.faults.unassign` | `write` | Remove the assignment from a fault |
| `faults.unignore` | `honeybadger.api.faults.unignore` | `write` | Stop ignoring faults, so collection resumes, by ID or by query with `all: true` |
| `faults.unresolve` | `honeybadger.api.faults.unresolve` | `write` | Mark faults unresolved, by ID or by query with `all: true`; `dry_run` reports what would change |
| `faults.unsnooze` | `honeybadger.api.faults.unsnooze` | `write` | Remove a fault's snooze |
| `faults.update` | `honeybadger.api.faults.update` | `write` | Change a fault resolved or ignored state, assignee, tags, or whether it resolves on the next deploy |
| `insights.query` | `honeybadger.api.insights.query` | `read` | Run a BadgerQL query over the project event streams and return its rows; a POST that changes nothing |
| `notices.get` | `honeybadger.api.notices.get` | `read` | Read one notice by its UUID, without naming its project or fault |
| `notices.list` | `honeybadger.api.notices.list` | `read` | List a fault's notices newest first, with source-mapped backtraces unless `unmapped` is set |
| `occurrences.list` | `honeybadger.api.occurrences.list` | `read` | Read notice counts for every project the token can see, ordered by project name |
| `projects.create` | `honeybadger.api.projects.create` | `write` | Create a project, optionally in a team; `team_id` requires `team:write` and rejects the whole request without it |
| `projects.delete` | `honeybadger.api.projects.delete` | `destructive` | Permanently delete a project and all its data |
| `projects.get` | `honeybadger.api.projects.get` | `read` | Read one project by ID, including its fault counts and environment names |
| `projects.list` | `honeybadger.api.projects.list` | `read` | List projects the token can reach, optionally filtered by exact name, with paging |
| `projects.occurrences` | `honeybadger.api.projects.occurrences` | `read` | Read notice counts for one project over an hour, day, week or month, one count per interval |
| `projects.stats` | `honeybadger.api.projects.stats` | `read` | Read a project fault and notice counts for the last day, week and month |
| `projects.update` | `honeybadger.api.projects.update` | `write` | Change a project's settings; a null clears a nullable field and a field left out keeps its value |
| `sites.checks` | `honeybadger.api.sites.checks` | `read` | List a site's individual uptime check results, newest page first |
| `sites.create` | `honeybadger.api.sites.create` | `write` | Create an uptime site; `match` is required for every match type except `success`, which refuses it, and `timeout` must be shorter than the check interval |
| `sites.delete` | `honeybadger.api.sites.delete` | `destructive` | Delete an uptime site and stop monitoring it |
| `sites.get` | `honeybadger.api.sites.get` | `read` | Read one uptime site with its URL, match rule and current state |
| `sites.list` | `honeybadger.api.sites.list` | `read` | List a project's uptime monitoring sites |
| `sites.outages` | `honeybadger.api.sites.outages` | `read` | List a site's outage periods, with the status and reason each failed |
| `sites.update` | `honeybadger.api.sites.update` | `write` | Change an uptime site's URL, matching, headers, locations, frequency or active state |
| `streams.list` | `honeybadger.api.streams.list` | `read` | List event streams; the ID is what `insights.query` takes in `stream_ids` |
| `token.get` | `honeybadger.api.token.get` | `read` | Report what the current token is: its kind, scopes, account and the projects it can reach. Needs no scope |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/honeybadger

## License

Apache-2.0
