# @corsair-dev/productboard

Productboard Public REST API v2 integration for Corsair. The plugin covers notes, workspace-configured entities and their relationships, entity field values, member activity, members, teams, Jira integration reads, and PBFM document references.

## Install and authenticate

```bash
pnpm add @corsair-dev/productboard
```

Use a Productboard personal access token as the Corsair `api_key`; requests send it as `Authorization: Bearer <token>`, and include `Accept: application/json`. Personal access tokens are created under **Settings → Integrations → Public APIs → Access Token** and are available on Pro plans and above. Productboard also accepts OAuth access tokens in the same bearer header, so an already-issued OAuth access token can be supplied as the stored bearer credential. This plugin does not issue or refresh OAuth tokens. Its Authentication guide, detailed OAuth guide, and v2 per-route OpenAPI security sections currently publish differing OAuth URL/scope spellings; use a personal access token for the supported default setup and verify scopes with Productboard before enabling OAuth.

Productboard also documents OAuth server-to-server JWT and OAuth for MCP clients (DCR/PKCE). Those specialized credential-issuance flows are not implemented by this plugin.

## Operation matrix

All routes use `https://api.productboard.com/v2`. For operations with query parameters, pass the documented Productboard query keys (including array values such as `type[]`) in `query`. For write operations, pass the documented JSON request envelope in `body`. Path arguments are named in braces below. See each official reference for the complete filters, request fields, OAuth scopes, and response fields.

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
| `documents.get` | `GET /documents/{documentId}` | [Entity/document reference](https://developer.productboard.com/reference/listentities) |
| `documents.replaceContent` | `PUT /documents/{documentId}/content` | [Entity/document reference](https://developer.productboard.com/reference/listentities) |
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

The two Documents API routes are referenced by the entity response schema (`DocumentReferenceFieldValue`) for document-backed rich-text fields. The document identifier is opaque; the API may return 404 for rich-text fields or entity types not yet served by Documents.

## Pagination, limits, and caveats

- List routes expose the provider's cursor and `links.next` response unchanged. Pass the next page's `pageCursor` back in `query`; relationship attributes can have their own pagination links.
- Productboard documents a default rate limit of 50 requests/second per access token. On 429, its `Retry-After` header is retained in Corsair's `ApiError`; the transport and plugin handler avoid duplicate retries.
- Notes and entities use configuration-driven fields. The plugin validates the outer operation input strictly and JSON-validates dynamic `query`/`body` values, while preserving workspace-specific field keys and field values rather than inventing a fixed field list.
- Member and owner PII can be returned as `[redacted]` without the relevant `members:pii:read` OAuth scope. Event logs contain operation names only. Provider error bodies and request payloads are omitted from propagated API errors to avoid leaking note contents or member data.
- `entities.customerScore` is explicitly marked beta by Productboard. Field-value mutations apply to select/tag fields only; STATUS values are not managed by those routes. Deleting a field value can unset or reassign values according to the documented `force`/`replaceWith` query options.
- Writes are not automatically replayed on 5xx or timeout. Deletes are marked destructive.

## Excluded routes

- All webhook subscription management routes (`/webhooks`): webhook delivery/receivers are outside this plugin's scope.
- Authentication/token issuance endpoints and the specialized server-to-server JWT / MCP DCR flows: credentials are supplied through Corsair rather than issued by API operations.

Plugin-integration REST management and connection-state routes are included. Productboard may issue a probe when a plugin integration is created or an enabled action URL is updated; the plugin does not implement the configured external action callback receiver or webhook delivery. The write-only `action.headers.authorization` secret is never returned, logged, or included in propagated API errors.

No database entities are persisted and no webhooks are registered.

## Reference

- [Productboard Public API v2](https://developer.productboard.com/)
- [Authentication](https://developer.productboard.com/reference/authentication)
- [Pagination](https://developer.productboard.com/reference/pagination)
- [Rate limits](https://developer.productboard.com/reference/rate-limits)

## License

Apache-2.0
