# @corsair-dev/formbricks

Formbricks plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/formbricks
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `actionClasses.create` | `formbricks.api.actionClasses.create` | `write` | Create an action class |
| `actionClasses.list` | `formbricks.api.actionClasses.list` | `read` | List the action classes that can trigger a survey |
| `client.contactsState` | `formbricks.api.client.contactsState` | `write` | Read a respondent's state, creating the contact if the userId is new |
| `client.createDisplay` | `formbricks.api.client.createDisplay` | `write` | Record that a survey was displayed to someone |
| `client.createUser` | `formbricks.api.client.createUser` | `write` | Create a client user |
| `client.environment` | `formbricks.api.client.environment` | `read` | Read the client environment bundle for a workspace |
| `client.identifyUser` | `formbricks.api.client.identifyUser` | `write` | Create or identify a client user |
| `contactAttributeKeys.create` | `formbricks.api.contactAttributeKeys.create` | `write` | Create a contact attribute key |
| `contactAttributeKeys.delete` | `formbricks.api.contactAttributeKeys.delete` | `destructive` | Delete a contact attribute key |
| `contactAttributeKeys.get` | `formbricks.api.contactAttributeKeys.get` | `read` | Get a single contact attribute key |
| `contactAttributeKeys.getClass` | `formbricks.api.contactAttributeKeys.getClass` | `read` | Get an attribute key under the catalog's former "attribute class" name - same route as contactAttributeKeys.get |
| `contactAttributeKeys.list` | `formbricks.api.contactAttributeKeys.list` | `read` | List the contact attribute keys a workspace defines |
| `contactAttributeKeys.listClasses` | `formbricks.api.contactAttributeKeys.listClasses` | `read` | List attribute keys under the catalog's former "attribute class" name - same route as contactAttributeKeys.list |
| `contactAttributeKeys.update` | `formbricks.api.contactAttributeKeys.update` | `write` | Update a contact attribute key's definition - not any contact's values |
| `contactAttributes.list` | `formbricks.api.contactAttributes.list` | `read` | List contact attribute values across contacts |
| `contacts.create` | `formbricks.api.contacts.create` | `write` | Create a contact |
| `contacts.delete` | `formbricks.api.contacts.delete` | `destructive` | Delete a contact, removing a respondent's identity |
| `contacts.get` | `formbricks.api.contacts.get` | `read` | Get a single contact |
| `contacts.getPerson` | `formbricks.api.contacts.getPerson` | `read` | Get a contact under the catalog's former "person" name - same route as contacts.get |
| `contacts.list` | `formbricks.api.contacts.list` | `read` | List the contacts in a workspace |
| `contacts.listPeople` | `formbricks.api.contacts.listPeople` | `read` | List contacts under the catalog's former "people" name - same route as contacts.list |
| `contacts.updateAttributes` | `formbricks.api.contacts.updateAttributes` | `write` | Set a contact's attribute values by userId, creating the contact if it is new |
| `contacts.uploadBulk` | `formbricks.api.contacts.uploadBulk` | `write` | Create many contacts in one request |
| `health.check` | `formbricks.api.health.check` | `read` | Check service health |
| `health.list` | `formbricks.api.health.list` | `read` | Read service health status |
| `me.get` | `formbricks.api.me.get` | `read` | Get the API key's identity, workspaces and organization |
| `me.getAccountInfo` | `formbricks.api.me.getAccountInfo` | `read` | Get account information |
| `me.getManagement` | `formbricks.api.me.getManagement` | `read` | Get the v1 account payload, for a workspace-scoped key only |
| `responses.create` | `formbricks.api.responses.create` | `write` | Record a survey response |
| `responses.delete` | `formbricks.api.responses.delete` | `destructive` | Delete a survey response, erasing a respondent's submitted answers |
| `responses.list` | `formbricks.api.responses.list` | `read` | List survey responses, optionally for one survey |
| `responses.update` | `formbricks.api.responses.update` | `write` | Update a survey response |
| `roles.list` | `formbricks.api.roles.list` | `read` | List the organization roles a member can hold |
| `storage.uploadPrivate` | `formbricks.api.storage.uploadPrivate` | `write` | Request an upload for a private respondent file |
| `storage.uploadPublic` | `formbricks.api.storage.uploadPublic` | `write` | Request an upload for a public file |
| `surveys.create` | `formbricks.api.surveys.create` | `write` | Create a survey |
| `surveys.delete` | `formbricks.api.surveys.delete` | `destructive` | Delete a survey and the responses collected against it |
| `surveys.list` | `formbricks.api.surveys.list` | `read` | List the surveys in a workspace |
| `surveys.update` | `formbricks.api.surveys.update` | `write` | Update a survey |
| `teams.delete` | `formbricks.api.teams.delete` | `destructive` | Delete a team, removing the workspace access it granted |
| `teams.list` | `formbricks.api.teams.list` | `read` | List the teams in an organization |
| `teams.listWorkspaceTeams` | `formbricks.api.teams.listWorkspaceTeams` | `read` | List which teams have access to which workspace |
| `webhooks.create` | `formbricks.api.webhooks.create` | `write` | Create a webhook and receive its signing secret |
| `webhooks.delete` | `formbricks.api.webhooks.delete` | `destructive` | Delete a webhook, invalidating its signing secret |
| `webhooks.get` | `formbricks.api.webhooks.get` | `read` | Get a single webhook |
| `webhooks.list` | `formbricks.api.webhooks.list` | `read` | List the webhooks on a workspace |
| `webhooks.update` | `formbricks.api.webhooks.update` | `write` | Update a webhook |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/formbricks

## License

Apache-2.0
