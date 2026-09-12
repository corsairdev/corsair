# @corsair-dev/bugsnag

BugSnag plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bugsnag
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `collaborators.delete` | `bugsnag.api.collaborators.delete` | `destructive` | Remove a collaborator, revoking access to every project in the organization |
| `collaborators.get` | `bugsnag.api.collaborators.get` | `read` | Get a single collaborator |
| `collaborators.getOnProject` | `bugsnag.api.collaborators.getOnProject` | `read` | Get a collaborator in the context of a project |
| `collaborators.getProjectAccess` | `bugsnag.api.collaborators.getProjectAccess` | `read` | Get how one collaborator reaches one project |
| `collaborators.invite` | `bugsnag.api.collaborators.invite` | `write` | Invite a collaborator to an organization by email address |
| `collaborators.list` | `bugsnag.api.collaborators.list` | `read` | List the collaborators on an organization |
| `collaborators.listOnProject` | `bugsnag.api.collaborators.listOnProject` | `read` | List the collaborators who can reach a project |
| `collaborators.listProjectAccesses` | `bugsnag.api.collaborators.listProjectAccesses` | `read` | List how a collaborator reaches each project, with the granting role |
| `collaborators.listProjects` | `bugsnag.api.collaborators.listProjects` | `read` | List the projects a collaborator can reach |
| `collaborators.projectAccessCounts` | `bugsnag.api.collaborators.projectAccessCounts` | `read` | Count how many projects each named collaborator can reach |
| `collaborators.updatePermissions` | `bugsnag.api.collaborators.updatePermissions` | `write` | Change a collaborator's project access or admin status |
| `dataDeletions.confirmForProject` | `bugsnag.api.dataDeletions.confirmForProject` | `destructive` | Confirm a project event data deletion, irreversibly erasing the matched data |
| `dataDeletions.createForOrganization` | `bugsnag.api.dataDeletions.createForOrganization` | `destructive` | Create a request to erase matching event data across an organization |
| `dataDeletions.createForProject` | `bugsnag.api.dataDeletions.createForProject` | `destructive` | Create a request to erase matching event data in a project |
| `dataDeletions.getForOrganization` | `bugsnag.api.dataDeletions.getForOrganization` | `read` | Check the status of an organization event data deletion |
| `dataDeletions.getForProject` | `bugsnag.api.dataDeletions.getForProject` | `read` | Check the status of a project event data deletion |
| `dataRequests.createForOrganization` | `bugsnag.api.dataRequests.createForOrganization` | `write` | Request an export of an organization's event data for a subject access request |
| `dataRequests.createForProject` | `bugsnag.api.dataRequests.createForProject` | `write` | Request an export of a project's event data for a subject access request |
| `dataRequests.getForOrganization` | `bugsnag.api.dataRequests.getForOrganization` | `read` | Check the status of an organization event data export |
| `dataRequests.getForProject` | `bugsnag.api.dataRequests.getForProject` | `read` | Check the status of a project event data export |
| `errors.bulkUpdate` | `bugsnag.api.errors.bulkUpdate` | `destructive` | Apply one operation to many errors at once, including delete and discard |
| `errors.deleteAll` | `bugsnag.api.errors.deleteAll` | `destructive` | Permanently delete every error and event in a project |
| `errors.list` | `bugsnag.api.errors.list` | `read` | List the error groups on a project |
| `eventFields.create` | `bugsnag.api.eventFields.create` | `write` | Create a custom event field from a path inside event metadata |
| `eventFields.delete` | `bugsnag.api.eventFields.delete` | `destructive` | Delete a custom event field |
| `eventFields.list` | `bugsnag.api.eventFields.list` | `read` | List the fields a project can filter and pivot on |
| `events.list` | `bugsnag.api.events.list` | `read` | List the individual event occurrences on a project |
| `events.listForError` | `bugsnag.api.events.listForError` | `read` | List the individual events belonging to one error |
| `featureFlags.list` | `bugsnag.api.featureFlags.list` | `read` | List the feature flags seen on a project in a release stage |
| `featureFlags.listSummaries` | `bugsnag.api.featureFlags.listSummaries` | `read` | List feature flag summaries for a project |
| `integrations.configure` | `bugsnag.api.integrations.configure` | `write` | Configure an integration on a project |
| `integrations.deleteConfigured` | `bugsnag.api.integrations.deleteConfigured` | `destructive` | Delete a configured integration |
| `integrations.getConfigured` | `bugsnag.api.integrations.getConfigured` | `read` | Get a single configured integration |
| `integrations.listConfigured` | `bugsnag.api.integrations.listConfigured` | `read` | List the integrations configured on a project |
| `integrations.listSupported` | `bugsnag.api.integrations.listSupported` | `read` | List every integration BugSnag supports |
| `integrations.test` | `bugsnag.api.integrations.test` | `read` | Test an integration configuration before creating it |
| `organizations.delete` | `bugsnag.api.organizations.delete` | `destructive` | Delete an organization with all of its projects, errors and collaborator access |
| `organizations.get` | `bugsnag.api.organizations.get` | `read` | Get a single organization |
| `organizations.list` | `bugsnag.api.organizations.list` | `read` | List the organizations the token's owner belongs to |
| `pivots.list` | `bugsnag.api.pivots.list` | `read` | List the pivot definitions available on a project |
| `pivots.values` | `bugsnag.api.pivots.values` | `read` | List one pivot's values with each value's share of events |
| `projects.create` | `bugsnag.api.projects.create` | `write` | Create a project in an organization |
| `projects.delete` | `bugsnag.api.projects.delete` | `destructive` | Delete a project and its entire error history |
| `projects.get` | `bugsnag.api.projects.get` | `read` | Get a single project |
| `projects.list` | `bugsnag.api.projects.list` | `read` | List the projects in an organization |
| `projects.networkGroupingRuleset` | `bugsnag.api.projects.networkGroupingRuleset` | `read` | Get a project's network span grouping ruleset |
| `projects.regenerateApiKey` | `bugsnag.api.projects.regenerateApiKey` | `destructive` | Rotate a project's notifier API key, stopping every deployed notifier until redeployed |
| `releases.list` | `bugsnag.api.releases.list` | `read` | List the releases of a project |
| `releases.listGroups` | `bugsnag.api.releases.listGroups` | `read` | List the release groups of a project within a release stage |
| `savedSearches.create` | `bugsnag.api.savedSearches.create` | `write` | Create a saved search from a filter configuration |
| `savedSearches.delete` | `bugsnag.api.savedSearches.delete` | `destructive` | Delete a saved search |
| `savedSearches.get` | `bugsnag.api.savedSearches.get` | `read` | Get a single saved search |
| `savedSearches.list` | `bugsnag.api.savedSearches.list` | `read` | List the saved searches on a project |
| `savedSearches.usageSummary` | `bugsnag.api.savedSearches.usageSummary` | `read` | Report what depends on a saved search, to check before deleting it |
| `teams.addCollaboratorMemberships` | `bugsnag.api.teams.addCollaboratorMemberships` | `write` | Add a collaborator to teams, or to all of them |
| `teams.addMembers` | `bugsnag.api.teams.addMembers` | `write` | Add collaborators to a team, or add all of them |
| `teams.create` | `bugsnag.api.teams.create` | `write` | Create a team in an organization |
| `teams.delete` | `bugsnag.api.teams.delete` | `destructive` | Delete a team, removing the grouping but not its members |
| `teams.get` | `bugsnag.api.teams.get` | `read` | Get a single team |
| `teams.list` | `bugsnag.api.teams.list` | `read` | List the teams in an organization |
| `trends.projectBuckets` | `bugsnag.api.trends.projectBuckets` | `read` | Get a project's event counts split into time buckets |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bugsnag

## License

Apache-2.0
