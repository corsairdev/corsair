# @corsair-dev/productboard

Productboard Public REST API v2 integration for Corsair. The plugin covers all 58 REST operations in Productboard's published Notes, Entities, Analytics, Members, Teams, Jira Integrations, Plugin Integrations, and Webhooks API references. The Webhooks API coverage manages subscriptions; it does not implement the external notification receiver.

## Install and authenticate

```bash
pnpm add @corsair-dev/productboard
```

Use a Productboard personal access token as the Corsair `api_key`; requests send it as `Authorization: Bearer <token>`, and include `Accept: application/json`. Personal access tokens are created under **Settings → Integrations → Public APIs → Access Token** and are available on Pro plans and above. This plugin supports API-token authentication only. OAuth login, token issuance, and refresh are unavailable: Productboard's detailed OAuth guide and v2 per-route OpenAPI security sections disagree on authorization/token URLs and scopes, so this integration does not claim an OAuth flow or compatibility for OAuth access tokens.

Productboard also documents OAuth server-to-server JWT and OAuth for MCP clients (DCR/PKCE); neither specialized flow is implemented by this plugin.

## Operation matrix

All 58 supported operations use `https://api.productboard.com/v2`. For operations with query parameters, pass the documented Productboard query keys (including array values such as `type[]`) in `query`. For write operations, pass the documented JSON request envelope in `body`. Path arguments are named in braces below. See each official reference for the complete filters, request fields, OAuth scopes, and response fields.

| Corsair operation | Method and path | Official reference |
| --- | --- | --- |
| `notes.list` | `GET /notes` | [List notes](https://developer.productboard.com/reference/listnotes) |
| `notes.search` | `POST /notes/search` | [Search notes](https://developer.productboard.com/reference/performnotessearch) |
| `notes.create` | `POST /notes` | [Create note](https://developer.productboard.com/reference/createnote) |
| `notes.get` | `GET /notes/{id}` | [Get note](https://developer.productboard.com/reference/getnote) |
| `notes.update` | `PATCH /notes/{id}` | [Update note](https://developer.productboard.com/reference/updatenote) |
| `notes.delete` | `DELETE /notes/{id}` | [Delete note](https://developer.productboard.com/reference/deletenote) |
| `notes.configurations.list` | `GET /notes/configurations` | [List note configurations](https://developer.productboard.com/reference/listnoteconfigurations) |
| `notes.configurations.get` | `GET /notes/configurations/{type}` | [Get note configuration](https://developer.productboard.com/reference/getnoteconfiguration) |
| `notes.relationships.list` | `GET /notes/{id}/relationships` | [List note relationships](https://developer.productboard.com/reference/listnoterelationships) |
| `notes.relationships.create` | `POST /notes/{id}/relationships` | [Create note relationship](https://developer.productboard.com/reference/createnoterelationship) |
| `notes.relationships.setCustomer` | `PUT /notes/{id}/relationships/customer` | [Set customer relationship](https://developer.productboard.com/reference/replacenotecustomerrelationship) |
| `notes.relationships.delete` | `DELETE /notes/{id}/relationships/{targetType}/{targetId}` | [Delete note relationship](https://developer.productboard.com/reference/delete-note-relationship) |
| `entities.list` | `GET /entities` | [List entities](https://developer.productboard.com/reference/listentities) |
| `entities.search` | `POST /entities/search` | [Search entities](https://developer.productboard.com/reference/performentitiessearch) |
| `entities.create` | `POST /entities` | [Create entity](https://developer.productboard.com/reference/createentity) |
| `entities.get` | `GET /entities/{id}` | [Get entity](https://developer.productboard.com/reference/getentity) |
| `entities.update` | `PATCH /entities/{id}` | [Update entity](https://developer.productboard.com/reference/updateentity) |
| `entities.delete` | `DELETE /entities/{id}` | [Delete entity](https://developer.productboard.com/reference/deleteentity) |
| `entities.configurations.list` | `GET /entities/configurations` | [List entity configurations](https://developer.productboard.com/reference/listentityconfigurations) |
| `entities.configurations.get` | `GET /entities/configurations/{type}` | [Get entity configuration](https://developer.productboard.com/reference/getentityconfiguration) |
| `entities.relationships.list` | `GET /entities/{id}/relationships` | [List entity relationships](https://developer.productboard.com/reference/listentityrelationships) |
| `entities.relationships.create` | `POST /entities/{id}/relationships` | [Create entity relationship](https://developer.productboard.com/reference/createentityrelationship) |
| `entities.relationships.setParent` | `PUT /entities/{id}/relationships/parent` | [Set parent relationship](https://developer.productboard.com/reference/replaceentityrelationship) |
| `entities.relationships.delete` | `DELETE /entities/{id}/relationships/{type}/{targetId}` | [Delete entity relationship](https://developer.productboard.com/reference/deleteentityrelationship) |
| `entities.fieldValues.list` | `GET /entities/fields/{fieldId}/values` | [List field values](https://developer.productboard.com/reference/listentityfieldvalues) |
| `entities.fieldValues.create` | `POST /entities/fields/{fieldId}/values` | [Create field value](https://developer.productboard.com/reference/createentityfieldvalue) |
| `entities.fieldValues.update` | `PATCH /entities/fields/{fieldId}/values/{valueId}` | [Update field value](https://developer.productboard.com/reference/updateentityfieldvalue) |
| `entities.fieldValues.delete` | `DELETE /entities/fields/{fieldId}/values/{valueId}` | [Delete field value](https://developer.productboard.com/reference/deleteentityfieldvalue) |
| `entities.customerScore` | `GET /entities/{id}/score` | [Customer score (beta)](https://developer.productboard.com/reference/getcustomerscore) |
| `analytics.memberActivities` | `GET /analytics/member-activities` | [List member activities](https://developer.productboard.com/reference/listmemberactivities) |
| `members.list` | `GET /members` | [List members](https://developer.productboard.com/reference/listmembers) |
| `members.search` | `POST /members/search` | [Search members](https://developer.productboard.com/reference/performmemberssearch) |
| `members.get` | `GET /members/{id}` | [Get member](https://developer.productboard.com/reference/getmember) |
| `teams.list` | `GET /teams` | [List teams](https://developer.productboard.com/reference/listteams) |
| `teams.search` | `POST /teams/search` | [Search teams](https://developer.productboard.com/reference/performteamssearch) |
| `teams.create` | `POST /teams` | [Create team](https://developer.productboard.com/reference/createteam) |
| `teams.get` | `GET /teams/{id}` | [Get team](https://developer.productboard.com/reference/getteam) |
| `teams.update` | `PATCH /teams/{id}` | [Update team](https://developer.productboard.com/reference/updateteam) |
| `teams.delete` | `DELETE /teams/{id}` | [Delete team](https://developer.productboard.com/reference/deleteteam) |
| `teams.members` | `GET /teams/{id}/members` | [List team members](https://developer.productboard.com/reference/listteammembers) |
| `jiraIntegrations.list` | `GET /jira-integrations` | [List Jira integrations](https://developer.productboard.com/reference/listjiraintegrations) |
| `jiraIntegrations.get` | `GET /jira-integrations/{id}` | [Get Jira integration](https://developer.productboard.com/reference/getjiraintegration) |
| `jiraIntegrations.connections` | `GET /jira-integrations/{integrationId}/connections` | [List Jira connections](https://developer.productboard.com/reference/listjiraintegrationconnections) |
| `jiraIntegrations.connection` | `GET /jira-integrations/{integrationId}/connections/{entityId}` | [Get Jira connection](https://developer.productboard.com/reference/getjiraintegrationconnection) |
| `pluginIntegrations.list` | `GET /plugin-integrations` | [List plugin integrations](https://developer.productboard.com/reference/listpluginintegrations) |
| `pluginIntegrations.create` | `POST /plugin-integrations` | [Create plugin integration](https://developer.productboard.com/reference/createpluginintegration) |
| `pluginIntegrations.get` | `GET /plugin-integrations/{integrationId}` | [Get plugin integration](https://developer.productboard.com/reference/getpluginintegration) |
| `pluginIntegrations.update` | `PATCH /plugin-integrations/{integrationId}` | [Update plugin integration](https://developer.productboard.com/reference/updatepluginintegration) |
| `pluginIntegrations.delete` | `DELETE /plugin-integrations/{integrationId}` | [Delete plugin integration](https://developer.productboard.com/reference/deletepluginintegration) |
| `pluginIntegrations.connections.list` | `GET /plugin-integrations/{integrationId}/connections` | [List plugin integration connections](https://developer.productboard.com/reference/listpluginintegrationconnections) |
| `pluginIntegrations.connections.search` | `POST /plugin-integrations/{integrationId}/connections/search` | [Search plugin integration connections](https://developer.productboard.com/reference/searchpluginintegrationconnections) |
| `pluginIntegrations.connections.get` | `GET /plugin-integrations/{integrationId}/connections/{entityId}` | [Get plugin integration connection](https://developer.productboard.com/reference/getpluginintegrationconnection) |
| `pluginIntegrations.connections.update` | `PUT /plugin-integrations/{integrationId}/connections/{entityId}` | [Update plugin integration connection state](https://developer.productboard.com/reference/updatepluginintegrationconnectionstate) |
| `pluginIntegrations.connections.delete` | `DELETE /plugin-integrations/{integrationId}/connections/{entityId}` | [Delete plugin integration connection](https://developer.productboard.com/reference/deletepluginintegrationconnection) |
| `webhooks.list` | `GET /webhooks` | [List webhook subscriptions](https://developer.productboard.com/reference/listwebhooks) |
| `webhooks.create` | `POST /webhooks` | [Create webhook subscription](https://developer.productboard.com/reference/createwebhook) |
| `webhooks.get` | `GET /webhooks/{webhookId}` | [Get webhook subscription](https://developer.productboard.com/reference/getwebhook) |
| `webhooks.delete` | `DELETE /webhooks/{webhookId}` | [Delete webhook subscription](https://developer.productboard.com/reference/deletewebhook) |

The official reference index currently lists these 58 operations across the eight API groups: Notes (12), Entities (17), Analytics (1), Members (3), Teams (7), Jira Integrations (4), Plugin Integrations (10), and Webhooks (4). The method/path test keeps an independent copy of the complete inventory, and a README test checks that every implemented operation has its own matrix row and first-party URL.

## Excluded routes and surfaces

| Surface | First-party reference | Why it is not an implemented operation |
| --- | --- | --- |
| Documents: `GET /v2/documents/{documentId}` and `PUT /v2/documents/{documentId}/content` | [Entity reference](https://developer.productboard.com/reference/listentities); [October 8 changelog](https://developer.productboard.com/changelog/2026-10-08.md); [published OpenAPI groups](https://developer.productboard.com/reference/explore-with-postman) | The entity reference and changelog establish opaque document IDs, these paths, PBFM content, and possible 404s, but Productboard publishes no Documents OpenAPI group or complete standalone auth/access, request, and response contracts. They remain excluded until Productboard publishes or confirms those contracts. |
| OAuth setup: `GET /oauth2/authorize`, `POST /oauth2/token`, `GET /oauth2/token/info`, `POST /oauth2/revoke`; server-to-server `POST {APP_DEFAULT_URL}/oauth2/token` | [Authorization-code guide](https://developer.productboard.com/reference/oauth-authorization-code); [server-to-server guide](https://developer.productboard.com/reference/oauth-server-to-server); [OAuth for MCP clients](https://developer.productboard.com/reference/oauth-public-client); [v2 route security definitions](https://developer.productboard.com/v2/openapi/notes.yaml) | These are authentication setup routes, not Public API v2 resource operations. The guides use `/oauth2/authorize` and `/oauth2/token`, while v2 OpenAPI security definitions use `/oauth/authorize` and `/oauth/token`; the documented scope models also differ. The specialized JWT and MCP DCR flows have separate application/token lifecycles. This plugin therefore supports Productboard personal access tokens only and does not claim OAuth compatibility. |
| Webhook notification callback `POST {notification.url}` | [Create webhook OpenAPI](https://developer.productboard.com/reference/createwebhook) | This is a callback to the customer-configured external HTTPS receiver, not a Productboard route under `/v2`. The issue does not request an inbound receiver. The four subscription-management routes are implemented above. |

## Pagination, limits, and caveats

- List routes expose the provider's cursor and `links.next` response unchanged. Pass the next page's `pageCursor` back in `query`; relationship attributes can have their own pagination links.
- Productboard documents a default rate limit of 50 requests/second per access token. On 429, its `Retry-After` header is retained in Corsair's `ApiError`; the transport and plugin handler avoid duplicate retries.
- Notes and entities use configuration-driven fields. The plugin validates the outer operation input strictly and JSON-validates dynamic `query`/`body` values, while preserving workspace-specific field keys and field values rather than inventing a fixed field list.
- Member and owner PII can be returned as `[redacted]` without the relevant `members:pii:read` OAuth scope. Event logs contain operation names only. Provider error bodies and request payloads are omitted from propagated API errors to avoid leaking note contents or member data.
- `entities.customerScore` is explicitly marked beta by Productboard. Field-value mutations apply to select/tag fields only; STATUS values are not managed by those routes. Deleting a field value can unset or reassign values according to the documented `force`/`replaceWith` query options.
- Writes are not automatically replayed on 5xx or timeout. Deletes are marked destructive.

Plugin-integration REST management, webhook subscription management, and connection-state routes are included. Productboard may issue a probe when a plugin integration is created or an enabled action URL is updated; the plugin does not implement the configured external action callback receiver or webhook delivery. Webhook creation accepts only documented event types and a public HTTPS notification URL. The write-only plugin-action and webhook notification authorization values are never logged or included in propagated API errors; webhook response validation strips any authorization header because Productboard documents it as omitted from responses.

No database entities are persisted and no inbound webhook receiver is registered.

## Reference

- [Productboard Public API v2](https://developer.productboard.com/)
- [Authentication](https://developer.productboard.com/reference/authentication)
- [Pagination](https://developer.productboard.com/reference/pagination)
- [Rate limits](https://developer.productboard.com/reference/rate-limits)
- [Webhook subscriptions](https://developer.productboard.com/reference/listwebhooks)
- [Productboard API OpenAPI groups](https://developer.productboard.com/reference/explore-with-postman)

## License

Apache-2.0
