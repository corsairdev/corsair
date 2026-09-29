# @corsair-dev/activecampaign

ActiveCampaign plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/activecampaign
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accountContacts.create` | `activecampaign.api.accountContacts.create` | `write` | Link a contact to an account with an optional job title |
| `accountContacts.delete` | `activecampaign.api.accountContacts.delete` | `destructive` | Remove the link between an account and a contact |
| `accountContacts.get` | `activecampaign.api.accountContacts.get` | `read` | Retrieve an account-contact association by its ID |
| `accountContacts.list` | `activecampaign.api.accountContacts.list` | `read` | List associations between accounts and contacts |
| `accountContacts.update` | `activecampaign.api.accountContacts.update` | `write` | Update an account-contact association |
| `accountCustomFieldData.create` | `activecampaign.api.accountCustomFieldData.create` | `write` | Set a custom field value on an account |
| `accountCustomFieldData.createBulk` | `activecampaign.api.accountCustomFieldData.createBulk` | `write` | Set many account custom field values in one request |
| `accountCustomFieldData.delete` | `activecampaign.api.accountCustomFieldData.delete` | `destructive` | Delete a custom field value from an account |
| `accountCustomFieldData.get` | `activecampaign.api.accountCustomFieldData.get` | `read` | Retrieve an account custom field value by its ID |
| `accountCustomFieldData.list` | `activecampaign.api.accountCustomFieldData.list` | `read` | List custom field values stored against accounts |
| `accountCustomFieldData.update` | `activecampaign.api.accountCustomFieldData.update` | `write` | Update a custom field value on an account |
| `accountCustomFieldData.updateBulk` | `activecampaign.api.accountCustomFieldData.updateBulk` | `write` | Update many account custom field values in one request |
| `accountCustomFieldMeta.create` | `activecampaign.api.accountCustomFieldMeta.create` | `write` | Define a new custom field for accounts |
| `accountCustomFieldMeta.delete` | `activecampaign.api.accountCustomFieldMeta.delete` | `destructive` | Delete an account custom field definition |
| `accountCustomFieldMeta.get` | `activecampaign.api.accountCustomFieldMeta.get` | `read` | Retrieve an account custom field definition by its ID |
| `accountCustomFieldMeta.list` | `activecampaign.api.accountCustomFieldMeta.list` | `read` | List custom field definitions for accounts |
| `accountCustomFieldMeta.update` | `activecampaign.api.accountCustomFieldMeta.update` | `write` | Update an account custom field definition |
| `accounts.create` | `activecampaign.api.accounts.create` | `write` | Create a CRM account with a unique name |
| `accounts.delete` | `activecampaign.api.accounts.delete` | `destructive` | Delete a CRM account and its associated data |
| `accounts.deleteBulk` | `activecampaign.api.accounts.deleteBulk` | `destructive` | Delete many CRM accounts in one request |
| `accounts.get` | `activecampaign.api.accounts.get` | `read` | Retrieve a CRM account by its ID |
| `accounts.list` | `activecampaign.api.accounts.list` | `read` | List CRM accounts, optionally filtered by name |
| `accounts.update` | `activecampaign.api.accounts.update` | `write` | Update an existing CRM account by its ID |
| `accounts.upsert` | `activecampaign.api.accounts.upsert` | `write` | Create a CRM account, or update the one with the same name |
| `activities.list` | `activecampaign.api.activities.list` | `read` | List account activity, optionally narrowed to one contact |
| `addresses.create` | `activecampaign.api.addresses.create` | `write` | Create a company address for campaign footers |
| `addresses.delete` | `activecampaign.api.addresses.delete` | `destructive` | Delete a company address by its ID |
| `addresses.get` | `activecampaign.api.addresses.get` | `read` | Retrieve a company address by its ID |
| `addresses.list` | `activecampaign.api.addresses.list` | `read` | List the company addresses used in campaigns |
| `addresses.update` | `activecampaign.api.addresses.update` | `write` | Update an existing company address |
| `addressGroups.delete` | `activecampaign.api.addressGroups.delete` | `destructive` | Delete an address group by its ID |
| `automations.list` | `activecampaign.api.automations.list` | `read` | List automation workflows |
| `brandings.get` | `activecampaign.api.brandings.get` | `read` | Retrieve a branding configuration by its ID |
| `brandings.update` | `activecampaign.api.brandings.update` | `write` | Update branding such as site name, logo and favicon |
| `browseSessions.addToCart` | `activecampaign.api.browseSessions.addToCart` | `write` | Flag a browse session as having items added to cart |
| `browseSessions.save` | `activecampaign.api.browseSessions.save` | `write` | Create a browse session in a specified state |
| `browseSessions.search` | `activecampaign.api.browseSessions.search` | `read` | Search browse sessions for a contact and connection |
| `browseSessions.testEvent` | `activecampaign.api.browseSessions.testEvent` | `write` | Simulate a tracking event and return its debug output |
| `calendars.create` | `activecampaign.api.calendars.create` | `write` | Create a calendar feed for external calendar apps |
| `calendars.delete` | `activecampaign.api.calendars.delete` | `destructive` | Delete a calendar feed by its ID |
| `calendars.get` | `activecampaign.api.calendars.get` | `read` | Retrieve a calendar feed by its ID |
| `calendars.list` | `activecampaign.api.calendars.list` | `read` | List calendar feeds configured on the account |
| `calendars.update` | `activecampaign.api.calendars.update` | `write` | Update a calendar feed by its ID |
| `campaigns.create` | `activecampaign.api.campaigns.create` | `write` | Create a broadcast or automation campaign |
| `campaigns.duplicate` | `activecampaign.api.campaigns.duplicate` | `write` | Duplicate a campaign with its content and configuration |
| `campaigns.get` | `activecampaign.api.campaigns.get` | `read` | Retrieve a campaign by its ID with engagement metrics |
| `campaigns.getAutomationLists` | `activecampaign.api.campaigns.getAutomationLists` | `read` | List the lists a campaign automation sends to |
| `campaigns.getAutomations` | `activecampaign.api.campaigns.getAutomations` | `read` | List automations linked to a campaign |
| `campaigns.getLinks` | `activecampaign.api.campaigns.getLinks` | `read` | List the tracked links belonging to a campaign |
| `campaigns.getMessages` | `activecampaign.api.campaigns.getMessages` | `read` | List the messages attached to a campaign |
| `campaigns.getUser` | `activecampaign.api.campaigns.getUser` | `read` | Retrieve the user who owns a campaign |
| `campaigns.list` | `activecampaign.api.campaigns.list` | `read` | List campaigns with pagination and filters |
| `campaigns.update` | `activecampaign.api.campaigns.update` | `write` | Edit an existing campaign, such as its name |
| `configs.update` | `activecampaign.api.configs.update` | `write` | Update an account configuration value |
| `connections.create` | `activecampaign.api.connections.create` | `write` | Create a connection to an external e-commerce service |
| `connections.delete` | `activecampaign.api.connections.delete` | `destructive` | Delete a connection by its ID |
| `connections.get` | `activecampaign.api.connections.get` | `read` | Retrieve a connection by its ID |
| `connections.list` | `activecampaign.api.connections.list` | `read` | List Deep Data connections to external services |
| `connections.update` | `activecampaign.api.connections.update` | `write` | Update an existing connection |
| `contactAutomations.add` | `activecampaign.api.contactAutomations.add` | `write` | Enrol a contact in an automation by email address |
| `contactAutomations.entryCounts` | `activecampaign.api.contactAutomations.entryCounts` | `read` | Count how many times a contact entered each automation |
| `contactAutomations.get` | `activecampaign.api.contactAutomations.get` | `read` | Retrieve a contact automation enrolment by its ID |
| `contactAutomations.list` | `activecampaign.api.contactAutomations.list` | `read` | List contact enrolments across automations |
| `contactAutomations.remove` | `activecampaign.api.contactAutomations.remove` | `destructive` | Remove a contact from an automation, one run or all |
| `contactDeals.create` | `activecampaign.api.contactDeals.create` | `write` | Add a secondary contact to a deal |
| `contactDeals.delete` | `activecampaign.api.contactDeals.delete` | `destructive` | Remove a secondary contact from a deal |
| `contactDeals.get` | `activecampaign.api.contactDeals.get` | `read` | Retrieve a secondary contact association by its ID |
| `contactDeals.list` | `activecampaign.api.contactDeals.list` | `read` | List secondary contacts associated with deals |
| `contactDeals.update` | `activecampaign.api.contactDeals.update` | `write` | Update a secondary contact association |
| `contactLists.list` | `activecampaign.api.contactLists.list` | `read` | List all contact-to-list memberships |
| `contacts.createOrUpdate` | `activecampaign.api.contacts.createOrUpdate` | `write` | Create a contact, or update it if the email already exists |
| `contacts.delete` | `activecampaign.api.contacts.delete` | `destructive` | Delete a contact by its ID |
| `contacts.find` | `activecampaign.api.contacts.find` | `read` | Find a contact by email address |
| `contacts.get` | `activecampaign.api.contacts.get` | `read` | Retrieve a contact by its ID |
| `contacts.getAccountContacts` | `activecampaign.api.contacts.getAccountContacts` | `read` | List the accounts a contact is associated with |
| `contacts.getAutomations` | `activecampaign.api.contacts.getAutomations` | `read` | List the automations a contact is enrolled in |
| `contacts.getData` | `activecampaign.api.contacts.getData` | `read` | Retrieve the geographic and tracking data of a contact |
| `contacts.getDeals` | `activecampaign.api.contacts.getDeals` | `read` | List the deals associated with a contact |
| `contacts.getFieldValues` | `activecampaign.api.contacts.getFieldValues` | `read` | List the custom field values of a contact |
| `contacts.getGeoIps` | `activecampaign.api.contacts.getGeoIps` | `read` | List the geo IP records associated with a contact |
| `contacts.getGoals` | `activecampaign.api.contacts.getGoals` | `read` | List the automation goals a contact has completed |
| `contacts.getLists` | `activecampaign.api.contacts.getLists` | `read` | List the list memberships of a contact |
| `contacts.getLogs` | `activecampaign.api.contacts.getLogs` | `read` | List the activity log entries for a contact |
| `contacts.getNotes` | `activecampaign.api.contacts.getNotes` | `read` | List the notes attached to a contact |
| `contacts.getOrganization` | `activecampaign.api.contacts.getOrganization` | `read` | Retrieve the organization a contact belongs to |
| `contacts.getPlusAppend` | `activecampaign.api.contacts.getPlusAppend` | `read` | Retrieve third-party enrichment data for a contact |
| `contacts.getScoreValues` | `activecampaign.api.contacts.getScoreValues` | `read` | List the score values of a contact |
| `contacts.getTags` | `activecampaign.api.contacts.getTags` | `read` | List the tags applied to a contact |
| `contacts.getTrackingLogs` | `activecampaign.api.contacts.getTrackingLogs` | `read` | List site and event tracking records for a contact |
| `contacts.list` | `activecampaign.api.contacts.list` | `read` | List contacts with pagination and filters |
| `contacts.update` | `activecampaign.api.contacts.update` | `write` | Update an existing contact by its ID |
| `contactTags.list` | `activecampaign.api.contactTags.list` | `read` | List all contact-to-tag associations |
| `contactTasks.create` | `activecampaign.api.contactTasks.create` | `write` | Create a task against a contact |
| `contactTasks.find` | `activecampaign.api.contactTasks.find` | `read` | Find contact tasks by title, optionally for one contact |
| `customObjectRecords.delete` | `activecampaign.api.customObjectRecords.delete` | `destructive` | Delete a custom object record by its ID |
| `customObjectRecords.deleteByExternalId` | `activecampaign.api.customObjectRecords.deleteByExternalId` | `destructive` | Delete a custom object record by its external ID |
| `customObjectRecords.get` | `activecampaign.api.customObjectRecords.get` | `read` | Retrieve a custom object record by its ID |
| `customObjectRecords.getByExternalId` | `activecampaign.api.customObjectRecords.getByExternalId` | `read` | Retrieve a custom object record by its external ID |
| `customObjectRecords.list` | `activecampaign.api.customObjectRecords.list` | `read` | List the records belonging to a custom object schema |
| `customObjectRecords.upsert` | `activecampaign.api.customObjectRecords.upsert` | `write` | Create or update a custom object record by external ID |
| `customObjectSchemas.create` | `activecampaign.api.customObjectSchemas.create` | `write` | Create a custom object schema |
| `customObjectSchemas.createChild` | `activecampaign.api.customObjectSchemas.createChild` | `write` | Create a child schema under a public parent schema |
| `customObjectSchemas.delete` | `activecampaign.api.customObjectSchemas.delete` | `destructive` | Delete a custom object schema and all its records |
| `customObjectSchemas.get` | `activecampaign.api.customObjectSchemas.get` | `read` | Retrieve a custom object schema by its ID |
| `customObjectSchemas.list` | `activecampaign.api.customObjectSchemas.list` | `read` | List custom object schema definitions |
| `customObjectSchemas.update` | `activecampaign.api.customObjectSchemas.update` | `write` | Update a custom object schema or add field options |
| `dealActivities.list` | `activecampaign.api.dealActivities.list` | `read` | List recent activity across deals |
| `dealCustomFieldData.delete` | `activecampaign.api.dealCustomFieldData.delete` | `destructive` | Delete a custom field value from a deal |
| `dealCustomFieldData.get` | `activecampaign.api.dealCustomFieldData.get` | `read` | Retrieve a deal custom field value by its ID |
| `dealCustomFieldData.list` | `activecampaign.api.dealCustomFieldData.list` | `read` | List custom field values stored against deals |
| `dealCustomFieldData.update` | `activecampaign.api.dealCustomFieldData.update` | `write` | Update a custom field value on a deal |
| `dealCustomFieldMeta.create` | `activecampaign.api.dealCustomFieldMeta.create` | `write` | Create a custom field definition for deals |
| `dealCustomFieldMeta.delete` | `activecampaign.api.dealCustomFieldMeta.delete` | `destructive` | Delete a deal custom field definition |
| `dealCustomFieldMeta.get` | `activecampaign.api.dealCustomFieldMeta.get` | `read` | Retrieve a deal custom field definition by its ID |
| `dealCustomFieldMeta.list` | `activecampaign.api.dealCustomFieldMeta.list` | `read` | List custom field definitions for deals |
| `dealCustomFieldMeta.update` | `activecampaign.api.dealCustomFieldMeta.update` | `write` | Update a deal custom field definition |
| `dealGroups.create` | `activecampaign.api.dealGroups.create` | `write` | Create a deal pipeline with its three default stages |
| `dealGroups.delete` | `activecampaign.api.dealGroups.delete` | `destructive` | Delete a pipeline and every stage and deal in it |
| `dealGroups.get` | `activecampaign.api.dealGroups.get` | `read` | Retrieve a deal pipeline by its ID |
| `dealGroups.list` | `activecampaign.api.dealGroups.list` | `read` | List deal pipelines, optionally filtered by title |
| `dealGroups.update` | `activecampaign.api.dealGroups.update` | `write` | Update a deal pipeline by its ID |
| `dealRoles.create` | `activecampaign.api.dealRoles.create` | `write` | Create a deal role such as Decision Maker |
| `dealRoles.delete` | `activecampaign.api.dealRoles.delete` | `destructive` | Delete a deal role by its ID |
| `dealRoles.list` | `activecampaign.api.dealRoles.list` | `read` | List the roles a contact can hold on a deal |
| `deals.delete` | `activecampaign.api.deals.delete` | `destructive` | Delete a deal by its ID |
| `deals.get` | `activecampaign.api.deals.get` | `read` | Retrieve a deal by its ID |
| `deals.list` | `activecampaign.api.deals.list` | `read` | List deals with pagination and filters |
| `deals.listFiltered` | `activecampaign.api.deals.listFiltered` | `read` | Search deals by title or filter by stage, pipeline, owner or status |
| `deals.update` | `activecampaign.api.deals.update` | `write` | Update an existing deal by its ID |
| `deals.updateOwnersBulk` | `activecampaign.api.deals.updateOwnersBulk` | `write` | Reassign many deals to new owners in one request |
| `dealStages.create` | `activecampaign.api.dealStages.create` | `write` | Create a stage in a deal pipeline |
| `dealStages.delete` | `activecampaign.api.dealStages.delete` | `destructive` | Delete a pipeline stage by its ID |
| `dealStages.deleteWithDeals` | `activecampaign.api.dealStages.deleteWithDeals` | `destructive` | Delete a stage, optionally relocating its deals first |
| `dealStages.get` | `activecampaign.api.dealStages.get` | `read` | Retrieve a pipeline stage by its ID |
| `dealStages.list` | `activecampaign.api.dealStages.list` | `read` | List deal pipeline stages |
| `dealStages.moveDeals` | `activecampaign.api.dealStages.moveDeals` | `write` | Move every deal in one stage to another stage |
| `dealStages.update` | `activecampaign.api.dealStages.update` | `write` | Update a pipeline stage by its ID |
| `dealTasks.create` | `activecampaign.api.dealTasks.create` | `write` | Create a task against a deal, contact or account |
| `dealTasks.delete` | `activecampaign.api.dealTasks.delete` | `destructive` | Delete a deal task by its ID |
| `dealTasks.get` | `activecampaign.api.dealTasks.get` | `read` | Retrieve a deal task by its ID |
| `dealTasks.list` | `activecampaign.api.dealTasks.list` | `read` | List deal tasks with pagination |
| `dealTasks.update` | `activecampaign.api.dealTasks.update` | `write` | Update an existing deal task by its ID |
| `dealTaskTypes.create` | `activecampaign.api.dealTaskTypes.create` | `write` | Create a task type for categorising deal tasks |
| `dealTaskTypes.get` | `activecampaign.api.dealTaskTypes.get` | `read` | Retrieve a deal task type by its ID |
| `dealTaskTypes.list` | `activecampaign.api.dealTaskTypes.list` | `read` | List the task types available for deals |
| `dealTaskTypes.update` | `activecampaign.api.dealTaskTypes.update` | `write` | Update a deal task type by its ID |
| `ecomCustomers.create` | `activecampaign.api.ecomCustomers.create` | `write` | Register an e-commerce customer against a connection |
| `ecomCustomers.delete` | `activecampaign.api.ecomCustomers.delete` | `destructive` | Delete an e-commerce customer and its data |
| `ecomCustomers.get` | `activecampaign.api.ecomCustomers.get` | `read` | Retrieve an e-commerce customer by its ID |
| `ecomCustomers.list` | `activecampaign.api.ecomCustomers.list` | `read` | List e-commerce customers with revenue metrics |
| `ecomCustomers.update` | `activecampaign.api.ecomCustomers.update` | `write` | Update an e-commerce customer record |
| `ecomOrderProducts.get` | `activecampaign.api.ecomOrderProducts.get` | `read` | Retrieve an order product line by its ID |
| `ecomOrderProducts.list` | `activecampaign.api.ecomOrderProducts.list` | `read` | List the products attached to e-commerce orders |
| `ecomOrderProducts.listForOrder` | `activecampaign.api.ecomOrderProducts.listForOrder` | `read` | List the product lines belonging to one order |
| `ecomOrders.create` | `activecampaign.api.ecomOrders.create` | `write` | Record an e-commerce order for automation triggers |
| `ecomOrders.delete` | `activecampaign.api.ecomOrders.delete` | `destructive` | Delete an e-commerce order by its ID |
| `ecomOrders.find` | `activecampaign.api.ecomOrders.find` | `read` | Find one order by its store order ID within a connection |
| `ecomOrders.get` | `activecampaign.api.ecomOrders.get` | `read` | Retrieve an e-commerce order by its ID |
| `ecomOrders.list` | `activecampaign.api.ecomOrders.list` | `read` | List e-commerce orders with pagination |
| `ecomOrders.update` | `activecampaign.api.ecomOrders.update` | `write` | Update an existing e-commerce order |
| `ecomOrders.upsert` | `activecampaign.api.ecomOrders.upsert` | `write` | Create an order, or update the one with the same store order ID. Concurrent upserts for the same connectionid and externalid can duplicate; serialize them or use orders.upsertBulk |
| `emailActivities.list` | `activecampaign.api.emailActivities.list` | `read` | List email activity for a subscriber or deal |
| `eventTrackingEvents.create` | `activecampaign.api.eventTrackingEvents.create` | `write` | Whitelist a new event name for tracking |
| `eventTrackingEvents.delete` | `activecampaign.api.eventTrackingEvents.delete` | `destructive` | Remove an event name from the tracking whitelist |
| `eventTrackingEvents.list` | `activecampaign.api.eventTrackingEvents.list` | `read` | List the whitelisted event tracking event names |
| `fieldOptions.createBulk` | `activecampaign.api.fieldOptions.createBulk` | `write` | Create options in bulk for a dropdown or listbox field |
| `fieldRels.create` | `activecampaign.api.fieldRels.create` | `write` | Associate a custom field with a list |
| `fieldRels.delete` | `activecampaign.api.fieldRels.delete` | `destructive` | Remove the association between a custom field and a list |
| `fieldRels.list` | `activecampaign.api.fieldRels.list` | `read` | List relationships between custom fields and lists |
| `fields.create` | `activecampaign.api.fields.create` | `write` | Create a new custom contact field |
| `fields.delete` | `activecampaign.api.fields.delete` | `destructive` | Delete a custom field and every value stored against it |
| `fields.get` | `activecampaign.api.fields.get` | `read` | Retrieve a custom field definition by its ID |
| `fields.list` | `activecampaign.api.fields.list` | `read` | List custom field definitions with pagination |
| `fields.update` | `activecampaign.api.fields.update` | `write` | Update an existing custom field definition |
| `fieldValues.delete` | `activecampaign.api.fieldValues.delete` | `destructive` | Delete a custom field value by its ID |
| `fieldValues.get` | `activecampaign.api.fieldValues.get` | `read` | Retrieve a single custom field value by its ID |
| `fieldValues.list` | `activecampaign.api.fieldValues.list` | `read` | List custom field values across all contacts |
| `fieldValues.setForContact` | `activecampaign.api.fieldValues.setForContact` | `write` | Set a custom field value on a contact |
| `fieldValues.update` | `activecampaign.api.fieldValues.update` | `write` | Update an existing custom field value by its ID |
| `forms.createOptin` | `activecampaign.api.forms.createOptin` | `write` | Record a form opt-in on behalf of a contact |
| `forms.delete` | `activecampaign.api.forms.delete` | `destructive` | Delete a form and its associated data |
| `forms.get` | `activecampaign.api.forms.get` | `read` | Retrieve a form by its ID |
| `forms.list` | `activecampaign.api.forms.list` | `read` | List forms with their field configuration |
| `groupLimits.list` | `activecampaign.api.groupLimits.list` | `read` | List the resource limits configured per group |
| `groupMembers.create` | `activecampaign.api.groupMembers.create` | `write` | Add a custom field to a display group so it becomes visible |
| `groupMembers.delete` | `activecampaign.api.groupMembers.delete` | `destructive` | Remove a custom field from its display group |
| `groupMembers.list` | `activecampaign.api.groupMembers.list` | `read` | List which custom fields belong to which display groups |
| `groupMembers.update` | `activecampaign.api.groupMembers.update` | `write` | Change the display group or ordering of a custom field |
| `groups.create` | `activecampaign.api.groups.create` | `write` | Create a permission group |
| `groups.delete` | `activecampaign.api.groups.delete` | `destructive` | Delete a permission group by its ID |
| `groups.get` | `activecampaign.api.groups.get` | `read` | Retrieve a permission group by its ID |
| `groups.list` | `activecampaign.api.groups.list` | `read` | List permission groups with their settings |
| `groups.update` | `activecampaign.api.groups.update` | `write` | Update a permission group title or description |
| `imports.createBulk` | `activecampaign.api.imports.createBulk` | `write` | Queue up to 250 contacts per call (payload under 400 KB) for asynchronous import |
| `imports.getStatus` | `activecampaign.api.imports.getStatus` | `read` | Retrieve the progress of a single import batch by its ID |
| `imports.list` | `activecampaign.api.imports.list` | `read` | List outstanding and recently completed import batches |
| `imports.listAggregate` | `activecampaign.api.imports.listAggregate` | `read` | Retrieve aggregate progress across all bulk import batches |
| `listGroups.create` | `activecampaign.api.listGroups.create` | `write` | Grant a user group permissions over a mailing list |
| `lists.create` | `activecampaign.api.lists.create` | `write` | Create a new mailing list |
| `lists.delete` | `activecampaign.api.lists.delete` | `destructive` | Delete a mailing list by its ID |
| `lists.get` | `activecampaign.api.lists.get` | `read` | Retrieve a mailing list by its ID |
| `lists.list` | `activecampaign.api.lists.list` | `read` | List mailing lists with pagination |
| `lists.updateSubscription` | `activecampaign.api.lists.updateSubscription` | `write` | Subscribe or unsubscribe a contact to or from a list |
| `messages.create` | `activecampaign.api.messages.create` | `write` | Create an email message with subject, sender and content |
| `messages.delete` | `activecampaign.api.messages.delete` | `destructive` | Delete an email message by its ID |
| `messages.get` | `activecampaign.api.messages.get` | `read` | Retrieve an email message by its ID |
| `messages.list` | `activecampaign.api.messages.list` | `read` | List email messages with pagination |
| `messages.update` | `activecampaign.api.messages.update` | `write` | Update an existing email message |
| `notes.addToContact` | `activecampaign.api.notes.addToContact` | `write` | Add a note to a contact identified by email address |
| `notes.create` | `activecampaign.api.notes.create` | `write` | Create a note against a contact, deal or account |
| `notes.createForAccount` | `activecampaign.api.notes.createForAccount` | `write` | Add a note to a CRM account |
| `notes.createForDeal` | `activecampaign.api.notes.createForDeal` | `write` | Add a note to a deal |
| `notes.delete` | `activecampaign.api.notes.delete` | `destructive` | Delete a note by its ID |
| `notes.get` | `activecampaign.api.notes.get` | `read` | Retrieve a note by its ID |
| `notes.list` | `activecampaign.api.notes.list` | `read` | List notes across contacts, deals and accounts |
| `notes.update` | `activecampaign.api.notes.update` | `write` | Update the body of an existing note |
| `notes.updateForAccount` | `activecampaign.api.notes.updateForAccount` | `write` | Update a note attached to a CRM account |
| `notes.updateForDeal` | `activecampaign.api.notes.updateForDeal` | `write` | Update a note attached to a deal |
| `orders.upsertBulk` | `activecampaign.api.orders.upsertBulk` | `write` | Create or update many orders synchronously |
| `orders.upsertBulkAsync` | `activecampaign.api.orders.upsertBulkAsync` | `write` | Create or update many orders asynchronously |
| `personalizations.create` | `activecampaign.api.personalizations.create` | `write` | Create a personalization variable |
| `personalizations.delete` | `activecampaign.api.personalizations.delete` | `destructive` | Delete a personalization variable |
| `personalizations.deleteBulk` | `activecampaign.api.personalizations.deleteBulk` | `destructive` | Delete many personalization variables at once |
| `personalizations.get` | `activecampaign.api.personalizations.get` | `read` | Retrieve a personalization variable by its ID |
| `personalizations.list` | `activecampaign.api.personalizations.list` | `read` | List personalization variables |
| `personalizations.lock` | `activecampaign.api.personalizations.lock` | `write` | Lock a personalization variable against edits |
| `personalizations.unlock` | `activecampaign.api.personalizations.unlock` | `write` | Unlock a personalization variable for editing |
| `personalizations.update` | `activecampaign.api.personalizations.update` | `write` | Edit an existing personalization variable |
| `products.create` | `activecampaign.api.products.create` | `write` | Create a product in the e-commerce catalog |
| `products.delete` | `activecampaign.api.products.delete` | `destructive` | Delete a product from the e-commerce catalog |
| `products.get` | `activecampaign.api.products.get` | `read` | Retrieve a catalog product by its ID |
| `products.search` | `activecampaign.api.products.search` | `read` | Search the e-commerce product catalog |
| `products.update` | `activecampaign.api.products.update` | `write` | Update a catalog product |
| `products.upsertBulk` | `activecampaign.api.products.upsertBulk` | `write` | Create or update many catalog products in one request |
| `recurringPayments.search` | `activecampaign.api.recurringPayments.search` | `read` | Search recurring payment records by filter |
| `recurringPayments.upsertBulk` | `activecampaign.api.recurringPayments.upsertBulk` | `write` | Create or update many recurring payments at once |
| `savedResponses.create` | `activecampaign.api.savedResponses.create` | `write` | Create a reusable saved response template |
| `savedResponses.delete` | `activecampaign.api.savedResponses.delete` | `destructive` | Delete a saved response template |
| `savedResponses.get` | `activecampaign.api.savedResponses.get` | `read` | Retrieve a saved response by its ID |
| `savedResponses.list` | `activecampaign.api.savedResponses.list` | `read` | List saved response templates |
| `savedResponses.update` | `activecampaign.api.savedResponses.update` | `write` | Update a saved response template |
| `scores.list` | `activecampaign.api.scores.list` | `read` | List the scoring rules configured on the account |
| `segments.create` | `activecampaign.api.segments.create` | `write` | Create a segment with filtering conditions |
| `segments.delete` | `activecampaign.api.segments.delete` | `destructive` | Delete a segment and its history |
| `segments.get` | `activecampaign.api.segments.get` | `read` | Retrieve a segment by its ID |
| `segments.list` | `activecampaign.api.segments.list` | `read` | List contact segments |
| `segments.listAudiences` | `activecampaign.api.segments.listAudiences` | `read` | List saved segment summaries, known as audiences |
| `segments.update` | `activecampaign.api.segments.update` | `write` | Update a segment definition |
| `segmentsV2.countAtTimestamp` | `activecampaign.api.segmentsV2.countAtTimestamp` | `read` | Retrieve segment counts recorded before a timestamp |
| `segmentsV2.countHistory` | `activecampaign.api.segmentsV2.countHistory` | `read` | List historic result counts for one segment |
| `segmentsV2.create` | `activecampaign.api.segmentsV2.create` | `write` | Create an advanced segment with filtering conditions |
| `segmentsV2.delete` | `activecampaign.api.segmentsV2.delete` | `destructive` | Delete a segment and every historic version of it |
| `segmentsV2.get` | `activecampaign.api.segmentsV2.get` | `read` | Retrieve a V2 segment by its UUID |
| `segmentsV2.getAtTimestamp` | `activecampaign.api.segmentsV2.getAtTimestamp` | `read` | Retrieve a segment as it stood at a point in time |
| `segmentsV2.match` | `activecampaign.api.segmentsV2.match` | `read` | Check whether a contact matches a segment |
| `segmentsV2.matchAll` | `activecampaign.api.segmentsV2.matchAll` | `write` | Start a match-all evaluation for every contact in a segment |
| `segmentsV2.matchAllResult` | `activecampaign.api.segmentsV2.matchAllResult` | `read` | Fetch a match-all result set by its run ID |
| `segmentsV2.matchByExternalId` | `activecampaign.api.segmentsV2.matchByExternalId` | `read` | Check segment membership using an external contact ID |
| `segmentsV2.matchSomeResult` | `activecampaign.api.segmentsV2.matchSomeResult` | `read` | Fetch a partial segment match result set by run ID |
| `segmentsV2.recentCounts` | `activecampaign.api.segmentsV2.recentCounts` | `read` | Retrieve the most recent result count per segment |
| `segmentsV2.revertToTimestamp` | `activecampaign.api.segmentsV2.revertToTimestamp` | `write` | Revert a segment to how it looked at a point in time |
| `segmentsV2.update` | `activecampaign.api.segmentsV2.update` | `write` | Update a V2 segment definition |
| `smsBroadcastLists.list` | `activecampaign.api.smsBroadcastLists.list` | `read` | List the SMS broadcast lists available on the account |
| `smsBroadcasts.createSnapshot` | `activecampaign.api.smsBroadcasts.createSnapshot` | `write` | Request a metrics snapshot for specific SMS broadcasts |
| `smsBroadcasts.getFailures` | `activecampaign.api.smsBroadcasts.getFailures` | `read` | Group and count SMS delivery failures for a broadcast |
| `smsBroadcasts.getMetrics` | `activecampaign.api.smsBroadcasts.getMetrics` | `read` | Retrieve delivery metrics for specific SMS broadcasts |
| `smsBroadcasts.getRecipients` | `activecampaign.api.smsBroadcasts.getRecipients` | `read` | List the contacts an SMS broadcast was sent to |
| `smsBroadcasts.getSnapshot` | `activecampaign.api.smsBroadcasts.getSnapshot` | `read` | Retrieve aggregate metrics across all SMS broadcasts |
| `smsBroadcasts.list` | `activecampaign.api.smsBroadcasts.list` | `read` | List SMS broadcasts with optional name and status filters |
| `smsCredits.get` | `activecampaign.api.smsCredits.get` | `read` | Retrieve SMS credit usage and remaining balance |
| `tags.addToContact` | `activecampaign.api.tags.addToContact` | `write` | Apply a tag to a contact |
| `tags.create` | `activecampaign.api.tags.create` | `write` | Create a new tag |
| `tags.delete` | `activecampaign.api.tags.delete` | `destructive` | Delete a tag by its ID |
| `tags.get` | `activecampaign.api.tags.get` | `read` | Retrieve a tag by its ID |
| `tags.list` | `activecampaign.api.tags.list` | `read` | List tags with pagination and search |
| `tags.removeFromContact` | `activecampaign.api.tags.removeFromContact` | `destructive` | Remove a tag from a contact by its contactTag ID |
| `tags.update` | `activecampaign.api.tags.update` | `write` | Update an existing tag by its ID |
| `taskOutcomes.create` | `activecampaign.api.taskOutcomes.create` | `write` | Create a task outcome with an associated sentiment |
| `taskOutcomes.get` | `activecampaign.api.taskOutcomes.get` | `read` | Retrieve a task outcome by its ID |
| `taskOutcomes.list` | `activecampaign.api.taskOutcomes.list` | `read` | List the outcomes that can be assigned to tasks |
| `taskReminders.create` | `activecampaign.api.taskReminders.create` | `write` | Create a reminder ahead of a deal task due date |
| `templates.createShareLink` | `activecampaign.api.templates.createShareLink` | `write` | Create a shareable link for a campaign template |
| `templates.get` | `activecampaign.api.templates.get` | `read` | Retrieve a campaign template by its ID |
| `tracking.addWhitelist` | `activecampaign.api.tracking.addWhitelist` | `write` | Add a domain to the site tracking whitelist |
| `tracking.getCode` | `activecampaign.api.tracking.getCode` | `read` | Retrieve the site tracking JavaScript snippet |
| `tracking.getEventStatus` | `activecampaign.api.tracking.getEventStatus` | `read` | Check whether event tracking is enabled |
| `tracking.getSiteStatus` | `activecampaign.api.tracking.getSiteStatus` | `read` | Check whether site tracking is enabled |
| `tracking.listWhitelist` | `activecampaign.api.tracking.listWhitelist` | `read` | List the domains allowed for site tracking |
| `tracking.removeWhitelist` | `activecampaign.api.tracking.removeWhitelist` | `destructive` | Remove a domain from the site tracking whitelist |
| `tracking.setEventStatus` | `activecampaign.api.tracking.setEventStatus` | `write` | Enable or disable event tracking for the account |
| `tracking.setSiteStatus` | `activecampaign.api.tracking.setSiteStatus` | `write` | Enable or disable site tracking for the account |
| `tracking.trackEvent` | `activecampaign.api.tracking.trackEvent` | `write` | Record a custom event against a contact |
| `users.create` | `activecampaign.api.users.create` | `write` | Create an account user who can sign in |
| `users.delete` | `activecampaign.api.users.delete` | `destructive` | Delete an account user by their ID |
| `users.get` | `activecampaign.api.users.get` | `read` | Retrieve an account user by their ID |
| `users.getByUsername` | `activecampaign.api.users.getByUsername` | `read` | Retrieve an account user by their username |
| `users.getMe` | `activecampaign.api.users.getMe` | `read` | Retrieve the user the API token belongs to |
| `users.list` | `activecampaign.api.users.list` | `read` | List account users with pagination and sorting |
| `users.update` | `activecampaign.api.users.update` | `write` | Update an account user, including group assignment |
| `webhooks.create` | `activecampaign.api.webhooks.create` | `write` | Create a webhook subscription for account events |
| `webhooks.delete` | `activecampaign.api.webhooks.delete` | `destructive` | Delete a webhook subscription by its ID |
| `webhooks.get` | `activecampaign.api.webhooks.get` | `read` | Retrieve a webhook subscription by its ID |
| `webhooks.list` | `activecampaign.api.webhooks.list` | `read` | List configured webhook subscriptions |
| `webhooks.update` | `activecampaign.api.webhooks.update` | `write` | Update a webhook subscription |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/activecampaign

## License

Apache-2.0
