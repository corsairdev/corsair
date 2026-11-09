# @corsair-dev/gong

Gong plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/gong
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accountsEnrich.getResults` | `gong.api.accountsEnrich.getResults` | `read` | Retrieve account enrichment results for a job. |
| `accountsEnrich.start` | `gong.api.accountsEnrich.start` | `write` | Start an account enrichment job. |
| `auditing.listLogs` | `gong.api.auditing.listLogs` | `read` | Retrieve Gong audit log entries for a time range. |
| `calls.add` | `gong.api.calls.add` | `write` | Create a Gong call from an externally recorded conversation. |
| `calls.addRecording` | `gong.api.calls.addRecording` | `write` | Upload media for a previously created Gong call. |
| `calls.get` | `gong.api.calls.get` | `read` | Retrieve details for one Gong call. |
| `calls.getTranscripts` | `gong.api.calls.getTranscripts` | `read` | Retrieve transcripts for calls matching the filter. |
| `calls.list` | `gong.api.calls.list` | `read` | List calls within a requested date range. |
| `calls.listExtensive` | `gong.api.calls.listExtensive` | `read` | Retrieve calls with detailed content and filters. |
| `coaching.list` | `gong.api.coaching.list` | `read` | List coaching metrics for users. |
| `contactsEnrich.getResults` | `gong.api.contactsEnrich.getResults` | `read` | Retrieve contact enrichment results for a job. |
| `contactsEnrich.start` | `gong.api.contactsEnrich.start` | `write` | Start a contact enrichment job. |
| `crm.deleteIntegration` | `gong.api.crm.deleteIntegration` | `destructive` | Delete a Gong CRM integration. |
| `crm.getObjects` | `gong.api.crm.getObjects` | `read` | Retrieve CRM objects by CRM IDs. |
| `crm.getRequestStatus` | `gong.api.crm.getRequestStatus` | `read` | Retrieve CRM request status. |
| `crm.listIntegrations` | `gong.api.crm.listIntegrations` | `read` | List Gong CRM integrations. |
| `crm.listSchemaFields` | `gong.api.crm.listSchemaFields` | `read` | List selected CRM schema fields. |
| `crm.registerIntegration` | `gong.api.crm.registerIntegration` | `write` | Register a Gong CRM integration. |
| `crm.uploadObjects` | `gong.api.crm.uploadObjects` | `write` | Upload CRM objects from a data file. |
| `crm.uploadSchemaFields` | `gong.api.crm.uploadSchemaFields` | `write` | Upload selected CRM schema fields. |
| `dataPrivacy.findEmailReferences` | `gong.api.dataPrivacy.findEmailReferences` | `read` | Find Gong records associated with an email address. |
| `dataPrivacy.findPhoneReferences` | `gong.api.dataPrivacy.findPhoneReferences` | `read` | Find Gong records associated with a phone number. |
| `dataPrivacy.purgeEmailAddress` | `gong.api.dataPrivacy.purgeEmailAddress` | `destructive` | Delete an email address and its associated Gong data. |
| `dataPrivacy.purgePhoneNumber` | `gong.api.dataPrivacy.purgePhoneNumber` | `destructive` | Delete a phone number and its associated Gong data. |
| `digitalInteractions.add` | `gong.api.digitalInteractions.add` | `write` | Add a digital interaction event to Gong. |
| `engageFlows.assign` | `gong.api.engageFlows.assign` | `write` | Assign prospects to flows. |
| `engageFlows.assignedProspects` | `gong.api.engageFlows.assignedProspects` | `read` | Retrieve prospects assigned to flows. |
| `engageFlows.bulkAssignment` | `gong.api.engageFlows.bulkAssignment` | `write` | Submit a bulk flow assignment. |
| `engageFlows.folders` | `gong.api.engageFlows.folders` | `read` | List Engage flow folders. |
| `engageFlows.getBulkAssignment` | `gong.api.engageFlows.getBulkAssignment` | `read` | Retrieve a bulk flow assignment. |
| `engageFlows.list` | `gong.api.engageFlows.list` | `read` | List Engage flows. |
| `engageFlows.search` | `gong.api.engageFlows.search` | `read` | Search Engage flows. |
| `engageFlows.steps` | `gong.api.engageFlows.steps` | `read` | Retrieve steps for Engage flows. |
| `engageFlows.unassign` | `gong.api.engageFlows.unassign` | `write` | Unassign flows by instance ID. |
| `engageFlows.unassignProspects` | `gong.api.engageFlows.unassignProspects` | `write` | Unassign prospect flows by CRM ID. |
| `entities.ask` | `gong.api.entities.ask` | `read` | Ask a question about a CRM entity. |
| `entities.generateBrief` | `gong.api.entities.generateBrief` | `read` | Generate an AI brief for a CRM entity. |
| `integrationSettings.update` | `gong.api.integrationSettings.update` | `write` | Update Gong integration settings. |
| `library.folderContent` | `gong.api.library.folderContent` | `read` | List calls in a library folder. |
| `library.folders` | `gong.api.library.folders` | `read` | Retrieve public library folders. |
| `outcomes.list` | `gong.api.outcomes.list` | `read` | List available call outcomes. |
| `permissions.addCallUsers` | `gong.api.permissions.addCallUsers` | `write` | Grant individual users access to calls. |
| `permissions.createProfile` | `gong.api.permissions.createProfile` | `write` | Create a permission profile. |
| `permissions.deleteCallUsers` | `gong.api.permissions.deleteCallUsers` | `destructive` | Remove individual users from call access. |
| `permissions.getCallUsers` | `gong.api.permissions.getCallUsers` | `read` | Retrieve users with individual call access. |
| `permissions.getProfile` | `gong.api.permissions.getProfile` | `read` | Retrieve a permission profile. |
| `permissions.listProfiles` | `gong.api.permissions.listProfiles` | `read` | List permission profiles for a workspace. |
| `permissions.listProfileUsers` | `gong.api.permissions.listProfileUsers` | `read` | List users attached to a permission profile. |
| `permissions.updateProfile` | `gong.api.permissions.updateProfile` | `write` | Update a permission profile. |
| `settings.briefs` | `gong.api.settings.briefs` | `read` | List briefs. |
| `settings.scorecards` | `gong.api.settings.scorecards` | `read` | List scorecards. |
| `settings.trackers` | `gong.api.settings.trackers` | `read` | List keyword trackers. |
| `stats.aggregate` | `gong.api.stats.aggregate` | `read` | Retrieve aggregate user activity. |
| `stats.aggregateByPeriod` | `gong.api.stats.aggregateByPeriod` | `read` | Retrieve aggregate activity by period. |
| `stats.answeredScorecards` | `gong.api.stats.answeredScorecards` | `read` | Retrieve answered scorecard statistics. |
| `stats.dayByDay` | `gong.api.stats.dayByDay` | `read` | Retrieve daily user activity. |
| `stats.interaction` | `gong.api.stats.interaction` | `read` | Retrieve interaction statistics. |
| `targets.listDefinitions` | `gong.api.targets.listDefinitions` | `read` | List target definitions. |
| `targets.uploadAssignments` | `gong.api.targets.uploadAssignments` | `write` | Upload target assignments. |
| `tasks.list` | `gong.api.tasks.list` | `read` | List Gong tasks. |
| `tasks.updateReminder` | `gong.api.tasks.updateReminder` | `write` | Update a task reminder. |
| `users.get` | `gong.api.users.get` | `read` | Retrieve a user by Gong user identifier. |
| `users.getHistory` | `gong.api.users.getHistory` | `read` | Retrieve the settings history for a Gong user. |
| `users.list` | `gong.api.users.list` | `read` | List users in the Gong company workspace. |
| `users.listMultiple` | `gong.api.users.listMultiple` | `read` | List users matching the supplied filters. |
| `workspaces.list` | `gong.api.workspaces.list` | `read` | List company workspaces. |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gong

## License

Apache-2.0
