# @corsair-dev/capsulecrm

Capsule CRM plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/capsulecrm
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activityTypes.get` | `capsulecrm.api.activityTypes.get` | `read` | Get an activity type by ID |
| `activityTypes.list` | `capsulecrm.api.activityTypes.list` | `read` | List activity types |
| `activityTypes.listIcons` | `capsulecrm.api.activityTypes.listIcons` | `read` | List activity type icons |
| `attachments.get` | `capsulecrm.api.attachments.get` | `read` | Download an attachment by ID |
| `attachments.upload` | `capsulecrm.api.attachments.upload` | `write` | Upload an attachment and receive a token |
| `boards.delete` | `capsulecrm.api.boards.delete` | `destructive` | Delete (archive) a board [DESTRUCTIVE] |
| `boards.get` | `capsulecrm.api.boards.get` | `read` | Get a board by ID |
| `boards.list` | `capsulecrm.api.boards.list` | `read` | List boards |
| `boards.listStages` | `capsulecrm.api.boards.listStages` | `read` | List stages on a board |
| `boards.restore` | `capsulecrm.api.boards.restore` | `write` | Restore a deleted board |
| `boards.update` | `capsulecrm.api.boards.update` | `write` | Update a board |
| `categories.create` | `capsulecrm.api.categories.create` | `write` | Create a task category |
| `categories.delete` | `capsulecrm.api.categories.delete` | `destructive` | Delete a category [DESTRUCTIVE] |
| `categories.get` | `capsulecrm.api.categories.get` | `read` | Get a category by ID |
| `categories.list` | `capsulecrm.api.categories.list` | `read` | List task categories |
| `categories.update` | `capsulecrm.api.categories.update` | `write` | Update a category |
| `countries.list` | `capsulecrm.api.countries.list` | `read` | List countries |
| `currencies.list` | `capsulecrm.api.currencies.list` | `read` | List currencies |
| `customFields.create` | `capsulecrm.api.customFields.create` | `write` | Create a custom field definition |
| `customFields.delete` | `capsulecrm.api.customFields.delete` | `destructive` | Delete a custom field definition [DESTRUCTIVE] |
| `customFields.get` | `capsulecrm.api.customFields.get` | `read` | Get a custom field definition |
| `customFields.list` | `capsulecrm.api.customFields.list` | `read` | List custom field definitions for an entity type |
| `customFields.update` | `capsulecrm.api.customFields.update` | `write` | Update a custom field definition |
| `entries.create` | `capsulecrm.api.entries.create` | `write` | Create a note entry |
| `entries.delete` | `capsulecrm.api.entries.delete` | `destructive` | Delete an entry [DESTRUCTIVE] |
| `entries.get` | `capsulecrm.api.entries.get` | `read` | Get an entry by ID |
| `entries.listByDate` | `capsulecrm.api.entries.listByDate` | `read` | List notes, emails, and completed tasks by date |
| `entries.listForEntity` | `capsulecrm.api.entries.listForEntity` | `read` | List entries for a party, opportunity, or project |
| `entries.update` | `capsulecrm.api.entries.update` | `write` | Update a note or email entry |
| `filters.run` | `capsulecrm.api.filters.run` | `read` | Run a structured filter query |
| `goals.list` | `capsulecrm.api.goals.list` | `read` | List goals |
| `lostReasons.create` | `capsulecrm.api.lostReasons.create` | `write` | Create a lost reason |
| `lostReasons.delete` | `capsulecrm.api.lostReasons.delete` | `destructive` | Delete a lost reason [DESTRUCTIVE] |
| `lostReasons.get` | `capsulecrm.api.lostReasons.get` | `read` | Get a lost reason by ID |
| `lostReasons.list` | `capsulecrm.api.lostReasons.list` | `read` | List lost reasons |
| `lostReasons.update` | `capsulecrm.api.lostReasons.update` | `write` | Update a lost reason |
| `milestones.create` | `capsulecrm.api.milestones.create` | `write` | Create a milestone |
| `milestones.delete` | `capsulecrm.api.milestones.delete` | `destructive` | Delete a milestone [DESTRUCTIVE] |
| `milestones.get` | `capsulecrm.api.milestones.get` | `read` | Get a milestone by ID |
| `milestones.list` | `capsulecrm.api.milestones.list` | `read` | List milestones |
| `milestones.update` | `capsulecrm.api.milestones.update` | `write` | Update a milestone |
| `opportunities.addParty` | `capsulecrm.api.opportunities.addParty` | `write` | Add a party to an opportunity |
| `opportunities.create` | `capsulecrm.api.opportunities.create` | `write` | Create an opportunity |
| `opportunities.delete` | `capsulecrm.api.opportunities.delete` | `destructive` | Delete an opportunity [DESTRUCTIVE] |
| `opportunities.deleteParty` | `capsulecrm.api.opportunities.deleteParty` | `write` | Remove a party from an opportunity |
| `opportunities.get` | `capsulecrm.api.opportunities.get` | `read` | Get an opportunity by ID |
| `opportunities.list` | `capsulecrm.api.opportunities.list` | `read` | List opportunities |
| `opportunities.listDeleted` | `capsulecrm.api.opportunities.listDeleted` | `read` | List deleted or restricted opportunities |
| `opportunities.listParties` | `capsulecrm.api.opportunities.listParties` | `read` | List additional parties on an opportunity |
| `opportunities.listProjects` | `capsulecrm.api.opportunities.listProjects` | `read` | List projects linked to an opportunity |
| `opportunities.search` | `capsulecrm.api.opportunities.search` | `read` | Search opportunities by query string |
| `opportunities.update` | `capsulecrm.api.opportunities.update` | `write` | Update an opportunity |
| `parties.create` | `capsulecrm.api.parties.create` | `write` | Create a person or organisation |
| `parties.delete` | `capsulecrm.api.parties.delete` | `destructive` | Delete a party [DESTRUCTIVE] |
| `parties.get` | `capsulecrm.api.parties.get` | `read` | Get a party by ID |
| `parties.list` | `capsulecrm.api.parties.list` | `read` | List parties (people and organisations) |
| `parties.listDeleted` | `capsulecrm.api.parties.listDeleted` | `read` | List parties deleted since a date |
| `parties.listEmployees` | `capsulecrm.api.parties.listEmployees` | `read` | List employees of an organisation |
| `parties.listOpportunities` | `capsulecrm.api.parties.listOpportunities` | `read` | List opportunities for a party |
| `parties.listProjects` | `capsulecrm.api.parties.listProjects` | `read` | List projects for a party |
| `parties.search` | `capsulecrm.api.parties.search` | `read` | Search parties by query string |
| `parties.update` | `capsulecrm.api.parties.update` | `write` | Update a party |
| `pipelines.get` | `capsulecrm.api.pipelines.get` | `read` | Get a pipeline by ID |
| `pipelines.list` | `capsulecrm.api.pipelines.list` | `read` | List sales pipelines |
| `pipelines.listMilestones` | `capsulecrm.api.pipelines.listMilestones` | `read` | List milestones on a pipeline |
| `pipelines.update` | `capsulecrm.api.pipelines.update` | `write` | Update a pipeline |
| `projects.addParty` | `capsulecrm.api.projects.addParty` | `write` | Add a party to a project |
| `projects.create` | `capsulecrm.api.projects.create` | `write` | Create a project (case) |
| `projects.delete` | `capsulecrm.api.projects.delete` | `destructive` | Delete a project [DESTRUCTIVE] |
| `projects.deleteParty` | `capsulecrm.api.projects.deleteParty` | `write` | Remove a party from a project |
| `projects.get` | `capsulecrm.api.projects.get` | `read` | Get a project by ID |
| `projects.list` | `capsulecrm.api.projects.list` | `read` | List projects (kases) |
| `projects.listDeleted` | `capsulecrm.api.projects.listDeleted` | `read` | List deleted or restricted projects |
| `projects.listParties` | `capsulecrm.api.projects.listParties` | `read` | List parties on a project |
| `projects.search` | `capsulecrm.api.projects.search` | `read` | Search projects by query string |
| `projects.update` | `capsulecrm.api.projects.update` | `write` | Update a project |
| `restHooks.list` | `capsulecrm.api.restHooks.list` | `read` | List REST hook subscriptions |
| `site.get` | `capsulecrm.api.site.get` | `read` | Get Capsule site (account) details |
| `stages.create` | `capsulecrm.api.stages.create` | `write` | Create a board stage |
| `stages.delete` | `capsulecrm.api.stages.delete` | `destructive` | Delete a stage [DESTRUCTIVE] |
| `stages.get` | `capsulecrm.api.stages.get` | `read` | Get a stage by ID |
| `stages.list` | `capsulecrm.api.stages.list` | `read` | List stages across boards |
| `stages.update` | `capsulecrm.api.stages.update` | `write` | Update a stage |
| `tags.delete` | `capsulecrm.api.tags.delete` | `destructive` | Delete a tag [DESTRUCTIVE] |
| `tags.get` | `capsulecrm.api.tags.get` | `read` | Get a tag by ID |
| `tags.list` | `capsulecrm.api.tags.list` | `read` | List tags for an entity type |
| `tags.update` | `capsulecrm.api.tags.update` | `write` | Update a tag name |
| `tasks.create` | `capsulecrm.api.tasks.create` | `write` | Create a task |
| `tasks.delete` | `capsulecrm.api.tasks.delete` | `destructive` | Delete a task [DESTRUCTIVE] |
| `tasks.get` | `capsulecrm.api.tasks.get` | `read` | Get a task by ID |
| `tasks.list` | `capsulecrm.api.tasks.list` | `read` | List tasks |
| `tasks.update` | `capsulecrm.api.tasks.update` | `write` | Update a task |
| `teams.list` | `capsulecrm.api.teams.list` | `read` | List teams |
| `titles.create` | `capsulecrm.api.titles.create` | `write` | Create a custom person title |
| `titles.delete` | `capsulecrm.api.titles.delete` | `destructive` | Delete a title [DESTRUCTIVE] |
| `titles.list` | `capsulecrm.api.titles.list` | `read` | List custom person titles |
| `trackDefinitions.create` | `capsulecrm.api.trackDefinitions.create` | `write` | Create a track definition |
| `trackDefinitions.delete` | `capsulecrm.api.trackDefinitions.delete` | `destructive` | Delete a track definition [DESTRUCTIVE] |
| `trackDefinitions.get` | `capsulecrm.api.trackDefinitions.get` | `read` | Get a track definition by ID |
| `trackDefinitions.list` | `capsulecrm.api.trackDefinitions.list` | `read` | List track definitions |
| `trackDefinitions.update` | `capsulecrm.api.trackDefinitions.update` | `write` | Update a track definition |
| `tracks.create` | `capsulecrm.api.tracks.create` | `write` | Apply a track definition to an entity |
| `tracks.delete` | `capsulecrm.api.tracks.delete` | `destructive` | Delete a track [DESTRUCTIVE] |
| `tracks.get` | `capsulecrm.api.tracks.get` | `read` | Get a track by ID |
| `tracks.listForEntity` | `capsulecrm.api.tracks.listForEntity` | `read` | List tracks on an opportunity or project |
| `tracks.update` | `capsulecrm.api.tracks.update` | `write` | Update a track description or date |
| `users.get` | `capsulecrm.api.users.get` | `read` | Get a user by ID |
| `users.getCurrent` | `capsulecrm.api.users.getCurrent` | `read` | Get the current authenticated user |
| `users.list` | `capsulecrm.api.users.list` | `read` | List users |
| `users.update` | `capsulecrm.api.users.update` | `write` | Update user preferences |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/capsulecrm

## License

Apache-2.0
