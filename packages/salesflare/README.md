# @corsair-dev/salesflare

Salesflare plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/salesflare
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.addAccountContacts` | `salesflare.api.accounts.addAccountContacts` | `write` | Link contacts to an account |
| `accounts.addAccountUsers` | `salesflare.api.accounts.addAccountUsers` | `write` | Add users to an account |
| `accounts.createAccount` | `salesflare.api.accounts.createAccount` | `write` | Create a new account |
| `accounts.deleteAccount` | `salesflare.api.accounts.deleteAccount` | `destructive` | Delete a account |
| `accounts.listAccountFeed` | `salesflare.api.accounts.listAccountFeed` | `read` | List the activity feed of an account |
| `accounts.listAccountMessages` | `salesflare.api.accounts.listAccountMessages` | `read` | List messages on an account |
| `accounts.listAccounts` | `salesflare.api.accounts.listAccounts` | `read` | List Accounts |
| `accounts.retrieveAccount` | `salesflare.api.accounts.retrieveAccount` | `read` | Retrieve a single account by ID |
| `accounts.updateAccount` | `salesflare.api.accounts.updateAccount` | `write` | Update a account |
| `accounts.updateAccountContacts` | `salesflare.api.accounts.updateAccountContacts` | `write` | Update the contact links of an account |
| `accounts.updateAccountUsers` | `salesflare.api.accounts.updateAccountUsers` | `write` | Update the users assigned to an account |
| `calls.createCall` | `salesflare.api.calls.createCall` | `write` | Create a new call |
| `calls.updateCall` | `salesflare.api.calls.updateCall` | `write` | Update a logged call |
| `campaigns.listCampaignMergeFields` | `salesflare.api.campaigns.listCampaignMergeFields` | `read` | List the merge fields available for campaigns |
| `contacts.createContact` | `salesflare.api.contacts.createContact` | `write` | Create a new contact |
| `contacts.deleteContact` | `salesflare.api.contacts.deleteContact` | `destructive` | Delete a contact |
| `contacts.listContacts` | `salesflare.api.contacts.listContacts` | `read` | List Contacts |
| `contacts.retrieveContact` | `salesflare.api.contacts.retrieveContact` | `read` | Retrieve a single contact by ID |
| `contacts.updateContact` | `salesflare.api.contacts.updateContact` | `write` | Update a contact |
| `currencies.listCurrencies` | `salesflare.api.currencies.listCurrencies` | `read` | List Currencies |
| `customfields.createCustomFieldSub` | `salesflare.api.customfields.createCustomFieldSub` | `write` | Create a new customField sub-resource |
| `customfields.deleteCustomField` | `salesflare.api.customfields.deleteCustomField` | `destructive` | Delete a customField |
| `customfields.listCustomFieldOptions` | `salesflare.api.customfields.listCustomFieldOptions` | `read` | List the options of a custom field |
| `customfields.listCustomFields` | `salesflare.api.customfields.listCustomFields` | `read` | List the custom fields of an item class |
| `customfields.listCustomFieldTypes` | `salesflare.api.customfields.listCustomFieldTypes` | `read` | List the custom field types supported by Salesflare |
| `customfields.retrieveCustomField` | `salesflare.api.customfields.retrieveCustomField` | `read` | Retrieve a single customField by ID |
| `customfields.updateCustomField` | `salesflare.api.customfields.updateCustomField` | `write` | Update a customField |
| `datasources.listEmailDataSources` | `salesflare.api.datasources.listEmailDataSources` | `read` | List the connected email data sources |
| `datasources.updateEmailDataSource` | `salesflare.api.datasources.updateEmailDataSource` | `write` | Update a connected email data source |
| `filterfields.listFilterFields` | `salesflare.api.filterfields.listFilterFields` | `read` | List the filter fields available for an entity |
| `groups.listGroups` | `salesflare.api.groups.listGroups` | `read` | List Groups |
| `groups.retrieveGroup` | `salesflare.api.groups.retrieveGroup` | `read` | Retrieve a single group by ID |
| `me.listMyContacts` | `salesflare.api.me.listMyContacts` | `read` | List contacts assigned to the current user |
| `me.retrieveCurrentUser` | `salesflare.api.me.retrieveCurrentUser` | `read` | Retrieve the currently authenticated user |
| `meetings.createMeeting` | `salesflare.api.meetings.createMeeting` | `write` | Create a new meeting |
| `meetings.deleteMeeting` | `salesflare.api.meetings.deleteMeeting` | `destructive` | Delete a meeting |
| `meetings.retrieveMeeting` | `salesflare.api.meetings.retrieveMeeting` | `read` | Retrieve a single meeting by ID |
| `meetings.updateMeeting` | `salesflare.api.meetings.updateMeeting` | `write` | Update a meeting |
| `messages.createMessage` | `salesflare.api.messages.createMessage` | `write` | Create a new message |
| `messages.createMessageFeedback` | `salesflare.api.messages.createMessageFeedback` | `write` | Submit feedback for a message |
| `messages.deleteMessage` | `salesflare.api.messages.deleteMessage` | `destructive` | Delete a message |
| `messages.updateMessage` | `salesflare.api.messages.updateMessage` | `write` | Update a message |
| `opportunities.createOpportunity` | `salesflare.api.opportunities.createOpportunity` | `write` | Create a new opportunity |
| `opportunities.deleteOpportunity` | `salesflare.api.opportunities.deleteOpportunity` | `destructive` | Delete a opportunity |
| `opportunities.listOpportunities` | `salesflare.api.opportunities.listOpportunities` | `read` | List Opportunities |
| `opportunities.retrieveOpportunity` | `salesflare.api.opportunities.retrieveOpportunity` | `read` | Retrieve a single opportunity by ID |
| `opportunities.updateOpportunity` | `salesflare.api.opportunities.updateOpportunity` | `write` | Update a opportunity |
| `persons.listPersons` | `salesflare.api.persons.listPersons` | `read` | List persons resolved from email addresses |
| `pipelines.listPipelines` | `salesflare.api.pipelines.listPipelines` | `read` | List Pipelines |
| `settings.retrieveAiSettings` | `salesflare.api.settings.retrieveAiSettings` | `read` | Retrieve the workspace's AI settings |
| `settings.updateAiSettings` | `salesflare.api.settings.updateAiSettings` | `write` | Update the workspace's AI settings |
| `stages.listStages` | `salesflare.api.stages.listStages` | `read` | List Stages |
| `stages.retrieveStage` | `salesflare.api.stages.retrieveStage` | `read` | Retrieve a single stage by ID |
| `tags.createTag` | `salesflare.api.tags.createTag` | `write` | Create a new tag |
| `tags.deleteTag` | `salesflare.api.tags.deleteTag` | `destructive` | Delete a tag |
| `tags.listTags` | `salesflare.api.tags.listTags` | `read` | List Tags |
| `tags.listTagUsage` | `salesflare.api.tags.listTagUsage` | `read` | List the usage statistics of a tag |
| `tags.retrieveTag` | `salesflare.api.tags.retrieveTag` | `read` | Retrieve a single tag by ID |
| `tags.updateTag` | `salesflare.api.tags.updateTag` | `write` | Update a tag |
| `tasks.createTask` | `salesflare.api.tasks.createTask` | `write` | Create a new task |
| `tasks.deleteTask` | `salesflare.api.tasks.deleteTask` | `destructive` | Delete a task |
| `tasks.listTasks` | `salesflare.api.tasks.listTasks` | `read` | List Tasks |
| `tasks.updateTask` | `salesflare.api.tasks.updateTask` | `write` | Update a task |
| `users.listUsers` | `salesflare.api.users.listUsers` | `read` | List Users |
| `users.retrieveUser` | `salesflare.api.users.retrieveUser` | `read` | Retrieve a single user by ID |
| `workflows.createWorkflow` | `salesflare.api.workflows.createWorkflow` | `write` | Create a new workflow |
| `workflows.listWorkflows` | `salesflare.api.workflows.listWorkflows` | `read` | List Workflows |
| `workflows.retrieveWorkflow` | `salesflare.api.workflows.retrieveWorkflow` | `read` | Retrieve a single workflow by ID |
| `workflows.updateWorkflow` | `salesflare.api.workflows.updateWorkflow` | `write` | Update a workflow |
| `workflows.updateWorkflowAudience` | `salesflare.api.workflows.updateWorkflowAudience` | `write` | Update the audience record of a workflow |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/salesflare

## License

Apache-2.0
