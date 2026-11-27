# @corsair-dev/zep

Context engineering and agent memory with Zep: users and threads with messages and context, knowledge graphs (episodes, nodes, edges, hyperedges, observations, search, ontology), user groups and policies, context templates, batch ingestion, project settings, and Agent Skills and traces (205 operations).

## Install

```bash
pnpm add @corsair-dev/zep
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agents.create` | `zep.api.agents.create` | `write` | Create Agent. (POST /agents) |
| `agents.declareBreakingChange` | `zep.api.agents.declareBreakingChange` | `destructive` | Declare a breaking Agent deployment change. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.delete` | `zep.api.agents.delete` | `destructive` | Delete Agent. Cannot be undone. (DELETE /agents/{agent_uuid}) |
| `agents.get` | `zep.api.agents.get` | `read` | Get Agent. (GET /agents/{agent_uuid}) |
| `agents.getContext` | `zep.api.agents.getContext` | `read` | Get Agent context. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.learning.get` | `zep.api.agents.learning.get` | `read` | Get Agent Learning State. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.learning.listRuns` | `zep.api.agents.learning.listRuns` | `read` | List Agent Skill Compilation Outcomes. List durable learning-run outcomes for an Agent. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.list` | `zep.api.agents.list` | `read` | List Agents. (POST /agents/list) |
| `agents.literalPolicy.get` | `zep.api.agents.literalPolicy.get` | `read` | Get Agent Literal Policy. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.literalPolicy.update` | `zep.api.agents.literalPolicy.update` | `write` | Update Agent Literal Policy. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.planSplit` | `zep.api.agents.planSplit` | `read` | Plan an Agent split. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skillCandidates.evaluate` | `zep.api.agents.skillCandidates.evaluate` | `write` | Record Agent Skill Candidate Evaluation. |
| `agents.skillCandidates.get` | `zep.api.agents.skillCandidates.get` | `read` | Get Agent Skill Candidate Review. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skillCandidates.list` | `zep.api.agents.skillCandidates.list` | `read` | List Agent Skill Candidate Reviews. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skillPublications.lookup` | `zep.api.agents.skillPublications.lookup` | `read` | Look up automatic Skill publication lineage. Find a destination Skill by its source Agent, Skill, and version. The endpoint returns 404 until an automatic publication is ready or after it is invalidated. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.approve` | `zep.api.agents.skills.approve` | `write` | Approve Agent Skill. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.create` | `zep.api.agents.skills.create` | `write` | Create Agent Skill. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.createVersion` | `zep.api.agents.skills.createVersion` | `write` | Create Agent Skill Version. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.evaluations.create` | `zep.api.agents.skills.evaluations.create` | `write` | Record Agent Skill Evaluation. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.evidence.list` | `zep.api.agents.skills.evidence.list` | `read` | List Agent Skill Evidence. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.get` | `zep.api.agents.skills.get` | `read` | Get Agent Skill. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.getPublication` | `zep.api.agents.skills.getPublication` | `read` | Get automatic Skill publication lineage. Get the publication that created a destination Skill. Use its source version and policy identity to verify a copied Skill. The endpoint returns 404 for unpublished and invalidated Skills. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.importPackage` | `zep.api.agents.skills.importPackage` | `write` | Import an Agent Skill. Submit a portable Skill archive. The completed Task returns {"result":{"skill_uuid":"<uuid>"}}. Approve that Skill before retrieval. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.list` | `zep.api.agents.skills.list` | `read` | List Agent Skills. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.relations.list` | `zep.api.agents.skills.relations.list` | `read` | List Agent Skill Relationships. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.retire` | `zep.api.agents.skills.retire` | `destructive` | Retire Agent Skill. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.search` | `zep.api.agents.skills.search` | `read` | Search Agent Skills. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.uses.addOutcome` | `zep.api.agents.skills.uses.addOutcome` | `write` | Record Agent Skill Feedback. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.uses.create` | `zep.api.agents.skills.uses.create` | `write` | Create Agent Skill Use. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.versions.compare` | `zep.api.agents.skills.versions.compare` | `read` | Compare Agent Skill Versions. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.versions.exports.create` | `zep.api.agents.skills.versions.exports.create` | `write` | Export an Agent Skill version. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.versions.exports.get` | `zep.api.agents.skills.versions.exports.get` | `read` | Download an Agent Skill export. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.versions.get` | `zep.api.agents.skills.versions.get` | `read` | Get Agent Skill Version. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.versions.list` | `zep.api.agents.skills.versions.list` | `read` | List Agent Skill Versions. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.skills.versions.restore` | `zep.api.agents.skills.versions.restore` | `write` | Restore Agent Skill Version. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.taskFamilies.list` | `zep.api.agents.taskFamilies.list` | `read` | List Agent Task Families. (POST /agents/{agent_uuid}/task-families/list) |
| `agents.taskFamilies.rename` | `zep.api.agents.taskFamilies.rename` | `write` | Rename Agent Task Family. (POST /agents/{agent_uuid}/task-families/rename) |
| `agents.traceImports.create` | `zep.api.agents.traceImports.create` | `write` | Create a trace import. Create a scheduled import or queue a one-time import. A scheduled import returns HTTP 201 with import. A one-time import returns HTTP 202 with import, run, and task. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.traceImports.delete` | `zep.api.agents.traceImports.delete` | `destructive` | Delete a trace import. Set traces=delete to queue asynchronous Trace deletion. The default keeps Traces. Example query: ?traces=delete. Agent Skills is in closed release: accounts without access get 403 permission_denied. Cannot be undone. |
| `agents.traceImports.get` | `zep.api.agents.traceImports.get` | `read` | Get a trace import. Read one trace import. The response does not include its source cursor. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.traceImports.list` | `zep.api.agents.traceImports.list` | `read` | List trace imports. List trace imports that belong to this Agent. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.traceImports.pause` | `zep.api.agents.traceImports.pause` | `write` | Pause a trace import. Pause a scheduled trace import. One-time imports cannot be paused. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.traceImports.resume` | `zep.api.agents.traceImports.resume` | `write` | Resume a trace import. Resume a scheduled trace import. Zep verifies credentials first when they caused the pause. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.traceImports.runs.create` | `zep.api.agents.traceImports.runs.create` | `write` | Create a trace import run. Create a pending run and its Task. This operation does not start the run. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.traceImports.runs.get` | `zep.api.agents.traceImports.runs.get` | `read` | Get a trace import run. Read one run that belongs to this trace import. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.traceImports.runs.items.list` | `zep.api.agents.traceImports.runs.items.list` | `read` | List trace import run items. List trace results for this run. Run items do not include source payload. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.traceImports.runs.list` | `zep.api.agents.traceImports.runs.list` | `read` | List trace import runs. List runs that belong to this trace import. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.traceImports.update` | `zep.api.agents.traceImports.update` | `write` | Update a trace import. Use expected_revision to reject a stale update. Example request: {"expected_revision":1,"name":"Updated support traces"}. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.traces.abandon` | `zep.api.agents.traces.abandon` | `write` | Abandon Agent Trace. (POST /agents/{agent_uuid}/traces/{trace_uuid}/abandon) |
| `agents.traces.appendEvent` | `zep.api.agents.traces.appendEvent` | `write` | Append Agent Trace Event. A tool call and its result can share a tool_call_id. For example, append {"event_type":"tool_call","tool_call_id":"call_8f2b","content":"Search orders","context":{"tools":[{"name":"search_orders"}]}} and {"event_type":"tool_result","tool_call_id":"call_8f2b","content":"Order… |
| `agents.traces.close` | `zep.api.agents.traces.close` | `write` | Close Agent Trace. (POST /agents/{agent_uuid}/traces/{trace_uuid}/close) |
| `agents.traces.correctTaskFamily` | `zep.api.agents.traces.correctTaskFamily` | `write` | Correct Agent Trace Task Family. (POST /agents/{agent_uuid}/traces/{trace_uuid}/correct-task-family) |
| `agents.traces.create` | `zep.api.agents.traces.create` | `write` | Create Agent Trace. (POST /agents/{agent_uuid}/traces) |
| `agents.traces.delete` | `zep.api.agents.traces.delete` | `destructive` | Delete Agent Trace. Cannot be undone. (DELETE /agents/{agent_uuid}/traces/{trace_uuid}) |
| `agents.traces.deleteEvent` | `zep.api.agents.traces.deleteEvent` | `destructive` | Delete Agent Trace Event. Cannot be undone. |
| `agents.traces.get` | `zep.api.agents.traces.get` | `read` | Get Agent Trace. (GET /agents/{agent_uuid}/traces/{trace_uuid}) |
| `agents.traces.getSummary` | `zep.api.agents.traces.getSummary` | `read` | Get Current Agent Trace Summary. (GET /agents/{agent_uuid}/traces/{trace_uuid}/summary) |
| `agents.traces.list` | `zep.api.agents.traces.list` | `read` | List Agent Traces. (POST /agents/{agent_uuid}/traces/list) |
| `agents.traces.listEvents` | `zep.api.agents.traces.listEvents` | `read` | List Agent Trace Events. (GET /agents/{agent_uuid}/traces/{trace_uuid}/events) |
| `agents.traces.listSummaryVersions` | `zep.api.agents.traces.listSummaryVersions` | `read` | List Agent Trace Summary Versions. (GET /agents/{agent_uuid}/traces/{trace_uuid}/summary/versions) |
| `agents.traces.reopen` | `zep.api.agents.traces.reopen` | `write` | Reopen Agent Trace. (POST /agents/{agent_uuid}/traces/{trace_uuid}/reopen) |
| `agents.traces.update` | `zep.api.agents.traces.update` | `write` | Update Agent Trace. (PATCH /agents/{agent_uuid}/traces/{trace_uuid}) |
| `agents.update` | `zep.api.agents.update` | `write` | Update Agent. (PATCH /agents/{agent_uuid}) |
| `agents.verifiers.get` | `zep.api.agents.verifiers.get` | `read` | Get Agent Verifier. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.verifiers.invalidateEvidence` | `zep.api.agents.verifiers.invalidateEvidence` | `destructive` | Invalidate Agent Verifier Evidence. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.verifiers.list` | `zep.api.agents.verifiers.list` | `read` | List Agent Verifiers. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.verifiers.revoke` | `zep.api.agents.verifiers.revoke` | `destructive` | Revoke Agent Verifier. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `agents.verifiers.update` | `zep.api.agents.verifiers.update` | `write` | Update Agent Verifier. Agent Skills is in closed release: accounts without access get 403 permission_denied. |
| `batches.addItems` | `zep.api.batches.addItems` | `write` | Add batch items. (POST /batches/{batch_uuid}/items) |
| `batches.create` | `zep.api.batches.create` | `write` | Create batch. (POST /batches) |
| `batches.delete` | `zep.api.batches.delete` | `destructive` | Delete batch. Cannot be undone. (DELETE /batches/{batch_uuid}) |
| `batches.get` | `zep.api.batches.get` | `read` | Get batch. (GET /batches/{batch_uuid}) |
| `batches.list` | `zep.api.batches.list` | `read` | List batches. (GET /batches) |
| `batches.listItems` | `zep.api.batches.listItems` | `read` | List batch items. (GET /batches/{batch_uuid}/items) |
| `batches.process` | `zep.api.batches.process` | `write` | Process batch. (POST /batches/{batch_uuid}/process) |
| `contextTemplates.create` | `zep.api.contextTemplates.create` | `write` | Create context template. (POST /context-templates) |
| `contextTemplates.delete` | `zep.api.contextTemplates.delete` | `destructive` | Delete context template. Cannot be undone. |
| `contextTemplates.get` | `zep.api.contextTemplates.get` | `read` | Get context template. (GET /context-templates/{template_uuid}) |
| `contextTemplates.list` | `zep.api.contextTemplates.list` | `read` | List context templates. (POST /context-templates/list) |
| `contextTemplates.update` | `zep.api.contextTemplates.update` | `write` | Update context template. (PUT /context-templates/{template_uuid}) |
| `debugLogs.enable` | `zep.api.debugLogs.enable` | `write` | Enable debug logging. Enables debug logging for the project for one hour, or for 24 hours on the Enterprise plan. Episodes ingested while debug logging is enabled have a debug log (see graph.episode.get_debug_logs). |
| `graphs.clone` | `zep.api.graphs.clone` | `write` | Clone graph. (POST /graphs/{graph_uuid}/clone) |
| `graphs.create` | `zep.api.graphs.create` | `write` | Create graph. (POST /graphs) |
| `graphs.delete` | `zep.api.graphs.delete` | `destructive` | Delete graph. Cannot be undone. (DELETE /graphs/{graph_uuid}) |
| `graphs.documentSummaries.list` | `zep.api.graphs.documentSummaries.list` | `read` | List document summaries. Lists the document summaries of a graph and returns one page of results. The default page_size is 50, and the maximum page_size is 100. You can sort by uuid or created_at. The default sort is uuid in descending order. |
| `graphs.edges.add` | `zep.api.graphs.edges.add` | `write` | Add edges. Adds 1 to 100 edges. A name creates a node when deduplicate is false. When deduplicate is true, Zep matches a node by name first. |
| `graphs.edges.delete` | `zep.api.graphs.edges.delete` | `destructive` | Delete edge. Cannot be undone. (DELETE /graphs/{graph_uuid}/edges/{edge_uuid}) |
| `graphs.edges.get` | `zep.api.graphs.edges.get` | `read` | Get edge. (GET /graphs/{graph_uuid}/edges/{edge_uuid}) |
| `graphs.edges.list` | `zep.api.graphs.edges.list` | `read` | List edges. Lists the edges of a graph and returns one page of results. The default page_size is 50, and the maximum page_size is 100. You can sort by uuid, created_at, or valid_at. The default sort is uuid in descending order. An edge with no valid_at sorts as if its valid_at is 1970-01-01T00:00:00Z. |
| `graphs.edges.update` | `zep.api.graphs.edges.update` | `write` | Update edge. Updates one edge. When the edge belongs to a hyperedge, changing fact rewrites it on every member of that hyperedge in one all-or-nothing write, because the members share it. Attribute-only edits touch this edge alone. |
| `graphs.episodes.add` | `zep.api.graphs.episodes.add` | `write` | Add episode. (POST /graphs/{graph_uuid}/episodes) |
| `graphs.episodes.delete` | `zep.api.graphs.episodes.delete` | `destructive` | Delete episode. Cannot be undone. (DELETE /graphs/{graph_uuid}/episodes/{episode_uuid}) |
| `graphs.episodes.get` | `zep.api.graphs.episodes.get` | `read` | Get episode. (GET /graphs/{graph_uuid}/episodes/{episode_uuid}) |
| `graphs.episodes.getDebugLogs` | `zep.api.graphs.episodes.getDebugLogs` | `read` | Get episode debug logs. Returns the ingestion workflow log of an episode. The log exists only when debug logging was enabled for the project when the episode was ingested (see debug_log.enable). |
| `graphs.episodes.list` | `zep.api.graphs.episodes.list` | `read` | List episodes. Lists the episodes of a graph. filters.mentioned_node_uuids restricts the results to episodes that mention any of the listed node UUIDs. The list can also contain episode UUIDs: an episode UUID matches that episode, so one request can return a known set of episodes. At most 256 entries. |
| `graphs.episodes.listIngestionTraces` | `zep.api.graphs.episodes.listIngestionTraces` | `read` | List episode ingestion traces. Returns the ingestion traces of an episode, oldest first. Each trace records the input and the output of one ingestion step, with an explanation on each output entry that has one. |
| `graphs.episodes.update` | `zep.api.graphs.episodes.update` | `write` | Update episode. (PATCH /graphs/{graph_uuid}/episodes/{episode_uuid}) |
| `graphs.get` | `zep.api.graphs.get` | `read` | Get graph. (GET /graphs/{graph_uuid}) |
| `graphs.getContentPolicy` | `zep.api.graphs.getContentPolicy` | `read` | Get graph content policy. Experimental: the request, the response, and the behavior of this operation can change. Returns the content policy the graph bound at creation. The policy of a graph does not change after creation. A graph without a content policy returns revision 0 with no categories and no rules. |
| `graphs.getContext` | `zep.api.graphs.getContext` | `read` | Assemble graph context. (POST /graphs/{graph_uuid}/context) |
| `graphs.getInclusionRules` | `zep.api.graphs.getInclusionRules` | `read` | Get graph inclusion rules. Returns the graph rules, for example {"inclusion_rules":[],"inherited":true}. |
| `graphs.getInstructions` | `zep.api.graphs.getInstructions` | `read` | Get graph instructions. (GET /graphs/{graph_uuid}/instructions) |
| `graphs.getKnowledge` | `zep.api.graphs.getKnowledge` | `read` | Get graph knowledge. Returns the domain knowledge in effect at this scope. The knowledge_api account flag must be enabled. Response example: {"knowledge":[{"name":"CRM","text":"CRM means the customer service."}],"inherited":false} |
| `graphs.getObservationSteering` | `zep.api.graphs.getObservationSteering` | `read` | Get graph observation steering. (GET /graphs/{graph_uuid}/observation-steering) |
| `graphs.getOntology` | `zep.api.graphs.getOntology` | `read` | Get graph ontology. (GET /graphs/{graph_uuid}/ontology) |
| `graphs.getSubgraph` | `zep.api.graphs.getSubgraph` | `read` | Get subgraph. (POST /graphs/{graph_uuid}/subgraph) |
| `graphs.hyperedges.add` | `zep.api.graphs.hyperedges.add` | `write` | Add hyperedge. Creates one hyperedge: a fact that relates more than two nodes, written onto one member edge per node pair. The member edges must span at least three distinct nodes, since two nodes are a pair of edges rather than a hyperedge; a single pair uses graph.edge.add. |
| `graphs.hyperedges.createEdge` | `zep.api.graphs.hyperedges.createEdge` | `write` | Add hyperedge member. Adds one member edge to an existing hyperedge. The new member inherits the hyperedge's fact and timestamps and joins its episodes, so only its own name and node pair are supplied. The response contains the UUID that Zep assigned and the name and nodes that you supplied. |
| `graphs.hyperedges.delete` | `zep.api.graphs.hyperedges.delete` | `destructive` | Delete hyperedge. Deletes every member edge of the hyperedge. After the task completes the hyperedge and each of its members are gone. Cannot be undone. |
| `graphs.hyperedges.deleteEdge` | `zep.api.graphs.hyperedges.deleteEdge` | `destructive` | Delete hyperedge member. Removes one member edge from the hyperedge. The remaining members stay in the hyperedge, and deleting the last member removes the hyperedge itself. Cannot be undone. |
| `graphs.hyperedges.get` | `zep.api.graphs.hyperedges.get` | `read` | Get hyperedge. Returns one hyperedge assembled from its member edges. The fact and the validity timestamps are shared by every member and are reported on the hyperedge; each member reports only its own name and endpoints. |
| `graphs.hyperedges.list` | `zep.api.graphs.hyperedges.list` | `read` | List hyperedges. Returns the graph's hyperedges. A hyperedge is listed while it has at least one member edge. Supported filters are node_uuids, edge_uuids and episode_uuids: a hyperedge matches a list when any of its members does, and must match every list supplied. |
| `graphs.hyperedges.update` | `zep.api.graphs.hyperedges.update` | `write` | Update hyperedge. Updates the shared fact and writes it onto every member edge in one all-or-nothing write: either every member carries the new fact or none does. Only fact is accepted, because it is the only field the members share. |
| `graphs.list` | `zep.api.graphs.list` | `read` | List graphs. (POST /graphs/list) |
| `graphs.listContentPolicyEvents` | `zep.api.graphs.listContentPolicyEvents` | `read` | List graph content policy events. Experimental: the request, the response, and the behavior of this operation can change. Lists the content policy decisions recorded for a graph, newest first. Each event carries identifiers only. A graph without a content policy returns an empty list. |
| `graphs.listMetadataKeys` | `zep.api.graphs.listMetadataKeys` | `read` | List graph metadata keys. Returns the append-only metadata keys recorded for a graph. A key can remain in the list after no episode or message uses it. |
| `graphs.lookup` | `zep.api.graphs.lookup` | `read` | Lookup graph by developer id. (POST /graphs/lookup) |
| `graphs.nodes.add` | `zep.api.graphs.nodes.add` | `write` | Add nodes. (POST /graphs/{graph_uuid}/nodes) |
| `graphs.nodes.delete` | `zep.api.graphs.nodes.delete` | `destructive` | Delete node. Cannot be undone. (DELETE /graphs/{graph_uuid}/nodes/{node_uuid}) |
| `graphs.nodes.get` | `zep.api.graphs.nodes.get` | `read` | Get node. (GET /graphs/{graph_uuid}/nodes/{node_uuid}) |
| `graphs.nodes.list` | `zep.api.graphs.nodes.list` | `read` | List nodes. Lists the nodes of a graph and returns one page of results. The default page_size is 50, and the maximum page_size is 100. You can sort by uuid, created_at, or degree. The default sort is uuid in descending order. |
| `graphs.nodes.listNeighbors` | `zep.api.graphs.nodes.listNeighbors` | `read` | List node neighbors. (POST /graphs/{graph_uuid}/nodes/{node_uuid}/neighbors) |
| `graphs.nodes.update` | `zep.api.graphs.nodes.update` | `write` | Update node. (PATCH /graphs/{graph_uuid}/nodes/{node_uuid}) |
| `graphs.observations.get` | `zep.api.graphs.observations.get` | `read` | Get observation. (GET /graphs/{graph_uuid}/observations/{observation_uuid}) |
| `graphs.observations.list` | `zep.api.graphs.observations.list` | `read` | List observations. Lists the observations of a graph and returns one page of results. The default page_size is 50, and the maximum page_size is 100. You can sort by uuid or created_at. The default sort is uuid in descending order. |
| `graphs.query` | `zep.api.graphs.query` | `read` | Query a graph. Experimental. Smart Query retrieves multi-hop context from a graph in one call. Some agent tasks need multi-hop retrieval: the agent does not know in advance what to search for, so it must retrieve a record, learn from it, and then plan the next retrieval. |
| `graphs.searchEdges` | `zep.api.graphs.searchEdges` | `read` | Search edges. Edge search does not support node_labels, exclude_node_labels, or content_policy_violated. content_policy_violated is supported on episode search only. An edge has two nodes, so a node label filter is not defined for edge search. |
| `graphs.searchEpisodes` | `zep.api.graphs.searchEpisodes` | `read` | Search episodes. Episode search supports only the metadata_filters and content_policy_violated filters. Every other filter returns unsupported_filter. |
| `graphs.searchNodes` | `zep.api.graphs.searchNodes` | `read` | Search nodes. Node search does not support edge_types, exclude_edge_types, edge_uuids, connected_node_uuids, source_node_uuids, target_node_uuids, date_filters, or content_policy_violated. content_policy_violated is supported on episode search only. The edge filters select edges. |
| `graphs.searchObservations` | `zep.api.graphs.searchObservations` | `read` | Search observations. Observation search supports no filters. Every filter returns unsupported_filter. |
| `graphs.searchThreadSummaries` | `zep.api.graphs.searchThreadSummaries` | `read` | Search thread summaries. Thread-summary search supports only the metadata_filters filter, which matches the metadata of the thread episodes. Every other filter returns unsupported_filter. |
| `graphs.setInclusionRules` | `zep.api.graphs.setInclusionRules` | `write` | Set graph inclusion rules. Replaces the graph rules. Request: {"inclusion_rules":[]}. Response: {"inclusion_rules":[],"inherited":true}. |
| `graphs.setInstructions` | `zep.api.graphs.setInstructions` | `write` | Set graph instructions. (PUT /graphs/{graph_uuid}/instructions) |
| `graphs.setKnowledge` | `zep.api.graphs.setKnowledge` | `write` | Set graph knowledge. Replaces the complete set of domain knowledge entries at this scope. The knowledge_api account flag must be enabled. |
| `graphs.setObservationSteering` | `zep.api.graphs.setObservationSteering` | `write` | Set graph observation steering. (PUT /graphs/{graph_uuid}/observation-steering) |
| `graphs.setOntology` | `zep.api.graphs.setOntology` | `write` | Set graph ontology. (PUT /graphs/{graph_uuid}/ontology) |
| `graphs.threadSummaries.list` | `zep.api.graphs.threadSummaries.list` | `read` | List thread summaries. Lists the thread summaries of a graph and returns one page of results. The default page_size is 50, and the maximum page_size is 100. You can sort by uuid or created_at. The default sort is uuid in descending order. |
| `graphs.update` | `zep.api.graphs.update` | `write` | Update graph. (PATCH /graphs/{graph_uuid}) |
| `graphs.warm` | `zep.api.graphs.warm` | `write` | Warm graph. (POST /graphs/{graph_uuid}/warm) |
| `lookup.developerIds` | `zep.api.lookup.developerIds` | `read` | Batch lookup of developer ids. (POST /lookup) |
| `project.get` | `zep.api.project.get` | `read` | Get project. (GET /project) |
| `project.getContentPolicy` | `zep.api.project.getContentPolicy` | `read` | Get project content policy. Experimental: the request, the response, and the behavior of this operation can change. Returns the current content policy revision of the project. A new graph binds this revision at creation. |
| `project.getContentPolicyRevision` | `zep.api.project.getContentPolicyRevision` | `read` | Get project content policy revision. Experimental: the request, the response, and the behavior of this operation can change. |
| `project.getInclusionRules` | `zep.api.project.getInclusionRules` | `read` | Get project inclusion rules. Returns the project rules, for example {"inclusion_rules":[],"inherited":false}. |
| `project.getInstructions` | `zep.api.project.getInstructions` | `read` | Get project instructions. (GET /project/instructions) |
| `project.getKnowledge` | `zep.api.project.getKnowledge` | `read` | Get project knowledge. Returns the domain knowledge in effect at this scope. The knowledge_api account flag must be enabled. Response example: {"knowledge":[{"name":"CRM","text":"CRM means the customer service."}],"inherited":false} |
| `project.getObservationSteering` | `zep.api.project.getObservationSteering` | `read` | Get project observation steering. (GET /project/observation-steering) |
| `project.getOntology` | `zep.api.project.getOntology` | `read` | Get project ontology. (GET /project/ontology) |
| `project.getUserSummaryInstructions` | `zep.api.project.getUserSummaryInstructions` | `read` | Get project user-summary instructions. (GET /project/user-summary-instructions) |
| `project.listContentPolicyRevisions` | `zep.api.project.listContentPolicyRevisions` | `read` | List project content policy revisions. Experimental: the request, the response, and the behavior of this operation can change. Lists every revision of the project content policy, newest first, including revision 0. |
| `project.setContentPolicy` | `zep.api.project.setContentPolicy` | `write` | Set project content policy. Experimental: this operation and the new rule fields can change. The typed rule fields are in private preview and are available only to enabled accounts. Replaces the project content policy and creates a new immutable revision. Graphs that already exist keep the revision they bound. |
| `project.setInclusionRules` | `zep.api.project.setInclusionRules` | `write` | Set project inclusion rules. Replaces the project rules. Request: {"inclusion_rules":[]}. Response: {"inclusion_rules":[],"inherited":false}. |
| `project.setInstructions` | `zep.api.project.setInstructions` | `write` | Set project instructions. (PUT /project/instructions) |
| `project.setKnowledge` | `zep.api.project.setKnowledge` | `write` | Set project knowledge. Replaces the complete set of domain knowledge entries at this scope. The knowledge_api account flag must be enabled. |
| `project.setObservationSteering` | `zep.api.project.setObservationSteering` | `write` | Set project observation steering. (PUT /project/observation-steering) |
| `project.setOntology` | `zep.api.project.setOntology` | `write` | Set project ontology. Replaces the entity types and the edge types that the project uses. |
| `project.setUserSummaryInstructions` | `zep.api.project.setUserSummaryInstructions` | `write` | Set project user-summary instructions. (PUT /project/user-summary-instructions) |
| `project.update` | `zep.api.project.update` | `write` | Update project. Set hyperedges_enabled to true to enable extraction. A member needs the project.edit permission. Project API keys receive 403 permission_denied. |
| `tasks.get` | `zep.api.tasks.get` | `read` | Get task. (GET /tasks/{task_uuid}) |
| `tasks.list` | `zep.api.tasks.list` | `read` | List tasks. (GET /tasks) |
| `threads.create` | `zep.api.threads.create` | `write` | Create thread. (POST /threads) |
| `threads.delete` | `zep.api.threads.delete` | `destructive` | Delete thread. Cannot be undone. (DELETE /threads/{thread_uuid}) |
| `threads.get` | `zep.api.threads.get` | `read` | Get thread. (GET /threads/{thread_uuid}) |
| `threads.getContext` | `zep.api.threads.getContext` | `read` | Get thread context. (GET /threads/{thread_uuid}/context) |
| `threads.getSummary` | `zep.api.threads.getSummary` | `read` | Get thread summary. (GET /threads/{thread_uuid}/summary) |
| `threads.list` | `zep.api.threads.list` | `read` | List threads. (GET /threads) |
| `threads.listEpisodes` | `zep.api.threads.listEpisodes` | `read` | List thread episodes. (GET /threads/{thread_uuid}/episodes) |
| `threads.lookup` | `zep.api.threads.lookup` | `read` | Lookup thread by developer id. (POST /threads/lookup) |
| `threads.messages.add` | `zep.api.threads.messages.add` | `write` | Add thread messages. (POST /threads/{thread_uuid}/messages) |
| `threads.messages.get` | `zep.api.threads.messages.get` | `read` | Get message. (GET /threads/{thread_uuid}/messages/{message_uuid}) |
| `threads.messages.list` | `zep.api.threads.messages.list` | `read` | List thread messages. (GET /threads/{thread_uuid}/messages) |
| `threads.messages.update` | `zep.api.threads.messages.update` | `write` | Update message. (PATCH /threads/{thread_uuid}/messages/{message_uuid}) |
| `traceConnections.create` | `zep.api.traceConnections.create` | `write` | Create a trace connection. Verify a provider credential before Zep stores it. Both providers accept 1 to 60 requests per minute and an optional retention window. |
| `traceConnections.delete` | `zep.api.traceConnections.delete` | `destructive` | Delete a trace connection. Delete a trace connection that no active trace import uses. Cannot be undone. |
| `traceConnections.get` | `zep.api.traceConnections.get` | `read` | Get a trace connection. Read one trace connection. The response includes a credential hint and never includes the credential. |
| `traceConnections.getTrace` | `zep.api.traceConnections.getTrace` | `read` | Get a source trace. Read one trace and optionally preview a mapping. Example body: {"provider_project_id":"project_123","trace_id":"trace-123","mapping":{"task_family":{"source":"fixed","value":"support"}}}. |
| `traceConnections.list` | `zep.api.traceConnections.list` | `read` | List trace connections. List trace connections in the current Zep project. |
| `traceConnections.listProjects` | `zep.api.traceConnections.listProjects` | `read` | List provider projects. List provider projects with the page_size and cursor query parameters. |
| `traceConnections.listTraces` | `zep.api.traceConnections.listTraces` | `read` | List source traces. Filter provider traces. Example body: {"provider_project_id":"project_123","filter":{"started_after":"2026-01-01T00:00:00Z"}}. |
| `traceConnections.update` | `zep.api.traceConnections.update` | `write` | Update a trace connection. Verify changed settings before Zep stores them. A request that changes api_url must also include credential. Otherwise Zep returns 400 invalid_request. Both providers accept 1 to 60 requests per minute and an optional retention window. Example request: {"requests_per_minute":60,"retention_days":30}. |
| `traceConnections.verify` | `zep.api.traceConnections.verify` | `write` | Verify a trace connection. Check the provider credential and update the connection status. |
| `userGroups.addMembers` | `zep.api.userGroups.addMembers` | `write` | Add user group members. Requires attribute-based access control to be enabled for your account. |
| `userGroups.attachPolicySet` | `zep.api.userGroups.attachPolicySet` | `write` | Attach policy set to a user group. Administrative operation. Requires a bearer token. Manage policy sets from the Zep dashboard. |
| `userGroups.create` | `zep.api.userGroups.create` | `write` | Create user group. Requires attribute-based access control to be enabled for your account. |
| `userGroups.delete` | `zep.api.userGroups.delete` | `destructive` | Delete user group. Requires attribute-based access control to be enabled for your account. Cannot be undone. |
| `userGroups.detachPolicySet` | `zep.api.userGroups.detachPolicySet` | `destructive` | Detach policy set from a user group. Administrative operation. Requires a bearer token. Manage policy sets from the Zep dashboard. Cannot be undone. |
| `userGroups.get` | `zep.api.userGroups.get` | `read` | Get user group. Requires attribute-based access control to be enabled for your account. |
| `userGroups.list` | `zep.api.userGroups.list` | `read` | List user groups. Requires attribute-based access control to be enabled for your account. |
| `userGroups.listMemberCandidates` | `zep.api.userGroups.listMemberCandidates` | `read` | List member candidates. Requires attribute-based access control to be enabled for your account. |
| `userGroups.listMembers` | `zep.api.userGroups.listMembers` | `read` | List user group members. Requires attribute-based access control to be enabled for your account. |
| `userGroups.listPolicySets` | `zep.api.userGroups.listPolicySets` | `read` | List policy sets on a user group. Administrative operation. Requires a bearer token. Manage policy sets from the Zep dashboard. |
| `userGroups.removeMember` | `zep.api.userGroups.removeMember` | `destructive` | Remove one user group member. Requires attribute-based access control to be enabled for your account. Cannot be undone. |
| `userGroups.removeMembers` | `zep.api.userGroups.removeMembers` | `destructive` | Remove user group members. Requires attribute-based access control to be enabled for your account. |
| `userGroups.update` | `zep.api.userGroups.update` | `write` | Update user group. Requires attribute-based access control to be enabled for your account. |
| `users.create` | `zep.api.users.create` | `write` | Create user. (POST /users) |
| `users.delete` | `zep.api.users.delete` | `destructive` | Delete user. Cannot be undone. (DELETE /users/{user_uuid}) |
| `users.get` | `zep.api.users.get` | `read` | Get user. (GET /users/{user_uuid}) |
| `users.getByEmail` | `zep.api.users.getByEmail` | `read` | Get user by email. Send {"email": "jane@example.com"} to get the user with this email. An email matches only when the stored and requested values are equal after normalization. Normalization lowercases both values and trims leading and trailing whitespace. |
| `users.getNode` | `zep.api.users.getNode` | `read` | Get user node. (GET /users/{user_uuid}/node) |
| `users.getSummaryInstructions` | `zep.api.users.getSummaryInstructions` | `read` | Get user summary instructions. (GET /users/{user_uuid}/summary-instructions) |
| `users.list` | `zep.api.users.list` | `read` | List users. (POST /users/list) |
| `users.listUserGroups` | `zep.api.users.listUserGroups` | `read` | List user groups for a user. Requires attribute-based access control to be enabled for your account. |
| `users.lookup` | `zep.api.users.lookup` | `read` | Lookup user by developer id. (POST /users/lookup) |
| `users.setSummaryInstructions` | `zep.api.users.setSummaryInstructions` | `write` | Set user summary instructions. (PUT /users/{user_uuid}/summary-instructions) |
| `users.update` | `zep.api.users.update` | `write` | Update user. (PATCH /users/{user_uuid}) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 3 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zep

## License

Apache-2.0
