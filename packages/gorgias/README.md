# Gorgias

Corsair integration for the documented Gorgias REST API. It exposes 114 operations across 24 resource groups with strict Zod request/response validation, cursor pagination, tenant-specific routing, rate-limit handling, and file transfer support.

## Authentication

This plugin supports **private Gorgias apps** using an API key. Configure these account credentials:

- `api_key`: the Gorgias private-app API key
- `email`: the agent email associated with the API key
- `tenant_external_id`: the Gorgias account subdomain (the hostname prefix in your account URL)

The client sends HTTP Basic authentication (`email:api_key`) to `https://<subdomain>.gorgias.com`. The tenant value is validated before it is used as a hostname.

Gorgias requires OAuth 2.0 for public apps. Public-app OAuth is intentionally excluded from this plugin; the private-app API-key flow must not be used for a public app. No webhook receiver is included.

## Pagination, retries, and privacy

List operations accept the provider-documented cursor, limit, order, and resource-specific filters. Responses preserve Gorgias pagination envelopes and cursors; pass `meta.next_cursor` as the next request cursor to fetch another page.

Gorgias documents private API-key limits of 40 requests per 20 seconds (enterprise accounts use a 10-second window). HTTP 429 responses use `Retry-After`; the shared Corsair transport owns JSON-request retries, while the binary transport retries rate-limited reads itself. Writes are not retried on server/network failures.

Logs contain only the operation identifier. Request/response data and signed file URLs are not logged; propagated HTTP errors have provider bodies and request details redacted.

File upload takes base64 content in `body.files` and sends multipart form data. File and CSV downloads return `{ kind: "binary", contentType, base64, sizeBytes }`; signed URLs are followed internally. The client enforces a 20 MiB transfer safety limit and up to 10 uploaded files per request.

## REST operation inventory

All routes below are documented in the [Gorgias REST API reference](https://developers.gorgias.com/reference/introduction). The request schema places path parameters in `path`, query parameters in `query`, header parameters in `headers`, and the documented request body in `body`.

### account

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `account.createAccountSetting` | `POST` | `/api/account/settings` | [Gorgias docs](https://developers.gorgias.com/reference/create-account-setting.md) |
| `account.getAccount` | `GET` | `/api/account` | [Gorgias docs](https://developers.gorgias.com/reference/get-account.md) |
| `account.listAccountSettings` | `GET` | `/api/account/settings` | [Gorgias docs](https://developers.gorgias.com/reference/list-account-settings.md) |
| `account.updateAccountSetting` | `PUT` | `/api/account/settings/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-account-setting.md) |

### customFields

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `customFields.createCustomField` | `POST` | `/api/custom-fields` | [Gorgias docs](https://developers.gorgias.com/reference/create-custom-field.md) |
| `customFields.getCustomField` | `GET` | `/api/custom-fields/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-custom-field.md) |
| `customFields.listCustomFields` | `GET` | `/api/custom-fields` | [Gorgias docs](https://developers.gorgias.com/reference/list-custom-fields.md) |
| `customFields.updateCustomField` | `PUT` | `/api/custom-fields/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-custom-field.md) |
| `customFields.updateCustomFields` | `PUT` | `/api/custom-fields` | [Gorgias docs](https://developers.gorgias.com/reference/update-custom-fields.md) |

### customers

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `customers.createCustomer` | `POST` | `/api/customers` | [Gorgias docs](https://developers.gorgias.com/reference/create-customer.md) |
| `customers.deleteCustomer` | `DELETE` | `/api/customers/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-customer.md) |
| `customers.deleteCustomerCustomFieldValue` | `DELETE` | `/api/customers/{customer_id}/custom-fields/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-customer-custom-field-value.md) |
| `customers.deleteCustomers` | `DELETE` | `/api/customers` | [Gorgias docs](https://developers.gorgias.com/reference/delete-customers.md) |
| `customers.getCustomer` | `GET` | `/api/customers/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-customer.md) |
| `customers.listCustomerCustomFieldsValues` | `GET` | `/api/customers/{customer_id}/custom-fields` | [Gorgias docs](https://developers.gorgias.com/reference/list-customer-custom-fields-values.md) |
| `customers.listCustomers` | `GET` | `/api/customers` | [Gorgias docs](https://developers.gorgias.com/reference/list-customers.md) |
| `customers.mergeCustomers` | `PUT` | `/api/customers/merge` | [Gorgias docs](https://developers.gorgias.com/reference/merge-customers.md) |
| `customers.updateCustomer` | `PUT` | `/api/customers/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-customer.md) |
| `customers.updateCustomerCustomFieldValue` | `PUT` | `/api/customers/{customer_id}/custom-fields/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-customer-custom-field-value.md) |
| `customers.updateCustomerCustomFieldValues` | `PUT` | `/api/customers/{customer_id}/custom-fields` | [Gorgias docs](https://developers.gorgias.com/reference/update-customer-custom-field-values.md) |
| `customers.updateCustomerData` | `PUT` | `/api/customers/{customer_id}/data` | [Gorgias docs](https://developers.gorgias.com/reference/update-customer-data.md) |

### events

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `events.getEvent` | `GET` | `/api/events/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-event.md) |
| `events.listEvents` | `GET` | `/api/events` | [Gorgias docs](https://developers.gorgias.com/reference/list-events.md) |

### files

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `files.uploadFiles` | `POST` | `/api/upload` | [Gorgias docs](https://developers.gorgias.com/reference/post_api-upload.md) |
| `files.downloadFile` | `GET` | `/api/{file_type}/download/{domain_hash}/{resource_name}` | [Gorgias docs](https://developers.gorgias.com/reference/download-file.md) |

### integrations

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `integrations.createIntegration` | `POST` | `/api/integrations` | [Gorgias docs](https://developers.gorgias.com/reference/create-integration.md) |
| `integrations.deleteIntegration` | `DELETE` | `/api/integrations/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-integration.md) |
| `integrations.getIntegration` | `GET` | `/api/integrations/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-integration.md) |
| `integrations.listIntegrations` | `GET` | `/api/integrations` | [Gorgias docs](https://developers.gorgias.com/reference/list-integrations.md) |
| `integrations.updateIntegration` | `PUT` | `/api/integrations/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-integration.md) |

### jobs

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `jobs.cancelJob` | `DELETE` | `/api/jobs/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/cancel-job.md) |
| `jobs.createJob` | `POST` | `/api/jobs` | [Gorgias docs](https://developers.gorgias.com/reference/create-job.md) |
| `jobs.getJob` | `GET` | `/api/jobs/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-job.md) |
| `jobs.listJobs` | `GET` | `/api/jobs` | [Gorgias docs](https://developers.gorgias.com/reference/list-jobs.md) |
| `jobs.updateJob` | `PUT` | `/api/jobs/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-job.md) |

### macros

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `macros.bulkArchiveMacros` | `PUT` | `/api/macros/archive` | [Gorgias docs](https://developers.gorgias.com/reference/bulk-archive-macros.md) |
| `macros.bulkUnarchiveMacros` | `PUT` | `/api/macros/unarchive` | [Gorgias docs](https://developers.gorgias.com/reference/bulk-unarchive-macros.md) |
| `macros.createMacro` | `POST` | `/api/macros` | [Gorgias docs](https://developers.gorgias.com/reference/create-macro.md) |
| `macros.deleteMacro` | `DELETE` | `/api/macros/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-macro.md) |
| `macros.getMacro` | `GET` | `/api/macros/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-macro.md) |
| `macros.listMacros` | `GET` | `/api/macros` | [Gorgias docs](https://developers.gorgias.com/reference/list-macros.md) |
| `macros.updateMacro` | `PUT` | `/api/macros/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-macro.md) |

### metricCards

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `metricCards.createMetricCardFeedback` | `POST` | `/api/metric-cards/{slug}/feedback` | [Gorgias docs](https://developers.gorgias.com/reference/create-metric-card-feedback.md) |
| `metricCards.getMetricCard` | `GET` | `/api/metric-cards/{slug}` | [Gorgias docs](https://developers.gorgias.com/reference/get-metric-card.md) |
| `metricCards.searchMetricCards` | `GET` | `/api/metric-cards` | [Gorgias docs](https://developers.gorgias.com/reference/search-metric-cards.md) |

### reportingStatistics

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `reportingStatistics.getStatistic` | `POST` | `/api/reporting/stats` | [Gorgias docs](https://developers.gorgias.com/reference/get-statistic.md) |

### rules

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `rules.createRule` | `POST` | `/api/rules` | [Gorgias docs](https://developers.gorgias.com/reference/create-rule.md) |
| `rules.deleteRule` | `DELETE` | `/api/rules/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-rule.md) |
| `rules.getRule` | `GET` | `/api/rules/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-rule.md) |
| `rules.listRules` | `GET` | `/api/rules` | [Gorgias docs](https://developers.gorgias.com/reference/list-rules.md) |
| `rules.updateRule` | `PUT` | `/api/rules/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-rule.md) |
| `rules.updateRulesPriorities` | `POST` | `/api/rules/priorities` | [Gorgias docs](https://developers.gorgias.com/reference/update-rules-priorities.md) |

### satisfactionSurveys

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `satisfactionSurveys.createSatisfactionSurvey` | `POST` | `/api/satisfaction-surveys` | [Gorgias docs](https://developers.gorgias.com/reference/create-satisfaction-survey.md) |
| `satisfactionSurveys.getSatisfactionSurvey` | `GET` | `/api/satisfaction-surveys/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-satisfaction-survey.md) |
| `satisfactionSurveys.listSatisfactionSurveys` | `GET` | `/api/satisfaction-surveys` | [Gorgias docs](https://developers.gorgias.com/reference/list-satisfaction-surveys.md) |
| `satisfactionSurveys.updateSatisfactionSurvey` | `PUT` | `/api/satisfaction-surveys/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-satisfaction-survey.md) |

### search

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `search.search` | `POST` | `/api/search` | [Gorgias docs](https://developers.gorgias.com/reference/search-1.md) |

### statistics

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `statistics.downloadLegacyStatistic` | `POST` | `/api/stats/{name}/download` | [Gorgias docs](https://developers.gorgias.com/reference/download-legacy-statistic.md) |
| `statistics.getLegacyStatistic` | `POST` | `/api/stats/{name}` | [Gorgias docs](https://developers.gorgias.com/reference/get-legacy-statistic.md) |

### tags

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `tags.createTag` | `POST` | `/api/tags` | [Gorgias docs](https://developers.gorgias.com/reference/create-tag.md) |
| `tags.deleteTag` | `DELETE` | `/api/tags/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-tag.md) |
| `tags.deleteTags` | `DELETE` | `/api/tags` | [Gorgias docs](https://developers.gorgias.com/reference/delete-tags.md) |
| `tags.getTag` | `GET` | `/api/tags/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-tag.md) |
| `tags.listTags` | `GET` | `/api/tags` | [Gorgias docs](https://developers.gorgias.com/reference/list-tags.md) |
| `tags.mergeTags` | `PUT` | `/api/tags/{destination_tag_id}/merge` | [Gorgias docs](https://developers.gorgias.com/reference/merge-tags.md) |
| `tags.updateTag` | `PUT` | `/api/tags/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-tag.md) |

### teams

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `teams.createTeam` | `POST` | `/api/teams` | [Gorgias docs](https://developers.gorgias.com/reference/create-team.md) |
| `teams.deleteTeam` | `DELETE` | `/api/teams/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-team.md) |
| `teams.getTeam` | `GET` | `/api/teams/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-team.md) |
| `teams.listTeams` | `GET` | `/api/teams` | [Gorgias docs](https://developers.gorgias.com/reference/list-teams.md) |
| `teams.updateTeam` | `PUT` | `/api/teams/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-team.md) |

### ticketMessages

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `ticketMessages.createTicketMessage` | `POST` | `/api/tickets/{ticket_id}/messages` | [Gorgias docs](https://developers.gorgias.com/reference/create-ticket-message.md) |
| `ticketMessages.deleteTicketMessage` | `DELETE` | `/api/tickets/{ticket_id}/messages/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-ticket-message.md) |
| `ticketMessages.getTicketMessage` | `GET` | `/api/tickets/{ticket_id}/messages/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-ticket-message.md) |
| `ticketMessages.listMessages` | `GET` | `/api/messages` | [Gorgias docs](https://developers.gorgias.com/reference/list-messages.md) |
| `ticketMessages.listTicketMessages` | `GET` | `/api/tickets/{ticket_id}/messages` | [Gorgias docs](https://developers.gorgias.com/reference/list-ticket-messages.md) |
| `ticketMessages.updateTicketMessage` | `PUT` | `/api/tickets/{ticket_id}/messages/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-ticket-message.md) |

### tickets

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `tickets.createTicket` | `POST` | `/api/tickets` | [Gorgias docs](https://developers.gorgias.com/reference/create-ticket.md) |
| `tickets.createTicketTags` | `POST` | `/api/tickets/{ticket_id}/tags` | [Gorgias docs](https://developers.gorgias.com/reference/create-ticket-tags.md) |
| `tickets.deleteTicket` | `DELETE` | `/api/tickets/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-ticket.md) |
| `tickets.deleteTicketCustomField` | `DELETE` | `/api/tickets/{ticket_id}/custom-fields/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-ticket-custom-field.md) |
| `tickets.deleteTicketTags` | `DELETE` | `/api/tickets/{ticket_id}/tags` | [Gorgias docs](https://developers.gorgias.com/reference/delete-ticket-tags.md) |
| `tickets.getTicket` | `GET` | `/api/tickets/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-ticket.md) |
| `tickets.listTicketCustomFields` | `GET` | `/api/tickets/{ticket_id}/custom-fields` | [Gorgias docs](https://developers.gorgias.com/reference/list-ticket-custom-fields.md) |
| `tickets.listTicketTags` | `GET` | `/api/tickets/{ticket_id}/tags` | [Gorgias docs](https://developers.gorgias.com/reference/list-ticket-tags.md) |
| `tickets.listTickets` | `GET` | `/api/tickets` | [Gorgias docs](https://developers.gorgias.com/reference/list-tickets.md) |
| `tickets.updateTicket` | `PUT` | `/api/tickets/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-ticket.md) |
| `tickets.updateTicketCustomField` | `PUT` | `/api/tickets/{ticket_id}/custom-fields/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-ticket-custom-field.md) |
| `tickets.updateTicketCustomFields` | `PUT` | `/api/tickets/{ticket_id}/custom-fields` | [Gorgias docs](https://developers.gorgias.com/reference/update-ticket-custom-fields.md) |
| `tickets.updateTicketTags` | `PUT` | `/api/tickets/{ticket_id}/tags` | [Gorgias docs](https://developers.gorgias.com/reference/update-ticket-tags.md) |

### users

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `users.createUser` | `POST` | `/api/users` | [Gorgias docs](https://developers.gorgias.com/reference/create-user.md) |
| `users.deleteUser` | `DELETE` | `/api/users/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-user.md) |
| `users.getUser` | `GET` | `/api/users/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-user.md) |
| `users.listUsers` | `GET` | `/api/users` | [Gorgias docs](https://developers.gorgias.com/reference/list-users.md) |
| `users.updateUser` | `PUT` | `/api/users/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-user.md) |

### views

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `views.createView` | `POST` | `/api/views` | [Gorgias docs](https://developers.gorgias.com/reference/create-view.md) |
| `views.deleteView` | `DELETE` | `/api/views/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-view.md) |
| `views.getView` | `GET` | `/api/views/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-view.md) |
| `views.listViewItems` | `GET` | `/api/views/{view_id}/items` | [Gorgias docs](https://developers.gorgias.com/reference/list-view-items.md) |
| `views.listViews` | `GET` | `/api/views` | [Gorgias docs](https://developers.gorgias.com/reference/list-views.md) |
| `views.updateView` | `PUT` | `/api/views/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-view.md) |
| `views.updateViewItems` | `PUT` | `/api/views/{view_id}/items` | [Gorgias docs](https://developers.gorgias.com/reference/update-view-items.md) |

### voiceCallEvents

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `voiceCallEvents.getVoiceCallEvent` | `GET` | `/api/phone/voice-call-events/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-voice-call-event.md) |
| `voiceCallEvents.listVoiceCallEvents` | `GET` | `/api/phone/voice-call-events` | [Gorgias docs](https://developers.gorgias.com/reference/list-voice-call-events.md) |

### voiceCallRecordings

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `voiceCallRecordings.deleteVoiceCallRecording` | `DELETE` | `/api/phone/voice-call-recordings/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-voice-call-recording.md) |
| `voiceCallRecordings.getVoiceCallRecording` | `GET` | `/api/phone/voice-call-recordings/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-voice-call-recording.md) |
| `voiceCallRecordings.listVoiceCallRecordings` | `GET` | `/api/phone/voice-call-recordings` | [Gorgias docs](https://developers.gorgias.com/reference/list-voice-call-recordings.md) |

### voiceCalls

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `voiceCalls.getVoiceCall` | `GET` | `/api/phone/voice-calls/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-voice-call.md) |
| `voiceCalls.listVoiceCalls` | `GET` | `/api/phone/voice-calls` | [Gorgias docs](https://developers.gorgias.com/reference/list-voice-calls.md) |

### widgets

| Corsair operation | Method | Route | Official reference |
| --- | --- | --- | --- |
| `widgets.createWidget` | `POST` | `/api/widgets` | [Gorgias docs](https://developers.gorgias.com/reference/create-widget.md) |
| `widgets.deleteWidget` | `DELETE` | `/api/widgets/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/delete-widget.md) |
| `widgets.getWidget` | `GET` | `/api/widgets/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/get-widget.md) |
| `widgets.listWidgets` | `GET` | `/api/widgets` | [Gorgias docs](https://developers.gorgias.com/reference/list-widgets.md) |
| `widgets.updateWidget` | `PUT` | `/api/widgets/{id}` | [Gorgias docs](https://developers.gorgias.com/reference/update-widget.md) |

## Documented route notes

- `tickets.listTicketMessages` is documented as deprecated by Gorgias; use `ticketMessages.listMessages` with `query.ticket_id` for new integrations.
- `tickets.updateTicketCustomFields` replaces the ticket’s complete custom-field set, so include all values that should remain.
- `ticketMessages.createTicketMessage` can send a customer-visible message and is classified as destructive.
- The `users.getUser` route's 200 response does not name a schema in its endpoint page; its output is validated against the official [User object](https://developers.gorgias.com/reference/the-user-object).
- Webhook endpoints and public-app OAuth are outside this private-app REST integration. The official index has no REST webhook receiver operation.

## References

- [Gorgias REST API overview](https://developers.gorgias.com/reference/introduction)
- [Authentication](https://developers.gorgias.com/reference/authentication)
- [Pagination](https://developers.gorgias.com/reference/pagination)
- [Rate limits](https://developers.gorgias.com/reference/limitations)
- [Official API index](https://developers.gorgias.com/llms.txt)
