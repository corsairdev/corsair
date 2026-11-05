# @corsair-dev/elasticsearch

Elasticsearch plugin for Corsair. Access to a self-hosted (or Elastic Cloud) Elasticsearch cluster: cluster info, health, settings and routing, the CAT inventory APIs, node and task monitoring, index lifecycle, document CRUD, and search.

## Install

```bash
pnpm add @corsair-dev/elasticsearch
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cluster.getHealth` | `elasticsearch.api.cluster.getHealth` | `read` | Get the cluster's health status (green/yellow/red) with shard, node and pending-task counts, optionally scoped to an index target and with wait_for_status |
| `cluster.ping` | `elasticsearch.api.cluster.ping` | `read` | Ping the cluster (HEAD /): resolves to { exists: boolean } so an agent can check reachability before heavier calls |
| `cluster.getInfo` | `elasticsearch.api.cluster.getInfo` | `read` | Get the cluster info block (GET /): cluster name and uuid, the responding node, tagline and full version details |
| `cluster.subsystemInfo` | `elasticsearch.api.cluster.subsystemInfo` | `read` | Get cluster subsystem info (GET /_info/{target}) for http, ingest, thread_pool or script; target accepts a comma list or _all |
| `cluster.pendingTasks` | `elasticsearch.api.cluster.pendingTasks` | `read` | List the pending cluster-level tasks (index creation, shard rebalancing) still queued on the master node |
| `cluster.getSettings` | `elasticsearch.api.cluster.getSettings` | `read` | Get cluster-wide settings (persistent, transient and optionally defaults) keyed by setting name |
| `cluster.putSettings` | `elasticsearch.api.cluster.putSettings` | `write` | Update cluster-wide settings (PUT /_cluster/settings) with a persistent and/or transient settings object |
| `cluster.reroute` | `elasticsearch.api.cluster.reroute` | `write` | Reroute cluster shards (POST /_cluster/reroute) with typed move, cancel and allocate commands; dry_run simulates without applying |
| `cluster.allocationExplain` | `elasticsearch.api.cluster.allocationExplain` | `read` | Explain why a shard is (or is not) allocated: the decider verdicts, current node and disk context for a chosen shard |
| `cluster.getState` | `elasticsearch.api.cluster.getState` | `read` | Get the cluster state document filtered by metric (metadata, nodes, routing_table, ...) and optional index targets |
| `cluster.getStats` | `elasticsearch.api.cluster.getStats` | `read` | Get cluster statistics (GET /_cluster/stats) for all nodes or a node filter: index counts and sizes, OS, JVM and process usage |
| `cluster.addVotingConfigExclusions` | `elasticsearch.api.cluster.addVotingConfigExclusions` | `write` | Exclude nodes from the voting configuration by names or ids (exactly one) so they can leave the cluster safely |
| `cluster.clearVotingConfigExclusions` | `elasticsearch.api.cluster.clearVotingConfigExclusions` | `write` | Clear the voting configuration exclusions list, optionally waiting until the excluded nodes have left the cluster |
| `cluster.remoteInfo` | `elasticsearch.api.cluster.remoteInfo` | `read` | Get remote cluster information keyed by alias: connection mode (sniff or proxy), connectivity and seed addresses |
| `cluster.healthReport` | `elasticsearch.api.cluster.healthReport` | `read` | Get the cluster health report with per-indicator status (master_is_stable, shards_availability, disk, ...); a feature selects a subset |
| `cluster.sslCertificates` | `elasticsearch.api.cluster.sslCertificates` | `read` | List the SSL certificates loaded on the HTTP layer: alias, subject, issuer, serial, path and expiry per certificate |
| `cluster.scriptContexts` | `elasticsearch.api.cluster.scriptContexts` | `read` | List the supported script contexts with the methods and parameters each exposes to scripts |
| `cluster.resolveCluster` | `elasticsearch.api.cluster.resolveCluster` | `read` | Resolve a remote cluster alias to its connection details |
| `cluster.scriptLanguages` | `elasticsearch.api.cluster.scriptLanguages` | `read` | List the script languages the cluster allows and the contexts each language can be used in |
| `documents.get` | `elasticsearch.api.documents.get` | `read` | Get one JSON document by index and id; a missing document returns found: false rather than an error |
| `documents.exists` | `elasticsearch.api.documents.exists` | `read` | Check whether a document exists (HEAD): resolves to { exists: boolean } instead of throwing on 404 |
| `documents.index` | `elasticsearch.api.documents.index` | `write` | Create or replace a document by id (POST /{index}/_doc/{id}) with optional op_type, refresh and optimistic-concurrency controls |
| `documents.create` | `elasticsearch.api.documents.create` | `write` | Create a document only if no document with the id exists yet (POST /{index}/_create/{id}); a duplicate answers 409 |
| `documents.update` | `elasticsearch.api.documents.update` | `write` | Update one document with a partial doc merge or a script (exactly one), with optional upsert and retry-on-conflict |
| `documents.delete` | `elasticsearch.api.documents.delete` | `destructive` | Delete one document by id; a missing document answers 404 with result: not_found instead of an error |
| `documents.updateByQuery` | `elasticsearch.api.documents.updateByQuery` | `write` | Update every document matching a query with a script, optionally throttled, sliced and run as a background task |
| `documents.deleteByQuery` | `elasticsearch.api.documents.deleteByQuery` | `destructive` | Delete every document matching a query (the query is mandatory so the deletion set is always explicit) |
| `documents.mget` | `elasticsearch.api.documents.mget` | `read` | Fetch multiple documents in one request by ids (under the path index) or explicit { _index, _id } entries |
| `documents.getSource` | `elasticsearch.api.documents.getSource` | `read` | Get a document's _source JSON directly by index and id; a missing document is a 404 error (unlike documents.get) |
| `documents.existsSource` | `elasticsearch.api.documents.existsSource` | `read` | Check whether a stored _source exists for a document (HEAD): resolves to { exists: boolean } |
| `documents.explain` | `elasticsearch.api.documents.explain` | `read` | Explain whether and why a document matches a query: score computation and optional inline get back |
| `documents.termvectors` | `elasticsearch.api.documents.termvectors` | `read` | Get term-vector statistics (terms, positions, offsets, payloads, frequencies) for one document |
| `documents.mtermvectors` | `elasticsearch.api.documents.mtermvectors` | `read` | Get term vectors for multiple documents by ids or { _index, _id } entries in one request |
| `documents.bulk` | `elasticsearch.api.documents.bulk` | `destructive` | Bulk index, create, update or delete documents on one target (PUT /{index}/_bulk) from typed operations or raw NDJSON; marked destructive because bulk actions can include deletes |
| `indices.analyze` | `elasticsearch.api.indices.analyze` | `read` | Run text analysis with an index analyzer or field and get the resulting tokens back with offsets and positions |
| `indices.addBlock` | `elasticsearch.api.indices.addBlock` | `write` | Add an index block (metadata, read, read_only or write) limiting what operations the index accepts |
| `indices.clone` | `elasticsearch.api.indices.clone` | `write` | Clone an index into a new index with the same settings, mappings and aliases (source must be read-only) |
| `indices.close` | `elasticsearch.api.indices.close` | `write` | Close an index: blocks searches and writes while keeping its data on disk |
| `indices.create` | `elasticsearch.api.indices.create` | `write` | Create an index (PUT /{index}) with optional mappings, aliases, settings and shard-readiness wait |
| `indices.delete` | `elasticsearch.api.indices.delete` | `destructive` | Delete one or more indices and all their data (alias names are not valid targets) |
| `indices.deleteAlias` | `elasticsearch.api.indices.deleteAlias` | `destructive` | Delete aliases from indices (comma-separated names or wildcards); producers writing through the alias lose their target |
| `indices.downsample` | `elasticsearch.api.indices.downsample` | `write` | Downsample a time series index into a coarser fixed-interval index (aggregate or last-value sampling) |
| `indices.exists` | `elasticsearch.api.indices.exists` | `read` | Check whether an index or data stream exists (HEAD): resolves to { exists: boolean } instead of throwing on 404 |
| `indices.existsAlias` | `elasticsearch.api.indices.existsAlias` | `read` | Check whether an alias exists on a target (HEAD): resolves to { exists: boolean } |
| `indices.getFieldMapping` | `elasticsearch.api.indices.getFieldMapping` | `read` | Get mapping definitions for specific fields (comma-separated list or wildcards) across indices |
| `indices.getAlias` | `elasticsearch.api.indices.getAlias` | `read` | Get the aliases attached to indices, keyed by index name; a missing alias answers 404 |
| `indices.getMapping` | `elasticsearch.api.indices.getMapping` | `read` | Get mapping definitions for one or more indices or data streams, keyed by index name |
| `indices.getSettings` | `elasticsearch.api.indices.getSettings` | `read` | Get index settings by name or wildcard, keyed by index name, optionally including defaults |
| `indices.open` | `elasticsearch.api.indices.open` | `write` | Open a closed index so searches and indexing resume on it |
| `indices.putAlias` | `elasticsearch.api.indices.putAlias` | `write` | Create or update an alias on indices with optional filter query, routing and write-index designation |
| `indices.putMapping` | `elasticsearch.api.indices.putMapping` | `write` | Add or update field mappings on existing indices (new fields only; existing fields cannot change type) |
| `indices.putSettings` | `elasticsearch.api.indices.putSettings` | `write` | Update index settings (PUT /{index}/_settings), optionally preserving existing values or reopening closed indices |
| `indices.removeBlock` | `elasticsearch.api.indices.removeBlock` | `write` | Remove a previously added index block (metadata, read, read_only or write) |
| `indices.rollover` | `elasticsearch.api.indices.rollover` | `write` | Roll an alias or data stream over to a new index when conditions (max_age, max_size, max_docs...) are met, with dry-run support |
| `indices.shrink` | `elasticsearch.api.indices.shrink` | `write` | Shrink an index into a new index with fewer primary shards (factor of the source count) |
| `indices.split` | `elasticsearch.api.indices.split` | `write` | Split an index into a new index with more primary shards (split count must be a multiple of the source) |
| `indices.cacheClear` | `elasticsearch.api.indices.cacheClear` | `write` | Clear index caches (fielddata, query, request, or specific fields) for the target indices |
| `indices.deprecations` | `elasticsearch.api.indices.deprecations` | `read` | Get deprecation warnings about the target index configuration that the next major Elasticsearch upgrade will remove |
| `indices.diskUsage` | `elasticsearch.api.indices.diskUsage` | `read` | Analyze disk usage per field of an index; requires the explicit run_expensive_tasks: true opt-in because the analysis is resource-intensive |
| `indices.explainDataLifecycle` | `elasticsearch.api.indices.explainDataLifecycle` | `read` | Get the data stream lifecycle management status for the target indices, keyed by index name |
| `indices.fieldUsageStats` | `elasticsearch.api.indices.fieldUsageStats` | `read` | Get field usage statistics (how often each field was read by searches) for the target indices |
| `indices.flush` | `elasticsearch.api.indices.flush` | `write` | Flush indices (GET /{index}/_flush) to persist in-memory transaction-log entries to storage |
| `indices.forceMerge` | `elasticsearch.api.indices.forceMerge` | `write` | Force a Lucene segment merge on indices, optionally to a target segment count; resource-heavy on large indices |
| `indices.ilmExplain` | `elasticsearch.api.indices.ilmExplain` | `read` | Get the Index Lifecycle Management state for the target indices, including the current step and any failures |
| `indices.ilmRemove` | `elasticsearch.api.indices.ilmRemove` | `write` | Remove the ILM policy association from an index; lifecycle management stops managing it |
| `indices.ilmRetry` | `elasticsearch.api.indices.ilmRetry` | `write` | Retry a failed Index Lifecycle Management step for the target indices |
| `indices.recovery` | `elasticsearch.api.indices.recovery` | `read` | View shard recovery status for indices (replication, recovery from snapshot, relocation), keyed by index name |
| `indices.refresh` | `elasticsearch.api.indices.refresh` | `write` | Refresh indices (GET /{index}/_refresh) so pending indexed documents become searchable immediately |
| `indices.reloadSearchAnalyzers` | `elasticsearch.api.indices.reloadSearchAnalyzers` | `write` | Reload search analyzers on indices whose analyzer resources changed (for example after a synonym file update) |
| `indices.resolveIndex` | `elasticsearch.api.indices.resolveIndex` | `read` | Resolve an index, alias or wildcard pattern into the concrete indices, aliases and data streams it matches |
| `indices.searchableSnapshotStats` | `elasticsearch.api.indices.searchableSnapshotStats` | `read` | Get searchable snapshot statistics (cache usage, IO) for mounted indices at cluster, index or shard level |
| `indices.clearSearchableSnapshotCache` | `elasticsearch.api.indices.clearSearchableSnapshotCache` | `write` | Clear the searchable snapshots shared cache for fully-mounted indices |
| `indices.segments` | `elasticsearch.api.indices.segments` | `read` | Get low-level Lucene segment information per shard of the target indices |
| `indices.shardStores` | `elasticsearch.api.indices.shardStores` | `read` | Get information about shard stores (copy status, allocation, flush stats) filtered by health status |
| `indices.stats` | `elasticsearch.api.indices.stats` | `read` | Get index statistics for chosen metrics (store, indexing, search, merge, segments, docs...), aggregated at cluster, index or shard level |
| `indices.get` | `elasticsearch.api.indices.get` | `read` | Get mapping, settings and alias information for one or more indices or data streams |
| `indices.list` | `elasticsearch.api.indices.list` | `read` | List the indices (or data stream backing indices) matching a target, with health, shards, doc counts and store size |
| `search.run` | `elasticsearch.api.search.run` | `read` | Search indices, data streams or aliases with a typed subset of the Query DSL (match, match_phrase, term, terms, ids, match_all, bool) with from/size paging |
| `search.asyncSubmit` | `elasticsearch.api.search.asyncSubmit` | `read` | Submit an async search: returns partial results immediately with an id for polling while the search keeps running |
| `search.asyncGet` | `elasticsearch.api.search.asyncGet` | `read` | Get the current results of an async search by id, optionally waiting for completion |
| `search.asyncStatus` | `elasticsearch.api.search.asyncStatus` | `read` | Get only the running status of an async search by id |
| `search.asyncDelete` | `elasticsearch.api.search.asyncDelete` | `destructive` | Delete an async search and its results before it completes, freeing its resources |
| `search.closePointInTime` | `elasticsearch.api.search.closePointInTime` | `write` | Close a point in time by id, freeing the resources it holds on its indices |
| `search.count` | `elasticsearch.api.search.count` | `read` | Count documents matching a typed query (or every document) across indices, data streams and aliases without fetching hits |
| `search.eql` | `elasticsearch.api.search.eql` | `read` | Run an Event Query Language search (event and sequence matching) over log/event indices |
| `search.fieldCaps` | `elasticsearch.api.search.fieldCaps` | `read` | Get field capabilities (types, searchable, aggregatable, per-index overrides) across indices |
| `search.graphExplore` | `elasticsearch.api.search.graphExplore` | `read` | Explore graph analytics: find vertices and connections between terms that co-occur in documents |
| `search.msearch` | `elasticsearch.api.search.msearch` | `read` | Run multiple searches in one request from typed sub-searches (query/from/size) or raw NDJSON; each response item carries its own error |
| `search.msearchTemplate` | `elasticsearch.api.search.msearchTemplate` | `read` | Run multiple templated searches in one request, each using a stored template id and params |
| `search.openPointInTime` | `elasticsearch.api.search.openPointInTime` | `write` | Open a point in time (PIT) over indices with a keep-alive; the returned id pins a consistent view and holds cluster resources |
| `search.rankEval` | `elasticsearch.api.search.rankEval` | `read` | Evaluate ranked search results against rated documents with a metric (precision, recall, DCG...) and get per-request details |
| `search.shards` | `elasticsearch.api.search.shards` | `read` | Get the shards a search would execute on: node list, shard routing copies and index names |
| `search.template` | `elasticsearch.api.search.template` | `read` | Run a search with a stored template id or an inline mustache source plus params; same response shape as search.run |
| `search.termsEnum` | `elasticsearch.api.search.termsEnum` | `read` | Enumerate terms in a field that match a string prefix, for autocomplete-style lookups |
| `search.validateQuery` | `elasticsearch.api.search.validateQuery` | `read` | Validate a typed query (or Lucene q string) without running it, with optional per-shard explanations |
| `search.vectorTile` | `elasticsearch.api.search.vectorTile` | `read` | Search a geospatial field as a Mapbox vector tile for a zoom/x/y grid; returns the protobuf tile base64-encoded |
| `fleet.search` | `elasticsearch.api.fleet.search` | `read` | Run a Fleet search on one index or alias, optionally waiting for global checkpoints before executing |
| `fleet.msearch` | `elasticsearch.api.fleet.msearch` | `read` | Run multiple Fleet searches in one request with optional checkpoint waits; each item carries its own error |
| `fleet.globalCheckpoints` | `elasticsearch.api.fleet.globalCheckpoints` | `read` | Get the global checkpoints of an index, optionally waiting for them to advance past given values |
| `ccr.follow` | `elasticsearch.api.ccr.follow` | `write` | Create a follower index that replicates a leader index from a remote cluster (cross-cluster replication) |
| `ccr.followInfo` | `elasticsearch.api.ccr.followInfo` | `read` | Get follower information (leader index, remote cluster, status) for follower index patterns |
| `ccr.followStats` | `elasticsearch.api.ccr.followStats` | `read` | Get cross-cluster replication statistics (shard-level following stats) for follower indices |
| `ccr.forgetFollower` | `elasticsearch.api.ccr.forgetFollower` | `write` | Remove a follower retention lease from a leader index by follower identifiers, letting its data be trimmed |
| `ccr.pauseFollow` | `elasticsearch.api.ccr.pauseFollow` | `write` | Pause replication of a follower index; the leader stops streaming operations until resumed |
| `ccr.resumeFollow` | `elasticsearch.api.ccr.resumeFollow` | `write` | Resume replication on a paused follower index |
| `ccr.unfollow` | `elasticsearch.api.ccr.unfollow` | `write` | Convert a follower index into a regular index, detaching it from its leader for good |
| `cat.help` | `elasticsearch.api.cat.help` | `read` | Get the CAT API help text (GET /_cat): the plain-text list of every cat command, always returned as text |
| `cat.aliases` | `elasticsearch.api.cat.aliases` | `read` | List index aliases with their filter, routing and write-index flags, filtered by an alias name pattern |
| `cat.allocation` | `elasticsearch.api.cat.allocation` | `read` | List shard allocation per data node: shard counts and disk usage (used, available, total, percent) |
| `cat.circuitBreakers` | `elasticsearch.api.cat.circuitBreakers` | `read` | List circuit breakers per node with their limits, estimated usage and whether they tripped |
| `cat.componentTemplates` | `elasticsearch.api.cat.componentTemplates` | `read` | List component templates with version and per-section counts (mappings, settings, aliases), filtered by name pattern |
| `cat.count` | `elasticsearch.api.cat.count` | `read` | Get a quick live-document count for the whole cluster or an index/data stream/alias target |
| `cat.fielddata` | `elasticsearch.api.cat.fielddata` | `read` | List fielddata cache usage per node and field, in bytes, optionally filtered by field list |
| `cat.health` | `elasticsearch.api.cat.health` | `read` | Get the compact cluster health row (status, node and shard counts) as a one-row JSON array |
| `cat.master` | `elasticsearch.api.cat.master` | `read` | Get the elected master node: its id, host, ip and name in one row |
| `cat.mlJobs` | `elasticsearch.api.cat.mlJobs` | `read` | List anomaly detection jobs with state, processed records, model size and forecast counts |
| `cat.mlDataFrameAnalytics` | `elasticsearch.api.cat.mlDataFrameAnalytics` | `read` | List data frame analytics jobs with their type and state, filtered by id pattern |
| `cat.mlDatafeeds` | `elasticsearch.api.cat.mlDatafeeds` | `read` | List ML datafeeds with their state and bucket counts, filtered by datafeed id pattern |
| `cat.mlTrainedModels` | `elasticsearch.api.cat.mlTrainedModels` | `read` | List trained models with creator, creation time, feature count and version, with from/size paging |
| `cat.nodeattrs` | `elasticsearch.api.cat.nodeattrs` | `read` | List the custom node attributes (node.name, attr/value pairs) the allocator uses for shard awareness |
| `cat.nodes` | `elasticsearch.api.cat.nodes` | `read` | List the nodes with id, name, address, heap/ram/cpu percentages, roles and version |
| `cat.pendingTasks` | `elasticsearch.api.cat.pendingTasks` | `read` | List pending cluster tasks queued on the master with insertion order, priority and queue time |
| `cat.plugins` | `elasticsearch.api.cat.plugins` | `read` | List the plugins installed per node with name, version and description |
| `cat.recovery` | `elasticsearch.api.cat.recovery` | `read` | List shard recovery events (index, stage, source and target, bytes recovered), optionally active-only or detailed |
| `cat.repositories` | `elasticsearch.api.cat.repositories` | `read` | List the registered snapshot repositories with their types |
| `cat.segments` | `elasticsearch.api.cat.segments` | `read` | List Lucene segments per shard: generation, doc counts, size and memory, filtered by index target |
| `cat.shards` | `elasticsearch.api.cat.shards` | `read` | List every shard with index, number, primary/replica, state, docs, store size and assigned node |
| `cat.snapshots` | `elasticsearch.api.cat.snapshots` | `read` | List snapshots in one or more repositories with status, start/end times, duration and index counts |
| `cat.tasks` | `elasticsearch.api.cat.tasks` | `read` | List currently running tasks with action, node and running time, filterable by actions, nodes or parent task |
| `cat.templates` | `elasticsearch.api.cat.templates` | `read` | List index templates with their index patterns, order and component templates, filtered by name pattern |
| `cat.threadPool` | `elasticsearch.api.cat.threadPool` | `read` | List thread pool statistics per node and pool: active, queued and rejected counts, filtered by pool pattern |
| `cat.transforms` | `elasticsearch.api.cat.transforms` | `read` | List transforms with state, checkpoint progress and documents processed, with from/size paging |
| `nodes.info` | `elasticsearch.api.nodes.info` | `read` | Get node information (GET /_nodes) for all or selected nodes: OS, process, JVM, thread pools, plugins and ingest processors, filtered by metric |
| `nodes.stats` | `elasticsearch.api.nodes.stats` | `read` | Get node statistics for all or selected nodes: indices, OS, JVM, filesystem, thread pools, breakers, filtered by metric and index metric |
| `nodes.usage` | `elasticsearch.api.nodes.usage` | `read` | Get node feature usage: how often each REST action and aggregation ran, per node |
| `nodes.hotThreads` | `elasticsearch.api.nodes.hotThreads` | `read` | Get the current hot threads dump per node as plain text, with sampling type, interval and thread count controls |
| `nodes.reloadSecureSettings` | `elasticsearch.api.nodes.reloadSecureSettings` | `write` | Reload keystore secure settings on all or selected nodes so updated credentials take effect without a restart |
| `nodes.repositoriesMetering` | `elasticsearch.api.nodes.repositoriesMetering` | `read` | Get repositories metering information (snapshot search usage) for all or selected nodes |
| `nodes.clearRepositoriesMetering` | `elasticsearch.api.nodes.clearRepositoriesMetering` | `write` | Clear archived repositories metering information up to a maximum archive version on selected nodes |
| `tasks.list` | `elasticsearch.api.tasks.list` | `read` | List the tasks currently running on the cluster, groupable by node or parent task and filterable by actions and nodes |
| `tasks.get` | `elasticsearch.api.tasks.get` | `read` | Get one task by its <node_id>:<number> id with status, timing and optionally its completed response |
| `tasks.cancel` | `elasticsearch.api.tasks.cancel` | `write` | Cancel one task (POST /_tasks/{task_id}/_cancel), optionally narrowed by actions, nodes or parent task |
| `security.apiKeys.get` | `elasticsearch.api.security.apiKeys.get` | `read` | List API keys filtered by id, name, owner, realm or username, optionally active-only, with the encoded key never returned |
| `security.apiKeys.create` | `elasticsearch.api.security.apiKeys.create` | `write` | Create an API key (POST /_security/api_key) with a name, optional expiration, role descriptors and metadata; the reply carries the id and the encoded key value |
| `security.apiKeys.invalidate` | `elasticsearch.api.security.apiKeys.invalidate` | `write` | Invalidate API keys by id, ids, name, realm, username or owner selector (DELETE /_security/api_key); invalidated keys stop working immediately |
| `security.apiKeys.bulkUpdate` | `elasticsearch.api.security.apiKeys.bulkUpdate` | `write` | Bulk update API keys by ids: replace role descriptors, metadata and expiration in one request, with per-key error details |
| `security.apiKeys.clone` | `elasticsearch.api.security.apiKeys.clone` | `write` | Clone an existing API key (PUT /_security/api_key/clone) into a new key with a fresh name, expiration and privilege set |
| `security.apiKeys.grant` | `elasticsearch.api.security.apiKeys.grant` | `write` | Grant an API key on behalf of another principal (password, access token or service account grant type), optionally restricted with role descriptors |
| `security.apiKeys.clearCache` | `elasticsearch.api.security.apiKeys.clearCache` | `write` | Evict API keys from the security cache by comma-separated ids (POST /_security/api_key/{ids}/_clear_cache; * clears all) |
| `security.apiKeys.update` | `elasticsearch.api.security.apiKeys.update` | `write` | Update one API key by id (PUT /_security/api_key/{id}): replace role descriptors, metadata or expiration |
| `security.apiKeys.query` | `elasticsearch.api.security.apiKeys.query` | `read` | Find API keys with a typed query (POST /_security/_query/api_key) over name, metadata and other key fields, search-style hits envelope |
| `security.crossClusterApiKeys.create` | `elasticsearch.api.security.crossClusterApiKeys.create` | `write` | Create a cross-cluster API key granting remote search and/or replication access to named indices |
| `security.crossClusterApiKeys.update` | `elasticsearch.api.security.crossClusterApiKeys.update` | `write` | Replace the access assignment, expiration or metadata of a cross-cluster API key by id |
| `security.authenticate` | `elasticsearch.api.security.authenticate` | `read` | Identify the authenticated principal (GET /_security/_authenticate): username, roles, realm chain and the API key or token in use |
| `security.users.get` | `elasticsearch.api.security.users.get` | `read` | Get users by comma-separated usernames or wildcards, with roles, full name, email, metadata and enabled flag keyed by username |
| `security.users.put` | `elasticsearch.api.security.users.put` | `write` | Create or update a user (POST /_security/user/{username}) with a password or hash, roles, profile fields and enabled flag; replies created: true\|false |
| `security.users.delete` | `elasticsearch.api.security.users.delete` | `destructive` | Delete a user and their credentials (DELETE /_security/user/{username}); replies found: true when a user was removed |
| `security.users.disable` | `elasticsearch.api.security.users.disable` | `write` | Disable a user so authentication is rejected until re-enabled (POST /_security/user/{username}/_disable) |
| `security.users.enable` | `elasticsearch.api.security.users.enable` | `write` | Re-enable a previously disabled user (POST /_security/user/{username}/_enable) |
| `security.users.changePassword` | `elasticsearch.api.security.users.changePassword` | `write` | Change a user password with a plaintext password or an SSH bcrypt hash (exactly one), (POST /_security/user/{username}/_password) |
| `security.users.query` | `elasticsearch.api.security.users.query` | `read` | Find users with a typed query over username and profile fields (POST /_security/_query/user), search-style hits envelope |
| `security.hasPrivileges` | `elasticsearch.api.security.hasPrivileges` | `read` | Check cluster, index and application privileges for one user (POST /_security/user/{user}/_has_privileges); the reply maps each privilege to a boolean |
| `security.getUserPrivileges` | `elasticsearch.api.security.getUserPrivileges` | `read` | List the privileges of the authenticated principal (GET /_security/user/_privileges): cluster, index, application, global and run_as grants |
| `security.roles.get` | `elasticsearch.api.security.roles.get` | `read` | Get roles by comma-separated names or wildcards (GET /_security/role/{name}), keyed by role name with their full privilege descriptors |
| `security.roles.put` | `elasticsearch.api.security.roles.put` | `write` | Create or update one role (POST /_security/role/{name}) with cluster, index, application, run_as and global privilege sections |
| `security.roles.delete` | `elasticsearch.api.security.roles.delete` | `destructive` | Delete a role (DELETE /_security/role/{name}); holders of the role lose its grants immediately, replies found: true when removed |
| `security.roles.bulkPut` | `elasticsearch.api.security.roles.bulkPut` | `write` | Create or update several roles in one request (POST /_security/role) from a name-to-descriptor map, with per-role error details |
| `security.roles.bulkDelete` | `elasticsearch.api.security.roles.bulkDelete` | `destructive` | Delete several roles in one request (DELETE /_security/role) by name list, with per-role error details |
| `security.roles.clearCache` | `elasticsearch.api.security.roles.clearCache` | `write` | Evict roles from the security cache by comma-separated names (POST /_security/role/{name}/_clear_cache; * clears all) |
| `security.roles.query` | `elasticsearch.api.security.roles.query` | `read` | Find roles with a typed query over name and privilege fields (POST /_security/_query/role), search-style hits envelope |
| `security.roleMappings.get` | `elasticsearch.api.security.roleMappings.get` | `read` | Get role mappings by comma-separated names (GET /_security/role_mapping/{name}), keyed by mapping name |
| `security.roleMappings.put` | `elasticsearch.api.security.roleMappings.put` | `write` | Create or update a role mapping (POST /_security/role_mapping/{name}) granting static roles or mustache role_templates under rules |
| `security.roleMappings.delete` | `elasticsearch.api.security.roleMappings.delete` | `destructive` | Delete a role mapping (DELETE /_security/role_mapping/{name}); replies found: true when a mapping was removed |
| `security.privileges.put` | `elasticsearch.api.security.privileges.put` | `write` | Create or update application privileges (POST /_security/privilege) from an application-to-privilege map with action lists and metadata |
| `security.privileges.getBuiltin` | `elasticsearch.api.security.privileges.getBuiltin` | `read` | List the builtin cluster, index and remote-cluster privilege names the cluster recognizes (GET /_security/privilege/_builtin) |
| `security.privileges.get` | `elasticsearch.api.security.privileges.get` | `read` | Get application privileges by application and privilege name or wildcard (GET /_security/privilege/{application}/{name}) |

Risk levels follow the operation's effect on the cluster: `read` never mutates, `write` changes documents or index/cluster state, `destructive` deletes data. Mutating calls (POST/PUT/DELETE) are never replayed on 5xx or timeout, because the change may already have been applied; 429 retries remain safe (the request was rejected before executing).

### HEAD exists convention

Operations whose REST API is a HEAD request (`cluster.ping`, `documents.exists`, `documents.existsSource`, `indices.exists`, `indices.existsAlias`) answer 200 or 404 with an empty body. The plugin resolves both to `{ exists: boolean }` instead of throwing on 404, so an agent can branch on the value directly.

Two endpoints always answer plain text and resolve to a string: `cat.help` (the CAT command list) and `nodes.hotThreads` (the thread dump).

`search.run`, `documents.explain`, `documents.updateByQuery`, `documents.deleteByQuery`, `documents.termvectors`, `search.count`, `search.msearch`, `search.asyncSubmit`, `search.eql` (typed body), `search.validateQuery`, `fleet.search`, `fleet.msearch` and `indices.putAlias` (filter) accept the same strict, typed subset of the Query DSL as `search.run`: `match`, `match_phrase`, `term`, `terms`, `ids`, `match_all`, and `bool` (which can nest any of these). Unknown query kinds and unknown body keys are rejected before the wire. `documents.deleteByQuery` additionally requires a `query`, so the deletion set is always explicit.

Bulk-style APIs that speak newline-delimited JSON (`documents.bulk`, `search.msearch`, `search.msearchTemplate`, `fleet.msearch`) accept typed operation/sub-search arrays, serialized by the plugin, or a validated raw `ndjson` string (every line must parse and the payload must end with a newline). `search.vectorTile` returns the binary protobuf tile as `{ contentType, base64 }`.

CAT endpoints (`cat.*`, plus `indices.list`) always request `format=json` and return rows where every value is a string (or null where a size is absent); an empty cluster or a no-match wildcard returns an empty array, which is valid. The CAT APIs are officially intended for human consumption; for programmatic use prefer the JSON API counterpart when one exists (for example `cluster.getHealth` over `cat.health`).

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

Each account stores its own cluster endpoint in the `baseUrl` account field (for example `https://es.internal.example:9200`), so different tenants can target different clusters. In solo mode pass `baseUrl` (and optionally `key`) as plugin options instead.

The stored API key value is sent as the documented `Authorization: ApiKey <encoded>` header ([API key auth](https://www.elastic.co/docs/api/doc/elasticsearch/authentication)). Accepted values:

- the `encoded` string returned by Elasticsearch's Create API key API (used as-is),
- a raw `id:api_key` pair (the plugin base64-encodes it; base64 cannot contain `:`, so the two forms never collide),
- a full header value `ApiKey ...`, `Basic ...` (HTTP Basic clusters) or `Bearer ...` (Elastic Cloud tokens), which passes through verbatim.

## Webhooks

No webhooks.

## Reference

- Elasticsearch REST API reference: https://www.elastic.co/docs/api/doc/elasticsearch
- Corsair plugin docs: https://docs.corsair.dev/plugins/elasticsearch

## License

Apache-2.0
