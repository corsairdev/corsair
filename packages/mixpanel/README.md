# @corsair-dev/mixpanel

Product analytics with Mixpanel - ingest events and user or group profiles, run Insights, funnel, retention and segmentation reports, export raw events, and manage annotations, Lexicon schemas, feature flags, experiments, warehouse imports, data pipelines, service accounts and GDPR requests.

## Install

```bash
pnpm add @corsair-dev/mixpanel
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `annotations.create` | `mixpanel.api.annotations.create` | `write` | Create a chart annotation marking an event on a date |
| `annotations.createTag` | `mixpanel.api.annotations.createTag` | `write` | Create an annotation tag |
| `annotations.delete` | `mixpanel.api.annotations.delete` | `destructive` | Delete an annotation |
| `annotations.get` | `mixpanel.api.annotations.get` | `read` | Get one annotation by id |
| `annotations.list` | `mixpanel.api.annotations.list` | `read` | List the chart annotations in the project, optionally by date range |
| `annotations.listTags` | `mixpanel.api.annotations.listTags` | `read` | List the annotation tags in the project |
| `annotations.update` | `mixpanel.api.annotations.update` | `write` | Change an annotation's description or tags |
| `auditLogs.query` | `mixpanel.api.auditLogs.query` | `read` | Query the organization's audit log (who changed what, when), filtered by user, type, service and date |
| `cohorts.list` | `mixpanel.api.cohorts.list` | `read` | List every saved cohort with its id, member count, visibility and description |
| `dataDefinitions.create` | `mixpanel.api.dataDefinitions.create` | `write` | Create a Lexicon data definition (event, property, custom event, metric, behavior or cohort) |
| `dataDefinitions.delete` | `mixpanel.api.dataDefinitions.delete` | `destructive` | Delete a data definition |
| `dataDefinitions.get` | `mixpanel.api.dataDefinitions.get` | `read` | Get one Lexicon data definition |
| `dataDefinitions.list` | `mixpanel.api.dataDefinitions.list` | `read` | List Lexicon data definitions (events, properties, metrics, cohorts) with filters, paged by cursor |
| `dataDefinitions.merge` | `mixpanel.api.dataDefinitions.merge` | `write` | Merge event or property definitions into one canonical definition |
| `dataDefinitions.unmerge` | `mixpanel.api.dataDefinitions.unmerge` | `write` | Undo a merge of data definitions |
| `dataDefinitions.update` | `mixpanel.api.dataDefinitions.update` | `write` | Update a data definition's description, display name, tags, owners or hidden/blocked/verified flags |
| `dataDefinitionTags.create` | `mixpanel.api.dataDefinitionTags.create` | `write` | Create a data definition tag |
| `dataDefinitionTags.delete` | `mixpanel.api.dataDefinitionTags.delete` | `destructive` | Delete a data definition tag (it is removed from every definition) |
| `dataDefinitionTags.get` | `mixpanel.api.dataDefinitionTags.get` | `read` | Get one data definition tag |
| `dataDefinitionTags.list` | `mixpanel.api.dataDefinitionTags.list` | `read` | List data definition tags with their usage counts |
| `dataDefinitionTags.rename` | `mixpanel.api.dataDefinitionTags.rename` | `write` | Rename a data definition tag |
| `events.counts` | `mixpanel.api.events.counts` | `read` | Aggregate counts of one or more events over time |
| `events.import` | `mixpanel.api.events.import` | `write` | Import up to 2000 server-side events (service account auth, any age), validated per event unless strict is 0 |
| `events.names` | `mixpanel.api.events.names` | `read` | The most common event names over the last 31 days |
| `events.propertyCounts` | `mixpanel.api.events.propertyCounts` | `read` | Aggregate counts of an event broken down by the values of one property |
| `events.top` | `mixpanel.api.events.top` | `read` | Today's top events with counts and change against yesterday |
| `events.topProperties` | `mixpanel.api.events.topProperties` | `read` | The top property names of an event with their counts |
| `events.topPropertyValues` | `mixpanel.api.events.topPropertyValues` | `read` | The top values of one event property |
| `events.track` | `mixpanel.api.events.track` | `write` | Track up to 2000 recent events (last 5 days) with the project token, the client-side ingestion route |
| `experiments.archive` | `mixpanel.api.experiments.archive` | `write` | Archive an experiment |
| `experiments.create` | `mixpanel.api.experiments.create` | `write` | Create a draft experiment |
| `experiments.decide` | `mixpanel.api.experiments.decide` | `destructive` | Record the decision on a concluded experiment (success and winning variant) |
| `experiments.delete` | `mixpanel.api.experiments.delete` | `destructive` | Delete an experiment |
| `experiments.forceConclude` | `mixpanel.api.experiments.forceConclude` | `destructive` | Stop a running experiment now, ending exposure to its variants |
| `experiments.get` | `mixpanel.api.experiments.get` | `read` | Get one experiment |
| `experiments.launch` | `mixpanel.api.experiments.launch` | `destructive` | Launch an experiment: live users start getting its variants |
| `experiments.list` | `mixpanel.api.experiments.list` | `read` | List the experiments of a workspace |
| `experiments.unarchive` | `mixpanel.api.experiments.unarchive` | `write` | Restore an archived experiment |
| `experiments.update` | `mixpanel.api.experiments.update` | `write` | Update an experiment's fields |
| `export.events` | `mixpanel.api.export.events` | `read` | Export raw events for a date range as parsed objects, with optional event-name filter, expression filter and limit |
| `featureFlags.create` | `mixpanel.api.featureFlags.create` | `write` | Create a feature flag with variants and rollout rules |
| `featureFlags.definitions` | `mixpanel.api.featureFlags.definitions` | `read` | Get the definitions of every flag, for local evaluation in server SDKs |
| `featureFlags.delete` | `mixpanel.api.featureFlags.delete` | `destructive` | Delete a feature flag |
| `featureFlags.evaluate` | `mixpanel.api.featureFlags.evaluate` | `read` | Evaluate every enabled feature flag for one user and return the assigned variants |
| `featureFlags.get` | `mixpanel.api.featureFlags.get` | `read` | Get one feature flag with its ruleset |
| `featureFlags.list` | `mixpanel.api.featureFlags.list` | `read` | List the feature flags of a workspace |
| `featureFlags.update` | `mixpanel.api.featureFlags.update` | `write` | Replace a feature flag (full PUT: send every field); changes what live users are served |
| `funnels.list` | `mixpanel.api.funnels.list` | `read` | List the saved funnels with their ids and names |
| `funnels.query` | `mixpanel.api.funnels.query` | `read` | Query a saved funnel for a date range, with optional segmentation and conversion window |
| `gdpr.cancelDeletion` | `mixpanel.api.gdpr.cancelDeletion` | `write` | Cancel a GDPR deletion job that has not started yet |
| `gdpr.createDeletion` | `mixpanel.api.gdpr.createDeletion` | `destructive` | Start a GDPR/CCPA deletion job that permanently deletes all events and profile data of the given users |
| `gdpr.createRetrieval` | `mixpanel.api.gdpr.createRetrieval` | `write` | Start a GDPR/CCPA data retrieval job that exports everything stored about the given users |
| `gdpr.getDeletion` | `mixpanel.api.gdpr.getDeletion` | `read` | Check a GDPR deletion job |
| `gdpr.getRetrieval` | `mixpanel.api.gdpr.getRetrieval` | `read` | Check a GDPR data retrieval job |
| `groups.batchUpdate` | `mixpanel.api.groups.batchUpdate` | `destructive` | Apply up to 200 mixed group profile updates in one request; $unset and $delete entries remove data |
| `groups.delete` | `mixpanel.api.groups.delete` | `destructive` | Permanently delete a group profile and its properties |
| `groups.remove` | `mixpanel.api.groups.remove` | `write` | Remove a value from list properties on a group profile |
| `groups.set` | `mixpanel.api.groups.set` | `write` | Set properties on a group profile, creating it if needed |
| `groups.setOnce` | `mixpanel.api.groups.setOnce` | `write` | Set properties on a group profile only where they are not set yet |
| `groups.union` | `mixpanel.api.groups.union` | `write` | Merge values into list properties on a group profile, skipping duplicates |
| `groups.unset` | `mixpanel.api.groups.unset` | `destructive` | Delete properties from a group profile |
| `identity.createAlias` | `mixpanel.api.identity.createAlias` | `write` | Send a $create_alias event so a new id resolves to an existing distinct_id (legacy ID management) |
| `identity.createIdentity` | `mixpanel.api.identity.createIdentity` | `write` | Send an $identify event linking an anonymous id to an identified id (original ID merge API) |
| `identity.merge` | `mixpanel.api.identity.merge` | `destructive` | Merge two distinct_ids into one user with a $merge event (original ID merge API); cannot be undone |
| `insights.query` | `mixpanel.api.insights.query` | `read` | Read the data behind one saved Insights report by its bookmark id |
| `insights.run` | `mixpanel.api.insights.run` | `read` | Run an ad hoc Insights query (events, funnels, retention, cohorts, formulas) without a saved report |
| `jql.run` | `mixpanel.api.jql.run` | `read` | Run a JQL script (custom JavaScript query) over events and profiles; JQL is in maintenance mode at Mixpanel |
| `lexicon.delete` | `mixpanel.api.lexicon.delete` | `destructive` | Delete the Lexicon schema of one event or profile type |
| `lexicon.deleteAll` | `mixpanel.api.lexicon.deleteAll` | `destructive` | Delete every Lexicon schema in the project |
| `lexicon.deleteForEntity` | `mixpanel.api.lexicon.deleteForEntity` | `destructive` | Delete every Lexicon schema for events or for profiles |
| `lexicon.get` | `mixpanel.api.lexicon.get` | `read` | Get the Lexicon schema of one event or profile type |
| `lexicon.list` | `mixpanel.api.lexicon.list` | `read` | List every Lexicon schema in the project |
| `lexicon.listForEntity` | `mixpanel.api.lexicon.listForEntity` | `read` | List the Lexicon schemas for events or for profiles |
| `lexicon.upsert` | `mixpanel.api.lexicon.upsert` | `write` | Create or replace the Lexicon schema of one event or profile type |
| `lexicon.upsertMany` | `mixpanel.api.lexicon.upsertMany` | `destructive` | Create or replace many Lexicon schemas at once; truncate deletes every schema not uploaded |
| `lookupTables.list` | `mixpanel.api.lookupTables.list` | `read` | List the lookup tables in the project with their ids |
| `lookupTables.replace` | `mixpanel.api.lookupTables.replace` | `destructive` | Replace every row of a lookup table with new CSV content (max 100 MB); the old rows are gone |
| `pipelines.create` | `mixpanel.api.pipelines.create` | `destructive` | Create a data pipeline that exports project data to a bucket or warehouse (a paid add-on that bills while it runs) |
| `pipelines.delete` | `mixpanel.api.pipelines.delete` | `destructive` | Delete (cancel) a data pipeline |
| `pipelines.edit` | `mixpanel.api.pipelines.edit` | `write` | Change a pipeline's event filter or settings |
| `pipelines.list` | `mixpanel.api.pipelines.list` | `read` | List the data pipelines of the project |
| `pipelines.pause` | `mixpanel.api.pipelines.pause` | `write` | Pause a data pipeline |
| `pipelines.resume` | `mixpanel.api.pipelines.resume` | `write` | Resume a paused data pipeline |
| `pipelines.status` | `mixpanel.api.pipelines.status` | `read` | Get a pipeline's export jobs by status |
| `pipelines.timeline` | `mixpanel.api.pipelines.timeline` | `read` | List the dates a pipeline has synced |
| `profiles.activity` | `mixpanel.api.profiles.activity` | `read` | Return the event activity stream of one or more users' profiles for a date range |
| `profiles.append` | `mixpanel.api.profiles.append` | `write` | Append a value to list properties on a user profile |
| `profiles.batchUpdate` | `mixpanel.api.profiles.batchUpdate` | `destructive` | Apply up to 2000 mixed profile updates in one request; $unset and $delete entries remove data |
| `profiles.delete` | `mixpanel.api.profiles.delete` | `destructive` | Permanently delete a user profile and its properties (events stay) |
| `profiles.increment` | `mixpanel.api.profiles.increment` | `write` | Add to (or subtract from) numeric properties on a user profile |
| `profiles.query` | `mixpanel.api.profiles.query` | `read` | Query user or group profiles with an expression, a cohort filter or exact distinct_ids, paged via session_id and next_page |
| `profiles.remove` | `mixpanel.api.profiles.remove` | `write` | Remove a value from list properties on a user profile |
| `profiles.set` | `mixpanel.api.profiles.set` | `write` | Set properties on a user profile, creating the profile if needed |
| `profiles.setOnce` | `mixpanel.api.profiles.setOnce` | `write` | Set properties on a user profile only where they are not set yet |
| `profiles.union` | `mixpanel.api.profiles.union` | `write` | Merge values into list properties on a user profile, skipping values already present |
| `profiles.unset` | `mixpanel.api.profiles.unset` | `destructive` | Delete properties from a user profile |
| `retention.frequency` | `mixpanel.api.retention.frequency` | `read` | Frequency (addiction) report: how many users did an event on how many hours or days of each period |
| `retention.query` | `mixpanel.api.retention.query` | `read` | Run a birth or compounded retention query for a date range, per day, week or month |
| `segmentation.average` | `mixpanel.api.segmentation.average` | `read` | Average a numeric property of an event per time unit |
| `segmentation.numeric` | `mixpanel.api.segmentation.numeric` | `read` | Segment an event by numeric ranges of a property |
| `segmentation.query` | `mixpanel.api.segmentation.query` | `read` | Count an event over time, optionally segmented by a property (Segmentation report) |
| `segmentation.sum` | `mixpanel.api.segmentation.sum` | `read` | Sum a numeric property of an event per time unit |
| `serviceAccounts.addToProjects` | `mixpanel.api.serviceAccounts.addToProjects` | `write` | Grant service accounts access to projects with a role |
| `serviceAccounts.create` | `mixpanel.api.serviceAccounts.create` | `destructive` | Create a service account and return its secret once; this mints a new credential with the given role |
| `serviceAccounts.delete` | `mixpanel.api.serviceAccounts.delete` | `destructive` | Delete a service account; anything using its secret stops working (including this connection, if it is this one) |
| `serviceAccounts.get` | `mixpanel.api.serviceAccounts.get` | `read` | Get one service account of the organization |
| `serviceAccounts.list` | `mixpanel.api.serviceAccounts.list` | `read` | List the organization's service accounts |
| `serviceAccounts.listForProject` | `mixpanel.api.serviceAccounts.listForProject` | `read` | List the service accounts that can reach this project, with their roles |
| `serviceAccounts.removeFromProjects` | `mixpanel.api.serviceAccounts.removeFromProjects` | `destructive` | Remove service accounts from projects; they lose access at once |
| `warehouseImports.createEventStream` | `mixpanel.api.warehouseImports.createEventStream` | `write` | Create an import that loads events from a warehouse table |
| `warehouseImports.createGroups` | `mixpanel.api.warehouseImports.createGroups` | `write` | Create an import that loads group profiles from a warehouse table |
| `warehouseImports.createLookupTable` | `mixpanel.api.warehouseImports.createLookupTable` | `write` | Create an import that loads a lookup table from a warehouse table |
| `warehouseImports.createPeople` | `mixpanel.api.warehouseImports.createPeople` | `write` | Create an import that loads user profiles from a warehouse table |
| `warehouseImports.delete` | `mixpanel.api.warehouseImports.delete` | `destructive` | Delete a warehouse import, and with delete_data the data it imported |
| `warehouseImports.get` | `mixpanel.api.warehouseImports.get` | `read` | Get one warehouse import with its settings |
| `warehouseImports.history` | `mixpanel.api.warehouseImports.history` | `read` | List the past sync runs of a warehouse import |
| `warehouseImports.list` | `mixpanel.api.warehouseImports.list` | `read` | List the warehouse imports of the project |
| `warehouseImports.run` | `mixpanel.api.warehouseImports.run` | `write` | Start a sync of a warehouse import now |
| `warehouseImports.update` | `mixpanel.api.warehouseImports.update` | `write` | Pause, resume or reschedule a warehouse import |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mixpanel

## License

Apache-2.0
