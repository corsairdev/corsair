# @corsair-dev/followupboss

FollowUpBoss plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/followupboss
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.identity` | `followupboss.api.account.identity` | `read` | Get the account identity information behind the authenticated API key |
| `account.me` | `followupboss.api.account.me` | `read` | Get the authenticated user's profile and role |
| `actionPlans.list` | `followupboss.api.actionPlans.list` | `read` | List the account's action plans |
| `actionPlansPeople.create` | `followupboss.api.actionPlansPeople.create` | `write` | Enroll a person into an action plan |
| `actionPlansPeople.list` | `followupboss.api.actionPlansPeople.list` | `read` | List the people enrolled in action plans, filtered by person |
| `actionPlansPeople.update` | `followupboss.api.actionPlansPeople.update` | `write` | Update an action plan enrollment, such as finishing it |
| `appointmentOutcomes.create` | `followupboss.api.appointmentOutcomes.create` | `write` | Create an appointment outcome with an optional sort order |
| `appointmentOutcomes.delete` | `followupboss.api.appointmentOutcomes.delete` | `destructive` | Delete an appointment outcome after reassigning its appointments to another outcome |
| `appointmentOutcomes.get` | `followupboss.api.appointmentOutcomes.get` | `read` | Get one appointment outcome by ID |
| `appointmentOutcomes.list` | `followupboss.api.appointmentOutcomes.list` | `read` | List the outcomes that appointments can be closed with |
| `appointmentOutcomes.update` | `followupboss.api.appointmentOutcomes.update` | `write` | Update an appointment outcome's name or sort order |
| `appointments.create` | `followupboss.api.appointments.create` | `write` | Create an appointment with invitees, optionally sending them invitations |
| `appointments.delete` | `followupboss.api.appointments.delete` | `destructive` | Permanently delete an appointment |
| `appointments.get` | `followupboss.api.appointments.get` | `read` | Get one appointment by ID |
| `appointments.list` | `followupboss.api.appointments.list` | `read` | List appointments, filtered by person, user or date range, paged |
| `appointments.update` | `followupboss.api.appointments.update` | `write` | Update an appointment's time, place, type or invitees |
| `appointmentTypes.create` | `followupboss.api.appointmentTypes.create` | `write` | Create an appointment type with an optional sort order |
| `appointmentTypes.delete` | `followupboss.api.appointmentTypes.delete` | `destructive` | Delete an appointment type after reassigning its appointments to another type |
| `appointmentTypes.get` | `followupboss.api.appointmentTypes.get` | `read` | Get one appointment type by ID |
| `appointmentTypes.list` | `followupboss.api.appointmentTypes.list` | `read` | List the appointment types, sorted and paged |
| `appointmentTypes.update` | `followupboss.api.appointmentTypes.update` | `write` | Update an appointment type's name or sort order |
| `automations.get` | `followupboss.api.automations.get` | `read` | Get one automation by ID |
| `automations.list` | `followupboss.api.automations.list` | `read` | List the account's automations |
| `automationsPeople.create` | `followupboss.api.automationsPeople.create` | `write` | Enroll a person into an automation |
| `automationsPeople.get` | `followupboss.api.automationsPeople.get` | `read` | Get one automation enrollment by ID |
| `automationsPeople.list` | `followupboss.api.automationsPeople.list` | `read` | List the people enrolled in automations, filtered by automation |
| `automationsPeople.update` | `followupboss.api.automationsPeople.update` | `write` | Update an automation enrollment, such as finishing it |
| `calls.create` | `followupboss.api.calls.create` | `write` | Log a call on a person with its direction, duration, outcome and note |
| `calls.get` | `followupboss.api.calls.get` | `read` | Get one logged call by ID |
| `calls.list` | `followupboss.api.calls.list` | `read` | List logged calls, filtered by person or phone number, paged |
| `calls.update` | `followupboss.api.calls.update` | `write` | Update a logged call's note, outcome or duration |
| `customFields.create` | `followupboss.api.customFields.create` | `write` | Create a custom field definition for people, with choices for dropdown types |
| `customFields.delete` | `followupboss.api.customFields.delete` | `destructive` | Permanently delete a person custom field definition |
| `customFields.get` | `followupboss.api.customFields.get` | `read` | Get one person custom field definition by ID |
| `customFields.list` | `followupboss.api.customFields.list` | `read` | List the custom fields available on people |
| `customFields.update` | `followupboss.api.customFields.update` | `write` | Update a person custom field's label, choices or visibility |
| `dealAttachments.create` | `followupboss.api.dealAttachments.create` | `write` | Attach an externally hosted file to a deal |
| `dealAttachments.delete` | `followupboss.api.dealAttachments.delete` | `destructive` | Permanently delete a file attachment from a deal |
| `dealAttachments.get` | `followupboss.api.dealAttachments.get` | `read` | Get one file attachment of a deal by ID |
| `dealAttachments.update` | `followupboss.api.dealAttachments.update` | `write` | Update the file URI, name or size of a deal attachment |
| `dealCustomFields.create` | `followupboss.api.dealCustomFields.create` | `write` | Create a custom field definition for deals, with choices for dropdown types |
| `dealCustomFields.delete` | `followupboss.api.dealCustomFields.delete` | `destructive` | Permanently delete a deal custom field definition |
| `dealCustomFields.get` | `followupboss.api.dealCustomFields.get` | `read` | Get one deal custom field definition by ID |
| `dealCustomFields.list` | `followupboss.api.dealCustomFields.list` | `read` | List the custom fields available on deals |
| `dealCustomFields.update` | `followupboss.api.dealCustomFields.update` | `write` | Update a deal custom field's label, choices or visibility |
| `deals.create` | `followupboss.api.deals.create` | `write` | Create a deal on a pipeline stage with a value and description |
| `deals.delete` | `followupboss.api.deals.delete` | `destructive` | Permanently delete a deal |
| `deals.get` | `followupboss.api.deals.get` | `read` | Get one deal by ID with its stage, value and associated people |
| `deals.list` | `followupboss.api.deals.list` | `read` | List deals with their stage, price and people, sorted and paged |
| `deals.update` | `followupboss.api.deals.update` | `write` | Update a deal's stage, value, commission or associated people |
| `emCampaigns.create` | `followupboss.api.emCampaigns.create` | `write` | Create an email marketing campaign with subject and HTML body |
| `emCampaigns.list` | `followupboss.api.emCampaigns.list` | `read` | List the email marketing campaigns, filtered by origin |
| `emCampaigns.update` | `followupboss.api.emCampaigns.update` | `write` | Update an email marketing campaign's name, subject or body |
| `emEvents.create` | `followupboss.api.emEvents.create` | `write` | Record email marketing events against subscriber email addresses |
| `emEvents.list` | `followupboss.api.emEvents.list` | `read` | List email marketing events such as sends, opens and clicks |
| `events.create` | `followupboss.api.events.create` | `write` | Push a lead event into Follow Up Boss's routing, which creates or matches the person and runs their action plans |
| `events.get` | `followupboss.api.events.get` | `read` | Get one lead event by ID |
| `events.list` | `followupboss.api.events.list` | `read` | List lead events, filtered by person, type or property, paged with the keyset cursor FUB enforces on deep pages |
| `groups.create` | `followupboss.api.groups.create` | `write` | Create a routing group of users with a distribution strategy |
| `groups.delete` | `followupboss.api.groups.delete` | `destructive` | Permanently delete a routing group |
| `groups.get` | `followupboss.api.groups.get` | `read` | Get one routing group by ID |
| `groups.list` | `followupboss.api.groups.list` | `read` | List the routing groups with their distribution strategy |
| `groups.roundRobin` | `followupboss.api.groups.roundRobin` | `read` | Read the round-robin rotation state of the routing groups |
| `groups.update` | `followupboss.api.groups.update` | `write` | Update a routing group's name, members or distribution |
| `inboxApps.addMessage` | `followupboss.api.inboxApps.addMessage` | `write` | Deliver a message from your system into an inbox app conversation |
| `inboxApps.addNote` | `followupboss.api.inboxApps.addNote` | `write` | Add an internal note to an inbox app conversation |
| `inboxApps.addSystemConfirmationMessage` | `followupboss.api.inboxApps.addSystemConfirmationMessage` | `write` | Add a system confirmation message to an inbox app conversation |
| `inboxApps.createParticipant` | `followupboss.api.inboxApps.createParticipant` | `write` | Add a participant to an inbox app conversation |
| `inboxApps.deactivate` | `followupboss.api.inboxApps.deactivate` | `destructive` | Deactivate an inbox app so it stops receiving conversations |
| `inboxApps.deleteParticipant` | `followupboss.api.inboxApps.deleteParticipant` | `destructive` | Remove a participant from an inbox app conversation |
| `inboxApps.getParticipants` | `followupboss.api.inboxApps.getParticipants` | `read` | List the participants of an inbox app conversation |
| `inboxApps.install` | `followupboss.api.inboxApps.install` | `write` | Install a published inbox app for a user with a subscription URL |
| `inboxApps.installedApp` | `followupboss.api.inboxApps.installedApp` | `read` | Read the installation details of a published inbox app |
| `inboxApps.updateConversation` | `followupboss.api.inboxApps.updateConversation` | `write` | Update an inbox app conversation's subject or state |
| `inboxApps.updateMessage` | `followupboss.api.inboxApps.updateMessage` | `write` | Update a message previously delivered to an inbox app conversation |
| `notes.create` | `followupboss.api.notes.create` | `write` | Add a note to a person |
| `notes.delete` | `followupboss.api.notes.delete` | `destructive` | Permanently delete a note |
| `notes.get` | `followupboss.api.notes.get` | `read` | Get one note by ID, optionally with its threaded replies and reactions |
| `notes.update` | `followupboss.api.notes.update` | `write` | Update a note's subject, body or person |
| `people.checkDuplicate` | `followupboss.api.people.checkDuplicate` | `read` | Check whether a person with this email address or phone number already exists, and who they are assigned to, before creating a new lead |
| `people.claim` | `followupboss.api.people.claim` | `write` | Claim an unclaimed lead so it becomes the user's contact |
| `people.create` | `followupboss.api.people.create` | `write` | Create a person, optionally merging into an existing duplicate instead of creating a new lead |
| `people.delete` | `followupboss.api.people.delete` | `destructive` | Permanently delete a person from the account |
| `people.get` | `followupboss.api.people.get` | `read` | Get one person by ID with their contact details, stage, source, tags and timeframes |
| `people.ignoreUnclaimed` | `followupboss.api.people.ignoreUnclaimed` | `write` | Ignore an unclaimed lead so it is no longer offered to the user; the lead answers 204 and is not deleted |
| `people.list` | `followupboss.api.people.list` | `read` | List people with filters such as name, email, phone, stage, source, tags or assignment, sorted and paged |
| `people.unclaimed` | `followupboss.api.people.unclaimed` | `read` | List the unclaimed leads currently offered to the user |
| `people.update` | `followupboss.api.people.update` | `write` | Update one person's contact details, stage, price, assignment, tags, timeframes or custom fields |
| `peopleRelationships.create` | `followupboss.api.peopleRelationships.create` | `write` | Create a partner relationship attached to a person |
| `peopleRelationships.delete` | `followupboss.api.peopleRelationships.delete` | `destructive` | Permanently delete a partner relationship |
| `peopleRelationships.get` | `followupboss.api.peopleRelationships.get` | `read` | Get one partner relationship by ID |
| `peopleRelationships.list` | `followupboss.api.peopleRelationships.list` | `read` | List the partner relationships of people, filtered by person or name |
| `peopleRelationships.update` | `followupboss.api.peopleRelationships.update` | `write` | Update the name, type or contact details of a relationship |
| `personAttachments.create` | `followupboss.api.personAttachments.create` | `write` | Attach an externally hosted file to a person |
| `personAttachments.delete` | `followupboss.api.personAttachments.delete` | `destructive` | Permanently delete a file attachment from a person |
| `personAttachments.get` | `followupboss.api.personAttachments.get` | `read` | Get one file attachment of a person by ID |
| `personAttachments.update` | `followupboss.api.personAttachments.update` | `write` | Update the file URI, name or size of a person attachment |
| `pipelines.create` | `followupboss.api.pipelines.create` | `write` | Create a deal pipeline with an optional stage list |
| `pipelines.delete` | `followupboss.api.pipelines.delete` | `destructive` | Permanently delete a deal pipeline |
| `pipelines.get` | `followupboss.api.pipelines.get` | `read` | Get one deal pipeline by ID |
| `pipelines.list` | `followupboss.api.pipelines.list` | `read` | List the deal pipelines with their stages and order |
| `pipelines.update` | `followupboss.api.pipelines.update` | `write` | Update a pipeline's name, description or stage order |
| `ponds.create` | `followupboss.api.ponds.create` | `write` | Create a pond with the users whose leads land in it |
| `ponds.delete` | `followupboss.api.ponds.delete` | `destructive` | Permanently delete a pond |
| `ponds.get` | `followupboss.api.ponds.get` | `read` | Get one pond by ID with its assigned users |
| `ponds.list` | `followupboss.api.ponds.list` | `read` | List the ponds, the lead pools that distribute new contacts to agents |
| `ponds.update` | `followupboss.api.ponds.update` | `write` | Update a pond's name or assigned users |
| `rateLimit.limits` | `followupboss.api.rateLimit.limits` | `read` | Read the rate-limit levels currently configured for this system |
| `rateLimit.usage` | `followupboss.api.rateLimit.usage` | `read` | Read this system's 24-hour API usage totals and rate-limit statistics |
| `reactions.create` | `followupboss.api.reactions.create` | `write` | Add a reaction to a note or other reference |
| `reactions.delete` | `followupboss.api.reactions.delete` | `destructive` | Remove a reaction, sending the documented delete body |
| `reactions.get` | `followupboss.api.reactions.get` | `read` | Get the reactions attached to a note |
| `smartLists.get` | `followupboss.api.smartLists.get` | `read` | Get one smart list by ID |
| `smartLists.list` | `followupboss.api.smartLists.list` | `read` | List the account smart lists, paged |
| `stages.create` | `followupboss.api.stages.create` | `write` | Create a deal stage with an optional sort order |
| `stages.delete` | `followupboss.api.stages.delete` | `destructive` | Delete a deal stage after reassigning its action plans to another stage |
| `stages.get` | `followupboss.api.stages.get` | `read` | Get one deal stage by ID |
| `stages.list` | `followupboss.api.stages.list` | `read` | List the deal stages across pipelines with their order weight |
| `stages.update` | `followupboss.api.stages.update` | `write` | Update a deal stage's name or sort order |
| `tasks.create` | `followupboss.api.tasks.create` | `write` | Create a task such as a follow-up on a person |
| `tasks.delete` | `followupboss.api.tasks.delete` | `destructive` | Permanently delete a task |
| `tasks.get` | `followupboss.api.tasks.get` | `read` | Get one task by ID with its type, due date and completion status |
| `tasks.list` | `followupboss.api.tasks.list` | `read` | List tasks, filtered by person, assignee, type or due range, paged |
| `tasks.update` | `followupboss.api.tasks.update` | `write` | Update a task's name, type, due date or completion |
| `teamInboxes.list` | `followupboss.api.teamInboxes.list` | `read` | List the team inboxes available in the account |
| `teams.create` | `followupboss.api.teams.create` | `write` | Create a team with members and leaders |
| `teams.delete` | `followupboss.api.teams.delete` | `destructive` | Permanently delete a team |
| `teams.get` | `followupboss.api.teams.get` | `read` | Get one team by ID with its members and leaders |
| `teams.list` | `followupboss.api.teams.list` | `read` | List the teams in the account with their members |
| `teams.update` | `followupboss.api.teams.update` | `write` | Update a team's name, members or leaders |
| `templates.create` | `followupboss.api.templates.create` | `write` | Create an email template with subject and body, optionally shared |
| `templates.delete` | `followupboss.api.templates.delete` | `destructive` | Permanently delete an email template |
| `templates.get` | `followupboss.api.templates.get` | `read` | Get one email template by ID |
| `templates.list` | `followupboss.api.templates.list` | `read` | List the email message templates, paged |
| `templates.merge` | `followupboss.api.templates.merge` | `write` | Render an email template for a person, merging their fields into the body |
| `templates.update` | `followupboss.api.templates.update` | `write` | Replace an email template's name, subject and body |
| `textMessages.create` | `followupboss.api.textMessages.create` | `write` | Log a text message on a person with its direction and byline details |
| `textMessages.get` | `followupboss.api.textMessages.get` | `read` | Get one text message by ID |
| `textMessages.list` | `followupboss.api.textMessages.list` | `read` | List text messages, filtered by person or phone number, paged |
| `textMessageTemplates.create` | `followupboss.api.textMessageTemplates.create` | `write` | Create a text message template, optionally shared |
| `textMessageTemplates.delete` | `followupboss.api.textMessageTemplates.delete` | `destructive` | Permanently delete a text message template |
| `textMessageTemplates.get` | `followupboss.api.textMessageTemplates.get` | `read` | Get one text message template by ID |
| `textMessageTemplates.list` | `followupboss.api.textMessageTemplates.list` | `read` | List the text message templates, paged |
| `textMessageTemplates.merge` | `followupboss.api.textMessageTemplates.merge` | `write` | Render a text message template for a person, merging their fields into the message |
| `textMessageTemplates.update` | `followupboss.api.textMessageTemplates.update` | `write` | Update a text message template's name or message |
| `threadedReplies.get` | `followupboss.api.threadedReplies.get` | `read` | Get the threaded replies of a note |
| `timeframes.list` | `followupboss.api.timeframes.list` | `read` | List the named timeframes available for people |
| `users.delete` | `followupboss.api.users.delete` | `destructive` | Permanently remove a user from the account |
| `users.get` | `followupboss.api.users.get` | `read` | Get one user by ID with their role and contact details |
| `users.list` | `followupboss.api.users.list` | `read` | List the users of the account with their roles |
| `webhookEvents.get` | `followupboss.api.webhookEvents.get` | `read` | List the delivery events recorded for one webhook subscription |
| `webhooks.create` | `followupboss.api.webhooks.create` | `write` | Subscribe a URL to one Follow Up Boss event |
| `webhooks.delete` | `followupboss.api.webhooks.delete` | `destructive` | Permanently delete a webhook subscription |
| `webhooks.get` | `followupboss.api.webhooks.get` | `read` | Get one webhook subscription by ID |
| `webhooks.list` | `followupboss.api.webhooks.list` | `read` | List the webhook subscriptions of the account |
| `webhooks.update` | `followupboss.api.webhooks.update` | `write` | Update a webhook subscription's URL or event type |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/followupboss

## License

Apache-2.0
