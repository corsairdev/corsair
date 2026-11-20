# @corsair-dev/lemlist

Lemlist plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/lemlist
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activities.deleteRecordingTranscript` | `lemlist.api.activities.deleteRecordingTranscript` | `destructive` | Delete call recording and transcript of an activity |
| `activities.list` | `lemlist.api.activities.list` | `read` | Retrieve outreach activities across team or campaigns |
| `campaigns.addAbmLeads` | `lemlist.api.campaigns.addAbmLeads` | `destructive` | Add People Database contacts to an ABM campaign |
| `campaigns.archive` | `lemlist.api.campaigns.archive` | `write` | Archive a campaign |
| `campaigns.create` | `lemlist.api.campaigns.create` | `write` | Create a new campaign with schedule and settings |
| `campaigns.duplicate` | `lemlist.api.campaigns.duplicate` | `write` | Duplicate an existing campaign with sequences and schedules |
| `campaigns.exportLeads` | `lemlist.api.campaigns.exportLeads` | `read` | Export leads from campaign with state filtering |
| `campaigns.get` | `lemlist.api.campaigns.get` | `read` | Retrieve details of a specific campaign by ID |
| `campaigns.getBatchStats` | `lemlist.api.campaigns.getBatchStats` | `read` | Retrieve performance statistics for multiple campaigns |
| `campaigns.getExportStatus` | `lemlist.api.campaigns.getExportStatus` | `read` | Check status of an asynchronous campaign export |
| `campaigns.getReports` | `lemlist.api.campaigns.getReports` | `read` | Retrieve aggregated reports for one or multiple campaigns |
| `campaigns.getSettings` | `lemlist.api.campaigns.getSettings` | `read` | Retrieve all settings of a campaign |
| `campaigns.getStats` | `lemlist.api.campaigns.getStats` | `read` | Retrieve performance statistics for a specific campaign |
| `campaigns.getStatutes` | `lemlist.api.campaigns.getStatutes` | `read` | Retrieve validation statutes and launch blockers for a campaign |
| `campaigns.list` | `lemlist.api.campaigns.list` | `read` | Retrieve a paginated list of all campaigns in team |
| `campaigns.pause` | `lemlist.api.campaigns.pause` | `write` | Pause a running campaign |
| `campaigns.setExportEmail` | `lemlist.api.campaigns.setExportEmail` | `destructive` | Email the campaign export download link to an address when the export completes |
| `campaigns.skipStepForEveryone` | `lemlist.api.campaigns.skipStepForEveryone` | `destructive` | Skip one sequence step for every lead in campaign |
| `campaigns.skipStepForLeads` | `lemlist.api.campaigns.skipStepForLeads` | `destructive` | Skip one sequence step for specific leads in campaign |
| `campaigns.start` | `lemlist.api.campaigns.start` | `destructive` | Resume a paused campaign and allow its outreach messages to send |
| `campaigns.startExport` | `lemlist.api.campaigns.startExport` | `write` | Initiate asynchronous export of campaign statistics |
| `campaigns.unarchive` | `lemlist.api.campaigns.unarchive` | `write` | Restore an archived campaign |
| `campaigns.update` | `lemlist.api.campaigns.update` | `write` | Update settings and configuration of a campaign |
| `campaigns.updateSettings` | `lemlist.api.campaigns.updateSettings` | `write` | Update settings of a campaign |
| `leads.addVariables` | `lemlist.api.leads.addVariables` | `write` | Add custom variables to a lead |
| `leads.createInCampaign` | `lemlist.api.leads.createInCampaign` | `destructive` | Create a new lead and add it to a campaign |
| `leads.deleteFromCampaign` | `lemlist.api.leads.deleteFromCampaign` | `destructive` | Remove a lead from a campaign by ID (use `leads.unsubscribeFromCampaign` to unsubscribe) |
| `leads.deleteVariables` | `lemlist.api.leads.deleteVariables` | `destructive` | Erase custom variables of a lead |
| `leads.get` | `lemlist.api.leads.get` | `read` | Retrieve lead by email address or lead ID |
| `leads.getByEmail` | `lemlist.api.leads.getByEmail` | `read` | Retrieve lead details by email address |
| `leads.getCrmFilters` | `lemlist.api.leads.getCrmFilters` | `read` | Retrieve filters and list views from connected CRM |
| `leads.importFromCrm` | `lemlist.api.leads.importFromCrm` | `destructive` | Import leads from connected CRM filter into campaign |
| `leads.listInCampaign` | `lemlist.api.leads.listInCampaign` | `read` | Retrieve leads from a specific campaign |
| `leads.markInterested` | `lemlist.api.leads.markInterested` | `write` | Mark lead as interested across all campaigns |
| `leads.markInterestedInCampaign` | `lemlist.api.leads.markInterestedInCampaign` | `write` | Mark lead as interested in a specific campaign |
| `leads.markNotInterested` | `lemlist.api.leads.markNotInterested` | `write` | Mark lead as not interested across all campaigns |
| `leads.markNotInterestedInCampaign` | `lemlist.api.leads.markNotInterestedInCampaign` | `write` | Mark lead as not interested in a specific campaign |
| `leads.pause` | `lemlist.api.leads.pause` | `write` | Pause lead activity across campaigns or in a specific campaign |
| `leads.personalizeStep` | `lemlist.api.leads.personalizeStep` | `write` | Personalize step message for a single lead |
| `leads.resetStepPersonalization` | `lemlist.api.leads.resetStepPersonalization` | `destructive` | Reset step personalization for a single lead |
| `leads.resume` | `lemlist.api.leads.resume` | `destructive` | Resume a paused lead in all campaigns or one campaign, allowing outreach to continue |
| `leads.review` | `lemlist.api.leads.review` | `destructive` | Manually launch a lead into its campaign, allowing outreach to begin |
| `leads.skipStep` | `lemlist.api.leads.skipStep` | `destructive` | Skip one step of a running campaign for a single lead |
| `leads.unsubscribeFromCampaign` | `lemlist.api.leads.unsubscribeFromCampaign` | `destructive` | Unsubscribe a lead from a campaign by email |
| `leads.updateInCampaign` | `lemlist.api.leads.updateInCampaign` | `write` | Update lead information in a campaign |
| `leads.updateVariables` | `lemlist.api.leads.updateVariables` | `write` | Update custom variables of a lead |
| `team.get` | `lemlist.api.team.get` | `read` | Retrieve team details and members |
| `team.getCredits` | `lemlist.api.team.getCredits` | `read` | Retrieve team remaining credits balance |
| `team.getCrmUsers` | `lemlist.api.team.getCrmUsers` | `read` | List team members connected to CRM |
| `team.getSenders` | `lemlist.api.team.getSenders` | `read` | Retrieve all team members and their associated campaigns |
| `unsubscribes.bulkUnsubscribeVariables` | `lemlist.api.unsubscribes.bulkUnsubscribeVariables` | `destructive` | Bulk unsubscribe variables up to 10,000 items |
| `unsubscribes.exportContacts` | `lemlist.api.unsubscribes.exportContacts` | `read` | Export all contacts with their subscription status (`doNotContact`) in CSV or JSON format |
| `unsubscribes.exportVariables` | `lemlist.api.unsubscribes.exportVariables` | `read` | Export unsubscribed variables in CSV or JSON format |
| `unsubscribes.getContactStatus` | `lemlist.api.unsubscribes.getContactStatus` | `read` | Get subscription status of a contact |
| `unsubscribes.getVariable` | `lemlist.api.unsubscribes.getVariable` | `read` | Get unsubscribed status of a variable |
| `unsubscribes.listVariables` | `lemlist.api.unsubscribes.listVariables` | `read` | List unsubscribed variables (emails, domains, phones) |
| `unsubscribes.resubscribeContact` | `lemlist.api.unsubscribes.resubscribeContact` | `write` | Re-subscribe a contact by ID |
| `unsubscribes.resubscribeVariable` | `lemlist.api.unsubscribes.resubscribeVariable` | `write` | Re-subscribe a variable to allow future outreach |
| `unsubscribes.unsubscribeContact` | `lemlist.api.unsubscribes.unsubscribeContact` | `destructive` | Unsubscribe a contact by ID |
| `unsubscribes.unsubscribeVariable` | `lemlist.api.unsubscribes.unsubscribeVariable` | `destructive` | Unsubscribe a single variable (email, domain, or phone) |

## Auth

Lemlist API key via HTTP Basic auth: empty username, API key as password (`Authorization: Basic base64(:apiKey)`). Corsair prompts your tenant for credentials on first use.

## Route reference and behavior

The route templates and complete request/response contracts are in Lemlist's official pages linked below. The endpoint list above maps directly to these documented routes.

| Operation | Method and path | Lemlist API reference |
|---|---|---|
| `team.get` | `GET /team` | [Reference](https://developer.lemlist.com/api-reference/endpoints/team/get-team.md) |
| `team.getSenders` | `GET /team/senders` | [Reference](https://developer.lemlist.com/api-reference/endpoints/team/get-team-senders.md) |
| `team.getCredits` | `GET /team/credits` | [Reference](https://developer.lemlist.com/api-reference/endpoints/team/get-team-credits.md) |
| `team.getCrmUsers` | `GET /team/crmUsers` | [Reference](https://developer.lemlist.com/api-reference/endpoints/crm/get-team-crm-users.md) |
| `campaigns.list` | `GET /campaigns` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/get-many-campaigns.md) |
| `campaigns.create` | `POST /campaigns` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/create-campaign.md) |
| `campaigns.get` | `GET /campaigns/{campaignId}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign.md) |
| `campaigns.update` | `PATCH /campaigns/{campaignId}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/update-campaign.md) |
| `campaigns.getSettings` | `GET /campaigns/{campaignId}/settings` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign-settings.md) |
| `campaigns.updateSettings` | `PATCH /campaigns/{campaignId}/settings` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/update-campaign-settings.md) |
| `campaigns.pause` | `POST /campaigns/{campaignId}/pause` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/pause-campaign.md) |
| `campaigns.start` | `POST /campaigns/{campaignId}/start` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/start-campaign.md) |
| `campaigns.archive` | `POST /campaigns/{campaignId}/archive` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/archive-campaign.md) |
| `campaigns.unarchive` | `POST /campaigns/{campaignId}/unarchive` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/unarchive-campaign.md) |
| `campaigns.duplicate` | `POST /campaigns/{campaignId}/duplicate` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/duplicate-campaign.md) |
| `campaigns.getStatutes` | `GET /campaigns/{campaignId}/statutes` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign-statutes.md) |
| `campaigns.getStats` | `GET /v2/campaigns/{campaignId}/stats` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign-stats.md) |
| `campaigns.getBatchStats` | `POST /v2/campaigns/stats/batch` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/get-batch-campaign-stats.md) |
| `campaigns.getReports` | `GET /campaigns/reports` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign-reports.md) |
| `campaigns.startExport` | `GET /campaigns/{campaignId}/export/start` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/start-campaign-export.md) |
| `campaigns.getExportStatus` | `GET /campaigns/{campaignId}/export/{exportId}/status` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/get-campaign-export-status.md) |
| `campaigns.setExportEmail` | `PUT /campaigns/{campaignId}/export/{exportId}/email/{email}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/set-export-email-notification.md) |
| `campaigns.exportLeads` | `GET /v2/campaigns/{campaignId}/export/leads` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/export-campaign-leads-v2.md) |
| `campaigns.skipStepForEveryone` | `POST /campaigns/{campaignId}/steps/{stepId}/skip` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/skip-step-for-everyone.md) |
| `campaigns.skipStepForLeads` | `POST /campaigns/{campaignId}/steps/{stepId}/skip-for-leads` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/skip-step-for-leads.md) |
| `campaigns.addAbmLeads` | `POST /campaigns/{campaignId}/abm-leads` | [Reference](https://developer.lemlist.com/api-reference/endpoints/campaigns/add-abm-campaign-leads.md) |
| `leads.get` | `GET /leads?id=…&version=v2` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/get-lead-by-email-or-id.md) |
| `leads.getByEmail` | `GET /leads/{email}?version=v2` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/get-lead-by-email.md) |
| `leads.listInCampaign` | `GET /campaigns/{campaignId}/leads/` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/get-campaign-leads.md) |
| `leads.createInCampaign` | `POST /campaigns/{campaignId}/leads/` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/create-lead-in-campaign.md) |
| `leads.updateInCampaign` | `PATCH /campaigns/{campaignId}/leads/{leadId}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/update-lead.md) |
| `leads.deleteFromCampaign` | `DELETE /campaigns/{campaignId}/leads/{leadId}?action=remove` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/delete-lead.md) |
| `leads.unsubscribeFromCampaign` | `DELETE /campaigns/{campaignId}/leads/{email}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/unsubscribe-lead-from-campaign.md) |
| `leads.resume` | `POST /leads/start/{leadId}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/resume-paused-lead.md) |
| `leads.pause` | `POST /leads/pause/{leadId}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/pause-lead.md) |
| `leads.review` | `POST /leads/review/{leadId}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/launch-lead.md) |
| `leads.markInterested` | `POST /leads/interested/{leadIdOrEmail}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/mark-lead-as-interested.md) |
| `leads.markNotInterested` | `POST /leads/notinterested/{leadIdOrEmail}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/mark-lead-as-not-interested.md) |
| `leads.markInterestedInCampaign` | `POST /campaigns/{campaignId}/leads/{leadIdOrEmail}/interested` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/mark-lead-as-interested-in-campaign.md) |
| `leads.markNotInterestedInCampaign` | `POST /campaigns/{campaignId}/leads/{leadIdOrEmail}/notinterested` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/mark-lead-as-not-interested-in-campaign.md) |
| `leads.skipStep` | `POST /campaigns/{campaignId}/leads/{leadIdOrEmail}/steps/{stepId}/skip` (deprecated) | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/skip-step-for-lead.md) |
| `leads.personalizeStep` | `PUT /campaigns/{campaignId}/leads/{leadIdOrEmail}/steps/{stepId}/personalization` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/personalize-step-for-lead.md) |
| `leads.resetStepPersonalization` | `DELETE /campaigns/{campaignId}/leads/{leadIdOrEmail}/steps/{stepId}/personalization` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/reset-step-personalization-for-lead.md) |
| `leads.addVariables` | `POST /leads/{leadId}/variables` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/add-lead-variables.md) |
| `leads.updateVariables` | `PATCH /leads/{leadId}/variables` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/update-lead-variables.md) |
| `leads.deleteVariables` | `DELETE /leads/{leadId}/variables` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/delete-lead-variables.md) |
| `leads.importFromCrm` | `POST /campaigns/{campaignId}/leads/import` | [Reference](https://developer.lemlist.com/api-reference/endpoints/leads/import-leads-from-crm.md) |
| `leads.getCrmFilters` | `GET /crm/filters` | [Reference](https://developer.lemlist.com/api-reference/endpoints/crm/get-crm-filters.md) |
| `activities.list` | `GET /activities?version=v2` | [Reference](https://developer.lemlist.com/api-reference/endpoints/activities/get-many-activities.md) |
| `activities.deleteRecordingTranscript` | `DELETE /activities/{activityId}/recording-transcript` | [Reference](https://developer.lemlist.com/api-reference/endpoints/activities/delete-activity-recording-transcript.md) |
| `unsubscribes.listVariables` | `GET /v2/unsubscribes/variables` | [Reference](https://developer.lemlist.com/api-reference/endpoints/unsubscribes/list-unsubscribed-variables.md) |
| `unsubscribes.bulkUnsubscribeVariables` | `POST /v2/unsubscribes/variables` | [Reference](https://developer.lemlist.com/api-reference/endpoints/unsubscribes/bulk-unsubscribe-variables.md) |
| `unsubscribes.getVariable` | `GET /v2/unsubscribes/variables/{value}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/unsubscribes/get-unsubscribed-variable.md) |
| `unsubscribes.unsubscribeVariable` | `POST /v2/unsubscribes/variables/{value}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/unsubscribes/unsubscribe-variable.md) |
| `unsubscribes.resubscribeVariable` | `DELETE /v2/unsubscribes/variables/{value}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/unsubscribes/resubscribe-variable.md) |
| `unsubscribes.getContactStatus` | `GET /v2/unsubscribes/contacts/{contactId}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/unsubscribes/get-contact-subscription-status.md) |
| `unsubscribes.unsubscribeContact` | `POST /v2/unsubscribes/contacts/{contactId}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/unsubscribes/unsubscribe-contact.md) |
| `unsubscribes.resubscribeContact` | `DELETE /v2/unsubscribes/contacts/{contactId}` | [Reference](https://developer.lemlist.com/api-reference/endpoints/unsubscribes/resubscribe-contact.md) |
| `unsubscribes.exportVariables` | `GET /v2/unsubscribes/exports/variables` | [Reference](https://developer.lemlist.com/api-reference/endpoints/unsubscribes/export-unsubscribed-variables.md) |
| `unsubscribes.exportContacts` | `GET /v2/unsubscribes/exports/contacts` | [Reference](https://developer.lemlist.com/api-reference/endpoints/unsubscribes/export-unsubscribed-contacts.md) |

Campaign, campaign-lead, activity, and unsubscribe-variable list operations use documented offset/limit pagination; export endpoints may return CSV text or JSON depending on `format`. The API allows 20 requests per 2 seconds per API key and returns `Retry-After`; Corsair captures that header and handles 429 retry policy. Settings endpoints require Email Pro, ABM lead insertion requires the ABM beta, and CRM import can consume enrichment credits. The legacy single-lead `leads.skipStep` operation remains exposed as documented but is deprecated by Lemlist in favor of `campaigns.skipStepForLeads`.

## Webhooks

No webhook or callback behavior is included. Webhook administration and incoming callbacks are outside this plugin's selected scope.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/lemlist

## License

Apache-2.0
