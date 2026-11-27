// Generated from Zep's OpenAPI spec (https://help.getzep.com/openapi/sdk-reference.json,
// fetched 2026-11-27); zep-manifest.json is the same contract as JSON.
// Inputs are the published parameters and request bodies in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

import type { FileInput, FileOutput } from 'corsair/http';

export type ZepJsonValue =
	| null
	| boolean
	| number
	| string
	| ZepJsonValue[]
	| { [key: string]: ZepJsonValue | undefined };

export const ZEP_OPERATION_IDS = [
	'agents.create',
	'agents.declareBreakingChange',
	'agents.delete',
	'agents.get',
	'agents.getContext',
	'agents.learning.get',
	'agents.learning.listRuns',
	'agents.list',
	'agents.literalPolicy.get',
	'agents.literalPolicy.update',
	'agents.planSplit',
	'agents.skillCandidates.evaluate',
	'agents.skillCandidates.get',
	'agents.skillCandidates.list',
	'agents.skillPublications.lookup',
	'agents.skills.approve',
	'agents.skills.create',
	'agents.skills.createVersion',
	'agents.skills.evaluations.create',
	'agents.skills.evidence.list',
	'agents.skills.get',
	'agents.skills.getPublication',
	'agents.skills.importPackage',
	'agents.skills.list',
	'agents.skills.relations.list',
	'agents.skills.retire',
	'agents.skills.search',
	'agents.skills.uses.addOutcome',
	'agents.skills.uses.create',
	'agents.skills.versions.compare',
	'agents.skills.versions.exports.create',
	'agents.skills.versions.exports.get',
	'agents.skills.versions.get',
	'agents.skills.versions.list',
	'agents.skills.versions.restore',
	'agents.taskFamilies.list',
	'agents.taskFamilies.rename',
	'agents.traceImports.create',
	'agents.traceImports.delete',
	'agents.traceImports.get',
	'agents.traceImports.list',
	'agents.traceImports.pause',
	'agents.traceImports.resume',
	'agents.traceImports.runs.create',
	'agents.traceImports.runs.get',
	'agents.traceImports.runs.items.list',
	'agents.traceImports.runs.list',
	'agents.traceImports.update',
	'agents.traces.abandon',
	'agents.traces.appendEvent',
	'agents.traces.close',
	'agents.traces.correctTaskFamily',
	'agents.traces.create',
	'agents.traces.delete',
	'agents.traces.deleteEvent',
	'agents.traces.get',
	'agents.traces.getSummary',
	'agents.traces.list',
	'agents.traces.listEvents',
	'agents.traces.listSummaryVersions',
	'agents.traces.reopen',
	'agents.traces.update',
	'agents.update',
	'agents.verifiers.get',
	'agents.verifiers.invalidateEvidence',
	'agents.verifiers.list',
	'agents.verifiers.revoke',
	'agents.verifiers.update',
	'batches.addItems',
	'batches.create',
	'batches.delete',
	'batches.get',
	'batches.list',
	'batches.listItems',
	'batches.process',
	'contextTemplates.create',
	'contextTemplates.delete',
	'contextTemplates.get',
	'contextTemplates.list',
	'contextTemplates.update',
	'debugLogs.enable',
	'graphs.clone',
	'graphs.create',
	'graphs.delete',
	'graphs.documentSummaries.list',
	'graphs.edges.add',
	'graphs.edges.delete',
	'graphs.edges.get',
	'graphs.edges.list',
	'graphs.edges.update',
	'graphs.episodes.add',
	'graphs.episodes.delete',
	'graphs.episodes.get',
	'graphs.episodes.getDebugLogs',
	'graphs.episodes.list',
	'graphs.episodes.listIngestionTraces',
	'graphs.episodes.update',
	'graphs.get',
	'graphs.getContentPolicy',
	'graphs.getContext',
	'graphs.getInclusionRules',
	'graphs.getInstructions',
	'graphs.getKnowledge',
	'graphs.getObservationSteering',
	'graphs.getOntology',
	'graphs.getSubgraph',
	'graphs.hyperedges.add',
	'graphs.hyperedges.createEdge',
	'graphs.hyperedges.delete',
	'graphs.hyperedges.deleteEdge',
	'graphs.hyperedges.get',
	'graphs.hyperedges.list',
	'graphs.hyperedges.update',
	'graphs.list',
	'graphs.listContentPolicyEvents',
	'graphs.listMetadataKeys',
	'graphs.lookup',
	'graphs.nodes.add',
	'graphs.nodes.delete',
	'graphs.nodes.get',
	'graphs.nodes.list',
	'graphs.nodes.listNeighbors',
	'graphs.nodes.update',
	'graphs.observations.get',
	'graphs.observations.list',
	'graphs.query',
	'graphs.searchEdges',
	'graphs.searchEpisodes',
	'graphs.searchNodes',
	'graphs.searchObservations',
	'graphs.searchThreadSummaries',
	'graphs.setInclusionRules',
	'graphs.setInstructions',
	'graphs.setKnowledge',
	'graphs.setObservationSteering',
	'graphs.setOntology',
	'graphs.threadSummaries.list',
	'graphs.update',
	'graphs.warm',
	'lookup.developerIds',
	'project.get',
	'project.getContentPolicy',
	'project.getContentPolicyRevision',
	'project.getInclusionRules',
	'project.getInstructions',
	'project.getKnowledge',
	'project.getObservationSteering',
	'project.getOntology',
	'project.getUserSummaryInstructions',
	'project.listContentPolicyRevisions',
	'project.setContentPolicy',
	'project.setInclusionRules',
	'project.setInstructions',
	'project.setKnowledge',
	'project.setObservationSteering',
	'project.setOntology',
	'project.setUserSummaryInstructions',
	'project.update',
	'tasks.get',
	'tasks.list',
	'threads.create',
	'threads.delete',
	'threads.get',
	'threads.getContext',
	'threads.getSummary',
	'threads.list',
	'threads.listEpisodes',
	'threads.lookup',
	'threads.messages.add',
	'threads.messages.get',
	'threads.messages.list',
	'threads.messages.update',
	'traceConnections.create',
	'traceConnections.delete',
	'traceConnections.get',
	'traceConnections.getTrace',
	'traceConnections.list',
	'traceConnections.listProjects',
	'traceConnections.listTraces',
	'traceConnections.update',
	'traceConnections.verify',
	'userGroups.addMembers',
	'userGroups.attachPolicySet',
	'userGroups.create',
	'userGroups.delete',
	'userGroups.detachPolicySet',
	'userGroups.get',
	'userGroups.list',
	'userGroups.listMemberCandidates',
	'userGroups.listMembers',
	'userGroups.listPolicySets',
	'userGroups.removeMember',
	'userGroups.removeMembers',
	'userGroups.update',
	'users.create',
	'users.delete',
	'users.get',
	'users.getByEmail',
	'users.getNode',
	'users.getSummaryInstructions',
	'users.list',
	'users.listUserGroups',
	'users.lookup',
	'users.setSummaryInstructions',
	'users.update',
] as const;

export type ZepOperationId = (typeof ZEP_OPERATION_IDS)[number];

export type ZepAgentsAgentUuidSkillsSkillUuidRelationsGetParametersKindSchemaItemsInput =
	| 'composes'
	| 'requires'
	| 'conflicts_with'
	| 'supersedes'
	| 'related'
	| 'uses_tool'
	| 'uses_environment'
	| 'supported_by'
	| 'contradicted_by'
	| 'supersedes_version'
	| 'applied_in';

export type ZepAgentsAgentUuidSkillsSkillUuidVersionsGetParametersMarkdownFormatInput =
	| 'agent'
	| 'full';

export type ZepAgentsAgentUuidSkillsSkillUuidVersionsVersionGetParametersIncludeInput =
	'contract';

export type ZepAgentsAgentUuidSkillsSkillUuidVersionsVersionGetParametersMarkdownFormatInput =
	| 'agent'
	| 'full';

export type ZepAgentsAgentUuidTraceImportsImportUuidDeleteParametersTracesInput =
	| 'keep'
	| 'delete';

export type ZepAgentsAgentUuidTracesListPostParametersOrderInput =
	| 'asc'
	| 'desc';

export type ZepAgentsAgentUuidTracesListPostParametersOrderByInput =
	| 'created_at'
	| 'updated_at';

export type ZepAgentsAgentUuidTracesListPostParametersSourceKindInput =
	| 'native'
	| 'trace_import';

export type ZepAgentsListPostParametersOrderInput = 'asc' | 'desc';

export type ZepAgentsListPostParametersOrderByInput =
	| 'created_at'
	| 'updated_at'
	| 'name';

export type ZepBatchesGetParametersStatusInput =
	| 'draft'
	| 'invalid'
	| 'queued'
	| 'processing'
	| 'succeeded'
	| 'partial'
	| 'failed'
	| 'canceled';

export type ZepGraphsGraphUuidDocumentSummariesListPostParametersOrderInput =
	| 'asc'
	| 'desc';

export type ZepGraphsGraphUuidDocumentSummariesListPostParametersOrderByInput =
	| 'uuid'
	| 'created_at';

export type ZepGraphsGraphUuidEdgesListPostParametersOrderInput =
	| 'asc'
	| 'desc';

export type ZepGraphsGraphUuidEdgesListPostParametersOrderByInput =
	| 'uuid'
	| 'created_at'
	| 'valid_at';

export type ZepGraphsGraphUuidEpisodesListPostParametersOrderInput =
	| 'asc'
	| 'desc';

export type ZepGraphsGraphUuidEpisodesListPostParametersOrderByInput =
	| 'created_at'
	| 'uuid';

export type ZepGraphsGraphUuidHyperedgesListPostParametersOrderInput =
	| 'asc'
	| 'desc';

export type ZepGraphsGraphUuidHyperedgesListPostParametersOrderByInput =
	| 'uuid'
	| 'created_at';

export type ZepGraphsGraphUuidNodesListPostParametersOrderInput =
	| 'asc'
	| 'desc';

export type ZepGraphsGraphUuidNodesListPostParametersOrderByInput =
	| 'uuid'
	| 'created_at'
	| 'degree';

export type ZepGraphsGraphUuidNodesNodeUuidNeighborsPostParametersOrderInput =
	| 'asc'
	| 'desc';

export type ZepGraphsGraphUuidNodesNodeUuidNeighborsPostParametersOrderByInput =
	| 'uuid'
	| 'created_at';

export type ZepGraphsGraphUuidObservationsListPostParametersOrderInput =
	| 'asc'
	| 'desc';

export type ZepGraphsGraphUuidObservationsListPostParametersOrderByInput =
	| 'uuid'
	| 'created_at';

export type ZepGraphsGraphUuidThreadSummariesListPostParametersOrderInput =
	| 'asc'
	| 'desc';

export type ZepGraphsGraphUuidThreadSummariesListPostParametersOrderByInput =
	| 'uuid'
	| 'created_at';

export type ZepGraphsListPostParametersOrderInput = 'asc' | 'desc';

export type ZepGraphsListPostParametersOrderByInput =
	| 'created_at'
	| 'name'
	| 'uuid';

export type ZepTasksGetParametersStatusInput =
	| 'pending'
	| 'processing'
	| 'succeeded'
	| 'partial'
	| 'failed';

export type ZepTasksGetParametersTypeInput =
	| 'user.delete'
	| 'agent.delete'
	| 'thread.delete'
	| 'graph.delete'
	| 'graph.add'
	| 'graph.add_nodes'
	| 'graph.add_edges'
	| 'graph.add_fact_triple'
	| 'graph.add_triple'
	| 'graph.edge.add'
	| 'graph.clone'
	| 'graph.warm'
	| 'graph.episode.delete'
	| 'graph.node.delete'
	| 'graph.edge.delete'
	| 'graph.hyperedge.add'
	| 'graph.hyperedge.create_edge'
	| 'graph.hyperedge.delete'
	| 'graph.hyperedge.delete_edge'
	| 'thread.add_messages'
	| 'batch.process'
	| 'agent.trajectory.finalize'
	| 'agent.trajectory.repair.task_family'
	| 'agent.trajectory.repair.evidence_deletion'
	| 'agent.trajectory_import.run'
	| 'agent.trajectory_import.delete'
	| 'agent.verifier.repair.evidence_invalidation'
	| 'agent.skill.repair.source_deletion'
	| 'agent.skill.export'
	| 'agent.skill.import';

export type ZepThreadsGetParametersOrderInput = 'asc' | 'desc';

export type ZepThreadsGetParametersOrderByInput =
	| 'created_at'
	| 'updated_at'
	| 'uuid';

export type ZepThreadsThreadUuidMessagesGetParametersOrderInput =
	| 'asc'
	| 'desc';

export type ZepThreadsThreadUuidMessagesGetParametersOrderByInput =
	'created_at';

export type ZepUsersListPostParametersOrderInput = 'asc' | 'desc';

export type ZepUsersListPostParametersOrderByInput =
	| 'created_at'
	| 'user_id'
	| 'email'
	| 'uuid';

/** The developer records the attempt outcome. Valid values are succeeded, failed, partial, abandoned, and unknown. */
export type ZepV4AddAgentSkillUseOutcomeRequestOutcomeInput =
	| 'succeeded'
	| 'failed'
	| 'partial'
	| 'abandoned'
	| 'unknown';

/** The data format of the episode: text, json, or message. Defaults to text. */
export type ZepV4AddEpisodeRequestTypeInput = 'text' | 'json' | 'message';

/** The developer sets the approval mode. Valid values are auto and manual. The default is auto. */
export type ZepV4AgentMemorySettingsApprovalInput = 'manual' | 'auto';

/** The developer selects the compilation mode. Valid values are scheduled, manual, and on_close. The default is scheduled. */
export type ZepV4AgentMemorySettingsCompilationModeInput =
	| 'scheduled'
	| 'manual'
	| 'on_close';

/** Include only the events with this drop reason. */
export type ZepV4ContentPolicyEventListFiltersDropReasonInput =
	| 'match'
	| 'indeterminate'
	| 'oversize'
	| 'dependent';

/** The rule action. The supported values are exclude and include. The include action is experimental and gated. */
export type ZepV4ContentPolicyRuleRequestActionInput = 'exclude' | 'include';

/** The developer selects the evaluation source. Valid values are customer, tool, offline_corpus, policy. */
export type ZepV4CreateAgentSkillCandidateEvaluationRequestEvaluatedByInput =
	| 'customer'
	| 'tool'
	| 'offline_corpus'
	| 'policy';

/** The developer supplies evaluation verdict. Valid values are succeeded, failed, partial, unknown. */
export type ZepV4CreateAgentSkillCandidateEvaluationRequestVerdictInput =
	| 'succeeded'
	| 'failed'
	| 'partial'
	| 'unknown';

/** The developer selects the evaluation source. Valid values are customer, tool, offline_corpus, policy. */
export type ZepV4CreateAgentSkillEvaluationRequestEvaluatedByInput =
	| 'customer'
	| 'tool'
	| 'offline_corpus'
	| 'policy';

/** The developer supplies evaluation verdict. Valid values are succeeded, failed, partial, unknown. */
export type ZepV4CreateAgentSkillEvaluationRequestVerdictInput =
	| 'succeeded'
	| 'failed'
	| 'partial'
	| 'unknown';

/** The developer supplies how the Skill was used. Valid values are selected, used, partially_used, ignored, inapplicable. */
export type ZepV4CreateAgentSkillUseRequestUsageInput =
	| 'selected'
	| 'used'
	| 'partially_used'
	| 'ignored'
	| 'inapplicable';

/** Provider is the Braintrust or LangSmith provider. */
export type ZepV4CreateTraceConnectionRequestProviderInput =
	| 'braintrust'
	| 'langsmith';

/** The temporal field to compare. */
export type ZepV4DateFilterFieldInput =
	| 'created_at'
	| 'valid_at'
	| 'invalid_at'
	| 'expired_at';

/** The lowercase comparison operator. */
export type ZepV4DateFilterOperatorInput =
	| 'eq'
	| 'ne'
	| 'gt'
	| 'lt'
	| 'gte'
	| 'lte'
	| 'is_null'
	| 'is_not_null';

/** Adjusts result selection to favor more recent graph data. */
export type ZepV4GraphContextRequestRecencyBiasInput =
	| 'off'
	| 'mild'
	| 'strong';

/** Effect includes or excludes matching candidates. */
export type ZepV4InclusionRuleEffectInput = 'include' | 'exclude';

/** Target selects entity candidates or fact candidates. */
export type ZepV4InclusionRuleTargetInput = 'entity' | 'fact';

/** The logical operator for this group. */
export type ZepV4MetadataFilterGroupTypeInput = 'and' | 'or';

/** The lowercase comparison operator. */
export type ZepV4MetadataFilterOperatorInput =
	| 'eq'
	| 'ne'
	| 'gt'
	| 'lt'
	| 'gte'
	| 'lte'
	| 'in'
	| 'contains'
	| 'is_null'
	| 'is_not_null';

/** The comparison value. Use an array for in, a non-empty string for contains, and omit the field for null operators. */
export type ZepV4MetadataFilterValueInput =
	| string
	| number
	| boolean
	| ZepV4MetadataFilterValue3Input;

export type ZepV4MetadataFilterValue3Input =
	Array<ZepV4MetadataFilterValueOneOf3ItemsInput>;

export type ZepV4MetadataFilterValueOneOf3ItemsInput =
	| string
	| number
	| boolean;

/** The edge orientation to follow from the node: in, out, or both. */
export type ZepV4NeighborsRequestDirectionInput = 'in' | 'out' | 'both';

/** Source selects the objective source. */
export type ZepV4ObjectiveMappingRuleSourceInput =
	| 'first_user_message'
	| 'root_input'
	| 'metadata';

/** The edge type hierarchy. Omitted when the ontology has no edge subtypes. */
export type ZepV4OntologyEdgeTypeHierarchyInput = Record<string, ZepJsonValue>;

/** The entity type hierarchy. Omitted when the ontology has no entity subtypes. */
export type ZepV4OntologyEntityTypeHierarchyInput = Record<
	string,
	ZepJsonValue
>;

/** Rule is the outcome mapping rule type. */
export type ZepV4OutcomeMappingRuleRuleInput = 'score' | 'metadata' | 'error';

/** Replacement developer metadata. Set to null to clear it. */
export type ZepV4PatchAgentRequestMetadataInput = Record<string, ZepJsonValue>;

/** Replacement capabilities. Set to null to clear them. */
export type ZepV4PatchAgentVerifierRequestCapabilitiesInput = Record<
	string,
	ZepJsonValue
>;

/** Replacement metadata. Set to null to clear it. */
export type ZepV4PatchAgentVerifierRequestMetadataInput = Record<
	string,
	ZepJsonValue
>;

/** Additional attributes to merge onto the edge; a key set to null is removed. */
export type ZepV4PatchEdgeRequestAttributesInput = Record<string, ZepJsonValue>;

/** Metadata to merge onto the episode; a key set to null is removed. Max 10 keys after the merge. Values must be strings, numbers, booleans, or arrays of scalars. */
export type ZepV4PatchEpisodeRequestMetadataInput = Record<
	string,
	ZepJsonValue
>;

/** Metadata to merge onto the message; a key set to null is removed. Max 10 keys after the merge. Values must be strings, numbers, booleans, or arrays of scalars. */
export type ZepV4PatchMessageRequestMetadataInput = Record<
	string,
	ZepJsonValue
>;

/** Additional attributes to merge onto the node; a key set to null is removed. */
export type ZepV4PatchNodeRequestAttributesInput = Record<string, ZepJsonValue>;

/** Metadata to merge onto the user; a key set to null is removed. */
export type ZepV4PatchUserRequestMetadataInput = Record<string, ZepJsonValue>;

/** The lowercase comparison operator. */
export type ZepV4PropertyFilterOperatorInput =
	| 'eq'
	| 'ne'
	| 'gt'
	| 'lt'
	| 'gte'
	| 'lte'
	| 'in'
	| 'is_null'
	| 'is_not_null';

/** The comparison value. Use an array for in. Its string members must be non-empty, contain no comma, and have no surrounding whitespace. */
export type ZepV4PropertyFilterValueInput =
	| string
	| number
	| boolean
	| ZepV4PropertyFilterValue3Input;

export type ZepV4PropertyFilterValue3Input =
	Array<ZepV4PropertyFilterValueOneOf3ItemsInput>;

export type ZepV4PropertyFilterValueOneOf3ItemsInput =
	| string
	| number
	| boolean;

/** The edge orientation to follow during expansion: in, out, or both. Defaults to both. */
export type ZepV4SubgraphRequestDirectionInput = 'in' | 'out' | 'both';

/** The service reads the task family from this source. The value infer asks Agent Skills to assign the task family automatically. */
export type ZepV4TaskFamilyMappingRuleSourceInput =
	| 'fixed'
	| 'metadata'
	| 'tag_prefix'
	| 'name'
	| 'infer';

export type ZepV4TraceMappingIncludeOutcomesItemsInput =
	| 'succeeded'
	| 'failed'
	| 'partial'
	| 'abandoned'
	| 'unknown';

/** The remediation for literals that are not explicitly allowed. */
export type ZepV4UpdateAgentLiteralPolicyRequestDefaultInput =
	| 'parameterize'
	| 'remove'
	| 'reject';

/** OnSourceChange is the new change policy, when supplied. */
export type ZepV4UpdateTraceImportRequestOnSourceChangeInput =
	| 'ignore'
	| 'replace';

export type ZepGraphitiRerankerInput =
	| 'rrf'
	| 'mmr'
	| 'node_distance'
	| 'episode_mentions'
	| 'cross_encoder';

export type ZepModelsBatchItemKindInput = 'graph_episode' | 'thread_message';

export type ZepModelsCustomInstructionInput = {
	/** logical key for identifying the instruction */
	name: string;
	/** the domain knowledge text */
	text: string;
};

export type ZepModelsGraphDataTypeInput =
	| 'text'
	| 'json'
	| 'message'
	| 'fact_triple';

export type ZepModelsObservationTypeInput = {
	description?: string;
	name?: string;
};

export type ZepModelsUserInstructionInput = {
	/** logical key for identifying the instruction */
	name: string;
	/** the actual instruction text */
	text: string;
};

export type ZepV4AddAgentSkillUseOutcomeRequestInput = {
	/** The developer records the attempt outcome. Valid values are succeeded, failed, partial, abandoned, and unknown. */
	outcome: ZepV4AddAgentSkillUseOutcomeRequestOutcomeInput;
};

export type ZepV4AddMessageInput = {
	/** The content of the message. */
	content?: string;
	/** Custom metadata to store with the message. Max 10 keys. Values must be strings, numbers, booleans, or arrays of scalars. */
	metadata?: Record<string, ZepJsonValue>;
	/** A customizable name for the sender of the message, for example "john" or "sales_agent". */
	name?: string;
	/** The message's reference time, used for temporal reasoning rather than ingestion time. Defaults to the ingestion time. */
	reference_time?: string;
	/** The role of the message's sender. */
	role?: ZepV4RoleTypeInput;
	/** Reserved for future use. Message identifiers are always server-assigned, so this field must be left unset. */
	uuid?: string;
};

export type ZepV4AgentContextResourceInput = {
	/** The service returns the display name. At most 128. */
	name: string;
	/** The service returns the version of this context resource. */
	version?: string;
};

export type ZepV4AgentLiteralPolicyClassesInput = {
	/** Reusable environment literal classes. */
	environments: Array<string>;
	/** Reusable tool literal classes. */
	tools: Array<string>;
};

export type ZepV4AgentLiteralPolicyValuesInput = {
	/** Exact reusable values eligible for a permitted environment literal class. */
	environments: Array<string>;
	/** Exact reusable values eligible for a permitted tool literal class. */
	tools: Array<string>;
};

export type ZepV4AgentMemoryEvaluationPolicyInput = {
	/** The developer lists one or more evaluation requirements for this policy. */
	requirements: Array<ZepV4AgentMemoryEvaluationRequirementInput>;
	/** The developer selects the task family that uses this evaluation policy. */
	task_family: string;
};

export type ZepV4AgentMemoryEvaluationRequirementInput = {
	/** The service sets this to true when it controls whether the requirement passes admission. */
	controlled?: boolean;
	/** The service returns the environment used for this evaluation. */
	environment?: string;
	/** The developer selects the evaluation source. */
	evaluated_by: string;
	/** The service returns the version of the evaluation rule. */
	evaluator_version: string;
	/** The developer supplies the required result for this evaluation. Valid values are defined by the evaluation named in the policy. */
	result: string;
};

export type ZepV4AgentMemorySettingsInput = {
	/** The developer lists the evaluations that each candidate must pass for its category. */
	admission_evaluation_requirements?: Array<ZepV4AgentMemoryEvaluationPolicyInput>;
	/** The developer sets the approval mode. Valid values are auto and manual. The default is auto. */
	approval?: ZepV4AgentMemorySettingsApprovalInput;
	/** The developer sets the minimum number of distinct attempt families for admission. The range is 1 to 16, and the default is 1. */
	approval_minimum_attempt_families?: number;
	/** The developer lists tool names that need member approval in auto approval. A generated Skill that uses one of these tools waits for a member. The list can contain up to 256 unique names, each at most 255 characters. The default is an empty list. */
	approval_required_tools?: Array<string>;
	/** The developer lists task-family slugs that use auto approval. An empty list applies auto approval to all task families. */
	auto_approval_task_families?: Array<string>;
	/** The developer selects the compilation mode. Valid values are scheduled, manual, and on_close. The default is scheduled. */
	compilation_mode?: ZepV4AgentMemorySettingsCompilationModeInput;
	/** The developer sets how many days an unused provisional Skill can remain before the service retires it. The range is 1 to 3650 days. If omitted, provisional Skills do not expire. */
	provisional_expiry_days?: number;
	/** The developer sets the maximum number of provisional Skills in one category. The range is 1 to 1000. A new Skill waits for a member when the count is over the limit. If omitted, no limit applies. */
	provisional_skill_limit?: number;
	/** The developer sets the age-based cleanup period for eligible proposal sets. The range is 1 to 3650 days. If omitted, the setting does not enable age-based cleanup. */
	retention_days?: number;
};

export type ZepV4AgentSkillMarkdownFormatInput = 'agent' | 'full';

export type ZepV4AgentSplitPlanDestinationRequestInput = {
	/** The developer supplies the Agent settings for this destination. */
	agent: ZepV4CreateAgentRequestInput;
	/** The developer lists 1 to 100 Skills to include in this plan. */
	skills: Array<ZepV4AgentSplitPlanSkillSelectionRequestInput>;
};

export type ZepV4AgentSplitPlanSkillSelectionRequestInput = {
	/** The developer supplies the Skill identifier. */
	skill_uuid: string;
	/** The developer selects the immutable Skill version to include. */
	skill_version_uuid: string;
	/** The developer supplies the Skill version number. It must be at least 1. */
	version: number;
};

export type ZepV4AgentStatusInput = 'active' | 'deleting' | 'deletion_failed';

export type ZepV4AgentTraceCloseVerifierInput = {
	assertion_id?: string;
	class?: string;
	evidence_reference?: string;
	outcome?: ZepV4AgentVerifierAssertionOutcomeInput;
	verifier_id: string;
};

export type ZepV4AgentTraceEventContextInput = {
	artifacts?: Array<ZepV4AgentTraceResourceRefInput>;
	environments?: Array<ZepV4AgentTraceResourceRefInput>;
	model?: ZepV4AgentTraceResourceRefInput;
	/** Tools identifies the tool that the event calls or returns. Skills learning reads this field. It is optional. A tool event can omit the tool name. */
	tools?: Array<ZepV4AgentTraceResourceRefInput>;
	verification?: ZepV4AgentTraceVerificationInput;
};

export type ZepV4AgentTraceEventSourceInput = {
	copy_mode?: ZepV4AgentTraceEventSourceCopyModeInput;
	kind: string;
	retention_mode?: ZepV4AgentTraceEventSourceRetentionModeInput;
	uuid: string;
};

export type ZepV4AgentTraceEventSourceCopyModeInput = 'reference' | 'copied';

export type ZepV4AgentTraceEventSourceRetentionModeInput =
	| 'delete_with_source'
	| 'keep';

export type ZepV4AgentTraceEventTypeInput =
	| 'input_reference'
	| 'observation'
	| 'decision'
	| 'tool_call'
	| 'tool_result'
	| 'artifact'
	| 'checkpoint'
	| 'feedback'
	| 'correction'
	| 'reflection'
	| 'verification';

export type ZepV4AgentTraceLifecycleInput =
	| 'open'
	| 'closing'
	| 'closed'
	| 'abandoned'
	| 'deleted';

export type ZepV4AgentTraceOutcomeInput =
	| 'succeeded'
	| 'failed'
	| 'partial'
	| 'abandoned'
	| 'unknown';

export type ZepV4AgentTraceResourceRefInput = {
	name: string;
	version?: string;
};

export type ZepV4AgentTraceSequenceRangeInput = {
	first: number;
	last: number;
};

export type ZepV4AgentTraceVerificationInput =
	| 'none'
	| 'agent'
	| 'tool'
	| 'customer'
	| 'external';

export type ZepV4AgentVerificationStrengthInput =
	| 'tool_verified'
	| 'customer_verified'
	| 'externally_verified';

export type ZepV4AgentVerifierAssertionOutcomeInput =
	| 'succeeded'
	| 'failed'
	| 'partial'
	| 'abandoned'
	| 'unknown';

export type ZepV4AgentVerifierPrincipalBindingInputInput = {
	/** The verification strength assigned to this principal binding. */
	effective_strength: ZepV4AgentVerificationStrengthInput;
	/** The exact principal identifier. Wildcards are not supported. */
	principal_id: string;
	/** The authenticated principal type: member, project-api-key, service, or mcp_user. */
	principal_type: string;
};

export type ZepV4AgentVerifierStatusInput = 'active' | 'revoked';

export type ZepV4BatchItemInputInput = {
	/** The message content, for a thread_message item. */
	content?: string;
	/** The episode content, for a graph_episode item. */
	data?: string;
	/** The data format of the episode: text, json, or message. */
	data_type?: ZepModelsGraphDataTypeInput;
	/** Groups this item as a chunk of a document on the graph. */
	document_id?: string;
	/** The graph to ingest this item into. Mutually exclusive with user_uuid. */
	graph_uuid?: string;
	/** Metadata to store on the item. Max 10 keys. Values must be strings, numbers, booleans, or arrays of scalars. */
	metadata?: Record<string, ZepJsonValue>;
	/** A customizable name for the sender of the message. */
	name?: string;
	/** The item's reference time, used for temporal reasoning rather than ingestion time. Applies to both graph_episode and thread_message items. Defaults to the ingestion time. */
	reference_time?: string;
	/** The role of the message's sender, for a thread_message item. */
	role?: ZepV4RoleTypeInput;
	/** A description of the source of this episode. */
	source_description?: string;
	/** The thread this message is added to, for a thread_message item. */
	thread_uuid?: string;
	/** The kind of item: graph_episode or thread_message. */
	type: ZepModelsBatchItemKindInput;
	/** The user whose graph this item is ingested into. Mutually exclusive with graph_uuid. */
	user_uuid?: string;
};

export type ZepV4ContentPolicyCategoryRequestInput = {
	/** What the category covers, in plain language. Maximum 500 characters. */
	description?: string;
	/** A stable key for the category, unique within the policy. Lowercase letters, digits, and underscores; 2 to 64 characters. */
	key?: string;
};

export type ZepV4ContentPolicyEventListFiltersInput = {
	/** Include only the events with this drop reason. */
	drop_reason?: ZepV4ContentPolicyEventListFiltersDropReasonInput;
	/** Include only the events of this episode. */
	episode_uuid?: string;
};

export type ZepV4ContentPolicyRuleRequestInput = {
	/** The rule action. The supported values are exclude and include. The include action is experimental and gated. */
	action?: ZepV4ContentPolicyRuleRequestActionInput;
	/** The key of the category this rule belongs to. The category must be in the same policy. */
	category_key?: string;
	/** The experimental condition that this rule evaluates. This field is available to all accounts. Maximum 1000 characters. */
	condition?: string;
	/** Deprecated: use condition. This alias remains available for one release. When both fields are set, they must have the same value. */
	description?: string;
	/** Edge types that this rule covers. The field is experimental and gated. */
	edge_types?: Array<string>;
	/** Entity types that this rule covers. The field is experimental and gated. */
	entity_types?: Array<string>;
	/** Regular expression patterns that this rule matches. The field is experimental and gated. */
	patterns?: Array<string>;
	/** Examples of similar content the rule permits. 0 to 8 items, each at most 500 characters. */
	permitted_examples?: Array<string>;
	/** Examples of content the rule prohibits. 1 to 8 items, each at most 500 characters. */
	prohibited_examples?: Array<string>;
};

export type ZepV4CreateAgentRequestInput = {
	/** The developer-assigned Agent identifier, unique within the project. */
	agent_id: string;
	/** The customer deployment this Agent represents. */
	deployment_id?: string;
	/** A human-readable description of the Agent. */
	description?: string;
	/** Agent Skills capture, compilation, and promotion settings. */
	memory_settings?: ZepV4AgentMemorySettingsInput;
	/** Developer metadata used to organize and filter Agents. */
	metadata?: Record<string, ZepJsonValue>;
	/** The Agent's display name. */
	name: string;
	/** The immutable boundary within which Skills may be synthesized. 1 to 200 characters of lowercase letters, digits, and the characters : . - _ */
	security_domain: string;
	/** The customer deployment version this Agent represents. If you omit it, the version is "default". */
	version?: string;
};

export type ZepV4DateFilterInput = {
	/** The temporal field to compare. */
	field?: ZepV4DateFilterFieldInput;
	/** The lowercase comparison operator. */
	operator?: ZepV4DateFilterOperatorInput;
	/** The RFC 3339 timestamp. Omit this field for null operators. */
	value?: string;
};

export type ZepV4DateFilterGroupInput = {
	/** All conditions in the group must match. */
	all_of?: Array<ZepV4DateFilterInput>;
};

export type ZepV4DateFiltersInput = {
	/** Each group is combined with OR logic. */
	any_of?: Array<ZepV4DateFilterGroupInput>;
};

export type ZepV4DocumentSummaryListFiltersInput = {
	/** Filter results by created_at. */
	date_filters?: ZepV4DateFiltersInput;
	/** Filter results by the metadata of the document episodes. */
	metadata_filters?: ZepV4MetadataFilterGroupInput;
	/** Filter results by node or edge properties. */
	property_filters?: Array<ZepV4PropertyFilterInput>;
};

export type ZepV4EdgeInputInput = {
	/** Additional attributes to store on the edge. */
	attributes?: Record<string, ZepJsonValue>;
	/** The time at which the fact was superseded or invalidated. */
	expired_at?: string;
	/** The fact text describing the relationship between the source and target nodes. */
	fact: string;
	/** The name of the edge, in upper snake case, for example RELATES_TO. */
	fact_name: string;
	/** The time at which the fact stopped being true. */
	invalid_at?: string;
	/** Metadata attached to the episode created for this edge. */
	metadata?: Record<string, ZepJsonValue>;
	/** The source node. A name creates a node without deduplication, or matches an existing node by name first when deduplication is enabled. */
	source_node: ZepV4EdgeNodeRefInput;
	/** The target node. A name creates a node without deduplication, or matches an existing node by name first when deduplication is enabled. */
	target_node: ZepV4EdgeNodeRefInput;
	/** The time at which the fact became true. */
	valid_at?: string;
};

export type ZepV4EdgeListFiltersInput = {
	/** Include edges connected to any of these node UUIDs. Node search does not support this filter. */
	connected_node_uuids?: Array<string>;
	/** Experimental. Match episodes by their content-policy result. Supported only on episode search when the project setting include_policy_violating_episodes is true. */
	content_policy_violated?: boolean;
	/** Filter results by temporal values. */
	date_filters?: ZepV4DateFiltersInput;
	/** Include results with any of these edge types. Node search does not support this filter. */
	edge_types?: Array<string>;
	/** Include results with any of these edge UUIDs. Node search does not support this filter. */
	edge_uuids?: Array<string>;
	/** Include results derived from any of these episode UUIDs. */
	episode_uuids?: Array<string>;
	/** Exclude results with any of these edge types. Node search does not support this filter. */
	exclude_edge_types?: Array<string>;
	/** Exclude nodes that have any of these labels. On an edge list, the API excludes an edge when its source node or its target node has one of these labels. Edge search does not support this filter. */
	exclude_node_labels?: Array<string>;
	/** Filter results by episode metadata. */
	metadata_filters?: ZepV4MetadataFilterGroupInput;
	/** Include only nodes that have at least one of these labels. On an edge list, the source node and the target node of each edge must each have at least one of these labels. Edge search does not support this filter. */
	node_labels?: Array<string>;
	/** Filter results by node or edge properties. */
	property_filters?: Array<ZepV4PropertyFilterInput>;
	/** Include edges that start at any of these node UUIDs. Node search does not support this filter. */
	source_node_uuids?: Array<string>;
	/** Include edges that end at any of these node UUIDs. Node search does not support this filter. */
	target_node_uuids?: Array<string>;
};

export type ZepV4EdgeNodeRefInput = {
	/** Additional attributes of the node, as defined by its entity type. */
	attributes?: Record<string, ZepJsonValue>;
	/** The entity type labels to assign to the node. */
	labels?: Array<string>;
	/** The name of the node to create, or to match when deduplication is enabled. */
	name?: string;
	/** A summary of the node. */
	summary?: string;
	/** The unique identifier of an existing node to attach the edge to. */
	uuid?: string;
};

export type ZepV4EdgeSearchFiltersInput = {
	/** Include edges connected to any of these node UUIDs. */
	connected_node_uuids?: Array<string>;
	/** Filter results by temporal values. */
	date_filters?: ZepV4DateFiltersInput;
	/** Include results with any of these edge types. */
	edge_types?: Array<string>;
	/** Include results with any of these edge UUIDs. */
	edge_uuids?: Array<string>;
	/** Include results derived from any of these episode UUIDs. */
	episode_uuids?: Array<string>;
	/** Exclude results with any of these edge types. */
	exclude_edge_types?: Array<string>;
	/** Filter results by episode metadata. */
	metadata_filters?: ZepV4MetadataFilterGroupInput;
	/** Filter results by node or edge properties. */
	property_filters?: Array<ZepV4PropertyFilterInput>;
	/** Include edges that start at any of these node UUIDs. */
	source_node_uuids?: Array<string>;
	/** Include edges that end at any of these node UUIDs. */
	target_node_uuids?: Array<string>;
};

export type ZepV4EdgeSourceTargetInput = {
	/** The entity type an edge of this type originates from. */
	source?: string;
	/** The entity type an edge of this type points to. */
	target?: string;
};

export type ZepV4EdgeTypeInput = {
	/** A description of the relationship this edge type represents, used to guide extraction. */
	description?: string;
	/** The name of the edge type, in upper snake case. */
	name?: string;
	/** The custom properties defined on edges of this type. */
	properties?: Array<ZepV4EntityPropertyInput>;
	/** The allowed source and target entity type pairs for edges of this type. */
	source_targets?: Array<ZepV4EdgeSourceTargetInput>;
};

export type ZepV4EntityPropertyInput = {
	/** A description of the property, used to guide extraction. */
	description?: string;
	/** The name of the property. */
	name?: string;
	/** Whether ingestion keeps the stored value of this property when it merges new information into an existing node. Supported on entity type properties only. */
	protected?: boolean;
	/** The value type of the property: text, int, float, or boolean. */
	type?: ZepV4EntityPropertyTypeInput;
};

export type ZepV4EntityPropertyTypeInput = 'text' | 'int' | 'float' | 'boolean';

export type ZepV4EntityTypeInput = {
	/** A description of the entity type, used to guide extraction. */
	description?: string;
	/** The property names that determine whether two nodes of this type are the same entity. */
	identity_properties?: Array<string>;
	/** The name of the entity type. */
	name?: string;
	/** The custom properties defined on nodes of this type. */
	properties?: Array<ZepV4EntityPropertyInput>;
};

export type ZepV4EpisodeListFiltersInput = {
	/** Experimental. When true, include only episodes that a content policy flagged. When false, include only episodes that no content policy flagged. The project setting include_policy_violating_episodes must be on. */
	content_policy_violated?: boolean;
	/** Include only the episodes of this document. The value is the document_id of the episodes. At most 100 characters. */
	document_id?: string;
	/** Include only episodes that mention at least one of these nodes. At most 256 node UUIDs. */
	mentioned_node_uuids?: Array<string>;
	/** Include only episodes whose metadata matches this filter group. */
	metadata_filters?: ZepV4MetadataFilterGroupInput;
};

export type ZepV4EpisodeSearchFiltersInput = {
	/** Experimental. Match episodes by their content-policy result. Supported only on episode search when the project setting include_policy_violating_episodes is true. */
	content_policy_violated?: boolean;
	/** Filter results by the episode's own stored metadata. */
	metadata_filters?: ZepV4MetadataFilterGroupInput;
};

export type ZepV4GraphContentPolicyRequestInput = {
	/** Categories to add for this graph. A key that the project policy already has is ignored. */
	categories?: Array<ZepV4ContentPolicyCategoryRequestInput>;
	/** When set, the create fails with content_policy_revision_stale unless this is the current project revision. */
	project_revision?: number;
	/** Rules to add for this graph. A rule that the project policy already has, with the same effective rule identity is ignored. */
	rules?: Array<ZepV4ContentPolicyRuleRequestInput>;
};

export type ZepV4GraphQueryModeInput = 'fast' | 'deep';

export type ZepV4HyperedgeInputInput = {
	/** The name of the member edge, in upper snake case, for example FOUNDED. */
	name: string;
	/** The source node of this member, referenced by uuid or created or matched by name. */
	source_node: ZepV4EdgeNodeRefInput;
	/** The target node of this member, referenced by uuid or created or matched by name. */
	target_node: ZepV4EdgeNodeRefInput;
};

export type ZepV4HyperedgeListFiltersInput = {
	/** Include only hyperedges that have one of these member edges. At most 256 edge UUIDs. */
	edge_uuids?: Array<string>;
	/** Include only hyperedges that have a member edge from one of these episodes. At most 256 episode UUIDs. */
	episode_uuids?: Array<string>;
	/** Include only hyperedges that have a member edge connected to one of these nodes. At most 256 node UUIDs. */
	node_uuids?: Array<string>;
};

export type ZepV4InclusionRuleInput = {
	/** Condition is a natural-language test; an empty value matches every applicable candidate. */
	condition?: string;
	/** Effect includes or excludes matching candidates. */
	effect?: ZepV4InclusionRuleEffectInput;
	/** Name uniquely identifies the rule within its scope. */
	name?: string;
	/** Target selects entity candidates or fact candidates. */
	target?: ZepV4InclusionRuleTargetInput;
	/** Types limits the rule to these ontology types and their subtypes. */
	types?: Array<string>;
};

export type ZepV4KnowledgeEntryInput = {
	/** The name identifies the entry within its scope. */
	name: string;
	/** The text describes a term, an alias, or another domain fact. */
	text: string;
};

export type ZepV4MetadataFilterInput = {
	/** The lowercase comparison operator. */
	operator?: ZepV4MetadataFilterOperatorInput;
	/** The metadata property name to compare. */
	property_name?: string;
	/** The comparison value. Use an array for in, a non-empty string for contains, and omit the field for null operators. */
	value?: ZepV4MetadataFilterValueInput;
};

export type ZepV4MetadataFilterGroupInput = {
	/** The metadata predicates in this group. */
	filters?: Array<ZepV4MetadataFilterInput>;
	/** The nested metadata groups in this group. */
	groups?: Array<ZepV4MetadataFilterGroupInput>;
	/** The logical operator for this group. */
	type?: ZepV4MetadataFilterGroupTypeInput;
};

export type ZepV4NodeInputInput = {
	/** Additional attributes of the node, as defined by its entity type. */
	attributes?: Record<string, ZepJsonValue>;
	/** The node's entity type. */
	label?: string;
	/** Metadata to store on the node. */
	metadata?: Record<string, ZepJsonValue>;
	/** The name of the entity the node represents. */
	name: string;
	/** A summary of the entity the node represents. */
	summary?: string;
};

export type ZepV4NodeListFiltersInput = {
	/** Include edges connected to any of these node UUIDs. Node search does not support this filter. */
	connected_node_uuids?: Array<string>;
	/** Experimental. Match episodes by their content-policy result. Supported only on episode search when the project setting include_policy_violating_episodes is true. */
	content_policy_violated?: boolean;
	/** Filter results by temporal values. */
	date_filters?: ZepV4DateFiltersInput;
	/** Include results with any of these edge types. Node search does not support this filter. */
	edge_types?: Array<string>;
	/** Include results with any of these edge UUIDs. Node search does not support this filter. */
	edge_uuids?: Array<string>;
	/** Include results derived from any of these episode UUIDs. */
	episode_uuids?: Array<string>;
	/** Exclude results with any of these edge types. Node search does not support this filter. */
	exclude_edge_types?: Array<string>;
	/** Exclude nodes that have any of these labels. On an edge list, the API excludes an edge when its source node or its target node has one of these labels. Edge search does not support this filter. */
	exclude_node_labels?: Array<string>;
	/** Filter results by episode metadata. */
	metadata_filters?: ZepV4MetadataFilterGroupInput;
	/** Include only nodes that have at least one of these labels. On an edge list, the source node and the target node of each edge must each have at least one of these labels. Edge search does not support this filter. */
	node_labels?: Array<string>;
	/** Filter results by node or edge properties. */
	property_filters?: Array<ZepV4PropertyFilterInput>;
	/** Include edges that start at any of these node UUIDs. Node search does not support this filter. */
	source_node_uuids?: Array<string>;
	/** Include edges that end at any of these node UUIDs. Node search does not support this filter. */
	target_node_uuids?: Array<string>;
};

export type ZepV4NodeSearchFiltersInput = {
	/** Include results derived from any of these episode UUIDs. */
	episode_uuids?: Array<string>;
	/** Exclude results with any of these node labels. Edge search does not support this filter. */
	exclude_node_labels?: Array<string>;
	/** Filter results by episode metadata. */
	metadata_filters?: ZepV4MetadataFilterGroupInput;
	/** Include results with any of these node labels. Edge search does not support this filter. */
	node_labels?: Array<string>;
	/** Filter results by node or edge properties. */
	property_filters?: Array<ZepV4PropertyFilterInput>;
};

export type ZepV4ObjectiveMappingRuleInput = {
	/** Key is the root metadata key to read. */
	key?: string;
	/** Source selects the objective source. */
	source?: ZepV4ObjectiveMappingRuleSourceInput;
};

export type ZepV4ObservationListFiltersInput = {
	/** Filter results by created_at. */
	date_filters?: ZepV4DateFiltersInput;
	/** Filter results by node or edge properties. */
	property_filters?: Array<ZepV4PropertyFilterInput>;
};

export type ZepV4ObservationSearchFiltersInput = Record<string, ZepJsonValue>;

export type ZepV4OutcomeMappingRuleInput = {
	/** FailedBelow is the optional score threshold for failure. */
	failed_below?: number;
	/** Key is the metadata key for a metadata rule. */
	key?: string;
	/** Name is the score name for a score rule. */
	name?: string;
	/** Rule is the outcome mapping rule type. */
	rule?: ZepV4OutcomeMappingRuleRuleInput;
	/** SucceededAtOrAbove is the score threshold for success. */
	succeeded_at_or_above?: number;
	/** Values maps metadata strings to Trace outcomes. */
	values?: Record<string, string>;
};

export type ZepV4PropertyFilterInput = {
	/** The lowercase comparison operator. */
	operator?: ZepV4PropertyFilterOperatorInput;
	/** The property name to compare. */
	property_name?: string;
	/** The comparison value. Use an array for in. Its string members must be non-empty, contain no comma, and have no surrounding whitespace. */
	value?: ZepV4PropertyFilterValueInput;
};

export type ZepV4RoleTypeInput =
	| 'system'
	| 'assistant'
	| 'user'
	| 'function'
	| 'tool';

export type ZepV4SearchFiltersInput = {
	/** Include edges connected to any of these node UUIDs. Node search does not support this filter. */
	connected_node_uuids?: Array<string>;
	/** Experimental. Match episodes by their content-policy result. Supported only on episode search when the project setting include_policy_violating_episodes is true. */
	content_policy_violated?: boolean;
	/** Filter results by temporal values. */
	date_filters?: ZepV4DateFiltersInput;
	/** Include results with any of these edge types. Node search does not support this filter. */
	edge_types?: Array<string>;
	/** Include results with any of these edge UUIDs. Node search does not support this filter. */
	edge_uuids?: Array<string>;
	/** Include results derived from any of these episode UUIDs. */
	episode_uuids?: Array<string>;
	/** Exclude results with any of these edge types. Node search does not support this filter. */
	exclude_edge_types?: Array<string>;
	/** Exclude nodes that have any of these labels. On an edge list, the API excludes an edge when its source node or its target node has one of these labels. Edge search does not support this filter. */
	exclude_node_labels?: Array<string>;
	/** Filter results by episode metadata. */
	metadata_filters?: ZepV4MetadataFilterGroupInput;
	/** Include only nodes that have at least one of these labels. On an edge list, the source node and the target node of each edge must each have at least one of these labels. Edge search does not support this filter. */
	node_labels?: Array<string>;
	/** Filter results by node or edge properties. */
	property_filters?: Array<ZepV4PropertyFilterInput>;
	/** Include edges that start at any of these node UUIDs. Node search does not support this filter. */
	source_node_uuids?: Array<string>;
	/** Include edges that end at any of these node UUIDs. Node search does not support this filter. */
	target_node_uuids?: Array<string>;
};

export type ZepV4SkillDefinitionInput = {
	/** The developer lists Agent versions that can use the Skill. */
	agent_versions?: Array<string>;
	/** The developer supplies alternate names for the resource. */
	aliases?: Array<string>;
	/** The developer supplies the resource description. */
	description?: string;
	/** The developer supplies situations in which the Skill must not be used. */
	do_not_use_when?: Array<string>;
	/** The developer supplies conditions that show when the Skill work is complete. */
	done_when?: Array<string>;
	/** The developer supplies environment names used by the Skill. */
	environments?: Array<ZepV4SkillResourceInput>;
	/** The developer supplies failure conditions and recovery steps. */
	failures?: Array<ZepV4SkillFailureInput>;
	/** The developer supplies a Skill kind. Valid values are principle, procedure, workflow, failure_mode, recovery, constraint. */
	kind?: ZepV4SkillKindInput;
	/** The developer supplies a display name. */
	name?: string;
	/** The developer supplies results that the Skill produces. */
	outputs?: Array<string>;
	/** The developer supplies the stable package name for the Skill. */
	package_name?: string;
	/** The developer supplies conditions that must be true before use. */
	preconditions?: Array<string>;
	/** The developer supplies ordered procedure steps. */
	procedure?: Array<ZepV4SkillProcedureStepInput>;
	/** The developer lists Skills that relate to this Skill. */
	related_skills?: Array<ZepV4SkillRelationInput>;
	/** The developer supplies structured sections of the Skill. */
	sections?: Array<ZepV4SkillDefinitionSectionInput>;
	/** The developer supplies conditions that require the workflow to stop. */
	stop_when?: Array<string>;
	/** The developer supplies the task-family slug. */
	task_family?: string;
	/** The developer supplies tool names used by the Skill. */
	tools?: Array<ZepV4SkillResourceInput>;
	/** The developer supplies conditions that must hold before the Skill is used. */
	use_when?: Array<string>;
};

export type ZepV4SkillDefinitionSectionInput = {
	/** The developer supplies section heading. */
	heading?: string;
	/** The developer assigns a stable ID to this section. */
	id?: string;
	/** The developer supplies skill content in Markdown. */
	markdown?: string;
};

export type ZepV4SkillFailureInput = {
	/** The developer supplies steps to recover from this failure. */
	recover?: Array<string>;
	/** The developer supplies a condition that causes this failure. */
	when?: string;
};

export type ZepV4SkillKindInput =
	| 'principle'
	| 'procedure'
	| 'workflow'
	| 'failure_mode'
	| 'recovery'
	| 'constraint';

export type ZepV4SkillProcedureStepInput = {
	/** The developer describes the decision point for this procedure step. */
	decision?: string;
	/** The developer supplies expected results. */
	expect?: Array<string>;
	/** The developer supplies action for this procedure step. */
	instruction?: string;
};

export type ZepV4SkillRelationInput = {
	/** The developer supplies a relationship to the related Skill. */
	relation?: string;
	/** The developer identifies a related Skill by its stable package name. */
	skill?: string;
	/** The developer supplies the Agent deployment version. */
	version?: string;
};

export type ZepV4SkillResourceInput = {
	/** The developer supplies alternate names for the resource. */
	aliases?: Array<string>;
	/** The developer supplies a display name. */
	name?: string;
	/** The developer supplies the Agent deployment version. */
	version?: string;
};

export type ZepV4TaskFamilyMappingRuleInput = {
	/** The service uses this task family when the source gives no value. The value infer asks Agent Skills to assign the task family automatically. */
	fallback?: string;
	/** Key is the metadata key for metadata mapping. */
	key?: string;
	/** Prefix is the tag prefix for tag mapping. */
	prefix?: string;
	/** The service reads the task family from this source. The value infer asks Agent Skills to assign the task family automatically. */
	source?: ZepV4TaskFamilyMappingRuleSourceInput;
	/** The developer supplies the task-family slug when the source is fixed. */
	value?: string;
};

export type ZepV4ThreadSummaryListFiltersInput = {
	/** Filter results by created_at. */
	date_filters?: ZepV4DateFiltersInput;
	/** Filter results by the metadata of the thread episodes. */
	metadata_filters?: ZepV4MetadataFilterGroupInput;
	/** Filter results by node or edge properties. */
	property_filters?: Array<ZepV4PropertyFilterInput>;
};

export type ZepV4ThreadSummarySearchFiltersInput = {
	/** Filter results by the metadata of the thread episodes. */
	metadata_filters?: ZepV4MetadataFilterGroupInput;
};

export type ZepV4TraceContentMappingInput = {
	/** IncludeSystemMessages controls whether system messages become events. */
	include_system_messages?: boolean;
	/** MetadataKeys contains root metadata keys copied to the Trace. */
	metadata_keys?: Array<string>;
};

export type ZepV4TraceFilterInput = {
	/** HasError filters traces by their error state. */
	has_error?: boolean;
	/** Metadata contains exact-match root metadata filters. Example: {"team":"support"}. */
	metadata?: Record<string, ZepJsonValue>;
	/** Name is the exact trace name filter. */
	name?: string;
	/** Scores contains score name and range filters. Example: [{"name":"quality","min":0.5}]. */
	scores?: Array<ZepV4TraceScoreRangeInput>;
	/** StartedAfter is the inclusive trace start-time lower bound. */
	started_after?: string;
	/** StartedBefore is the exclusive trace start-time upper bound. */
	started_before?: string;
	/** TagsAll contains tags that every result must include. */
	tags_all?: Array<string>;
	/** TagsAny contains tags that at least one result must include. */
	tags_any?: Array<string>;
};

export type ZepV4TraceImportOnSourceChangeInput = 'ignore' | 'replace';

export type ZepV4TraceImportScheduleInput = {
	/** IntervalHours is the scheduled run interval. */
	interval_hours: number;
	/** MaxOpenHours is the maximum wait for an open trace. The value must be 1 to 168 hours. The default is 24 hours. */
	max_open_hours?: number;
	/** SettleMinutes is the wait time for trace updates. The value must be 0 to 1,440 minutes. The default is 60 minutes. */
	settle_minutes?: number;
	/** StartFrom is the earliest trace start time that scheduled runs import. The value is "now", which is the time when the import was created, or an RFC 3339 timestamp. */
	start_from: string;
};

export type ZepV4TraceImportSelectionInput = {
	/** Filter selects traces by provider fields. Example: {"started_after":"2026-01-01T00:00:00Z"}. */
	filter?: ZepV4TraceFilterInput;
	/** TraceIDs contains explicit provider trace identifiers. */
	trace_ids?: Array<string>;
};

export type ZepV4TraceMappingInput = {
	/** Content configures copied span content. Example: {"include_system_messages":false}. */
	content?: ZepV4TraceContentMappingInput;
	/** IncludeOutcomes lists outcomes that can support a Skill. */
	include_outcomes?: Array<ZepV4TraceMappingIncludeOutcomesItemsInput>;
	/** Objective maps provider data to a Trace objective. Example: {"source":"first_user_message"}. */
	objective?: ZepV4ObjectiveMappingRuleInput;
	/** Outcome contains ordered outcome mapping rules. Example: [{"rule":"score","name":"quality","succeeded_at_or_above":0.8}]. */
	outcome?: Array<ZepV4OutcomeMappingRuleInput>;
	/** ScoreVerifier enables score-based verification. */
	score_verifier?: boolean;
	/** TaskFamily maps provider data to a task family. Example: {"source":"fixed","value":"support"}. */
	task_family?: ZepV4TaskFamilyMappingRuleInput;
};

export type ZepV4TraceScoreRangeInput = {
	/** Max is the inclusive score upper bound. */
	max?: number;
	/** Min is the inclusive score lower bound. */
	min?: number;
	/** Name is the provider score name. */
	name?: string;
};

/** The developer sets the approval mode. Valid values are auto and manual. The default is auto. */
export type ZepV4AgentMemorySettingsApproval = string;

/** The developer selects the compilation mode. Valid values are scheduled, manual, and on_close. The default is scheduled. */
export type ZepV4AgentMemorySettingsCompilationMode = string;

/** The service returns why compilation rejected the candidate. Valid values are no_eligible_traces,reflector_invalid_output,applicability_ungrounded,corroboration_insufficient,scanner_rejected,curator_rejected,curator_attempts_exhausted,prompt_budget_exceeded,provider_error. */
export type ZepV4AgentSkillCompilationOutcomeRejectionClass = string;

/** Polarity states whether the evidence supports, contradicts, or does not affect the contract claim. The service returns supporting, contradicting, or neutral. */
export type ZepV4AgentSkillContractEvidencePolarity = string;

/** SourceKind is the source type. The service returns trace, event, or summary. */
export type ZepV4AgentSkillContractEvidenceSourceKind = string;

/** The service returns how the Skill contract was created. Valid values are evidence_derived and customer_authored. */
export type ZepV4AgentSkillContractOrigin = string;

/** The service returns the relation type. Valid values are composes, requires, conflicts_with, supersedes, and related. */
export type ZepV4AgentSkillContractRelationKind = string;

/** Maturity is the trust tier of the Skill: provisional (one source attempt family), corroborated (two or more), established (a Trust of 0.6 or more from verified applications), or authored (no compiled source). */
export type ZepV4AgentSkillSearchHitMaturity = string;

/** The service returns the source type. The valid value is trace_import. */
export type ZepV4AgentTraceSourceKind = string;

/** The service returns the lifecycle status. Valid values are unverified,agent_verified,tool_verified,customer_verified,externally_verified. */
export type ZepV4AgentTraceSummaryVerificationStatus = string;

/** The processing status of the batch: draft, invalid, queued, processing, succeeded, partial, failed, or canceled. */
export type ZepV4BatchStatus = string;

/** The kind of artifact the decision applied to. episode marks the episode-level record that carries every matched category. */
export type ZepV4ContentPolicyEventArtifactKind = string;

/** Why the artifact was dropped: match, indeterminate, oversize, dependent, or not_included. */
export type ZepV4ContentPolicyEventDropReason = string;

/** The rule action. The supported values are exclude and include. */
export type ZepV4ContentPolicyRuleAction = string;

/** The evaluation status. pending means the evaluation has not finished, complete means every candidate was evaluated and the graph batch was written, and failed means ingestion retries were exhausted. not_evaluated means Zep processed the episode without an evaluation, for example because the… */
export type ZepV4EpisodeContentPolicyStatus = string;

/** Effect includes or excludes matching candidates. */
export type ZepV4InclusionRuleEffect = string;

/** Target selects entity candidates or fact candidates. */
export type ZepV4InclusionRuleTarget = string;

/** The type of resource this entry resolves: user, thread, or graph. */
export type ZepV4LookupItemResourceType = string;

/** Source selects the objective source. */
export type ZepV4ObjectiveMappingRuleSource = string;

/** The edge type hierarchy. Omitted when the ontology has no edge subtypes. */
export type ZepV4OntologyEdgeTypeHierarchy = Record<string, ZepJsonValue>;

/** The entity type hierarchy. Omitted when the ontology has no entity subtypes. */
export type ZepV4OntologyEntityTypeHierarchy = Record<string, ZepJsonValue>;

/** Rule is the outcome mapping rule type. */
export type ZepV4OutcomeMappingRuleRule = string;

/** Input is the provider span input. Example: {"messages":[]}. */
export type ZepV4SourceSpanInput = Record<string, ZepJsonValue>;

/** Output is the provider span output. Example: {"text":"Hello"}. */
export type ZepV4SourceSpanOutput = Record<string, ZepJsonValue>;

/** The service reads the task family from this source. The value infer asks Agent Skills to assign the task family automatically. */
export type ZepV4TaskFamilyMappingRuleSource = string;

/** The evaluation status of the episode. pending means the evaluation has not finished, complete means every candidate was evaluated, and failed means ingestion retries were exhausted. */
export type ZepV4TaskResultContentPolicyStatus = string;

/** The service returns the task state. Valid values are pending, processing, succeeded, partial, and failed. A task has no canceled state. When a batch becomes canceled, its batch.process task becomes failed, and the task error code is batch_canceled. */
export type ZepV4TaskStatus = string;

/** Provider is the Braintrust or LangSmith provider. */
export type ZepV4TraceConnectionProvider = string;

/** Provider is the Braintrust or LangSmith provider. */
export type ZepV4TraceImportProvider = string;

/** Status is the run status. */
export type ZepV4TraceImportRunReferenceStatus = string;

/** Trigger is the event that created the run. */
export type ZepV4TraceImportRunReferenceTrigger = string;

export type ZepV4TraceMappingIncludeOutcomesItems = string;

/** Outcome is the resolved outcome. */
export type ZepV4TraceMappingResultOutcome = string;

/** OutcomeRule is the rule that selected the outcome. */
export type ZepV4TraceMappingResultOutcomeRule = string;

export type ZepGraphitiAddedNode = {
	/** Additional attributes of the node. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The node creation time. */
	created_at?: string | null;
	/** The node's entity type. */
	label?: string | null;
	/** Metadata attached to the node's shadow episode. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** The name of the node. */
	name?: string | null;
	/** A regional summary of the node. */
	summary?: string | null;
	/** The node UUID, assigned by Zep. */
	uuid?: string | null;
};

export type ZepModelsBatchItemKind = string;

export type ZepModelsBatchItemStatus = string;

export type ZepModelsCustomInstruction = {
	/** logical key for identifying the instruction */
	name?: string | null;
	/** the domain knowledge text */
	text?: string | null;
};

export type ZepModelsGraphDataType = string;

export type ZepModelsObservationType = {
	description?: string | null;
	name?: string | null;
};

export type ZepModelsPolicySetSummary = {
	mode?: string | null;
	name?: string | null;
	uuid?: string | null;
	version?: number | null;
};

export type ZepModelsUserInstruction = {
	/** logical key for identifying the instruction */
	name?: string | null;
	/** the actual instruction text */
	text?: string | null;
};

export type ZepV4AddEdgesResult = {
	/** The accept-time acknowledgements in request order. */
	edges?: Array<ZepV4AddedEdge> | null;
	/** The asynchronous task that tracks edge creation and indexing. */
	task?: ZepV4Task | null;
};

export type ZepV4AddEpisodeResult = {
	/** The newly created episode, a full resource that is readable immediately. Its processed field is false until graph extraction finishes. */
	episode?: ZepV4Episode | null;
	/** The asynchronous task that tracks the episode's graph extraction and indexing. */
	task?: ZepV4Task | null;
};

export type ZepV4AddHyperedgeEdgeResult = {
	/** An accept-time acknowledgement of the member edge. It contains the identifier that Zep assigned and the name and nodes that you supplied. It does not contain the shared fact or timestamps of the hyperedge. */
	edge?: ZepV4AddedEdge | null;
	/** The asynchronous task that tracks writing the member edge. */
	task?: ZepV4Task | null;
};

export type ZepV4AddHyperedgeResult = {
	/** An accept-time acknowledgement of the hyperedge you submitted. */
	hyperedge?: ZepV4AddedHyperedge | null;
	/** The asynchronous task that tracks writing the member edges. */
	task?: ZepV4Task | null;
};

export type ZepV4AddMessagesResult = {
	/** The context block assembled from the graph after adding the messages, present only when return_context is true in the request. */
	context?: string | null;
	/** The messages that were added, each including its assigned identifier. */
	messages?: Array<ZepV4Message> | null;
	/** The asynchronous task that tracks the messages' graph extraction and indexing. */
	task?: ZepV4Task | null;
};

export type ZepV4AddNodesResult = {
	/** An accept-time acknowledgement of the nodes you submitted, each carrying its assigned identifier and the fields you supplied, not the full stored node. */
	nodes?: Array<ZepGraphitiAddedNode> | null;
	/** The asynchronous task that tracks the nodes' extraction and indexing. */
	task?: ZepV4Task | null;
};

export type ZepV4AddedEdge = {
	/** Additional attributes of the edge. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The time the fact was superseded or removed. */
	expired_at?: string | null;
	/** The natural-language fact you submitted for this edge. graph.hyperedge.create_edge does not return this field. */
	fact?: string | null;
	/** The name of the edge, in upper snake case, for example RELATES_TO. */
	fact_name?: string | null;
	/** The time at which the fact stopped being true. */
	invalid_at?: string | null;
	/** Custom metadata associated with the edge. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** The source node fields you supplied when creating this edge. */
	source_node?: ZepV4EdgeNodeRef | null;
	/** The source node UUID is set when deduplicate is false. It is the UUID you supplied, or the UUID Zep assigned to a node that the request creates. When deduplicate is true, read the endpoint from the task result. */
	source_node_uuid?: string | null;
	/** The target node fields you supplied when creating this edge. */
	target_node?: ZepV4EdgeNodeRef | null;
	/** The target node UUID is set when deduplicate is false. It is the UUID you supplied, or the UUID Zep assigned to a node that the request creates. When deduplicate is true, read the endpoint from the task result. */
	target_node_uuid?: string | null;
	/** The unique identifier assigned to the edge. */
	uuid?: string | null;
	/** The time from which the fact is considered true. */
	valid_at?: string | null;
};

export type ZepV4AddedHyperedge = {
	/** The attributes you supplied for every member edge. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The member edges, each with its assigned identifier. */
	edges?: Array<ZepV4AddedHyperedgeEdge> | null;
	/** The time the fact was superseded or removed. */
	expired_at?: string | null;
	/** The natural-language fact you submitted. */
	fact?: string | null;
	/** The time at which the fact stopped being true. */
	invalid_at?: string | null;
	/** The episode metadata you supplied. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** The unique identifier assigned to the hyperedge. */
	uuid?: string | null;
	/** The time from which the fact is considered true. */
	valid_at?: string | null;
};

export type ZepV4AddedHyperedgeEdge = {
	/** The name of the member edge you supplied. */
	name?: string | null;
	/** The source node fields you supplied for this member. */
	source_node?: ZepV4EdgeNodeRef | null;
	/** The target node fields you supplied for this member. */
	target_node?: ZepV4EdgeNodeRef | null;
	/** The unique identifier assigned to this member edge. */
	uuid?: string | null;
};

export type ZepV4Agent = {
	/** The developer-assigned Agent identifier, unique within the project. */
	agent_id?: string | null;
	/** The time the Agent was created. */
	created_at?: string | null;
	/** The customer deployment this Agent represents. */
	deployment_id?: string | null;
	/** A human-readable description of the Agent. */
	description?: string | null;
	/** Agent Skills capture, compilation, and promotion settings. */
	memory_settings?: ZepV4AgentMemorySettings | null;
	/** Developer metadata used to organize and filter Agents. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** The Agent's display name. */
	name?: string | null;
	/** The revision required by the next update or delete request. */
	revision?: number | null;
	/** The immutable boundary within which Skills may be synthesized. */
	security_domain?: string | null;
	/** The current lifecycle status. */
	status?: ZepV4AgentStatus | null;
	/** The time the Agent was last updated. */
	updated_at?: string | null;
	/** The stable identifier of the Agent. */
	uuid?: string | null;
	/** The customer deployment version this Agent represents. */
	version?: string | null;
};

export type ZepV4AgentBreakingChange = {
	/** The service returns the number of Skills affected by the declaration. */
	affected_skill_count?: number | null;
	/** The service returns the UUID of the Agent that received this declaration. */
	agent_uuid?: string | null;
	/** The service returns the Agent revision produced by this declaration, stable on replay. */
	revision?: number | null;
	/** The service assigns the UUID that identifies this declaration. */
	uuid?: string | null;
	/** The service returns the deployment version recorded by this declaration. */
	version?: string | null;
};

export type ZepV4AgentContext = {
	/** The service returns context for this result. */
	context?: string | null;
	/** The service returns the task-instance objective. */
	objective?: string | null;
	/** The service returns sources that it could not include in full. */
	partial_sources?: Array<ZepV4AgentContextPartialSource> | null;
	/** The service returns the UUID that identifies this context request. */
	request_id?: string | null;
	/** The service returns the Skills that it skipped. */
	skipped?: Array<ZepV4AgentContextSkippedSkill> | null;
	/** The service returns a snapshot of the source data. */
	snapshot?: Array<ZepV4AgentContextSkillSnapshot> | null;
	/** The service returns the task-family slug. */
	task_family?: string | null;
	/** The service returns the UUID of the source Trace. */
	trace_uuid?: string | null;
	/** The service sets this to true when the context exceeds its output limit. */
	truncated?: boolean | null;
};

export type ZepV4AgentContextEvidenceCounts = {
	/** The service returns contradicting evidence count. */
	contradicting?: number | null;
	/** The service returns the count of neutral evidence items. */
	neutral?: number | null;
	/** The service returns supporting evidence count. */
	supporting?: number | null;
};

export type ZepV4AgentContextPartialSource = {
	/** The service explains why this source is partial. */
	reason?: string | null;
	/** The service returns the source used to build this context. */
	source?: string | null;
	/** The service returns the UUID of the Task linked to this partial source. */
	task_uuid?: string | null;
};

export type ZepV4AgentContextSkillSnapshot = {
	/** The service returns the SHA-256 digest of the Skill artifact. */
	artifact_sha256?: string | null;
	/** The service returns citations that support this Skill snapshot. */
	evidence_citations?: Array<string> | null;
	/** The service returns counts of evidence items by result. */
	evidence_counts?: ZepV4AgentContextEvidenceCounts | null;
	/** The service returns result rank. */
	rank?: number | null;
	/** The service returns the UUID of the Skill. */
	skill_uuid?: string | null;
	/** The service returns the Skill version number. */
	version?: number | null;
};

export type ZepV4AgentContextSkippedSkill = {
	/** The service returns why the Skill was skipped from the context. */
	reason?: string | null;
	/** The service returns the UUID of the Skill. */
	skill_uuid?: string | null;
	/** The service returns the Skill version number. */
	version?: number | null;
};

export type ZepV4AgentDeleteResult = {
	/** The asynchronous task that tracks the Agent's deletion. */
	task?: ZepV4Task | null;
};

export type ZepV4AgentLearningState = {
	/** The service returns the approval mode. Valid values are auto and manual. The default is auto. */
	approval?: string | null;
	/** The service returns the Agent's learning mode. Valid values are scheduled, manual, and on_close. The default is scheduled. */
	compilation_mode?: string | null;
	/** The service sets this to true while a learning run waits to start or runs. Skills from that run are not yet available. */
	compilation_pending?: boolean | null;
	/** The service reports the number of Traces that can support learning. */
	eligible_trace_count?: number | null;
	/** The service reports how many distinct attempt families a run needs. The default is 3 in scheduled mode and 1 in on_close mode. */
	minimum_attempt_families?: number | null;
	/** The service returns text that tells a person what to do next. Code must not treat this text as a stable value. */
	next_step?: string | null;
	/** The service returns the evaluations that each candidate must pass. */
	required_evaluations?: Array<string> | null;
	/** The service returns the category whose learning progress this record describes. */
	task_family?: string | null;
};

export type ZepV4AgentLiteralPolicy = {
	/** Typed classes that the policy may preserve. */
	allowlisted_classes?: ZepV4AgentLiteralPolicyClasses | null;
	/** Exact reusable values that the policy may preserve when applicability matches. */
	allowlisted_values?: ZepV4AgentLiteralPolicyValues | null;
	/** The time this explicit revision was created. Omitted for revision zero. */
	created_at?: string | null;
	/** The principal identifier that created this explicit revision. Empty for revision zero. */
	created_by_principal_id?: string | null;
	/** The principal type that created this explicit revision. Empty for revision zero. */
	created_by_principal_type?: string | null;
	/** The remediation for literals that are not explicitly allowed. */
	default?: string | null;
	/** SHA-256 of the canonical policy JSON. */
	digest?: string | null;
	/** The immutable policy revision. Revision zero is the built-in strict default. */
	revision?: number | null;
};

export type ZepV4AgentLiteralPolicyClasses = {
	/** Reusable environment literal classes. */
	environments?: Array<string> | null;
	/** Reusable tool literal classes. */
	tools?: Array<string> | null;
};

export type ZepV4AgentLiteralPolicyValues = {
	/** Exact reusable values eligible for a permitted environment literal class. */
	environments?: Array<string> | null;
	/** Exact reusable values eligible for a permitted tool literal class. */
	tools?: Array<string> | null;
};

export type ZepV4AgentMemoryEvaluationPolicy = {
	/** The developer lists one or more evaluation requirements for this policy. */
	requirements?: Array<ZepV4AgentMemoryEvaluationRequirement> | null;
	/** The developer selects the task family that uses this evaluation policy. */
	task_family?: string | null;
};

export type ZepV4AgentMemoryEvaluationRequirement = {
	/** The service sets this to true when it controls whether the requirement passes admission. */
	controlled?: boolean | null;
	/** The service returns the environment used for this evaluation. */
	environment?: string | null;
	/** The developer selects the evaluation source. */
	evaluated_by?: string | null;
	/** The service returns the version of the evaluation rule. */
	evaluator_version?: string | null;
	/** The developer supplies the required result for this evaluation. Valid values are defined by the evaluation named in the policy. */
	result?: string | null;
};

export type ZepV4AgentMemorySettings = {
	/** The developer lists the evaluations that each candidate must pass for its category. */
	admission_evaluation_requirements?: Array<ZepV4AgentMemoryEvaluationPolicy> | null;
	/** The developer sets the approval mode. Valid values are auto and manual. The default is auto. */
	approval?: ZepV4AgentMemorySettingsApproval | null;
	/** The developer sets the minimum number of distinct attempt families for admission. The range is 1 to 16, and the default is 1. */
	approval_minimum_attempt_families?: number | null;
	/** The developer lists tool names that need member approval in auto approval. A generated Skill that uses one of these tools waits for a member. The list can contain up to 256 unique names, each at most 255 characters. The default is an empty list. */
	approval_required_tools?: Array<string> | null;
	/** The developer lists task-family slugs that use auto approval. An empty list applies auto approval to all task families. */
	auto_approval_task_families?: Array<string> | null;
	/** The developer selects the compilation mode. Valid values are scheduled, manual, and on_close. The default is scheduled. */
	compilation_mode?: ZepV4AgentMemorySettingsCompilationMode | null;
	/** The developer sets how many days an unused provisional Skill can remain before the service retires it. The range is 1 to 3650 days. If omitted, provisional Skills do not expire. */
	provisional_expiry_days?: number | null;
	/** The developer sets the maximum number of provisional Skills in one category. The range is 1 to 1000. A new Skill waits for a member when the count is over the limit. If omitted, no limit applies. */
	provisional_skill_limit?: number | null;
	/** The developer sets the age-based cleanup period for eligible proposal sets. The range is 1 to 3650 days. If omitted, the setting does not enable age-based cleanup. */
	retention_days?: number | null;
};

export type ZepV4AgentPage = {
	/** The service returns the Agents on this page. */
	items?: Array<ZepV4Agent> | null;
	/** Opaque cursor for retrieving the next page, present only when more results are available. */
	next_cursor?: string | null;
	/** The total number of Agents matching the filters and authorization scope. */
	total_size?: number | null;
};

export type ZepV4AgentSkill = {
	/** The service returns Agent versions that can use the Skill. */
	agent_versions?: Array<string> | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns the current Skill version number. */
	current_version?: number | null;
	/** The service returns the Skill kind. */
	kind?: string | null;
	/** The service returns the stable package name of the Skill. */
	package_name?: string | null;
	/** The service returns whether search can return this Skill. */
	searchable?: boolean | null;
	/** The first 8 hex characters of uuid. Every route that takes skill_uuid also accepts this value in place of the full UUID. */
	short_id?: string | null;
	/** The service returns the stable developer-facing ID of the Skill, when set. */
	skill_id?: string | null;
	/** The service returns the lifecycle status. */
	status?: string | null;
	/** The service returns the task-family slug. */
	task_family?: string | null;
	/** The service returns why the Skill is unavailable to this Agent. */
	unavailable_reason?: string | null;
	/** the time that Zep last updated this resource. */
	updated_at?: string | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
};

export type ZepV4AgentSkillAdmissionDecision = {
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns the decision for this operation. */
	decision?: string | null;
	/** The service returns publication policy mode. */
	mode?: string | null;
	/** The service returns the code that explains this result. */
	reason_code?: string | null;
	/** The service returns the version number of the Skill. */
	skill_version?: number | null;
	/** The service returns the count of distinct attempt families that support admission. */
	supporting_attempt_families?: number | null;
};

export type ZepV4AgentSkillCandidate = {
	/** The service returns Agent versions that can use the Skill. */
	agent_versions?: Array<string> | null;
	/** The service returns Skill versions used as the split-plan base. */
	base_versions?: Array<ZepV4AgentSkillCandidateBaseVersion> | null;
	/** The service returns classifier confidence score. */
	confidence?: number | null;
	/** The service returns the candidate operation. Valid values are add, patch, and retire. */
	decision?: string | null;
	/** The service returns the resource description. */
	description?: string | null;
	/** The service returns situations in which the Skill must not be used. */
	do_not_use_when?: Array<string> | null;
	/** The service returns evidence linked to this result. */
	evidence?: Array<ZepV4AgentSkillCandidateEvidence> | null;
	/** The service returns the Skill kind. */
	kind?: string | null;
	/** The service returns the Skill content in Markdown. */
	markdown?: string | null;
	/** The service returns the display name. */
	name?: string | null;
	/** The service returns the stable package name of the Skill. */
	package_name?: string | null;
	/** The service returns the task-family slug. */
	task_family?: string | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
};

export type ZepV4AgentSkillCandidateBaseVersion = {
	/** The service returns Agent versions that can use the Skill. */
	agent_versions?: Array<string> | null;
	/** The service returns the resource description. */
	description?: string | null;
	/** The service returns situations in which the Skill must not be used. */
	do_not_use_when?: Array<string> | null;
	/** The service returns the Skill content in Markdown. */
	markdown?: string | null;
	/** The service returns the display name. */
	name?: string | null;
	/** The service returns the UUID of the Skill. */
	skill_uuid?: string | null;
	/** The service returns the Skill version number. */
	version?: number | null;
};

export type ZepV4AgentSkillCandidateEvaluation = {
	/** The service returns the UUID of the candidate that this evaluation covers. */
	candidate_uuid?: string | null;
	/** The service reports whether a controlled test produced the result. */
	controlled_test?: boolean | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns the environment used for this evaluation. */
	environment?: string | null;
	/** The service returns the evaluation source. Valid values are customer, tool, offline_corpus, and policy. */
	evaluated_by?: string | null;
	/** The service returns the version of the evaluation rule. */
	evaluator_version?: string | null;
	/** The service returns the link to supporting evidence, when one exists. */
	evidence_reference?: string | null;
	/** The service returns evaluation metrics. */
	metrics?: Record<string, number> | null;
	/** The service returns the UUID of the review that produced this evaluation. */
	review_uuid?: string | null;
	/** The service returns the current revision number. */
	revision?: number | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
	/** The service returns the evaluation verdict. */
	verdict?: string | null;
};

export type ZepV4AgentSkillCandidateEvidence = {
	/** The service returns the provider of the source import, when this Trace was imported. */
	imported_provider?: string | null;
	/** The service returns when the source event occurred. */
	occurred_at?: string | null;
	/** The service returns the task outcome. */
	outcome?: string | null;
	/** The service returns the evidence stance. */
	polarity?: string | null;
	/** The service returns the evidence source type. Valid values are trace, trace_event, trace_summary, and skill_version. */
	source_kind?: string | null;
	/** The service returns the UUID of the source Trace. */
	trace_uuid?: string | null;
	/** The service returns how the outcome was verified. */
	verification?: string | null;
};

export type ZepV4AgentSkillCandidateReview = {
	/** The service returns the number of related resources. */
	candidate_count?: number | null;
	/** The service returns candidate Skills. */
	candidates?: Array<ZepV4AgentSkillCandidate> | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** ImportReviewRequired reports whether any evidence import requires approval. */
	import_review_required?: boolean | null;
	/** The service returns the code that explains this result. */
	reason_code?: string | null;
	/** The service returns evaluation results. */
	results?: Array<ZepV4AgentSkillCandidateReviewResult> | null;
	/** The service returns when the review occurred. */
	reviewed_at?: string | null;
	/** The service returns the current revision number. */
	revision?: number | null;
	/** The service returns the lifecycle status. */
	status?: string | null;
	/** The service returns the task-family slug. */
	task_family?: string | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
};

export type ZepV4AgentSkillCandidateReviewResult = {
	/** The service returns Skill versions used as the split-plan base. */
	base_versions?: Array<ZepV4AgentSkillCandidateBaseVersion> | null;
	/** The service returns UUIDs of the candidate Skills in this plan. */
	candidate_uuids?: Array<string> | null;
	/** The service returns the Curator decision for this review result. Valid values are add, patch, merge, split, supersede, contradict, retire, reject, and no_change. */
	decision?: string | null;
	/** The service returns UUIDs of the Skills that this plan can update. */
	target_skill_uuids?: Array<string> | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
};

export type ZepV4AgentSkillCandidateReviewSummary = {
	/** The service returns the number of related resources. */
	candidate_count?: number | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns the code that explains this result. */
	reason_code?: string | null;
	/** The service returns when the review occurred. */
	reviewed_at?: string | null;
	/** The service returns the current revision number. */
	revision?: number | null;
	/** The service returns the lifecycle status. */
	status?: string | null;
	/** The service returns the task-family slug. */
	task_family?: string | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
};

export type ZepV4AgentSkillCompilationOutcome = {
	/** The service assigns the UUID of the Agent that owns this learning run. */
	agent_uuid?: string | null;
	/** The service returns the number of attempts made in the last stage. */
	attempts?: number | null;
	/** The service returns the number of candidate Skills that the run produced. */
	candidate_count?: number | null;
	/** The service assigns the UUID that identifies this idempotent compilation attempt. */
	compilation_identity?: string | null;
	/** The service assigns the UUID of the scheduled window when one applies. */
	compilation_window_uuid?: string | null;
	/** The service returns when Zep recorded this learning-run outcome. */
	created_at?: string | null;
	/** The service returns the final result of the learning run. */
	decision?: string | null;
	/** The service returns the number of Skill proposals that the run produced. */
	proposal_count?: number | null;
	/** The service explains why the learning run stopped or made no change. */
	reason_text?: string | null;
	/** The service returns the count of add proposals that the Reflector, the proposal scanner, or the Curator rejected in this compilation. */
	rejected_add_count?: number | null;
	/** The service returns why compilation rejected the candidate. Valid values are no_eligible_traces,reflector_invalid_output,applicability_ungrounded,corroboration_insufficient,scanner_rejected,curator_rejected,curator_attempts_exhausted,prompt_budget_exceeded,provider_error. */
	rejection_class?: ZepV4AgentSkillCompilationOutcomeRejectionClass | null;
	/** The service reports the last stage reached: selection, reflector, scanner, curator, or admission. */
	stage?: string | null;
	/** The service returns the category that this learning run processed. */
	task_family?: string | null;
	/** The service returns the number of eligible Traces that the run processed. */
	trace_count?: number | null;
	/** The service returns the stable identifier for this learning run. */
	uuid?: string | null;
};

export type ZepV4AgentSkillContract = {
	/** The service returns alternate names for the resource. */
	aliases?: Array<string> | null;
	/** The service returns the Agent versions and models that can use the Skill. */
	applicability?: ZepV4AgentSkillContractApplicability | null;
	/** The service returns evidence identifiers that support the contract. */
	citations?: Array<string> | null;
	/** The service returns the confidence score for the contract, from 0 to 1. */
	confidence?: number | null;
	/** The service returns situations in which the Skill must not be used. */
	contraindications?: Array<ZepV4AgentSkillContractText> | null;
	/** The service returns extra sections that a customer added to the Skill. */
	customer_sections?: Array<ZepV4AgentSkillContractSection> | null;
	/** The service returns packages that the Skill requires. */
	dependencies?: Array<ZepV4AgentSkillContractDependency> | null;
	/** The service returns the resource description. */
	description?: string | null;
	/** The service returns environment names used by the Skill. */
	environments?: Array<ZepV4AgentSkillContractResource> | null;
	/** The service returns the evidence records cited by the contract. */
	evidence?: Array<ZepV4AgentSkillContractEvidence> | null;
	/** The service returns failure conditions and recovery steps. */
	failures?: Array<ZepV4AgentSkillContractFailure> | null;
	/** The service returns when the Skill should be used. */
	invocation?: ZepV4AgentSkillContractInvocation | null;
	/** The service returns the Skill kind. Valid values are principle, procedure, workflow, failure_mode, recovery, constraint. */
	kind?: ZepV4SkillKind | null;
	/** The service returns the display name. */
	name?: string | null;
	/** The service returns how the Skill contract was created. Valid values are evidence_derived and customer_authored. */
	origin?: ZepV4AgentSkillContractOrigin | null;
	/** The service returns results that the Skill produces. */
	outputs?: Array<ZepV4AgentSkillContractText> | null;
	/** The service returns the stable package name of the Skill. */
	package_name?: string | null;
	/** The service returns conditions that must be true before use. */
	preconditions?: Array<ZepV4AgentSkillContractText> | null;
	/** The service returns ordered procedure steps. */
	procedure?: Array<ZepV4AgentSkillContractStep> | null;
	/** The service returns links from this Skill to other Skills. */
	relations?: Array<ZepV4AgentSkillContractRelation> | null;
	/** The service returns the contract schema version. The current value is v1. */
	schema_version?: string | null;
	/** The service returns conditions that show when the Skill task is complete. */
	success_criteria?: Array<ZepV4AgentSkillContractText> | null;
	/** The service returns the task-family slug. */
	task_family?: string | null;
	/** The service returns conditions that show when the Skill's work is complete. */
	termination_conditions?: Array<ZepV4AgentSkillContractText> | null;
	/** The service returns tool names used by the Skill. */
	tools?: Array<ZepV4AgentSkillContractResource> | null;
};

export type ZepV4AgentSkillContractApplicability = {
	/** The service returns Agent versions that can use the Skill. */
	agent_versions?: Array<string> | null;
	/** The service returns evidence identifiers that support this applicability. */
	citations?: Array<string> | null;
	/** The service returns model names and their allowed versions. */
	models?: Array<ZepV4AgentSkillContractVersionConstraint> | null;
};

export type ZepV4AgentSkillContractDependency = {
	/** The service returns the stable package name of the Skill. */
	package_name?: string | null;
	/** The service returns the allowed versions for this Skill. */
	version_constraint?: string | null;
};

export type ZepV4AgentSkillContractEvidence = {
	/** AttemptFamilyID is the ID of the attempt family that supplied this evidence. The service returns this value. */
	attempt_family_id?: string | null;
	/** ID is the citation identifier that the service returns. It is unique in the evidence list. */
	id?: string | null;
	/** Polarity states whether the evidence supports, contradicts, or does not affect the contract claim. The service returns supporting, contradicting, or neutral. */
	polarity?: ZepV4AgentSkillContractEvidencePolarity | null;
	/** SourceID is the ID of the Trace, event, or summary version named by source_kind. The service returns this value. */
	source_id?: string | null;
	/** SourceKind is the source type. The service returns trace, event, or summary. */
	source_kind?: ZepV4AgentSkillContractEvidenceSourceKind | null;
	/** TraceID is the ID of the Trace that supplied this evidence. The service returns this value. */
	trace_id?: string | null;
};

export type ZepV4AgentSkillContractFailure = {
	/** The service returns the failure condition. */
	condition?: ZepV4AgentSkillContractText | null;
	/** The service returns actions that recover from this failure. */
	recovery?: Array<ZepV4AgentSkillContractText> | null;
};

export type ZepV4AgentSkillContractInvocation = {
	/** The service returns conditions that must hold before the Skill is used. */
	conditions?: Array<ZepV4AgentSkillContractText> | null;
	/** The service returns a summary of when to use the Skill. */
	summary?: ZepV4AgentSkillContractText | null;
};

export type ZepV4AgentSkillContractRelation = {
	/** The service returns evidence identifiers that support this relation. */
	citations?: Array<string> | null;
	/** The service returns the relation type. Valid values are composes, requires, conflicts_with, supersedes, and related. */
	kind?: ZepV4AgentSkillContractRelationKind | null;
	/** The service returns the package name of the related Skill. */
	target_package_name?: string | null;
	/** The service returns the allowed versions for the related Skill. */
	version_constraint?: string | null;
};

export type ZepV4AgentSkillContractResource = {
	/** The service returns alternate names for this tool or environment. */
	aliases?: Array<string> | null;
	/** The service returns evidence identifiers that support this resource. */
	citations?: Array<string> | null;
	/** The service returns the resource name stored in the contract. */
	name?: string | null;
	/** The service returns the allowed versions for this resource. */
	version_constraint?: string | null;
};

export type ZepV4AgentSkillContractSection = {
	/** The service returns section heading. */
	heading?: string | null;
	/** The service returns the Skill content in Markdown. */
	markdown?: string | null;
	/** The service returns the section schema version. The current value is v1. */
	schema_version?: string | null;
	/** The service returns the stable ID of this customer-authored section. */
	section_id?: string | null;
};

export type ZepV4AgentSkillContractStep = {
	/** The service returns the decision for this operation. */
	decision?: ZepV4AgentSkillContractText | null;
	/** The service returns results to look for after this procedure step. */
	expected_observations?: Array<ZepV4AgentSkillContractText> | null;
	/** The service returns the action for this procedure step. */
	instruction?: ZepV4AgentSkillContractText | null;
};

export type ZepV4AgentSkillContractText = {
	/** The service returns evidence identifiers that support this text. */
	citations?: Array<string> | null;
	/** The service returns text that a person can read. */
	text?: string | null;
};

export type ZepV4AgentSkillContractVersionConstraint = {
	/** The service returns the Agent model or deployment name. */
	name?: string | null;
	/** The service returns the allowed versions for this model or deployment. */
	version_constraint?: string | null;
};

export type ZepV4AgentSkillEvaluation = {
	/** The developer sets this to true when a controlled test produced the result. */
	controlled_test?: boolean | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns the environment used for this evaluation. */
	environment?: string | null;
	/** The service returns the evaluation source. Valid values are customer, tool, offline_corpus, and policy. */
	evaluated_by?: string | null;
	/** The service returns the version of the evaluation rule. */
	evaluator_version?: string | null;
	/** The service returns the link to supporting evidence, when one exists. */
	evidence_reference?: string | null;
	/** The service returns evaluation metrics. */
	metrics?: Record<string, number> | null;
	/** The service returns the UUID of the Skill. */
	skill_uuid?: string | null;
	/** The service returns the version number of the Skill. */
	skill_version?: number | null;
	/** The service returns the UUID of the source Trace. */
	trace_uuid?: string | null;
	/** The service returns the UUID of the recorded Skill use, when linked. */
	use_uuid?: string | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
	/** The service returns the evaluation verdict. */
	verdict?: string | null;
};

export type ZepV4AgentSkillEvidence = {
	/** The service returns the verification assertion linked to this evidence. */
	assertion_uuid?: string | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns when the source event occurred. */
	occurred_at?: string | null;
	/** The service returns the evidence stance. */
	polarity?: string | null;
	/** The service returns the evidence source type. Valid values are trace, trace_event, trace_summary, and skill_version. */
	source_kind?: string | null;
	/** The service returns summary version linked to this evidence. */
	summary_version_uuid?: string | null;
	/** The service returns trace event linked to this evidence. */
	trace_event_uuid?: string | null;
	/** The service returns the UUID of the source Trace. */
	trace_uuid?: string | null;
	/** The service returns the verification source. Valid values are none, agent, tool, customer, and external. */
	verification?: string | null;
};

export type ZepV4AgentSkillPublicationLineage = {
	/** The destination Agent UUID. */
	destination_agent_uuid?: string | null;
	/** The destination Skill UUID. */
	destination_skill_uuid?: string | null;
	/** The destination version UUID. */
	destination_version_uuid?: string | null;
	/** The policy revision that allowed automatic publication. */
	policy_revision?: number | null;
	/** The policy UUID that allowed automatic publication. */
	policy_uuid?: string | null;
	/** The publication UUID. */
	publication_uuid?: string | null;
	/** The source Agent UUID. */
	source_agent_uuid?: string | null;
	/** The source Skill UUID. */
	source_skill_uuid?: string | null;
	/** The source version number. */
	source_version?: number | null;
	/** The source version UUID. */
	source_version_uuid?: string | null;
};

export type ZepV4AgentSkillRelationship = {
	/** The service returns whether this Skill is applied to the Agent. */
	application_state?: string | null;
	/** The service returns the Skill kind. */
	kind?: string | null;
	/** The service returns the package name of the related Skill. */
	related_package_name?: string | null;
	/** The service returns the kind of the related Skill. */
	related_skill_kind?: string | null;
	/** The service returns the display name of the related Skill. */
	related_skill_name?: string | null;
	/** The service returns the task-family slug of the related Skill. */
	related_skill_task_family?: string | null;
	/** The service returns the UUID of the related Skill, when one is linked. */
	related_skill_uuid?: string | null;
	/** The service returns the version number of the related Skill. */
	related_skill_version?: number | null;
	/** The service returns the version constraint for the related Skill. */
	related_version_constraint?: string | null;
	/** The service returns the name of the related tool or environment. */
	resource_name?: string | null;
	/** The service returns the allowed versions of the related resource. */
	resource_version_constraint?: string | null;
	/** The service returns the outcome of the source Trace. */
	trace_outcome?: string | null;
	/** The service returns the task family of the source Trace. */
	trace_task_family?: string | null;
	/** The service returns the UUID of the source Trace. */
	trace_uuid?: string | null;
	/** The service returns the verification state of the source Trace. */
	trace_verification?: string | null;
};

export type ZepV4AgentSkillSearchHit = {
	/** The service returns Agent versions that can use this Skill. */
	agent_versions?: Array<string> | null;
	/** The service returns the resource description. */
	description?: string | null;
	/** The service returns environment names used by the Skill. */
	environments?: Array<string> | null;
	/** The service returns the Skill kind. */
	kind?: string | null;
	/** The service returns the rendered Skill instructions in Markdown. */
	markdown?: string | null;
	/** Maturity is the trust tier of the Skill: provisional (one source attempt family), corroborated (two or more), established (a Trust of 0.6 or more from verified applications), or authored (no compiled source). */
	maturity?: ZepV4AgentSkillSearchHitMaturity | null;
	/** The service returns the display name. */
	name?: string | null;
	/** The service returns the stable package name of the Skill. */
	package_name?: string | null;
	/** The service reports whether this Skill can run without external context. */
	self_contained?: boolean | null;
	/** The first 8 hex characters of uuid. Every route that takes skill_uuid also accepts this value in place of the full UUID. */
	short_id?: string | null;
	/** The service returns the stable developer-facing ID of the Skill, when set. */
	skill_id?: string | null;
	/** SourceAttemptFamilies is the count of distinct, successful, verified attempt families that support the current version. */
	source_attempt_families?: number | null;
	/** The service returns the task-family slug. */
	task_family?: string | null;
	/** The service returns tool names used by the Skill. */
	tools?: Array<string> | null;
	/** Trust is the lower bound of the 95% Wilson score interval for the success rate of strongly verified applications of the Skill. It is 0 when the Skill has no verified application. */
	trust?: number | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
	/** The service returns the count of strongly verified applications that end in success or failure. */
	verified_applications?: number | null;
	/** The service returns the Skill version number. */
	version?: number | null;
};

export type ZepV4AgentSkillSearchResponse = {
	/** The service returns the items in this page. */
	items?: Array<ZepV4AgentSkillSearchHit> | null;
	/** The service returns the cursor for the next page, when one exists. */
	next_cursor?: string | null;
	/** The service returns the signed token for this result set. */
	search_id?: string | null;
};

export type ZepV4AgentSkillUse = {
	/** The service returns the Agent version that used this Skill. */
	agent_version?: string | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns the task outcome. */
	outcome?: ZepV4AgentSkillUseOutcome | null;
	/** The service returns the code that explains this result. */
	reason_code?: string | null;
	/** The service returns the UUID of the Skill. */
	skill_uuid?: string | null;
	/** The service returns the version number of the Skill. */
	skill_version?: number | null;
	/** The service returns the UUID of the source Trace. */
	trace_uuid?: string | null;
	/** The service returns how the Skill was used. */
	usage?: string | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
};

export type ZepV4AgentSkillUseOutcome = {
	/** The service returns the verification assertion linked to this evidence. */
	assertion_uuid?: string | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns the task outcome. */
	outcome?: string | null;
	/** The service returns the UUID of the source Trace. */
	trace_uuid?: string | null;
	/** The service returns the UUID of the recorded Skill use. */
	use_uuid?: string | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
	/** The service returns the verification source. Valid values are none, agent, tool, customer, and external. */
	verification?: string | null;
};

export type ZepV4AgentSkillVersion = {
	/** The service returns skill contract. */
	contract?: ZepV4AgentSkillContract | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns the customer-authored Skill definition. */
	definition?: ZepV4SkillDefinition | null;
	/** Markdown is the agent view of the Skill unless the request selects `markdown_format=full`. */
	markdown?: string | null;
	/** The service reports whether the Skill can run without external context. */
	self_contained?: boolean | null;
	/** The service returns the Skill version number. */
	version?: number | null;
};

export type ZepV4AgentSkillVersionComparison = {
	/** The service lists fields that changed between these Skill versions. */
	changed_fields?: Array<string> | null;
	/** The service returns the Skill version before the comparison. */
	from?: ZepV4AgentSkillVersion | null;
	/** The service returns the Skill version after the comparison. */
	to?: ZepV4AgentSkillVersion | null;
};

export type ZepV4AgentSplitPlan = {
	/** The service reports whether the plan authorizes Agent creation. */
	authorizes_agent_creation?: boolean | null;
	/** The service reports whether the plan authorizes Skill publication. */
	authorizes_publication?: boolean | null;
	/** A split plan is not human approval and grants no authority for later commands. */
	creates_resources?: boolean | null;
	/** The service returns UUIDs of the destination Agents. */
	destinations?: Array<ZepV4AgentSplitPlanDestination> | null;
	/** The service returns the reason for the requested split. */
	rationale?: string | null;
	/** The service reports whether the developer confirmed the review. */
	review_acknowledged?: boolean | null;
	/** The service returns the source Agent and the revision used for this plan. */
	source?: ZepV4AgentSplitPlanSource | null;
};

export type ZepV4AgentSplitPlanDestination = {
	/** The service returns the Agent settings for this destination. */
	agent?: ZepV4CreateAgentRequest | null;
	/** The service returns the Skills included in this plan. */
	skills?: Array<ZepV4AgentSplitPlanSkillReference> | null;
};

export type ZepV4AgentSplitPlanSkillReference = {
	/** The service returns the stable package name of the Skill. */
	package_name?: string | null;
	/** The service returns the stable developer-facing ID of the Skill, when set. */
	skill_id?: string | null;
	/** The service returns the UUID of the Skill. */
	skill_uuid?: string | null;
	/** The service returns the UUID of the selected immutable Skill version. */
	skill_version_uuid?: string | null;
	/** The service returns the Skill's lifecycle status. */
	status?: string | null;
	/** The service returns the selected Skill version number. */
	version?: number | null;
};

export type ZepV4AgentSplitPlanSource = {
	/** The service returns the UUID of the owning Agent. */
	agent_uuid?: string | null;
	/** The service returns the current revision number. */
	revision?: number | null;
};

export type ZepV4AgentStatus = string;

export type ZepV4AgentTaskFamilyDescriptor = {
	/** The service returns the owning Agent UUID. */
	agent_uuid?: string | null;
	/** The service returns the time the descriptor was created. */
	created_at?: string | null;
	/** The service returns what the family covers. */
	description?: string | null;
	/** The service returns the descriptor version the classifier ran against. */
	descriptor_version?: number | null;
	/** The service returns the tools that distinguish this family from the others. */
	distinguishing_tools?: Array<string> | null;
	/** The service returns the most similar goal that does not belong to the family. */
	not_for?: string | null;
	/** The service returns the task-family slug members receive. */
	slug?: string | null;
	/** The service returns the time the descriptor was last updated. */
	updated_at?: string | null;
	/** The service returns when a Trace belongs to the family. */
	use_when?: string | null;
	/** The service returns the stable descriptor UUID. */
	uuid?: string | null;
};

export type ZepV4AgentTaskFamilyDescriptorPage = {
	/** The discovered task families on this page. */
	items?: Array<ZepV4AgentTaskFamilyDescriptor> | null;
	/** Opaque cursor for retrieving the next page, present only when more results are available. */
	next_cursor?: string | null;
	/** The service returns the total number of discovered task families within the owning Agent. */
	total_size?: number | null;
};

export type ZepV4AgentTrace = {
	/** The time the Trace was abandoned. */
	abandoned_at?: string | null;
	/** The service returns the owning Agent UUID. */
	agent_uuid?: string | null;
	/** The service returns the stable retry-family identity shared by attempts. */
	attempt_family_uuid?: string | null;
	/** The time the Trace closed. */
	closed_at?: string | null;
	/** The time the Trace was created. */
	created_at?: string | null;
	/** Server-owned fields that are not part of the top-level capture contract. */
	internal?: ZepV4AgentTraceInternal | null;
	/** The service returns whether eligible evidence may participate in learning. */
	learn_from?: boolean | null;
	/** The service returns why the Trace is not eligible for learning, when it is not eligible. */
	learn_from_reason?: string | null;
	/** Developer metadata used for exact containment filters. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** The service returns the task-instance objective captured for this attempt. */
	objective?: string | null;
	/** The service returns the task outcome that the developer recorded. Valid values are succeeded, failed, partial, abandoned, and unknown. */
	outcome?: ZepV4AgentTraceOutcome | null;
	/** The service returns the parent attempt when this Trace is a retry. */
	parent_trace_uuid?: string | null;
	/** The service returns the current revision for the next update or lifecycle command. */
	revision?: number | null;
	/** The source record for an imported Trace. */
	source?: ZepV4AgentTraceSource | null;
	/** The service returns the current lifecycle state. Valid values are open, closing, closed, abandoned, and deleted. */
	status?: ZepV4AgentTraceLifecycle | null;
	/** The service returns the declared or assigned task-family slug, when one is available. */
	task_family?: string | null;
	/** The service returns the latest classification result. Its state is pending, assigned, or unassigned. It is absent if classification did not run for this Trace. */
	task_family_inference?: ZepV4AgentTraceTaskFamilyInference | null;
	/** The service returns how it selected the task family. Valid values are declared, import_rule, and inferred. */
	task_family_source?: string | null;
	/** The developer may set an identifier that is unique within the Agent. A retry with the same create parameters returns 200 and the existing Trace. Different parameters return 409. */
	trace_id?: string | null;
	/** The time the Trace was last updated. */
	updated_at?: string | null;
	/** The service returns the stable Trace UUID. */
	uuid?: string | null;
	/** The service returns how the outcome was verified. Valid values are none, agent, tool, customer, and external. */
	verification?: ZepV4AgentTraceVerification | null;
};

export type ZepV4AgentTraceEvent = {
	agent_uuid?: string | null;
	content?: string | null;
	/** Context gives the model, the tools, and the environments of the event. context.tools is the tool that the event calls or returns, and Skills learning reads it. A tool event can omit the tool name. */
	context?: ZepV4AgentTraceEventContext | null;
	created_at?: string | null;
	event_id?: string | null;
	event_type?: ZepV4AgentTraceEventType | null;
	failed_at?: string | null;
	/** Metadata is developer data. Skills learning does not read it. */
	metadata?: Record<string, ZepJsonValue> | null;
	occurred_at?: string | null;
	processed_at?: string | null;
	processing_state?: ZepV4AgentTraceEventProcessingState | null;
	sequence?: number | null;
	sources?: Array<ZepV4AgentTraceEventSource> | null;
	/** ToolCallID is the ID that the agent framework gives a tool call. Use the same ID on the tool_call and tool_result events. It is valid only on these event types. A result without a matching call is valid. OpenAI uses tool_calls[].id, Anthropic uses the tool_use block id, and LangChain uses… */
	tool_call_id?: string | null;
	trace_uuid?: string | null;
	updated_at?: string | null;
	uuid?: string | null;
};

export type ZepV4AgentTraceEventContext = {
	artifacts?: Array<ZepV4AgentTraceResourceRef> | null;
	environments?: Array<ZepV4AgentTraceResourceRef> | null;
	model?: ZepV4AgentTraceResourceRef | null;
	/** Tools identifies the tool that the event calls or returns. Skills learning reads this field. It is optional. A tool event can omit the tool name. */
	tools?: Array<ZepV4AgentTraceResourceRef> | null;
	verification?: ZepV4AgentTraceVerification | null;
};

export type ZepV4AgentTraceEventPage = {
	/** The service returns the events in this page. */
	items?: Array<ZepV4AgentTraceEvent> | null;
	/** The service returns the cursor for the next page, when one exists. */
	next_cursor?: string | null;
	/** The service returns the total number of items. */
	total_size?: number | null;
};

export type ZepV4AgentTraceEventProcessingState = string;

export type ZepV4AgentTraceEventSource = {
	copy_mode?: ZepV4AgentTraceEventSourceCopyMode | null;
	kind?: string | null;
	retention_mode?: ZepV4AgentTraceEventSourceRetentionMode | null;
	uuid?: string | null;
};

export type ZepV4AgentTraceEventSourceCopyMode = string;

export type ZepV4AgentTraceEventSourceRetentionMode = string;

export type ZepV4AgentTraceEventType = string;

export type ZepV4AgentTraceFinalizationResult = {
	/** The service returns the asynchronous Task. */
	task?: ZepV4Task | null;
	/** The service returns the finalized Trace. */
	trace?: ZepV4AgentTrace | null;
};

export type ZepV4AgentTraceInternal = {
	/** The service returns the UUID of the assertion linked to this Trace. */
	assertion_uuid?: string | null;
	/** The service returns the final sequence number expected when the Trace closes. */
	closing_sequence?: number | null;
	/** The service returns the current summary version number. */
	current_summary_version?: number | null;
	/** The service returns the UUID of the last Task linked to this Trace. */
	last_task_uuid?: string | null;
	/** The service returns the next sequence number that the Trace can accept. */
	next_sequence?: number | null;
	/** The service returns the current processing state. Valid values are idle, pending, processing, failed. */
	processing_state?: ZepV4AgentTraceProcessingState | null;
};

export type ZepV4AgentTraceLifecycle = string;

export type ZepV4AgentTraceOutcome = string;

export type ZepV4AgentTracePage = {
	/** The Traces on this page. */
	items?: Array<ZepV4AgentTrace> | null;
	/** Opaque cursor for retrieving the next page, present only when more results are available. */
	next_cursor?: string | null;
	/** The total number of Traces matching the filters within the owning Agent. */
	total_size?: number | null;
};

export type ZepV4AgentTraceProcessingState = string;

export type ZepV4AgentTraceResourceRef = {
	name?: string | null;
	version?: string | null;
};

export type ZepV4AgentTraceSource = {
	/** The service returns the UUID of the provider connection, when the Trace came from an import. */
	connection_uuid?: string | null;
	/** The service returns the UUID of the import, when the Trace came from an import. */
	import_uuid?: string | null;
	/** The service returns when Zep imported the Trace. */
	imported_at?: string | null;
	/** The service returns the source type. The valid value is trace_import. */
	kind?: ZepV4AgentTraceSourceKind | null;
	/** The service returns the provider that supplied this Trace. */
	provider?: string | null;
	/** The service returns the provider's project ID when the Trace came from an import. */
	provider_project_id?: string | null;
	/** The service returns the UUID of the import run, when one applies. */
	run_uuid?: string | null;
	/** The service returns provider-specific scores for the imported Trace. */
	scores?: Record<string, number> | null;
	/** The service returns whether the provider Trace changed after import. */
	source_changed?: boolean | null;
	/** The service returns the provider revision processed by this import. */
	source_revision?: string | null;
	/** The service returns a link to the source Trace, when available. */
	source_url?: string | null;
	/** The service returns when the source Trace ended. */
	trace_ended_at?: string | null;
	/** The service returns the provider ID of the source Trace. */
	trace_id?: string | null;
	/** The service returns the start time of the source Trace, when available. */
	trace_started_at?: string | null;
};

export type ZepV4AgentTraceSourceDeletionResult = {
	/** The service returns the number of Skills affected by this deletion. */
	affected_skills?: number | null;
	/** The service returns the UUID of the deletion operation. */
	deletion_uuid?: string | null;
	/** The service returns the Task that repairs Skills affected by this deletion. */
	skill_repair_task?: ZepV4Task | null;
	/** The service returns the Task that repairs summaries affected by this deletion. */
	summary_repair_task?: ZepV4Task | null;
	/** The service returns the Trace. */
	trace?: ZepV4AgentTrace | null;
};

export type ZepV4AgentTraceStructuredSummary = {
	/** The service returns unresolved ambiguities. */
	ambiguities?: Array<ZepV4AgentTraceSummaryStatement> | null;
	/** The service returns verification method. */
	approach?: Array<ZepV4AgentTraceSummaryStatement> | null;
	/** The service returns linked artifacts. */
	artifacts?: Array<ZepV4AgentTraceSummaryResource> | null;
	/** The service returns lessons that the learning process may use. */
	candidate_lessons?: Array<ZepV4AgentTraceSummaryStatement> | null;
	/** The service returns corrective actions. */
	corrections?: Array<ZepV4AgentTraceSummaryStatement> | null;
	/** The service returns the event coverage of the summary. */
	coverage?: ZepV4AgentTraceSummaryCoverage | null;
	/** The service returns actions that helped complete the task. */
	effective_steps?: Array<ZepV4AgentTraceSummaryStatement> | null;
	/** The service returns environment names used by the Skill. */
	environments?: Array<ZepV4AgentTraceSummaryResource> | null;
	/** The service returns verification errors. */
	errors?: Array<ZepV4AgentTraceSummaryStatement> | null;
	/** The service returns how event times were selected for the summary. */
	event_time_basis?: string | null;
	/** The service returns the time of the first event in the summary. */
	first_event_time?: string | null;
	/** The service returns actions that did not help complete the task. */
	ineffective_steps?: Array<ZepV4AgentTraceSummaryStatement> | null;
	/** The service returns the time of the last event in the summary. */
	last_event_time?: string | null;
	/** The service returns the task-instance objective. */
	objective?: string | null;
	/** The service returns recovery actions. */
	recoveries?: Array<ZepV4AgentTraceSummaryStatement> | null;
	/** The service returns the outcome reported for the Trace. Valid values are succeeded, failed, partial, abandoned, unknown. */
	reported_outcome?: ZepV4AgentTraceOutcome | null;
	/** The service returns verification result. */
	result?: ZepV4AgentTraceSummaryStatement | null;
	/** The service returns the task-family slug. */
	task_family?: string | null;
	/** The service returns tool names used by the Skill. */
	tools?: Array<ZepV4AgentTraceSummaryResource> | null;
	/** The service returns the verification status and its evidence. */
	verification?: ZepV4AgentTraceSummaryVerification | null;
};

export type ZepV4AgentTraceSummaryByteRange = {
	/** The service returns the byte offset after the half-open omitted range. */
	end?: number | null;
	/** The service returns the first byte offset in the half-open omitted range. */
	start?: number | null;
};

export type ZepV4AgentTraceSummaryCitation = {
	/** The service returns the ID of the source event. */
	event_id?: string | null;
	/** The service returns the event sequence cited by this summary. */
	sequence?: number | null;
};

export type ZepV4AgentTraceSummaryCoverage = {
	/** The service returns events that the summary includes as excerpts. */
	excerpted_events?: Array<ZepV4AgentTraceSummaryExcerptedEvent> | null;
	/** The service returns the first sequence number covered by this summary. */
	first_sequence?: number | null;
	/** The service returns the last sequence number covered by this summary. */
	last_sequence?: number | null;
	/** The service returns sequence ranges that the summary omits. */
	omitted_sequence_ranges?: Array<ZepV4AgentTraceSummaryOmittedRange> | null;
};

export type ZepV4AgentTraceSummaryCreationReason = string;

export type ZepV4AgentTraceSummaryExcerptedEvent = {
	/** The service returns the excerpted event content in bytes. */
	content_bytes?: number | null;
	/** The service returns the ID of the source event. */
	event_id?: string | null;
	/** The service returns byte ranges removed from the excerpted event content. */
	omitted_byte_ranges?: Array<ZepV4AgentTraceSummaryByteRange> | null;
	/** The service returns the sequence number of the excerpted event. */
	sequence?: number | null;
};

export type ZepV4AgentTraceSummaryOmissionReason = string;

export type ZepV4AgentTraceSummaryOmittedRange = {
	/** The service returns the first sequence number in the omitted range. */
	first_sequence?: number | null;
	/** The service returns the last sequence number in the omitted range. */
	last_sequence?: number | null;
	/** The service returns the reason for this result. Valid values are narrower_authorization_boundary, acknowledged_gap, abandoned_gap, processing_failed, source_deleted. */
	reason?: ZepV4AgentTraceSummaryOmissionReason | null;
};

export type ZepV4AgentTraceSummaryPage = {
	/** The service returns the summary versions in this page. */
	items?: Array<ZepV4AgentTraceSummaryVersion> | null;
	/** The service returns the cursor for the next page, when one exists. */
	next_cursor?: string | null;
	/** The service returns the total number of matching items. */
	total_size?: number | null;
};

export type ZepV4AgentTraceSummaryResource = {
	/** The service returns the events that support this resource summary. */
	citations?: Array<ZepV4AgentTraceSummaryCitation> | null;
	/** The service returns the resource name recorded in the source event. */
	name?: string | null;
	/** The service returns the resource version recorded in the source event. */
	version?: string | null;
};

export type ZepV4AgentTraceSummaryStatement = {
	/** The service returns the events that support this statement. */
	citations?: Array<ZepV4AgentTraceSummaryCitation> | null;
	/** The service returns one statement from the summary. */
	text?: string | null;
};

export type ZepV4AgentTraceSummaryVerification = {
	/** The service returns the events that support this verification result. */
	citations?: Array<ZepV4AgentTraceSummaryCitation> | null;
	/** The service returns the detailed verification statements. */
	details?: Array<ZepV4AgentTraceSummaryStatement> | null;
	/** The service returns the lifecycle status. Valid values are unverified,agent_verified,tool_verified,customer_verified,externally_verified. */
	status?: ZepV4AgentTraceSummaryVerificationStatus | null;
	/** The service returns IDs of Verifiers that checked this summary. */
	verifier_ids?: Array<string> | null;
};

export type ZepV4AgentTraceSummaryVersion = {
	/** The service returns the UUID of the owning Agent. */
	agent_uuid?: string | null;
	/** The service returns the verification assertion linked to this evidence. */
	assertion_uuid?: string | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns what caused this summary version. Valid values are close, abandon, revision, task_family_correction, evidence_deletion, policy_change. */
	creation_reason?: ZepV4AgentTraceSummaryCreationReason | null;
	/** The service returns when the first event occurred. */
	first_occurred_at?: string | null;
	/** The service returns the first event sequence included in this summary. */
	first_sequence?: number | null;
	/** The service returns when the last event occurred. */
	last_occurred_at?: string | null;
	/** The service returns the last event sequence included in this summary. */
	last_sequence?: number | null;
	/** The service returns event sequence ranges that this summary omits. */
	omitted_sequence_ranges?: Array<ZepV4AgentTraceSummaryOmittedRange> | null;
	/** The service returns the task outcome. Valid values are succeeded, failed, partial, abandoned, unknown. */
	outcome?: ZepV4AgentTraceOutcome | null;
	/** The service returns the UUID of the parent summary version, when one exists. */
	parent_version_uuid?: string | null;
	/** The service returns the structured summary generated for this Trace. */
	structured_summary?: ZepV4AgentTraceStructuredSummary | null;
	/** The service returns text that a person can read. */
	text?: string | null;
	/** The service returns the UUID of the source Trace. */
	trace_uuid?: string | null;
	/** The service returns the UUID that identifies this summary version. */
	uuid?: string | null;
	/** The service returns how the outcome was verified. Valid values are none, agent, tool, customer, external, unverified, agent_verified, tool_verified, customer_verified, externally_verified. */
	verification?: ZepV4AgentTraceVerification | null;
	/** The service returns this summary version number. */
	version?: number | null;
};

export type ZepV4AgentTraceTaskFamilyInference = {
	/** The service returns the time the outcome was recorded. */
	assigned_at?: string | null;
	/** The service records the classifier version that produced the outcome. */
	classifier_version?: string | null;
	/** The service records the classifier confidence for the accepted or top candidate, from 0 to 1. */
	confidence?: number | null;
	/** The service returns the descriptor set version the classifier ran against. */
	descriptor_version?: number | null;
	/** The service returns whether the classifier marked the Trace reusable for learning. */
	learning_reusable?: boolean | null;
	/** The service returns pending while classification is in progress, assigned when a task family is selected, or unassigned when no family is selected. */
	state?: string | null;
};

export type ZepV4AgentTraceVerification = string;

export type ZepV4AgentVerificationStrength = string;

export type ZepV4AgentVerifier = {
	/** The owning Agent UUID. */
	agent_uuid?: string | null;
	/** Structured capabilities reported by the verifier integration. */
	capabilities?: Record<string, ZepJsonValue> | null;
	/** The immutable verifier class. */
	class?: string | null;
	/** The time the registration was created. */
	created_at?: string | null;
	/** The authenticated principal that created this registration. */
	created_by?: ZepV4AgentVerifierPrincipal | null;
	/** Developer metadata used to organize the registration. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** Verification strengths this registration may assert. */
	permitted_strengths?: Array<ZepV4AgentVerificationStrength> | null;
	/** Exact authenticated principals permitted to submit verifier assertions. */
	principal_bindings?: Array<ZepV4AgentVerifierPrincipalBinding> | null;
	/** The revision required by the next update or revoke request. */
	revision?: number | null;
	/** The time the registration was revoked. */
	revoked_at?: string | null;
	/** The registration lifecycle status. */
	status?: ZepV4AgentVerifierStatus | null;
	/** The time the registration was last updated. */
	updated_at?: string | null;
	/** The stable verifier registration UUID. */
	uuid?: string | null;
	/** The developer-assigned verifier identifier, unique within the Agent. */
	verifier_id?: string | null;
};

export type ZepV4AgentVerifierEvidenceInvalidationResult = {
	/** The service returns UUIDs of Skills affected by this invalidation. */
	affected_skill_uuids?: Array<string> | null;
	/** The service returns the UUID of the owning Agent. */
	agent_uuid?: string | null;
	/** The service returns when Zep created this resource. */
	created_at?: string | null;
	/** The service returns the principal that created this assertion. */
	created_by?: ZepV4AgentVerifierPrincipal | null;
	/** The service returns why the Verifier revisions were invalidated. */
	reason?: string | null;
	/** The service returns the Task that tracks this asynchronous operation. */
	task?: ZepV4Task | null;
	/** The service returns the UUID that identifies this resource. */
	uuid?: string | null;
	/** The service returns revisions of the Verifiers affected by this invalidation. */
	verifier_revisions?: Array<number> | null;
	/** The service returns the UUID of the Verifier linked to this invalidation. */
	verifier_uuid?: string | null;
};

export type ZepV4AgentVerifierPrincipal = {
	/** The exact principal identifier. Wildcards are not supported. */
	principal_id?: string | null;
	/** The authenticated principal type: member, project-api-key, service, or mcp_user. */
	principal_type?: string | null;
};

export type ZepV4AgentVerifierPrincipalBinding = {
	/** The time the binding was created. */
	created_at?: string | null;
	/** The service returns the verification strength assigned to this principal binding. Valid values are tool_verified, customer_verified, externally_verified. */
	effective_strength?: ZepV4AgentVerificationStrength | null;
	/** The service returns the exact principal identifier bound to this verifier. */
	principal_id?: string | null;
	/** The service returns the authenticated principal type bound to this verifier. */
	principal_type?: string | null;
};

export type ZepV4AgentVerifierStatus = string;

export type ZepV4AsyncResult = {
	/** The asynchronous task that tracks this operation's progress. */
	task?: ZepV4Task | null;
};

export type ZepV4Batch = {
	/** The time the batch was created. */
	created_at?: string | null;
	/** Custom metadata associated with the batch, supplied when it was created. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** The batch's processing progress, including its current stage and item counts. Present only once processing has started. */
	progress?: ZepV4BatchProgress | null;
	/** The processing status of the batch: draft, invalid, queued, processing, succeeded, partial, failed, or canceled. */
	status?: ZepV4BatchStatus | null;
	/** Whether ontology enforcement is applied when this batch is processed, rejecting entities that do not match the configured ontology. */
	strict_ontology?: boolean | null;
	/** The unique identifier of the batch. */
	uuid?: string | null;
};

export type ZepV4BatchItem = {
	/** Experimental. The content policy state of the item's episode, present only on a graph with a bound content policy rule and only once the item is processed. */
	content_policy?: ZepV4EpisodeContentPolicy | null;
	/** The time the item was appended to the batch. */
	created_at?: string | null;
	/** The identifier of the episode created for this item, equal to source_uuid. */
	episode_uuid?: string | null;
	/** The reason the item failed and the action to take. Present only when status is failed. */
	error?: ZepV4BatchItemError | null;
	/** The graph the item's episode is or will be ingested into. */
	graph_uuid?: string | null;
	/** The item's position within the batch, in the order it was appended. */
	sequence_index?: number | null;
	/** The unique identifier of the item's stored source row. */
	source_uuid?: string | null;
	/** The processing status of the item: pending, queued, processing, succeeded, failed, skipped, or canceled. */
	status?: ZepModelsBatchItemStatus | null;
	/** The thread the item's message is or will be added to. Present only for thread_message items. */
	thread_uuid?: string | null;
	/** The kind of item: graph_episode or thread_message. */
	type?: ZepModelsBatchItemKind | null;
	/** The unique identifier of the user that owns the graph. Present only when the graph is a user graph. */
	user_uuid?: string | null;
	/** The unique identifier of the batch item. */
	uuid?: string | null;
};

export type ZepV4BatchItemError = {
	/** The reason the item failed. */
	code?: ZepV4BatchItemErrorCode | null;
	/** The explanation of the failure and the action to take. */
	message?: string | null;
};

export type ZepV4BatchItemErrorCode = string;

export type ZepV4BatchItemPage = {
	/** The batch items on this page. */
	items?: Array<ZepV4BatchItem> | null;
	/** Opaque cursor for retrieving the next page, present only when more results are available. */
	next_cursor?: string | null;
	/** The total number of items in the batch that match the request. */
	total_size?: number | null;
};

export type ZepV4BatchItemsResponse = {
	/** The batch items that were added, in the order they were appended. */
	items?: Array<ZepV4BatchItem> | null;
	/** The request items that were rejected because their graph was not found. */
	rejected_items?: Array<ZepV4RejectedBatchItem> | null;
};

export type ZepV4BatchPage = {
	/** The batches on this page. */
	items?: Array<ZepV4Batch> | null;
	/** Opaque cursor for retrieving the next page, present only when more results are available. */
	next_cursor?: string | null;
	/** The total number of batches that match the request. */
	total_size?: number | null;
};

export type ZepV4BatchProgress = {
	/** The number of items that failed. */
	failed_items?: number | null;
	/** The number of items that are in processing now. */
	processing_items?: number | null;
	/** The processing stage that the batch is in. */
	stage?: string | null;
	/** The number of items that were processed successfully. */
	succeeded_items?: number | null;
	/** The number of items in the batch. */
	total_items?: number | null;
};

export type ZepV4CloneGraphResult = {
	/** The newly created graph the source graph is being cloned into. */
	graph?: ZepV4Graph | null;
	/** The asynchronous task that tracks the clone operation. */
	task?: ZepV4Task | null;
};

export type ZepV4ContentPolicy = {
	/** The categories of the policy. */
	categories?: Array<ZepV4ContentPolicyCategory> | null;
	/** When this policy set was created. */
	created_at?: string | null;
	/** The project revision number. 0 is the empty policy of a new project. */
	revision?: number | null;
	/** The rules of the policy. */
	rules?: Array<ZepV4ContentPolicyRule> | null;
	/** The identifier of this policy set. A project revision and every graph that binds it without additions share one uuid. */
	uuid?: string | null;
};

export type ZepV4ContentPolicyCategory = {
	/** What the category covers. */
	description?: string | null;
	/** The server-assigned identifier of the category. Stable across revisions while the key is unchanged. */
	id?: string | null;
	/** The stable key of the category. */
	key?: string | null;
};

export type ZepV4ContentPolicyEvent = {
	/** The kind of artifact the decision applied to. episode marks the episode-level record that carries every matched category. */
	artifact_kind?: ZepV4ContentPolicyEventArtifactKind | null;
	/** The keys of the categories with a matched rule. */
	category_keys?: Array<string> | null;
	/** The time of the decision. */
	decided_at?: string | null;
	/** Why the artifact was dropped: match, indeterminate, oversize, dependent, or not_included. */
	drop_reason?: ZepV4ContentPolicyEventDropReason | null;
	/** The episode the decision belongs to. */
	episode_uuid?: string | null;
	/** The opaque identifier of the event. */
	id?: string | null;
	/** The match mechanisms. The list is empty for a not_included event. */
	matched_by?: Array<ZepV4ContentPolicyMatchedBy> | null;
	/** The project revision number of the policy the graph bound. */
	revision?: number | null;
	/** The identifiers of the rules that matched. */
	rule_ids?: Array<string> | null;
};

export type ZepV4ContentPolicyEventPage = {
	/** The events on this page, newest first. */
	items?: Array<ZepV4ContentPolicyEvent> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** The total number of events that match the filters. */
	total_size?: number | null;
};

export type ZepV4ContentPolicyMatchedBy = string;

export type ZepV4ContentPolicyRevisionPage = {
	/** The revisions on this page, newest first. */
	items?: Array<ZepV4ContentPolicy> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** The total number of revisions, including revision 0. */
	total_size?: number | null;
};

export type ZepV4ContentPolicyRule = {
	/** The rule action. The supported values are exclude and include. */
	action?: ZepV4ContentPolicyRuleAction | null;
	/** The key of the category this rule belongs to. */
	category_key?: string | null;
	/** The condition that this rule evaluates. */
	condition?: string | null;
	/** Deprecated: use condition. This alias remains available for one release. */
	description?: string | null;
	/** Edge types that this rule covers. */
	edge_types?: Array<string> | null;
	/** Entity types that this rule covers. */
	entity_types?: Array<string> | null;
	/** The server-assigned identifier of the rule. Stable across revisions while the effective rule definition is unchanged. */
	id?: string | null;
	/** Regular expression patterns that this rule matches. */
	patterns?: Array<string> | null;
	/** Examples of similar content the rule permits. */
	permitted_examples?: Array<string> | null;
	/** Examples of content the rule prohibits. */
	prohibited_examples?: Array<string> | null;
};

export type ZepV4ContextEdge = {
	/** Additional attributes of the edge. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The time the edge was created. */
	created_at?: string | null;
	/** The episodes this edge was derived from. */
	episode_uuids?: Array<string> | null;
	/** The time the fact was superseded or removed. */
	expired_at?: string | null;
	/** The natural-language fact this edge represents. */
	fact?: string | null;
	/** The unique identifier of the graph this edge belongs to. */
	graph_uuid?: string | null;
	/** The unique identifier of the hyperedge this edge is a member of. Omitted when the edge is not part of a hyperedge. */
	hyperedge_uuid?: string | null;
	/** The time at which the fact stopped being true. */
	invalid_at?: string | null;
	/** The name of the edge, in upper snake case, for example RELATES_TO. */
	name?: string | null;
	/** A cross-encoder-derived relevance score, present only when the cross-encoder reranker scored this result; like score, it is omitted from plain list results. */
	relevance?: number | null;
	/** The kind of edge this is, for example entity or episodic. */
	scope?: string | null;
	/** The ranking score returned with every search result; omitted when the edge appears in a plain list rather than a search result. */
	score?: number | null;
	/** The 1-based position this edge was selected in across all context-assembly scopes. */
	selection_rank?: number | null;
	/** The current labels of the source node. This is read at request time rather than stored on the edge, and is omitted when the source node cannot be resolved. */
	source_node_labels?: Array<string> | null;
	/** The current name of the source node. This is read at request time rather than stored on the edge, and is omitted when the source node cannot be resolved. */
	source_node_name?: string | null;
	/** The unique identifier of the edge's source node. */
	source_node_uuid?: string | null;
	/** The current labels of the target node. This is read at request time rather than stored on the edge, and is omitted when the target node cannot be resolved. */
	target_node_labels?: Array<string> | null;
	/** The current name of the target node. This is read at request time rather than stored on the edge, and is omitted when the target node cannot be resolved. */
	target_node_name?: string | null;
	/** The unique identifier of the edge's target node. */
	target_node_uuid?: string | null;
	/** The unique identifier of the user that owns the graph. Present only when the graph is a user graph. */
	user_uuid?: string | null;
	/** The unique identifier of the edge. */
	uuid?: string | null;
	/** The time from which the fact is considered true. */
	valid_at?: string | null;
};

export type ZepV4ContextEpisode = {
	/** The raw content of the episode. */
	content?: string | null;
	/** Experimental. The content policy state of the episode, present only on a graph with a bound content policy rule. */
	content_policy?: ZepV4EpisodeContentPolicy | null;
	/** The time Zep received the episode. */
	created_at?: string | null;
	/** The developer-assigned identifier of the document this episode belongs to, present only for episodes added to a document. */
	document_id?: string | null;
	/** The time when Zep stopped the processing of the episode because the episode waited for more than 7 days. An expired episode is not in the graph. Add the episode again to process it. The field is omitted for an episode that did not expire. */
	expired_at?: string | null;
	/** The unique identifier of the graph this episode belongs to. */
	graph_uuid?: string | null;
	/** Custom metadata associated with the episode. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** Whether the episode has finished graph extraction and indexing. */
	processed?: boolean | null;
	/** The episode's reference time, used for temporal reasoning: the time that the developer supplied on add, or the ingestion time when the developer supplied no time. */
	reference_time?: string | null;
	/** A cross-encoder-derived relevance score, present only when the cross-encoder reranker scored this result; like score, it is omitted from plain list results. */
	relevance?: number | null;
	/** The role of the episode's sender, present only when the episode was added as a message. */
	role?: ZepV4RoleType | null;
	/** The free-form display name of the episode's sender, present only when the episode was added as a message. */
	role_name?: string | null;
	/** The ranking score returned with every search result; omitted when the episode appears in a plain list rather than a search result. */
	score?: number | null;
	/** The 1-based position this episode was selected in across all context-assembly scopes. */
	selection_rank?: number | null;
	/** The format of the episode's content: text, json, or message. */
	source?: ZepModelsGraphDataType | null;
	/** A free-form description of where the episode's content came from. */
	source_description?: string | null;
	/** The thread this episode belongs to, present only for episodes added to a thread. */
	thread_uuid?: string | null;
	/** The unique identifier of the user that owns the graph. Present only when the graph is a user graph. */
	user_uuid?: string | null;
	/** The unique identifier of the episode. */
	uuid?: string | null;
	/** Why an episode that is not processed waits. The field is present when the episode has waited for more than 24 hours, and when the episode expired. It is omitted for a processed episode. */
	wait_status?: ZepV4EpisodeWaitStatus | null;
};

export type ZepV4ContextNode = {
	/** Additional attributes of the node, as defined by its entity type. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The time the node was created. */
	created_at?: string | null;
	/** The count of live entity edges that touch this node, in both directions. Present only when the list request orders by `degree`. */
	degree?: number | null;
	/** The UUIDs of the live episodes that mention this node, newest first. The list is complete when `episode_uuids_truncated` is false. The list holds the newest 100 when the node has more than 100 source episodes; list episodes with the `mentioned_node_uuids` filter to read them all. */
	episode_uuids?: Array<string> | null;
	/** True when the node has more than 100 source episodes, so `episode_uuids` holds only the newest 100, or when provenance is unavailable. False means `episode_uuids` is the complete set. */
	episode_uuids_truncated?: boolean | null;
	/** The unique identifier of the graph this node belongs to. */
	graph_uuid?: string | null;
	/** The entity type labels assigned to the node. */
	labels?: Array<string> | null;
	/** The name of the entity that the node represents. */
	name?: string | null;
	/** A cross-encoder-derived relevance score, present only when the cross-encoder reranker scored this result; like score, it is omitted from plain list results. */
	relevance?: number | null;
	/** The ranking score returned with every search result; omitted when the node appears in a plain list rather than a search result. */
	score?: number | null;
	/** The 1-based position this node was selected in across all context-assembly scopes. */
	selection_rank?: number | null;
	/** A generated summary of the entity that the node represents. */
	summary?: string | null;
	/** The unique identifier of the user that owns the graph. Present only when the graph is a user graph. */
	user_uuid?: string | null;
	/** The node UUID, assigned by Zep. */
	uuid?: string | null;
};

export type ZepV4ContextObservation = {
	/** Additional attributes of the derived node, as defined by its entity type. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The time the observation was created. */
	created_at?: string | null;
	/** The unique identifiers of the episodes that support this observation. */
	episode_uuids?: Array<string> | null;
	/** The unique identifier of the graph this observation belongs to. */
	graph_uuid?: string | null;
	/** The labels identifying the type of this observation. */
	labels?: Array<string> | null;
	/** The name of the observation. */
	name?: string | null;
	/** A cross-encoder-derived relevance score, present only when the cross-encoder reranker scored this result; like score, it is omitted from plain list results. */
	relevance?: number | null;
	/** The ranking score returned with every search result; omitted when the observation appears in a plain list rather than a search result. */
	score?: number | null;
	/** The 1-based position this observation was selected in across all context-assembly scopes. */
	selection_rank?: number | null;
	/** A generated summary of the observation. */
	summary?: string | null;
	/** The unique identifier of the user that owns the graph. Present only when the graph is a user graph. */
	user_uuid?: string | null;
	/** The unique identifier of the observation, assigned by Zep. */
	uuid?: string | null;
};

export type ZepV4ContextResults = {
	/** The edges selected for inclusion in the assembled context. */
	edges?: Array<ZepV4ContextEdge> | null;
	/** The episodes selected for inclusion in the assembled context. */
	episodes?: Array<ZepV4ContextEpisode> | null;
	/** The nodes selected for inclusion in the assembled context. */
	nodes?: Array<ZepV4ContextNode> | null;
	/** The observations selected for inclusion in the assembled context. */
	observations?: Array<ZepV4ContextObservation> | null;
	/** The thread summaries selected for inclusion in the assembled context. */
	thread_summaries?: Array<ZepV4ContextThreadSummary> | null;
};

export type ZepV4ContextTemplate = {
	/** The time the template was created. */
	created_at?: string | null;
	/** The name of the context template. */
	name?: string | null;
	/** The template content. */
	template?: string | null;
	/** The unique identifier of the context template. */
	uuid?: string | null;
};

export type ZepV4ContextTemplatePage = {
	/** The context templates on this page. */
	items?: Array<ZepV4ContextTemplate> | null;
	/** Opaque cursor for retrieving the next page, present only when more results are available. */
	next_cursor?: string | null;
	/** The total number of context templates that match the request. */
	total_size?: number | null;
};

export type ZepV4ContextThreadSummary = {
	/** The time the summary was first created. */
	created_at?: string | null;
	/** The unique identifier of the graph this thread summary belongs to. */
	graph_uuid?: string | null;
	/** The wall-clock time of the most recent summary update. */
	last_summarized_at?: string | null;
	/** The latest episode reference time covered by the most recent summary update. */
	last_summarized_episode_valid_at?: string | null;
	/** A cross-encoder-derived relevance score, present only when the cross-encoder reranker scored this result; like score, it is omitted from plain list results. */
	relevance?: number | null;
	/** A score accompanies every search result; it is omitted when the summary appears in a plain list rather than a search result. */
	score?: number | null;
	/** The 1-based position this thread summary was selected in across all context-assembly scopes. */
	selection_rank?: number | null;
	/** The generated summary text for the thread. */
	summary?: string | null;
	/** The unique identifier of the thread this summary belongs to. */
	thread_uuid?: string | null;
	/** The unique identifier of the thread summary. */
	uuid?: string | null;
};

export type ZepV4CreateAgentRequest = {
	/** The developer-assigned Agent identifier, unique within the project. */
	agent_id?: string | null;
	/** The customer deployment this Agent represents. */
	deployment_id?: string | null;
	/** A human-readable description of the Agent. */
	description?: string | null;
	/** Agent Skills capture, compilation, and promotion settings. */
	memory_settings?: ZepV4AgentMemorySettings | null;
	/** Developer metadata used to organize and filter Agents. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** The Agent's display name. */
	name?: string | null;
	/** The immutable boundary within which Skills may be synthesized. 1 to 200 characters of lowercase letters, digits, and the characters : . - _ */
	security_domain?: string | null;
	/** The customer deployment version this Agent represents. If you omit it, the version is "default". */
	version?: string | null;
};

export type ZepV4DebugLogEntry = {
	/** The severity of the entry. */
	level?: ZepV4DebugLogLevel | null;
	/** The time the entry was written. */
	logged_at?: string | null;
	/** The log message. */
	message?: string | null;
};

export type ZepV4DebugLogLevel = string;

export type ZepV4DebugLogStatus = string;

export type ZepV4DebugLoggingEnablement = {
	/** The number of seconds that debug logging stays enabled. */
	duration_seconds?: number | null;
	/** Tells if ingestion tracing was also enabled. Ingestion tracing is available on the Flex, Flex Plus, and Enterprise plans. */
	ingestion_trace_enabled?: boolean | null;
};

export type ZepV4DocumentSummary = {
	/** The time the summary was created. */
	created_at?: string | null;
	/** The developer-assigned identifier of the document this summary covers. */
	document_id?: string | null;
	/** The time the summary was most recently generated. */
	last_summarized_at?: string | null;
	/** The latest episode reference time covered by the summary. */
	last_summarized_episode_valid_at?: string | null;
	/** A generated summary of the document's episodes. */
	summary?: string | null;
	/** The unique identifier of the document summary. */
	uuid?: string | null;
};

export type ZepV4DocumentSummaryPage = {
	/** The document summaries on this page. */
	items?: Array<ZepV4DocumentSummary> | null;
	/** Opaque cursor for retrieving the next page, present only when more results are available. */
	next_cursor?: string | null;
	/** Omitted for this collection; use next_cursor to detect the end of pagination. */
	total_size?: number | null;
};

export type ZepV4Edge = {
	/** Additional attributes of the edge. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The time the edge was created. */
	created_at?: string | null;
	/** The episodes this edge was derived from. */
	episode_uuids?: Array<string> | null;
	/** The time the fact was superseded or removed. */
	expired_at?: string | null;
	/** The natural-language fact this edge represents. */
	fact?: string | null;
	/** The unique identifier of the graph this edge belongs to. */
	graph_uuid?: string | null;
	/** The unique identifier of the hyperedge this edge is a member of. Omitted when the edge is not part of a hyperedge. */
	hyperedge_uuid?: string | null;
	/** The time at which the fact stopped being true. */
	invalid_at?: string | null;
	/** The name of the edge, in upper snake case, for example RELATES_TO. */
	name?: string | null;
	/** A cross-encoder-derived relevance score, present only when the cross-encoder reranker scored this result; like score, it is omitted from plain list results. */
	relevance?: number | null;
	/** The kind of edge this is, for example entity or episodic. */
	scope?: string | null;
	/** The ranking score returned with every search result; omitted when the edge appears in a plain list rather than a search result. */
	score?: number | null;
	/** The current labels of the source node. This is read at request time rather than stored on the edge, and is omitted when the source node cannot be resolved. */
	source_node_labels?: Array<string> | null;
	/** The current name of the source node. This is read at request time rather than stored on the edge, and is omitted when the source node cannot be resolved. */
	source_node_name?: string | null;
	/** The unique identifier of the edge's source node. */
	source_node_uuid?: string | null;
	/** The current labels of the target node. This is read at request time rather than stored on the edge, and is omitted when the target node cannot be resolved. */
	target_node_labels?: Array<string> | null;
	/** The current name of the target node. This is read at request time rather than stored on the edge, and is omitted when the target node cannot be resolved. */
	target_node_name?: string | null;
	/** The unique identifier of the edge's target node. */
	target_node_uuid?: string | null;
	/** The unique identifier of the user that owns the graph. Present only when the graph is a user graph. */
	user_uuid?: string | null;
	/** The unique identifier of the edge. */
	uuid?: string | null;
	/** The time from which the fact is considered true. */
	valid_at?: string | null;
};

export type ZepV4EdgeNodeRef = {
	/** Additional attributes of the node, as defined by its entity type. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The entity type labels to assign to the node. */
	labels?: Array<string> | null;
	/** The name of the node to create, or to match when deduplication is enabled. */
	name?: string | null;
	/** A summary of the node. */
	summary?: string | null;
	/** The unique identifier of an existing node to attach the edge to. */
	uuid?: string | null;
};

export type ZepV4EdgePage = {
	/** The edges on this page. */
	items?: Array<ZepV4Edge> | null;
	/** Opaque cursor for retrieving the next page, present only when more results are available. */
	next_cursor?: string | null;
	/** Omitted for this collection; use next_cursor to detect the end of pagination. */
	total_size?: number | null;
};

export type ZepV4EdgeSourceTarget = {
	/** The entity type an edge of this type originates from. */
	source?: string | null;
	/** The entity type an edge of this type points to. */
	target?: string | null;
};

export type ZepV4EdgeType = {
	/** A description of the relationship this edge type represents, used to guide extraction. */
	description?: string | null;
	/** The name of the edge type, in upper snake case. */
	name?: string | null;
	/** The custom properties defined on edges of this type. */
	properties?: Array<ZepV4EntityProperty> | null;
	/** The allowed source and target entity type pairs for edges of this type. */
	source_targets?: Array<ZepV4EdgeSourceTarget> | null;
};

export type ZepV4EntityProperty = {
	/** A description of the property, used to guide extraction. */
	description?: string | null;
	/** The name of the property. */
	name?: string | null;
	/** Whether ingestion keeps the stored value of this property when it merges new information into an existing node. Supported on entity type properties only. */
	protected?: boolean | null;
	/** The value type of the property: text, int, float, or boolean. */
	type?: ZepV4EntityPropertyType | null;
};

export type ZepV4EntityPropertyType = string;

export type ZepV4EntityType = {
	/** A description of the entity type, used to guide extraction. */
	description?: string | null;
	/** The property names that determine whether two nodes of this type are the same entity. */
	identity_properties?: Array<string> | null;
	/** The name of the entity type. */
	name?: string | null;
	/** The custom properties defined on nodes of this type. */
	properties?: Array<ZepV4EntityProperty> | null;
};

export type ZepV4Episode = {
	/** The raw content of the episode. */
	content?: string | null;
	/** Experimental. The content policy state of the episode, present only on a graph with a bound content policy rule. */
	content_policy?: ZepV4EpisodeContentPolicy | null;
	/** The time Zep received the episode. */
	created_at?: string | null;
	/** The developer-assigned identifier of the document this episode belongs to, present only for episodes added to a document. */
	document_id?: string | null;
	/** The time when Zep stopped the processing of the episode because the episode waited for more than 7 days. An expired episode is not in the graph. Add the episode again to process it. The field is omitted for an episode that did not expire. */
	expired_at?: string | null;
	/** The unique identifier of the graph this episode belongs to. */
	graph_uuid?: string | null;
	/** Custom metadata associated with the episode. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** Whether the episode has finished graph extraction and indexing. */
	processed?: boolean | null;
	/** The episode's reference time, used for temporal reasoning: the time that the developer supplied on add, or the ingestion time when the developer supplied no time. */
	reference_time?: string | null;
	/** A cross-encoder-derived relevance score, present only when the cross-encoder reranker scored this result; like score, it is omitted from plain list results. */
	relevance?: number | null;
	/** The role of the episode's sender, present only when the episode was added as a message. */
	role?: ZepV4RoleType | null;
	/** The free-form display name of the episode's sender, present only when the episode was added as a message. */
	role_name?: string | null;
	/** The ranking score returned with every search result; omitted when the episode appears in a plain list rather than a search result. */
	score?: number | null;
	/** The format of the episode's content: text, json, or message. */
	source?: ZepModelsGraphDataType | null;
	/** A free-form description of where the episode's content came from. */
	source_description?: string | null;
	/** The thread this episode belongs to, present only for episodes added to a thread. */
	thread_uuid?: string | null;
	/** The unique identifier of the user that owns the graph. Present only when the graph is a user graph. */
	user_uuid?: string | null;
	/** The unique identifier of the episode. */
	uuid?: string | null;
	/** Why an episode that is not processed waits. The field is present when the episode has waited for more than 24 hours, and when the episode expired. It is omitted for a processed episode. */
	wait_status?: ZepV4EpisodeWaitStatus | null;
};

export type ZepV4EpisodeContentPolicy = {
	/** The keys of the categories with a matched rule. */
	category_keys?: Array<string> | null;
	/** The number of derived candidates that were dropped. */
	dropped_count?: number | null;
	/** The number of derived candidates that were published to the graph. */
	retained_count?: number | null;
	/** The project revision number of the policy the graph bound. */
	revision?: number | null;
	/** The evaluation status. pending means the evaluation has not finished, complete means every candidate was evaluated and the graph batch was written, and failed means ingestion retries were exhausted. not_evaluated means Zep processed the episode without an evaluation, for example because the… */
	status?: ZepV4EpisodeContentPolicyStatus | null;
	/** Whether at least one derived candidate matched a rule. Once true, it stays true. */
	violated?: boolean | null;
};

export type ZepV4EpisodeDebugLog = {
	/** The time the ingestion workflow completed, present only after completion. */
	completed_at?: string | null;
	/** The log entries, oldest first. */
	entries?: Array<ZepV4DebugLogEntry> | null;
	/** The error message, present only when the status is error. */
	error?: string | null;
	/** The time the ingestion workflow started. */
	started_at?: string | null;
	/** The state of the ingestion workflow. */
	status?: ZepV4DebugLogStatus | null;
};

export type ZepV4EpisodePage = {
	/** The episodes on this page. */
	items?: Array<ZepV4Episode> | null;
	/** Opaque cursor for retrieving the next page, present only when more results are available. */
	next_cursor?: string | null;
	/** Omitted for this collection; use next_cursor to detect the end of pagination. */
	total_size?: number | null;
};

export type ZepV4EpisodeWaitStatus = string;

export type ZepV4ErrorBody = {
	code?: string | null;
	details?: Record<string, ZepJsonValue> | null;
	message?: string | null;
	param?: string | null;
	request_id?: string | null;
};

export type ZepV4Graph = {
	/** The time the graph was created. */
	created_at?: string | null;
	/** A description of the graph. */
	description?: string | null;
	/** The developer-assigned identifier of the graph, present only for standard graphs. */
	graph_id?: string | null;
	/** The display name of the graph. */
	name?: string | null;
	/** The graph's IANA time zone. */
	time_zone?: string | null;
	/** The kind of graph: user for a user's personal graph, or standard for a named graph created directly. */
	type?: string | null;
	/** The time the graph was last updated. */
	updated_at?: string | null;
	/** The unique identifier of the user this graph belongs to, present only for a user graph. */
	user_uuid?: string | null;
	/** The unique identifier of the graph. */
	uuid?: string | null;
};

export type ZepV4GraphContentPolicy = {
	/** When the graph bound the policy. */
	bound_at?: string | null;
	/** The categories of the policy. */
	categories?: Array<ZepV4ContentPolicyCategory> | null;
	/** When this policy set was created. */
	created_at?: string | null;
	/** The project revision number this graph bound at creation. It always equals revision. */
	project_revision?: number | null;
	/** The project revision number. 0 is the empty policy of a new project. */
	revision?: number | null;
	/** The rules of the policy. */
	rules?: Array<ZepV4ContentPolicyRule> | null;
	/** The identifier of this policy set. A project revision and every graph that binds it without additions share one uuid. */
	uuid?: string | null;
};

export type ZepV4GraphContextResponse = {
	/** The assembled context block of facts, entities, observations, and thread summaries. Pass it through the model provider's untrusted-data channel. */
	context?: string | null;
	/** The individual edges, nodes, episodes, observations, and thread summaries selected to build the context. Episodes are always empty because context assembly does not select episodes. Present only when requested. */
	results?: ZepV4ContextResults | null;
	/** Whether the character budget limited the size of the context block. */
	truncated?: boolean | null;
};

export type ZepV4GraphDeleteResult = {
	/** The asynchronous task that tracks the graph's deletion. */
	task?: ZepV4Task | null;
};

export type ZepV4GraphMetadataKey = {
	/** The time when the key was first recorded. */
	created_at?: string | null;
	/** The metadata key name. */
	key?: string | null;
};

export type ZepV4GraphMetadataKeyList = {
	/** The append-only keys recorded for the graph. A key can remain after no episode or message uses it. */
	items?: Array<ZepV4GraphMetadataKey> | null;
	/** The cursor for the next page, when more keys exist. */
	next_cursor?: string | null;
};

export type ZepV4GraphPage = {
	/** The graphs on this page. */
	items?: Array<ZepV4Graph> | null;
	/** Opaque cursor for retrieving the next page, present only when more results are available. */
	next_cursor?: string | null;
	/** The total number of graphs that match the request. */
	total_size?: number | null;
};

export type ZepV4Hyperedge = {
	/** The time the hyperedge was created. Every member edge shares this value. */
	created_at?: string | null;
	/** The member edges, ordered by uuid. Each carries only its own identity and endpoints; the shared fact and timestamps are on the hyperedge. */
	edges?: Array<ZepV4HyperedgeEdge> | null;
	/** The time the fact was superseded or removed. */
	expired_at?: string | null;
	/** The natural-language fact this hyperedge represents. Every member edge carries the same fact. */
	fact?: string | null;
	/** The unique identifier of the graph this hyperedge belongs to. */
	graph_uuid?: string | null;
	/** The time at which the fact stopped being true. */
	invalid_at?: string | null;
	/** The unique identifier of the user that owns the graph. Present only when the graph is a user graph. */
	user_uuid?: string | null;
	/** The unique identifier of the hyperedge. */
	uuid?: string | null;
	/** The time from which the fact is considered true. */
	valid_at?: string | null;
};

export type ZepV4HyperedgeEdge = {
	/** The name of the member edge, in upper snake case, for example FOUNDED. */
	name?: string | null;
	/** The unique identifier of the member edge's source node. */
	source_node_uuid?: string | null;
	/** The unique identifier of the member edge's target node. */
	target_node_uuid?: string | null;
	/** The unique identifier of the member edge. */
	uuid?: string | null;
};

export type ZepV4HyperedgePage = {
	items?: Array<ZepV4Hyperedge> | null;
	next_cursor?: string | null;
};

export type ZepV4ImportedTraceReference = {
	/** AgentUUID is the visible Agent identifier. */
	agent_uuid?: string | null;
	/** The service returns the UUID of the active import. */
	import_uuid?: string | null;
	/** TraceUUID is the imported Trace identifier. */
	trace_uuid?: string | null;
};

export type ZepV4InclusionRule = {
	/** Condition is a natural-language test; an empty value matches every applicable candidate. */
	condition?: string | null;
	/** Effect includes or excludes matching candidates. */
	effect?: ZepV4InclusionRuleEffect | null;
	/** Name uniquely identifies the rule within its scope. */
	name?: string | null;
	/** Target selects entity candidates or fact candidates. */
	target?: ZepV4InclusionRuleTarget | null;
	/** Types limits the rule to these ontology types and their subtypes. */
	types?: Array<string> | null;
};

export type ZepV4InclusionRules = {
	/** InclusionRules replaces the complete rule set at this scope. */
	inclusion_rules?: Array<ZepV4InclusionRule> | null;
	/** Inherited identifies a graph that uses project defaults. */
	inherited?: boolean | null;
};

export type ZepV4IngestionTrace = {
	/** The time the trace was recorded. */
	created_at?: string | null;
	/** The error message, present only when the status is failed. */
	error?: string | null;
	/** The input of the step. */
	input?: ZepV4IngestionTraceInput | null;
	/** The output of the step, with an explanation on each entry that has one. */
	output?: ZepV4IngestionTraceOutput | null;
	/** Tells if the explanations of the step were recorded. */
	status?: ZepV4IngestionTraceStatus | null;
	/** The ingestion step that the trace records. */
	step?: ZepV4IngestionTraceStep | null;
	/** The unique identifier of the trace. */
	uuid?: string | null;
};

export type ZepV4IngestionTraceCandidateOutcome = {
	/** The UUID of the candidate node or edge. */
	candidate_uuid?: string | null;
	/** The UUID of the extracted node or edge. */
	extracted_uuid?: string | null;
	/** The outcome of the comparison. */
	outcome?: ZepV4IngestionTraceCandidateOutcomeValue | null;
};

export type ZepV4IngestionTraceCandidateOutcomeValue = string;

export type ZepV4IngestionTraceEdge = {
	/** Additional attributes of the edge, as defined by its edge type. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The time the edge was created. */
	created_at?: string | null;
	/** The episodes that the edge was derived from. */
	episode_uuids?: Array<string> | null;
	/** The time the edge was superseded. */
	expired_at?: string | null;
	/** The explanation of the decision of the step for this edge. Present only on output entries that have an explanation. */
	explanation?: string | null;
	/** The natural-language fact that the edge represents. */
	fact?: string | null;
	/** The time at which the fact stopped being true. */
	invalid_at?: string | null;
	/** The name of the edge, in upper snake case. */
	name?: string | null;
	/** The unique identifier of the source node of the edge. */
	source_node_uuid?: string | null;
	/** The unique identifier of the target node of the edge. */
	target_node_uuid?: string | null;
	/** The unique identifier of the edge. */
	uuid?: string | null;
	/** The time from which the fact is true. */
	valid_at?: string | null;
};

export type ZepV4IngestionTraceEdgeInvalidation = {
	/** The unique identifier of the invalidated edge. */
	invalidated_edge_uuid?: string | null;
	/** The resolved edges that invalidated the edge. */
	invalidating_edges?: Array<ZepV4IngestionTraceEdgeReference> | null;
};

export type ZepV4IngestionTraceEdgeReference = {
	/** The explanation of the decision, when the step recorded one. */
	explanation?: string | null;
	/** The unique identifier of the edge. */
	uuid?: string | null;
};

export type ZepV4IngestionTraceEntityType = {
	/** A description of the entity type, used to guide extraction. */
	description?: string | null;
	/** The property names that determine whether two nodes of this type are the same entity. */
	identity_properties?: Array<string> | null;
	/** The name of the entity type. */
	name?: string | null;
	/** The name of the parent entity type. Absent for a top-level type. */
	parent?: string | null;
	/** The custom properties defined on nodes of this type. */
	properties?: Array<ZepV4EntityProperty> | null;
};

export type ZepV4IngestionTraceEpisode = {
	/** The content of the episode. */
	content?: string | null;
	/** The source type of the episode, for example message, text, or json. */
	source?: string | null;
	/** The unique identifier of the episode. */
	uuid?: string | null;
	/** The time at which the episode occurred. */
	valid_at?: string | null;
};

export type ZepV4IngestionTraceInput = {
	/** The existing edges that the step compared with the extracted edges. Present for resolve_edges and empty for the other steps. */
	candidate_edges?: Array<ZepV4IngestionTraceEdge> | null;
	/** The existing nodes that the step compared with the extracted nodes. Present for resolve_nodes and empty for the other steps. */
	candidate_nodes?: Array<ZepV4IngestionTraceNode> | null;
	/** The custom extraction instructions in effect for the episode. */
	custom_instructions?: Array<string> | null;
	/** The custom edge types in effect for the episode. */
	edge_types?: Array<ZepV4EdgeType> | null;
	/** The custom entity types in effect for the episode. */
	entity_types?: Array<ZepV4IngestionTraceEntityType> | null;
	/** The content of the episode that the step processed. */
	episode_content?: string | null;
	/** The episodes that the step processed together. */
	episodes?: Array<ZepV4IngestionTraceEpisode> | null;
	/** The extracted edges that the step resolved. Present for resolve_edges and empty for the other steps. */
	extracted_edges?: Array<ZepV4IngestionTraceEdge> | null;
	/** The extracted nodes that the step resolved. Present for resolve_nodes and empty for the other steps. */
	extracted_nodes?: Array<ZepV4IngestionTraceNode> | null;
	/** Tells if the default ontology was ignored. */
	ignore_default_ontology?: boolean | null;
	/** The previous episodes that the step used as context. */
	previous_episodes?: Array<ZepV4IngestionTraceEpisode> | null;
	/** The identity attributes where the extracted value differed from the stored value. The nodes keep the stored values. Present for resolve_nodes and empty for the other steps. */
	protected_attribute_conflicts?: Array<ZepV4IngestionTraceProtectedAttributeConflict> | null;
	/** The resolved nodes that the extracted edges connect. Present for resolve_edges and empty for the other steps. */
	resolved_nodes?: Array<ZepV4IngestionTraceNode> | null;
};

export type ZepV4IngestionTraceNode = {
	/** Additional attributes of the node, as defined by its entity type. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The time the node was created. */
	created_at?: string | null;
	/** The positions in the input episodes of the episodes that the node was extracted from. Present on the extracted nodes of combined_extraction. */
	episode_indexes?: Array<number> | null;
	/** The explanation of the decision of the step for this node. Present only on output entries that have an explanation. */
	explanation?: string | null;
	/** The entity type labels of the node. */
	labels?: Array<string> | null;
	/** The name of the entity that the node represents. */
	name?: string | null;
	/** The summary of the entity that the node represents. */
	summary?: string | null;
	/** The unique identifier of the node. */
	uuid?: string | null;
};

export type ZepV4IngestionTraceNodeDuplicate = {
	/** The existing node that the extracted node duplicates. */
	existing_node?: ZepV4IngestionTraceNode | null;
	/** The extracted node. */
	extracted_node?: ZepV4IngestionTraceNode | null;
};

export type ZepV4IngestionTraceNodeResolution = {
	/** The explanation of the decision, when the step recorded one. */
	explanation?: string | null;
	/** The unique identifier of the extracted node. */
	extracted_node_uuid?: string | null;
	/** The unique identifier of the resolved node. */
	resolved_node_uuid?: string | null;
};

export type ZepV4IngestionTraceOutput = {
	/** The outcomes that the step recorded for each extracted and candidate pair. Present for resolve_nodes and resolve_edges and empty for the other steps. */
	candidate_outcomes?: Array<ZepV4IngestionTraceCandidateOutcome> | null;
	/** The existing edges that the resolved edges invalidated. Present for resolve_edges and empty for the other steps. */
	edge_invalidations?: Array<ZepV4IngestionTraceEdgeInvalidation> | null;
	/** The resolved edges. Present for resolve_edges and empty for the other steps. */
	edges?: Array<ZepV4IngestionTraceEdge> | null;
	/** The edges that the step extracted. Present for combined_extraction and empty for the other steps. */
	extracted_edges?: Array<ZepV4IngestionTraceEdge> | null;
	/** The nodes that the step extracted. Present for combined_extraction and empty for the other steps. */
	extracted_nodes?: Array<ZepV4IngestionTraceNode> | null;
	/** The resolved edges that are new to the graph. Present for resolve_edges and empty for the other steps. */
	new_edges?: Array<ZepV4IngestionTraceEdge> | null;
	/** The extracted nodes that the step found to be duplicates of existing nodes. Present for resolve_nodes and empty for the other steps. */
	node_duplicates?: Array<ZepV4IngestionTraceNodeDuplicate> | null;
	/** The resolved node of each extracted node. Present for resolve_nodes and empty for the other steps. */
	node_resolutions?: Array<ZepV4IngestionTraceNodeResolution> | null;
	/** The resolved nodes. Present for resolve_nodes and empty for the other steps. */
	nodes?: Array<ZepV4IngestionTraceNode> | null;
};

export type ZepV4IngestionTracePage = {
	/** The ingestion traces on this page. */
	items?: Array<ZepV4IngestionTrace> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
};

export type ZepV4IngestionTraceProtectedAttributeConflict = {
	/** The name of the identity attribute. */
	attribute?: string | null;
	/** The value that the step extracted from the episode. */
	extracted_value?: ZepJsonValue | null;
	/** The unique identifier of the node. */
	node_uuid?: string | null;
	/** The stored value, which the node keeps. */
	stored_value?: ZepJsonValue | null;
};

export type ZepV4IngestionTraceStatus = string;

export type ZepV4IngestionTraceStep = string;

export type ZepV4Instructions = {
	/** Whether this is the project's default value rather than an override set on this graph. */
	inherited?: boolean | null;
	/** The custom extraction instructions in effect at this scope, each with a name and text. */
	instructions?: Array<ZepModelsCustomInstruction> | null;
};

export type ZepV4KnowledgeEntry = {
	/** The name identifies the entry within its scope. */
	name?: string | null;
	/** The text describes a term, an alias, or another domain fact. */
	text?: string | null;
};

export type ZepV4KnowledgeResponse = {
	/** Inherited is true when the graph uses the project entries. */
	inherited?: boolean | null;
	/** The domain knowledge entries in effect at this scope. */
	knowledge?: Array<ZepV4KnowledgeEntry> | null;
};

export type ZepV4LookupBatchResponse = {
	/** The lookup result for each identifier submitted, in request order within each resource type. */
	items?: Array<ZepV4LookupItem> | null;
};

export type ZepV4LookupItem = {
	/** Whether the identifier resolved to a resource visible to the caller. */
	found?: boolean | null;
	/** The developer-assigned identifier that was looked up. */
	legacy_id?: string | null;
	/** The type of resource this entry resolves: user, thread, or graph. */
	resource_type?: ZepV4LookupItemResourceType | null;
	/** The resource's unique identifier; present only when found is true. */
	uuid?: string | null;
};

export type ZepV4MembershipMutationResult = {
	/** The number of users added to the group. */
	added_count?: number | null;
	/** The number of requested users that already matched the target membership state and were left unchanged. */
	no_op_count?: number | null;
	/** The number of users removed from the group. */
	removed_count?: number | null;
};

export type ZepV4Message = {
	/** The content of the message. */
	content?: string | null;
	/** The time Zep received the message. */
	created_at?: string | null;
	/** Arbitrary key-value metadata attached to the message. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** A custom name for the message's sender, for example a specific user or agent name. */
	name?: string | null;
	/** Whether the message has finished being ingested into the user's graph. */
	processed?: boolean | null;
	/** The message's reference time: the time that the developer supplied on add, or the ingestion time when the developer supplied no time. */
	reference_time?: string | null;
	/** The role of the message's sender: system, assistant, user, function, or tool. */
	role?: ZepV4RoleType | null;
	/** The unique identifier of the thread this message belongs to. */
	thread_uuid?: string | null;
	/** The unique identifier of the message. */
	uuid?: string | null;
};

export type ZepV4MessagePage = {
	/** The messages on this page. */
	items?: Array<ZepV4Message> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** The total number of matching messages, counted at the time of this response. It does not indicate whether more pages remain. */
	total_size?: number | null;
};

export type ZepV4NeighborEntry = {
	/** The edges connecting the neighboring node to the queried node. */
	edges?: Array<ZepV4Edge> | null;
	/** The neighboring node reached from the queried node. */
	node?: ZepV4Node | null;
};

export type ZepV4NeighborPage = {
	/** The neighboring nodes and their connecting edges on this page. */
	items?: Array<ZepV4NeighborEntry> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** Omitted for this collection; use next_cursor to detect the end of pagination. */
	total_size?: number | null;
};

export type ZepV4Node = {
	/** Additional attributes of the node, as defined by its entity type. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The time the node was created. */
	created_at?: string | null;
	/** The count of live entity edges that touch this node, in both directions. Present only when the list request orders by `degree`. */
	degree?: number | null;
	/** The UUIDs of the live episodes that mention this node, newest first. The list is complete when `episode_uuids_truncated` is false. The list holds the newest 100 when the node has more than 100 source episodes; list episodes with the `mentioned_node_uuids` filter to read them all. */
	episode_uuids?: Array<string> | null;
	/** True when the node has more than 100 source episodes, so `episode_uuids` holds only the newest 100, or when provenance is unavailable. False means `episode_uuids` is the complete set. */
	episode_uuids_truncated?: boolean | null;
	/** The unique identifier of the graph this node belongs to. */
	graph_uuid?: string | null;
	/** The entity type labels assigned to the node. */
	labels?: Array<string> | null;
	/** The name of the entity that the node represents. */
	name?: string | null;
	/** A cross-encoder-derived relevance score, present only when the cross-encoder reranker scored this result; like score, it is omitted from plain list results. */
	relevance?: number | null;
	/** The ranking score returned with every search result; omitted when the node appears in a plain list rather than a search result. */
	score?: number | null;
	/** A generated summary of the entity that the node represents. */
	summary?: string | null;
	/** The unique identifier of the user that owns the graph. Present only when the graph is a user graph. */
	user_uuid?: string | null;
	/** The node UUID, assigned by Zep. */
	uuid?: string | null;
};

export type ZepV4NodePage = {
	/** The nodes on this page. */
	items?: Array<ZepV4Node> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** Omitted for this collection; use next_cursor to detect the end of pagination. */
	total_size?: number | null;
};

export type ZepV4ObjectiveMappingRule = {
	/** Key is the root metadata key to read. */
	key?: string | null;
	/** Source selects the objective source. */
	source?: ZepV4ObjectiveMappingRuleSource | null;
};

export type ZepV4Observation = {
	/** Additional attributes of the derived node, as defined by its entity type. */
	attributes?: Record<string, ZepJsonValue> | null;
	/** The time the observation was created. */
	created_at?: string | null;
	/** The unique identifiers of the episodes that support this observation. */
	episode_uuids?: Array<string> | null;
	/** The unique identifier of the graph this observation belongs to. */
	graph_uuid?: string | null;
	/** The labels identifying the type of this observation. */
	labels?: Array<string> | null;
	/** The name of the observation. */
	name?: string | null;
	/** A cross-encoder-derived relevance score, present only when the cross-encoder reranker scored this result; like score, it is omitted from plain list results. */
	relevance?: number | null;
	/** The ranking score returned with every search result; omitted when the observation appears in a plain list rather than a search result. */
	score?: number | null;
	/** A generated summary of the observation. */
	summary?: string | null;
	/** The unique identifier of the user that owns the graph. Present only when the graph is a user graph. */
	user_uuid?: string | null;
	/** The unique identifier of the observation, assigned by Zep. */
	uuid?: string | null;
};

export type ZepV4ObservationPage = {
	/** The observations on this page. */
	items?: Array<ZepV4Observation> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** Omitted for this collection; use next_cursor to detect the end of pagination. */
	total_size?: number | null;
};

export type ZepV4ObservationSteering = {
	/** Whether this is the project's default value rather than an override set on this graph. */
	inherited?: boolean | null;
	/** The natural-language instruction steering how observations are generated at this scope. */
	instruction?: string | null;
	/** The named observation types, each with a description, that generation should steer toward at this scope. */
	types?: Array<ZepModelsObservationType> | null;
};

export type ZepV4Ontology = {
	/** The edge type hierarchy. Omitted when the ontology has no edge subtypes. */
	edge_type_hierarchy?: ZepV4OntologyEdgeTypeHierarchy | null;
	/** The edge types defined in the ontology in effect at this scope. */
	edge_types?: Array<ZepV4EdgeType> | null;
	/** The entity type hierarchy. Omitted when the ontology has no entity subtypes. */
	entity_type_hierarchy?: ZepV4OntologyEntityTypeHierarchy | null;
	/** The entity types defined in the ontology in effect at this scope. */
	entity_types?: Array<ZepV4EntityType> | null;
	/** Whether this is the project's default value rather than an override set on this graph. */
	inherited?: boolean | null;
};

export type ZepV4OutcomeMappingRule = {
	/** FailedBelow is the optional score threshold for failure. */
	failed_below?: number | null;
	/** Key is the metadata key for a metadata rule. */
	key?: string | null;
	/** Name is the score name for a score rule. */
	name?: string | null;
	/** Rule is the outcome mapping rule type. */
	rule?: ZepV4OutcomeMappingRuleRule | null;
	/** SucceededAtOrAbove is the score threshold for success. */
	succeeded_at_or_above?: number | null;
	/** Values maps metadata strings to Trace outcomes. */
	values?: Record<string, string> | null;
};

export type ZepV4PageV4AgentSkillCandidateReviewSummary = {
	items?: Array<ZepV4AgentSkillCandidateReviewSummary> | null;
	next_cursor?: string | null;
	total_size?: number | null;
};

export type ZepV4PageV4AgentSkillCompilationOutcome = {
	items?: Array<ZepV4AgentSkillCompilationOutcome> | null;
	next_cursor?: string | null;
	total_size?: number | null;
};

export type ZepV4PageV4AgentSkillEvidence = {
	items?: Array<ZepV4AgentSkillEvidence> | null;
	next_cursor?: string | null;
	total_size?: number | null;
};

export type ZepV4PageV4AgentSkillRelationship = {
	items?: Array<ZepV4AgentSkillRelationship> | null;
	next_cursor?: string | null;
	total_size?: number | null;
};

export type ZepV4PageV4AgentSkillSearchHit = {
	items?: Array<ZepV4AgentSkillSearchHit> | null;
	next_cursor?: string | null;
	total_size?: number | null;
};

export type ZepV4PageV4AgentSkillVersion = {
	items?: Array<ZepV4AgentSkillVersion> | null;
	next_cursor?: string | null;
	total_size?: number | null;
};

export type ZepV4PageV4AgentVerifier = {
	items?: Array<ZepV4AgentVerifier> | null;
	next_cursor?: string | null;
	total_size?: number | null;
};

export type ZepV4PolicySetSummaryList = {
	/** The policy sets attached to the user group after this operation. */
	items?: Array<ZepModelsPolicySetSummary> | null;
};

export type ZepV4PolicySetSummaryPage = {
	/** The policy sets attached to the user group on this page. */
	items?: Array<ZepModelsPolicySetSummary> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** The total number of attached policy sets, counted at the time of this response. It does not indicate whether more pages remain. */
	total_size?: number | null;
};

export type ZepV4ProcessBatchResult = {
	/** The batch that was submitted for processing. */
	batch?: ZepV4Batch | null;
	/** The task tracking the batch's asynchronous processing. */
	task?: ZepV4Task | null;
};

export type ZepV4Project = {
	/** The time the project was created. */
	created_at?: string | null;
	/** The project's default IANA time zone, used as the fallback when a resource does not set its own. */
	default_time_zone?: string | null;
	/** A human-readable description of the project. */
	description?: string | null;
	/** True when hyperedge extraction is enabled for this project. This setting is one-way. */
	hyperedges_enabled?: boolean | null;
	/** When true, episode reads on graphs with a content policy include the episodes that violated the policy. The default is false. */
	include_policy_violating_episodes?: boolean | null;
	/** The name of the project. */
	name?: string | null;
	/** The unique identifier of the project. */
	uuid?: string | null;
};

export type ZepV4RejectedBatchItem = {
	/** The zero-based position of the item in the request. */
	index?: number | null;
	/** The reason that the item was rejected. */
	reason?: string | null;
};

export type ZepV4RenameAgentTaskFamilyResponse = {
	/** True when the source descriptor merged into an existing one. */
	merged?: boolean | null;
	/** The descriptor after the operation. On a merge it is the descriptor that kept the target slug. */
	task_family?: ZepV4AgentTaskFamilyDescriptor | null;
};

export type ZepV4RoleType = string;

export type ZepV4SkillDefinition = {
	/** The developer lists Agent versions that can use the Skill. */
	agent_versions?: Array<string> | null;
	/** The developer supplies alternate names for the resource. */
	aliases?: Array<string> | null;
	/** The developer supplies the resource description. */
	description?: string | null;
	/** The developer supplies situations in which the Skill must not be used. */
	do_not_use_when?: Array<string> | null;
	/** The developer supplies conditions that show when the Skill work is complete. */
	done_when?: Array<string> | null;
	/** The developer supplies environment names used by the Skill. */
	environments?: Array<ZepV4SkillResource> | null;
	/** The developer supplies failure conditions and recovery steps. */
	failures?: Array<ZepV4SkillFailure> | null;
	/** The developer supplies a Skill kind. Valid values are principle, procedure, workflow, failure_mode, recovery, constraint. */
	kind?: ZepV4SkillKind | null;
	/** The developer supplies a display name. */
	name?: string | null;
	/** The developer supplies results that the Skill produces. */
	outputs?: Array<string> | null;
	/** The developer supplies the stable package name for the Skill. */
	package_name?: string | null;
	/** The developer supplies conditions that must be true before use. */
	preconditions?: Array<string> | null;
	/** The developer supplies ordered procedure steps. */
	procedure?: Array<ZepV4SkillProcedureStep> | null;
	/** The developer lists Skills that relate to this Skill. */
	related_skills?: Array<ZepV4SkillRelation> | null;
	/** The developer supplies structured sections of the Skill. */
	sections?: Array<ZepV4SkillDefinitionSection> | null;
	/** The developer supplies conditions that require the workflow to stop. */
	stop_when?: Array<string> | null;
	/** The developer supplies the task-family slug. */
	task_family?: string | null;
	/** The developer supplies tool names used by the Skill. */
	tools?: Array<ZepV4SkillResource> | null;
	/** The developer supplies conditions that must hold before the Skill is used. */
	use_when?: Array<string> | null;
};

export type ZepV4SkillDefinitionSection = {
	/** The developer supplies section heading. */
	heading?: string | null;
	/** The developer assigns a stable ID to this section. */
	id?: string | null;
	/** The developer supplies skill content in Markdown. */
	markdown?: string | null;
};

export type ZepV4SkillFailure = {
	/** The developer supplies steps to recover from this failure. */
	recover?: Array<string> | null;
	/** The developer supplies a condition that causes this failure. */
	when?: string | null;
};

export type ZepV4SkillKind = string;

export type ZepV4SkillProcedureStep = {
	/** The developer describes the decision point for this procedure step. */
	decision?: string | null;
	/** The developer supplies expected results. */
	expect?: Array<string> | null;
	/** The developer supplies action for this procedure step. */
	instruction?: string | null;
};

export type ZepV4SkillRelation = {
	/** The developer supplies a relationship to the related Skill. */
	relation?: string | null;
	/** The developer identifies a related Skill by its stable package name. */
	skill?: string | null;
	/** The developer supplies the Agent deployment version. */
	version?: string | null;
};

export type ZepV4SkillResource = {
	/** The developer supplies alternate names for the resource. */
	aliases?: Array<string> | null;
	/** The developer supplies a display name. */
	name?: string | null;
	/** The developer supplies the Agent deployment version. */
	version?: string | null;
};

export type ZepV4SourceSpan = {
	/** CreatedAt is the span creation time. */
	created_at?: string | null;
	/** EndedAt is the span end time, when present. */
	ended_at?: string | null;
	/** Error is the span error text, when present. */
	error?: string | null;
	/** Input is the provider span input. Example: {"messages":[]}. */
	input?: ZepV4SourceSpanInput | null;
	/** Kind is the normalized span kind. */
	kind?: string | null;
	/** Metadata contains provider span metadata. Example: {"team":"support"}. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** The provider supplies the model name when it is available. */
	model?: string | null;
	/** Name is the provider span name. */
	name?: string | null;
	/** Output is the provider span output. Example: {"text":"Hello"}. */
	output?: ZepV4SourceSpanOutput | null;
	/** ParentSpanID is the parent span identifier, when present. */
	parent_span_id?: string | null;
	/** SpanID is the provider span identifier. */
	span_id?: string | null;
	/** StartedAt is the span start time, when present. */
	started_at?: string | null;
	/** ToolName is the tool name, when present. */
	tool_name?: string | null;
};

export type ZepV4SourceTrace = {
	/** Closed reports whether the root span has ended. */
	closed?: boolean | null;
	/** EndedAt is the trace end time, when present. */
	ended_at?: string | null;
	/** HasError reports whether the trace contains an error. */
	has_error?: boolean | null;
	/** ImportedTraces contains visible Zep Traces imported from this trace. Example: [{"agent_uuid":"f8b28f94-4f5a-4b3a-b782-87aa8464ac04","trace_uuid":"6a906e70-50ca-4e43-a874-5fcae02a71fa","import_uuid":"332c28e1-e6a7-4bca-97b2-ef1ec82c65fa"}]. */
	imported_traces?: Array<ZepV4ImportedTraceReference> | null;
	/** LastActivityAt is the most recent activity time across spans. */
	last_activity_at?: string | null;
	/** Metadata contains the root span metadata summary. Example: {"team":"support"}. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** Name is the trace name, when present. */
	name?: string | null;
	/** Scores contains the trace score values. */
	scores?: Record<string, number> | null;
	/** SourceRevision is the provider revision for the trace. */
	source_revision?: string | null;
	/** SourceURL is the provider link, when available. */
	source_url?: string | null;
	/** SpanCount is the number of spans in the trace. */
	span_count?: number | null;
	/** Spans contains the trace spans. Example: [{"span_id":"span_123","kind":"llm","name":"assistant_response"}]. */
	spans?: Array<ZepV4SourceSpan> | null;
	/** StartedAt is the trace start time, when present. */
	started_at?: string | null;
	/** Tags contains the trace tags. */
	tags?: Array<string> | null;
	/** TraceID is the provider trace identifier. */
	trace_id?: string | null;
};

export type ZepV4SourceTracePage = {
	/** Items contains the source trace summaries on this page. Example: [{"trace_id":"trace_123","name":"Support trace"}]. */
	items?: Array<ZepV4SourceTraceSummary> | null;
	/** NextCursor is the cursor for the next provider page. */
	next_cursor?: string | null;
};

export type ZepV4SourceTraceResponse = {
	/** Preview contains the optional mapping preview. Example: {"event_count":4}. */
	preview?: ZepV4TracePreview | null;
	/** Trace is the requested provider trace. Example: {"trace_id":"trace_123","spans":[]}. */
	trace?: ZepV4SourceTrace | null;
};

export type ZepV4SourceTraceSummary = {
	/** Closed reports whether the root span has ended. */
	closed?: boolean | null;
	/** EndedAt is the trace end time, when present. */
	ended_at?: string | null;
	/** HasError reports whether the trace contains an error. */
	has_error?: boolean | null;
	/** ImportedTraces contains visible Zep Traces imported from this trace. Example: [{"agent_uuid":"f8b28f94-4f5a-4b3a-b782-87aa8464ac04","trace_uuid":"6a906e70-50ca-4e43-a874-5fcae02a71fa","import_uuid":"332c28e1-e6a7-4bca-97b2-ef1ec82c65fa"}]. */
	imported_traces?: Array<ZepV4ImportedTraceReference> | null;
	/** LastActivityAt is the most recent activity time across spans. */
	last_activity_at?: string | null;
	/** Metadata contains the root span metadata summary. Example: {"team":"support"}. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** Name is the trace name, when present. */
	name?: string | null;
	/** Scores contains the trace score values. */
	scores?: Record<string, number> | null;
	/** SourceRevision is the provider revision for the trace. */
	source_revision?: string | null;
	/** SourceURL is the provider link, when available. */
	source_url?: string | null;
	/** SpanCount is the number of spans in the trace. */
	span_count?: number | null;
	/** StartedAt is the trace start time, when present. */
	started_at?: string | null;
	/** Tags contains the trace tags. */
	tags?: Array<string> | null;
	/** TraceID is the provider trace identifier. */
	trace_id?: string | null;
};

export type ZepV4SubgraphResponse = {
	/** Every traversed edge that passed the request filters; both endpoints of every edge are present in nodes. */
	edges?: Array<ZepV4Edge> | null;
	/** Every admitted seed node and every node reached within the traversal budget. */
	nodes?: Array<ZepV4Node> | null;
	/** Whether any budget or limit reduced the result. */
	truncated?: boolean | null;
	/** The binding limit that caused truncation, such as max_nodes or max_edges; present only when truncated is true. */
	truncation_reason?: string | null;
};

export type ZepV4Task = {
	/** The time the task reached a terminal status; absent while it is still in progress. */
	completed_at?: string | null;
	/** The time the task was created. */
	created_at?: string | null;
	/** The error that caused the task to fail; also present on a partial task when the worker can name a single cause. */
	error?: ZepV4ErrorBody | null;
	/** The last processing stage a worker reported for this task. It is not cleared when the task finishes, so a completed task may still show its final stage. */
	progress?: ZepV4TaskProgress | null;
	/** Operation-specific output populated once the task reaches succeeded or partial, such as identifiers the operation could not return synchronously. */
	result?: ZepV4TaskResult | null;
	/** The time a worker began processing the task; absent until then. */
	started_at?: string | null;
	/** The service returns the task state. Valid values are pending, processing, succeeded, partial, and failed. A task has no canceled state. When a batch becomes canceled, its batch.process task becomes failed, and the task error code is batch_canceled. */
	status?: ZepV4TaskStatus | null;
	/** The kind of asynchronous operation the task represents. */
	type?: string | null;
	/** The time the task was last updated. */
	updated_at?: string | null;
	/** The unique identifier of the task, used to poll its status. */
	uuid?: string | null;
};

export type ZepV4TaskFamilyMappingRule = {
	/** The service uses this task family when the source gives no value. The value infer asks Agent Skills to assign the task family automatically. */
	fallback?: string | null;
	/** Key is the metadata key for metadata mapping. */
	key?: string | null;
	/** Prefix is the tag prefix for tag mapping. */
	prefix?: string | null;
	/** The service reads the task family from this source. The value infer asks Agent Skills to assign the task family automatically. */
	source?: ZepV4TaskFamilyMappingRuleSource | null;
	/** The developer supplies the task-family slug when the source is fixed. */
	value?: string | null;
};

export type ZepV4TaskPage = {
	/** The tasks on this page. */
	items?: Array<ZepV4Task> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** The total number of matching tasks, counted at the time of this response. It does not indicate whether more pages remain. */
	total_size?: number | null;
};

export type ZepV4TaskProgress = {
	/** The most recent processing stage reported by the worker handling the task. */
	stage?: string | null;
};

export type ZepV4TaskResult = {
	/** Experimental. The content policy outcome of the task. */
	content_policy?: ZepV4TaskResultContentPolicy | null;
	/** The UUID of the edge that the task wrote. */
	edge_uuid?: string | null;
	/** The edges that the task wrote. */
	edges?: Array<ZepV4TaskResultEdge> | null;
	/** The UUID of the episode that the task added. */
	episode_uuid?: string | null;
	/** The content policy outcome of each message that the task added. */
	episodes?: Array<ZepV4TaskResultEpisode> | null;
	/** The UUID of the hyperedge that the task created. */
	hyperedge_uuid?: string | null;
	/** The UUID of the skill that the task imported. */
	skill_uuid?: string | null;
	/** The UUID of the source node of the edge that the task wrote. */
	source_node_uuid?: string | null;
	/** The UUID of the target node of the edge that the task wrote. */
	target_node_uuid?: string | null;
};

export type ZepV4TaskResultContentPolicy = {
	/** The keys of the categories with a matched rule. */
	category_keys?: Array<string> | null;
	/** The number of derived candidates of the episode that were dropped. */
	dropped_count?: number | null;
	/** The number of episodes in the batch whose evaluation failed. */
	failed_count?: number | null;
	/** The number of derived candidates of the episode that were published to the graph. */
	retained_count?: number | null;
	/** The project revision number of the policy that the graph bound. */
	revision?: number | null;
	/** The evaluation status of the episode. pending means the evaluation has not finished, complete means every candidate was evaluated, and failed means ingestion retries were exhausted. */
	status?: ZepV4TaskResultContentPolicyStatus | null;
	/** Whether at least one derived candidate of the episode matched a rule. */
	violated?: boolean | null;
	/** The number of episodes in the batch that a content policy flagged. */
	violated_count?: number | null;
};

export type ZepV4TaskResultEdge = {
	/** The UUID of the edge. */
	edge_uuid?: string | null;
	/** The UUID of the source node of the edge. */
	source_node_uuid?: string | null;
	/** The UUID of the target node of the edge. */
	target_node_uuid?: string | null;
};

export type ZepV4TaskResultEpisode = {
	/** Experimental. The content policy state of the episode. */
	content_policy?: ZepV4TaskResultContentPolicy | null;
	/** The UUID of the episode of the message. */
	episode_uuid?: string | null;
};

export type ZepV4Thread = {
	/** The time the thread was created. */
	created_at?: string | null;
	/** The unique identifier of the owning user's graph. */
	graph_uuid?: string | null;
	/** The developer-assigned identifier of the thread. */
	thread_id?: string | null;
	/** The time the thread was last updated. */
	updated_at?: string | null;
	/** The unique identifier of the user the thread belongs to. */
	user_uuid?: string | null;
	/** The unique identifier of the thread. */
	uuid?: string | null;
};

export type ZepV4ThreadContextResponse = {
	/** The context block containing relevant facts, entities, and messages or episodes from the user's graph. Pass it through the model provider's untrusted-data channel. */
	context?: string | null;
};

export type ZepV4ThreadDeleteResult = {
	/** The task tracking the thread's asynchronous deletion. */
	task?: ZepV4Task | null;
};

export type ZepV4ThreadPage = {
	/** The threads on this page. */
	items?: Array<ZepV4Thread> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** The total number of matching threads, counted at the time of this response. It does not indicate whether more pages remain. */
	total_size?: number | null;
};

export type ZepV4ThreadSummary = {
	/** The time the summary was first created. */
	created_at?: string | null;
	/** The unique identifier of the graph this thread summary belongs to. */
	graph_uuid?: string | null;
	/** The wall-clock time of the most recent summary update. */
	last_summarized_at?: string | null;
	/** The latest episode reference time covered by the most recent summary update. */
	last_summarized_episode_valid_at?: string | null;
	/** A cross-encoder-derived relevance score, present only when the cross-encoder reranker scored this result; like score, it is omitted from plain list results. */
	relevance?: number | null;
	/** A score accompanies every search result; it is omitted when the summary appears in a plain list rather than a search result. */
	score?: number | null;
	/** The generated summary text for the thread. */
	summary?: string | null;
	/** The unique identifier of the thread this summary belongs to. */
	thread_uuid?: string | null;
	/** The unique identifier of the thread summary. */
	uuid?: string | null;
};

export type ZepV4ThreadSummaryPage = {
	/** The thread summaries on this page. */
	items?: Array<ZepV4ThreadSummary> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** Omitted for this collection; use next_cursor to detect the end of pagination. */
	total_size?: number | null;
};

export type ZepV4TraceConnection = {
	/** CreatedAt is the resource creation time. */
	created_at?: string | null;
	/** CredentialHint contains the final four characters of the credential. */
	credential_hint?: string | null;
	/** CredentialVersion is the current credential version. */
	credential_version?: number | null;
	/** ImportCount is the number of non-deleted imports that use this connection. */
	import_count?: number | null;
	/** LastVerifiedAt is the last successful credential verification time. */
	last_verified_at?: string | null;
	/** Name is the display name. */
	name?: string | null;
	/** Provider is the Braintrust or LangSmith provider. */
	provider?: ZepV4TraceConnectionProvider | null;
	/** ProviderOrganizationID is the provider organization identifier. */
	provider_organization_id?: string | null;
	/** ProviderOrganizationName is the provider organization name. */
	provider_organization_name?: string | null;
	/** Settings contains provider request and retention settings. Example: {"requests_per_minute":10}. */
	settings?: ZepV4TraceConnectionSettings | null;
	/** Status is the provider verification status. */
	status?: string | null;
	/** UpdatedAt is the last resource update time. */
	updated_at?: string | null;
	/** UUID is the trace connection identifier. */
	uuid?: string | null;
};

export type ZepV4TraceConnectionPage = {
	/** Items contains the trace connections on this page. Example: [{"uuid":"8c78a85e-eac2-4f57-b5f5-59a68a1e77a1"}]. */
	items?: Array<ZepV4TraceConnection> | null;
	/** NextCursor is the cursor for the next page. */
	next_cursor?: string | null;
	/** TotalSize is the number of matching connections. */
	total_size?: number | null;
};

export type ZepV4TraceConnectionSettings = {
	/** APIURL is an optional custom provider endpoint. */
	api_url?: string | null;
	/** RequestsPerMinute is the request rate limit from 1 to 60 per minute. */
	requests_per_minute?: number | null;
	/** RetentionDays is the optional retention window in days. */
	retention_days?: number | null;
};

export type ZepV4TraceContentMapping = {
	/** IncludeSystemMessages controls whether system messages become events. */
	include_system_messages?: boolean | null;
	/** MetadataKeys contains root metadata keys copied to the Trace. */
	metadata_keys?: Array<string> | null;
};

export type ZepV4TraceFilter = {
	/** HasError filters traces by their error state. */
	has_error?: boolean | null;
	/** Metadata contains exact-match root metadata filters. Example: {"team":"support"}. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** Name is the exact trace name filter. */
	name?: string | null;
	/** Scores contains score name and range filters. Example: [{"name":"quality","min":0.5}]. */
	scores?: Array<ZepV4TraceScoreRange> | null;
	/** StartedAfter is the inclusive trace start-time lower bound. */
	started_after?: string | null;
	/** StartedBefore is the exclusive trace start-time upper bound. */
	started_before?: string | null;
	/** TagsAll contains tags that every result must include. */
	tags_all?: Array<string> | null;
	/** TagsAny contains tags that at least one result must include. */
	tags_any?: Array<string> | null;
};

export type ZepV4TraceImport = {
	/** AgentUUID is the owning Agent identifier. */
	agent_uuid?: string | null;
	/** The service returns the configured provider connection used by this import. */
	connection_uuid?: string | null;
	/** CreatedAt is the resource creation time. */
	created_at?: string | null;
	/** ImportedTraceCount is the number of Traces currently owned by this import. */
	imported_trace_count?: number | null;
	/** LastRun is the latest run for this import, when one exists. */
	last_run?: ZepV4TraceImportRunReference | null;
	/** LearnFrom reports whether imported evidence can support Skills. */
	learn_from?: boolean | null;
	/** Mapping defines how traces become Traces. Example: {"task_family":{"source":"fixed","value":"support"}}. */
	mapping?: ZepV4TraceMapping | null;
	/** Name is the import display name. */
	name?: string | null;
	/** NextRunAt is the next scheduled run time. */
	next_run_at?: string | null;
	/** OnSourceChange defines how changed source traces are handled. */
	on_source_change?: ZepV4TraceImportOnSourceChange | null;
	/** PauseReason is the reason for a paused import, when present. */
	pause_reason?: ZepV4TraceImportPauseReason | null;
	/** Provider is the Braintrust or LangSmith provider. */
	provider?: ZepV4TraceImportProvider | null;
	/** ProviderOrganizationID is the provider organization identifier. */
	provider_organization_id?: string | null;
	/** The service returns the provider project selected for this import. */
	provider_project_id?: string | null;
	/** RequireReview reports whether candidate review is required. */
	require_review?: boolean | null;
	/** Revision is the import update revision. */
	revision?: number | null;
	/** Schedule contains recurring import settings, when enabled. Example: {"interval_hours":4,"start_from":"now","settle_minutes":5,"max_open_hours":24}. */
	schedule?: ZepV4TraceImportSchedule | null;
	/** Selection defines the source traces to import. Example: {"trace_ids":["trace_123"]}. */
	selection?: ZepV4TraceImportSelection | null;
	/** SourceCursorUpdatedAt is the last source cursor update time. */
	source_cursor_updated_at?: string | null;
	/** Status is the import status. */
	status?: string | null;
	/** UpdatedAt is the last resource update time. */
	updated_at?: string | null;
	/** UUID is the trace import identifier. */
	uuid?: string | null;
};

export type ZepV4TraceImportCreateResult = {
	/** Import is the created import resource. Example: {"uuid":"332c28e1-e6a7-4bca-97b2-ef1ec82c65fa"}. */
	import?: ZepV4TraceImport | null;
	/** Run is the pending one-time run. The field is absent for a scheduled import. Example: {"uuid":"ea7e2724-9bfd-4ca1-aa5c-40a1dd72a688","status":"pending"}. */
	run?: ZepV4TraceImportRun | null;
	/** Task is the pending Task that will process the run. The field is absent for a scheduled import. Example: {"uuid":"3124c01a-8f49-4bfd-9758-6ce491a377c1","status":"pending"}. */
	task?: ZepV4Task | null;
};

export type ZepV4TraceImportOnSourceChange = string;

export type ZepV4TraceImportPage = {
	/** Items contains trace imports on this page. Example: [{"uuid":"332c28e1-e6a7-4bca-97b2-ef1ec82c65fa","name":"Support traces"}]. */
	items?: Array<ZepV4TraceImport> | null;
	/** NextCursor is the cursor for the next page. */
	next_cursor?: string | null;
	/** TotalSize is the number of matching imports. */
	total_size?: number | null;
};

export type ZepV4TraceImportPauseReason = string;

export type ZepV4TraceImportRun = {
	/** CompletedAt is the run completion time, when present. */
	completed_at?: string | null;
	/** Counts contains run totals by result type. */
	counts?: Record<string, number> | null;
	/** CreatedAt is the run creation time. */
	created_at?: string | null;
	/** DueAt is the scheduled run time, when present. */
	due_at?: string | null;
	/** ErrorCode is the safe run error code, when present. */
	error_code?: string | null;
	/** The service returns the UUID of the import that owns this run. */
	import_uuid?: string | null;
	/** MoreAvailable reports whether more matching traces remain. */
	more_available?: boolean | null;
	/** SkipReasons contains skip totals by reason. */
	skip_reasons?: Record<string, number> | null;
	/** StartedAt is the run start time, when present. */
	started_at?: string | null;
	/** Status is the run status. */
	status?: string | null;
	/** The service returns the Task UUID for this import run. */
	task_uuid?: string | null;
	/** Trigger is the event that created the run. */
	trigger?: string | null;
	/** UUID is the run identifier. */
	uuid?: string | null;
};

export type ZepV4TraceImportRunItem = {
	/** CreatedAt is the item creation time. */
	created_at?: string | null;
	/** Reason is the safe skip or failure reason, when present. */
	reason?: string | null;
	/** SourceRevision is the provider revision processed by the run. */
	source_revision?: string | null;
	/** Status is the trace result status. */
	status?: string | null;
	/** TraceID is the provider trace identifier. */
	trace_id?: string | null;
	/** TraceUUID is the created Trace identifier, when present. */
	trace_uuid?: string | null;
};

export type ZepV4TraceImportRunItemPage = {
	/** Items contains run items on this page. Example: [{"trace_id":"trace_123","status":"imported"}]. */
	items?: Array<ZepV4TraceImportRunItem> | null;
	/** NextCursor is the cursor for the next page. */
	next_cursor?: string | null;
	/** TotalSize is the number of matching run items. */
	total_size?: number | null;
};

export type ZepV4TraceImportRunPage = {
	/** Items contains runs on this page. Example: [{"uuid":"ea7e2724-9bfd-4ca1-aa5c-40a1dd72a688","status":"pending"}]. */
	items?: Array<ZepV4TraceImportRun> | null;
	/** NextCursor is the cursor for the next page. */
	next_cursor?: string | null;
	/** TotalSize is the number of matching runs. */
	total_size?: number | null;
};

export type ZepV4TraceImportRunReference = {
	/** CompletedAt is the run completion time, when present. */
	completed_at?: string | null;
	/** StartedAt is the run start time, when present. */
	started_at?: string | null;
	/** Status is the run status. */
	status?: ZepV4TraceImportRunReferenceStatus | null;
	/** Trigger is the event that created the run. */
	trigger?: ZepV4TraceImportRunReferenceTrigger | null;
	/** UUID is the run identifier. */
	uuid?: string | null;
};

export type ZepV4TraceImportSchedule = {
	/** IntervalHours is the scheduled run interval. */
	interval_hours?: number | null;
	/** MaxOpenHours is the maximum wait for an open trace. The value must be 1 to 168 hours. The default is 24 hours. */
	max_open_hours?: number | null;
	/** SettleMinutes is the wait time for trace updates. The value must be 0 to 1,440 minutes. The default is 60 minutes. */
	settle_minutes?: number | null;
	/** StartFrom is the earliest trace start time that scheduled runs import. The value is "now", which is the time when the import was created, or an RFC 3339 timestamp. */
	start_from?: string | null;
};

export type ZepV4TraceImportSelection = {
	/** Filter selects traces by provider fields. Example: {"started_after":"2026-01-01T00:00:00Z"}. */
	filter?: ZepV4TraceFilter | null;
	/** TraceIDs contains explicit provider trace identifiers. */
	trace_ids?: Array<string> | null;
};

export type ZepV4TraceMapping = {
	/** Content configures copied span content. Example: {"include_system_messages":false}. */
	content?: ZepV4TraceContentMapping | null;
	/** IncludeOutcomes lists outcomes that can support a Skill. */
	include_outcomes?: Array<ZepV4TraceMappingIncludeOutcomesItems> | null;
	/** Objective maps provider data to a Trace objective. Example: {"source":"first_user_message"}. */
	objective?: ZepV4ObjectiveMappingRule | null;
	/** Outcome contains ordered outcome mapping rules. Example: [{"rule":"score","name":"quality","succeeded_at_or_above":0.8}]. */
	outcome?: Array<ZepV4OutcomeMappingRule> | null;
	/** ScoreVerifier enables score-based verification. */
	score_verifier?: boolean | null;
	/** TaskFamily maps provider data to a task family. Example: {"source":"fixed","value":"support"}. */
	task_family?: ZepV4TaskFamilyMappingRule | null;
};

export type ZepV4TraceMappingResult = {
	/** Metadata contains mapped source metadata. Example: {"ticket_id":"123"}. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** Objective is the resolved objective. */
	objective?: string | null;
	/** Outcome is the resolved outcome. */
	outcome?: ZepV4TraceMappingResultOutcome | null;
	/** OutcomeRule is the rule that selected the outcome. */
	outcome_rule?: ZepV4TraceMappingResultOutcomeRule | null;
	/** Scores contains provider score values. */
	scores?: Record<string, number> | null;
	/** TaskFamily is the resolved task family. */
	task_family?: string | null;
	/** Verification is the resolved verification state. */
	verification?: string | null;
};

export type ZepV4TracePreview = {
	/** EventCount is the number of mapped events. */
	event_count?: number | null;
	/** MappingResult contains the resolved Trace fields. Example: {"task_family":"support","objective":"Help the customer"}. */
	mapping_result?: ZepV4TraceMappingResult | null;
	/** SkipReason is the reason the trace cannot be imported, when present. */
	skip_reason?: string | null;
};

export type ZepV4TraceProviderProject = {
	/** The provider supplies this creation time when it has one. The service returns it when it is available. */
	created_at?: string | null;
	/** ID is the provider project identifier. */
	id?: string | null;
	/** Name is the provider project name. */
	name?: string | null;
};

export type ZepV4TraceProviderProjectPage = {
	/** Items contains the provider projects on this page. Example: [{"id":"project_123","name":"Support"}]. */
	items?: Array<ZepV4TraceProviderProject> | null;
	/** NextCursor is the provider cursor for the next page. */
	next_cursor?: string | null;
};

export type ZepV4TraceScoreRange = {
	/** Max is the inclusive score upper bound. */
	max?: number | null;
	/** Min is the inclusive score lower bound. */
	min?: number | null;
	/** Name is the provider score name. */
	name?: string | null;
};

export type ZepV4User = {
	/** The time the user was created. */
	created_at?: string | null;
	/** When true, disables the use of the default fallback ontology for the user's graph. */
	disable_default_ontology?: boolean | null;
	/** The email address of the user. */
	email?: string | null;
	/** The first name of the user. */
	first_name?: string | null;
	/** The unique identifier of the user's graph, populated when the user is created. */
	graph_uuid?: string | null;
	/** The last name of the user. */
	last_name?: string | null;
	/** Arbitrary key-value metadata attached to the user. */
	metadata?: Record<string, ZepJsonValue> | null;
	/** The user's IANA time zone, used to localize dates in generated context. */
	time_zone?: string | null;
	/** An optional external identity identifier, such as an identity-provider subject claim. Zep uses it to match an identity-provider sign-in to this user. It is not an address; use uuid to address the user in v4. It is unique within the project, can contain at most 500 characters, and cannot be… */
	user_id?: string | null;
	/** The unique identifier of the user. */
	uuid?: string | null;
};

export type ZepV4UserDeleteResult = {
	/** The task tracking the user's asynchronous deletion. Once it completes, the user's threads, messages, and graph are removed as well. */
	task?: ZepV4Task | null;
};

export type ZepV4UserGroup = {
	/** The time the user group was created. */
	created_at?: string | null;
	/** A human-readable description of the user group. */
	description?: string | null;
	/** The name of the user group. */
	name?: string | null;
	/** The time the user group was last updated. */
	updated_at?: string | null;
	/** The unique identifier of the user group. */
	uuid?: string | null;
	/** The user group's version, used for optimistic concurrency on updates. */
	version?: number | null;
};

export type ZepV4UserGroupPage = {
	/** The user groups on this page. */
	items?: Array<ZepV4UserGroup> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** The total number of matching user groups, counted at the time of this response. It does not indicate whether more pages remain. */
	total_size?: number | null;
};

export type ZepV4UserPage = {
	/** The users on this page. */
	items?: Array<ZepV4User> | null;
	/** The cursor to pass as the next request's cursor to fetch the following page; absent when no further pages remain. */
	next_cursor?: string | null;
	/** The total number of matching users, counted at the time of this response. It does not indicate whether more pages remain. */
	total_size?: number | null;
};

export type ZepV4UserSummaryInstructions = {
	/** Whether this is the project's default value rather than an override set on this graph. */
	inherited?: boolean | null;
	/** The custom instructions used when generating a user's summary at this scope, each with a name and text. */
	instructions?: Array<ZepModelsUserInstruction> | null;
};

export type ZepOperationInputs = {
	'agents.create': {
		/** The developer-assigned Agent identifier, unique within the project. */
		agent_id: string;
		/** The customer deployment this Agent represents. */
		deployment_id?: string;
		/** A human-readable description of the Agent. */
		description?: string;
		/** Agent Skills capture, compilation, and promotion settings. */
		memory_settings?: ZepV4AgentMemorySettingsInput;
		/** Developer metadata used to organize and filter Agents. */
		metadata?: Record<string, ZepJsonValue>;
		/** The Agent's display name. */
		name: string;
		/** The immutable boundary within which Skills may be synthesized. 1 to 200 characters of lowercase letters, digits, and the characters : . - _ */
		security_domain: string;
		/** The customer deployment version this Agent represents. If you omit it, the version is "default". */
		version?: string;
	};
	'agents.declareBreakingChange': {
		/** Agent UUID */
		agent_uuid: string;
		/** The developer supplies the current Agent revision for optimistic concurrency. It must be at least 1. */
		expected_revision: number;
		/** The developer supplies the new deployment version. It must differ from the current version. */
		version: string;
	};
	'agents.delete': {
		/** Agent UUID */
		agent_uuid: string;
		/** The current Agent revision used for optimistic concurrency. */
		expected_revision: number;
	};
	'agents.get': {
		/** Agent UUID */
		agent_uuid: string;
	};
	'agents.getContext': {
		/** Agent UUID */
		agent_uuid: string;
		/** The developer supplies environment names used by the Skill. At most 32. */
		environments?: Array<ZepV4AgentContextResourceInput>;
		/** The developer supplies a Skill kind. At most 64. */
		kind?: string;
		/** The developer sets the maximum number of characters in the context response. */
		max_characters?: number;
		/** The developer supplies models used for this evaluation. At most 32. */
		models?: Array<ZepV4AgentContextResourceInput>;
		/** The developer supplies the task-instance objective. At most 512. */
		objective?: string;
		/** The developer supplies the task-family slug. At most 128. */
		task_family?: string;
		/** The developer supplies tool names used by the Skill. At most 32. */
		tools?: Array<ZepV4AgentContextResourceInput>;
		/** The developer supplies the UUID of the source Trace. */
		trace_uuid?: string;
	};
	'agents.learning.get': {
		/** Agent UUID */
		agent_uuid: string;
		/** Task family */
		task_family: string;
	};
	'agents.learning.listRuns': {
		/** Agent UUID */
		agent_uuid: string;
		/** Task family */
		task_family?: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'agents.list': {
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort field */
		order_by?: ZepAgentsListPostParametersOrderByInput;
		/** asc or desc */
		order?: ZepAgentsListPostParametersOrderInput;
		/** Filters to the exact developer-assigned Agent identifier. */
		agent_id?: string;
		/** The developer supplies filters to the exact deployment identifier. */
		deployment_id?: string;
		/** Filters to Agents whose metadata contains these key-value pairs. */
		metadata?: Record<string, ZepJsonValue>;
		/** The developer supplies filters to Agents whose name, Agent identifier, deployment identifier, or deployment version contains this text. Matching is case-insensitive. */
		search?: string;
		/** Filters to lifecycle status. Omit to include every status. */
		status?: ZepV4AgentStatusInput;
		/** Filters to the exact deployment version. */
		version?: string;
	};
	'agents.literalPolicy.get': {
		/** Agent UUID */
		agent_uuid: string;
	};
	'agents.literalPolicy.update': {
		/** Agent UUID */
		agent_uuid: string;
		/** Typed reusable literal classes. */
		allowlisted_classes: ZepV4AgentLiteralPolicyClassesInput;
		/** Exact reusable values scoped by tools and environments. */
		allowlisted_values: ZepV4AgentLiteralPolicyValuesInput;
		/** The remediation for literals that are not explicitly allowed. */
		default: ZepV4UpdateAgentLiteralPolicyRequestDefaultInput;
		/** The current literal-policy revision used for optimistic concurrency. */
		expected_revision?: number;
	};
	'agents.planSplit': {
		/** Source Agent UUID */
		agent_uuid: string;
		/** The developer lists 1 to 100 destination Agents. */
		destinations: Array<ZepV4AgentSplitPlanDestinationRequestInput>;
		/** The developer supplies the current revision used for optimistic concurrency. At least 1. */
		expected_revision: number;
		/** The developer explains the requested change. The limit is 2,000 characters. */
		rationale: string;
		/** The developer sets this to true to confirm that the review is complete. */
		review_acknowledged: boolean;
	};
	'agents.skillCandidates.evaluate': {
		/** Agent UUID */
		agent_uuid: string;
		/** Candidate review UUID */
		review_uuid: string;
		/** Candidate UUID */
		candidate_uuid: string;
		/** The developer sets this to true when a controlled test produced the result. */
		controlled_test?: boolean;
		/** The developer supplies the environment for this evaluation. */
		environment?: string;
		/** The developer selects the evaluation source. Valid values are customer, tool, offline_corpus, policy. */
		evaluated_by: ZepV4CreateAgentSkillCandidateEvaluationRequestEvaluatedByInput;
		/** The developer supplies the version of the evaluation rule. */
		evaluator_version: string;
		/** The developer links this evaluation to an evidence record. */
		evidence_reference?: string;
		/** The developer supplies the current revision used for optimistic concurrency. At least 1. */
		expected_revision: number;
		/** The developer supplies evaluation metrics. */
		metrics?: Record<string, number>;
		/** The developer supplies evaluation verdict. Valid values are succeeded, failed, partial, unknown. */
		verdict: ZepV4CreateAgentSkillCandidateEvaluationRequestVerdictInput;
	};
	'agents.skillCandidates.get': {
		/** Agent UUID */
		agent_uuid: string;
		/** Candidate review UUID */
		review_uuid: string;
	};
	'agents.skillCandidates.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'agents.skillPublications.lookup': {
		/** Destination Agent UUID */
		agent_uuid: string;
		/** Source Agent UUID */
		source_agent_uuid: string;
		/** Source Skill UUID */
		source_skill_uuid: string;
		/** Source version number */
		source_version: number;
	};
	'agents.skills.approve': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** The developer supplies the current Skill version to protect against concurrent edits. */
		expected_version: number;
	};
	'agents.skills.create': {
		/** Agent UUID */
		agent_uuid: string;
		/** The developer supplies the structured content of the Skill. */
		definition: ZepV4SkillDefinitionInput;
		/** The developer can set a stable ID for the Skill. If omitted, the service assigns one. */
		skill_id?: string;
	};
	'agents.skills.createVersion': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** The developer supplies the structured content for the new Skill version. */
		definition: ZepV4SkillDefinitionInput;
		/** The developer supplies the current Skill version to protect against concurrent edits. */
		expected_version: number;
	};
	'agents.skills.evaluations.create': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** The developer sets this to true when a controlled test produced the result. */
		controlled_test?: boolean;
		/** The developer supplies the environment for this evaluation. At most 1024. */
		environment?: string;
		/** The developer selects the evaluation source. Valid values are customer, tool, offline_corpus, policy. */
		evaluated_by: ZepV4CreateAgentSkillEvaluationRequestEvaluatedByInput;
		/** The developer supplies the evaluation rule version. It can contain up to 255 characters. */
		evaluator_version: string;
		/** The developer links this evaluation to an evidence record. */
		evidence_reference?: string;
		/** The developer supplies evaluation metrics. */
		metrics?: Record<string, number>;
		/** The developer supplies the Skill version to evaluate. It must be at least 1. */
		skill_version: number;
		/** The developer can link this evaluation to a recorded Skill use. */
		use_uuid?: string;
		/** The developer supplies evaluation verdict. Valid values are succeeded, failed, partial, unknown. */
		verdict: ZepV4CreateAgentSkillEvaluationRequestVerdictInput;
	};
	'agents.skills.evidence.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'agents.skills.get': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
	};
	'agents.skills.getPublication': {
		/** Destination Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
	};
	'agents.skills.importPackage': {
		/** Agent UUID */
		agent_uuid: string;
		/** Portable Skill ZIP archive */
		file: FileInput;
	};
	'agents.skills.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** The developer filters results by environment names. */
		environments?: Array<string>;
		/** The developer supplies a Skill kind. */
		kind?: string;
		/** The developer supplies the task-family slug. */
		task_family?: string;
		/** The developer supplies tool names used by the Skill. */
		tools?: Array<string>;
	};
	'agents.skills.relations.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** Relationship kinds */
		kind?: Array<ZepAgentsAgentUuidSkillsSkillUuidRelationsGetParametersKindSchemaItemsInput>;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'agents.skills.retire': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** The developer supplies the current Skill version to protect against concurrent edits. */
		expected_version: number;
	};
	'agents.skills.search': {
		/** Agent UUID */
		agent_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** The developer supplies environment names used by the Skill. */
		environments?: Array<string>;
		/** The developer sets this to true to include the Skill instructions in Markdown. */
		include_markdown?: boolean;
		/** The developer supplies a Skill kind. */
		kind?: string;
		/** MarkdownFormat selects the form of inline `markdown`. `agent` (the default) returns the Skill text that an Agent needs: no evidence markers, the description only in the frontmatter, and no empty sections. `full` returns the stored SKILL.md with its evidence markers. */
		markdown_format?: ZepV4AgentSkillMarkdownFormatInput;
		/** The developer supplies a search query for Skills. A term is a sequence of characters between whitespace. When the query has more than 64 terms, Zep searches with the first 64 terms and ignores the other terms. The query must not be longer than 512 bytes. */
		query: string;
		/** The developer supplies the task-family slug. */
		task_family?: string;
		/** The developer supplies tool names used by the Skill. */
		tools?: Array<string>;
	};
	'agents.skills.uses.addOutcome': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** Skill use UUID */
		use_uuid: string;
		/** The developer records the attempt outcome. Valid values are succeeded, failed, partial, abandoned, and unknown. */
		outcome: ZepV4AddAgentSkillUseOutcomeRequestOutcomeInput;
	};
	'agents.skills.uses.create': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** The developer records the outcome of the attempt. Valid values are succeeded, failed, partial, abandoned, and unknown. */
		outcome?: ZepV4AddAgentSkillUseOutcomeRequestInput;
		/** The developer supplies a reason code for this outcome. It can contain up to 255 characters. */
		reason_code?: string;
		/** The developer supplies the signed search token returned by Skill search. */
		search_id: string;
		/** The developer supplies the UUID of the source Trace. */
		trace_uuid: string;
		/** The developer supplies how the Skill was used. Valid values are selected, used, partially_used, ignored, inapplicable. */
		usage: ZepV4CreateAgentSkillUseRequestUsageInput;
	};
	'agents.skills.versions.compare': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** The developer supplies the source version to compare. It must be at least 1. */
		from_version: number;
		/** The developer supplies the destination version to compare. It must be at least 1. */
		to_version: number;
	};
	'agents.skills.versions.exports.create': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** Skill version */
		version: number;
	};
	'agents.skills.versions.exports.get': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** Skill version */
		version: number;
		/** Export Task UUID */
		task_uuid: string;
	};
	'agents.skills.versions.get': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** Skill version */
		version: number;
		/** Markdown form: agent (default) or full */
		markdown_format?: ZepAgentsAgentUuidSkillsSkillUuidVersionsVersionGetParametersMarkdownFormatInput;
		/** Optional field to add to the response: contract */
		include?: ZepAgentsAgentUuidSkillsSkillUuidVersionsVersionGetParametersIncludeInput;
	};
	'agents.skills.versions.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Markdown form: agent (default) or full */
		markdown_format?: ZepAgentsAgentUuidSkillsSkillUuidVersionsGetParametersMarkdownFormatInput;
	};
	'agents.skills.versions.restore': {
		/** Agent UUID */
		agent_uuid: string;
		/** Skill UUID, or the 8-character short_id */
		skill_uuid: string;
		/** The developer supplies the current Skill version to protect against concurrent edits. */
		expected_version: number;
		/** The developer supplies the Skill version to restore. */
		version: number;
	};
	'agents.taskFamilies.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'agents.taskFamilies.rename': {
		/** Agent UUID */
		agent_uuid: string;
		/** The current slug of the live descriptor. */
		from_slug: string;
		/** The new slug, or the slug of the live descriptor to merge into. */
		to_slug: string;
	};
	'agents.traceImports.create': {
		/** Agent UUID */
		agent_uuid: string;
		/** The developer selects the configured provider connection. */
		connection_uuid?: string;
		/** LearnFrom controls whether imported evidence can support Skills. */
		learn_from?: boolean;
		/** Mapping defines how source traces become Traces. Example: {"task_family":{"source":"fixed","value":"support"}}. */
		mapping?: ZepV4TraceMappingInput;
		/** Name is the import display name. */
		name?: string;
		/** OnSourceChange defines how changed source traces are handled. */
		on_source_change?: ZepV4TraceImportOnSourceChangeInput;
		/** The developer selects the project to import from the provider. */
		provider_project_id?: string;
		/** RequireReview requires review for candidates backed by this import. */
		require_review?: boolean;
		/** Schedule enables recurring imports when supplied. Example: {"interval_hours":4,"start_from":"now","settle_minutes":5,"max_open_hours":24}. */
		schedule?: ZepV4TraceImportScheduleInput;
		/** Selection defines the traces to import. Example: {"trace_ids":["trace_123"]}. */
		selection?: ZepV4TraceImportSelectionInput;
	};
	'agents.traceImports.delete': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace import UUID */
		import_uuid: string;
		/** Whether to delete imported Traces */
		traces?: ZepAgentsAgentUuidTraceImportsImportUuidDeleteParametersTracesInput;
	};
	'agents.traceImports.get': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace import UUID */
		import_uuid: string;
	};
	'agents.traceImports.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'agents.traceImports.pause': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace import UUID */
		import_uuid: string;
	};
	'agents.traceImports.resume': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace import UUID */
		import_uuid: string;
	};
	'agents.traceImports.runs.create': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace import UUID */
		import_uuid: string;
	};
	'agents.traceImports.runs.get': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace import UUID */
		import_uuid: string;
		/** Run UUID */
		run_uuid: string;
	};
	'agents.traceImports.runs.items.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace import UUID */
		import_uuid: string;
		/** Run UUID */
		run_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'agents.traceImports.runs.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace import UUID */
		import_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'agents.traceImports.update': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace import UUID */
		import_uuid: string;
		/** ExpectedRevision is the current import revision. */
		expected_revision?: number;
		/** LearnFrom is the new learning setting, when supplied. */
		learn_from?: boolean;
		/** Mapping is the new mapping, when supplied. Example: {"task_family":{"source":"fixed","value":"support"}}. */
		mapping?: ZepV4TraceMappingInput;
		/** Name is the new import name, when supplied. */
		name?: string;
		/** OnSourceChange is the new change policy, when supplied. */
		on_source_change?: ZepV4UpdateTraceImportRequestOnSourceChangeInput;
		/** RequireReview is the new review setting, when supplied. */
		require_review?: boolean;
		/** Schedule is the new schedule, when supplied. Example: {"interval_hours":4,"start_from":"now","settle_minutes":5,"max_open_hours":24}. */
		schedule?: ZepV4TraceImportScheduleInput;
		/** Selection is the new selection, when supplied. Example: {"trace_ids":["trace_123"]}. */
		selection?: ZepV4TraceImportSelectionInput;
	};
	'agents.traces.abandon': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
		assertion_uuid?: string;
		expected_revision?: number;
		highest_accepted_sequence: number;
		missing_sequence_ranges?: Array<ZepV4AgentTraceSequenceRangeInput>;
		reason?: string;
		verification?: ZepV4AgentTraceVerificationInput;
	};
	'agents.traces.appendEvent': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
		content?: string;
		/** Context gives the model, the tools, and the environments of the event. context.tools is the tool that the event calls or returns, and Skills learning reads it. A tool event can omit the tool name. */
		context?: ZepV4AgentTraceEventContextInput;
		event_id?: string;
		event_type: ZepV4AgentTraceEventTypeInput;
		/** Metadata is developer data. Skills learning does not read it. */
		metadata?: Record<string, ZepJsonValue>;
		occurred_at?: string;
		sequence?: number;
		sources?: Array<ZepV4AgentTraceEventSourceInput>;
		/** ToolCallID is the ID that the agent framework gives a tool call. Use the same ID on the tool_call and tool_result events. It is valid only on these event types. A result without a matching call is valid. OpenAI uses tool_calls[].id, Anthropic uses the tool_use block id, and LangChain uses… */
		tool_call_id?: string;
	};
	'agents.traces.close': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
		closing_sequence?: number;
		expected_revision?: number;
		missing_sequence_ranges?: Array<ZepV4AgentTraceSequenceRangeInput>;
		outcome?: ZepV4AgentTraceOutcomeInput;
		reason?: string;
		verification?: ZepV4AgentTraceVerificationInput;
		verifier?: ZepV4AgentTraceCloseVerifierInput;
		verifier_id?: string;
	};
	'agents.traces.correctTaskFamily': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
		/** The current Trace revision used for optimistic concurrency. */
		expected_revision: number;
		/** Why the terminal Trace classification is being corrected. */
		reason: string;
		/** Replacement task-family slug. Set to null to clear it. */
		task_family: string | null;
	};
	'agents.traces.create': {
		/** Agent UUID */
		agent_uuid: string;
		/** The developer supplies whether eligible evidence may participate in learning. Defaults to true. */
		learn_from?: boolean;
		/** Developer metadata used to organize and filter Traces. */
		metadata?: Record<string, ZepJsonValue>;
		/** The developer describes the task instance. The create request requires a non-empty value but does not check its size. An AppendAgentTraceEventRequest returns 400 if the Trace objective exceeds 8 KiB (8,192 bytes). */
		objective: string;
		/** The developer supplies the parent Trace UUID when this attempt retries an earlier attempt. */
		parent_trace_uuid?: string;
		/** The developer may set a task-family slug. If the developer omits it, Agent Skills assigns the Trace to a task family automatically. If Agent Skills cannot assign a task family, the `task_family_inference` field of the Trace is `unassigned`. A BYOM configuration requires `task_family`. A… */
		task_family?: string;
		/** The developer may set an identifier that is unique within the Agent. A retry with the same create parameters returns 200 and the existing Trace. Different parameters return 409. */
		trace_id?: string;
	};
	'agents.traces.delete': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
		/** The developer supplies the current revision for optimistic concurrency. */
		expected_revision: number;
	};
	'agents.traces.deleteEvent': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
		/** Event UUID */
		event_uuid: string;
		/** The developer supplies the current revision for optimistic concurrency. */
		expected_revision: number;
	};
	'agents.traces.get': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
	};
	'agents.traces.getSummary': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
	};
	'agents.traces.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort field */
		order_by?: ZepAgentsAgentUuidTracesListPostParametersOrderByInput;
		/** asc or desc */
		order?: ZepAgentsAgentUuidTracesListPostParametersOrderInput;
		/** Filter by owning Trace import UUID */
		import_uuid?: string;
		/** Source kind */
		source_kind?: ZepAgentsAgentUuidTracesListPostParametersSourceKindInput;
		/** Filters to Traces whose metadata contains these key-value pairs. */
		metadata?: Record<string, ZepJsonValue>;
		/** The developer supplies filters to one reported outcome. Valid values are succeeded, failed, partial, abandoned, unknown. */
		outcome?: ZepV4AgentTraceOutcomeInput;
		/** Filters to direct retries of this parent Trace. */
		parent_trace_uuid?: string;
		/** Filters to one lifecycle state. */
		status?: ZepV4AgentTraceLifecycleInput;
		/** Filters to an exact task-family slug. */
		task_family?: string;
		/** Filters to one verification strength. */
		verification?: ZepV4AgentTraceVerificationInput;
	};
	'agents.traces.listEvents': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'agents.traces.listSummaryVersions': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'agents.traces.reopen': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
		/** The current Trace revision used for optimistic concurrency. */
		expected_revision: number;
	};
	'agents.traces.update': {
		/** Agent UUID */
		agent_uuid: string;
		/** Trace UUID */
		trace_uuid: string;
		/** The current Trace revision used for optimistic concurrency. */
		expected_revision: number;
		/** Replacement task-family slug. Set to null to clear it. */
		task_family: string | null;
	};
	'agents.update': {
		/** Agent UUID */
		agent_uuid: string;
		/** The customer deployment this Agent represents. Set to null to clear it. */
		deployment_id?: string;
		/** A human-readable description of the Agent. Set to null to clear it. */
		description?: string;
		/** The current Agent revision used for optimistic concurrency. */
		expected_revision: number;
		/** Replacement Agent Skills settings. Set to null to restore defaults. */
		memory_settings?: ZepV4AgentMemorySettingsInput;
		/** Replacement developer metadata. Set to null to clear it. */
		metadata?: ZepV4PatchAgentRequestMetadataInput | null;
		/** The Agent's display name. */
		name?: string;
		/** The customer deployment version this Agent represents. Set to null to clear it. */
		version?: string;
	};
	'agents.verifiers.get': {
		/** Agent UUID */
		agent_uuid: string;
		/** Verifier UUID */
		verifier_uuid: string;
	};
	'agents.verifiers.invalidateEvidence': {
		/** Agent UUID */
		agent_uuid: string;
		/** Verifier UUID */
		verifier_uuid: string;
		/** The developer supplies why evidence from these verifier revisions is invalid. */
		reason: string;
		/** Verifier revisions whose accepted evidence is no longer valid. */
		verifier_revisions: Array<number>;
	};
	'agents.verifiers.list': {
		/** Agent UUID */
		agent_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Page cursor */
		cursor?: string;
		/** Filters to an exact immutable verifier class. */
		class?: string;
		/** Filters to registrations bound to this exact principal identifier. */
		principal_id?: string;
		/** Filters to registrations bound to this principal type. */
		principal_type?: string;
		/** Filters to active or revoked registrations. Omit to include both. */
		status?: ZepV4AgentVerifierStatusInput;
		/** Filters to an exact developer-assigned verifier identifier. */
		verifier_id?: string;
	};
	'agents.verifiers.revoke': {
		/** Agent UUID */
		agent_uuid: string;
		/** Verifier UUID */
		verifier_uuid: string;
		/** The current verifier revision used for optimistic concurrency. */
		expected_revision: number;
	};
	'agents.verifiers.update': {
		/** Agent UUID */
		agent_uuid: string;
		/** Verifier UUID */
		verifier_uuid: string;
		/** Replacement capabilities. Set to null to clear them. */
		capabilities?: ZepV4PatchAgentVerifierRequestCapabilitiesInput | null;
		/** The current verifier revision used for optimistic concurrency. */
		expected_revision: number;
		/** Replacement metadata. Set to null to clear it. */
		metadata?: ZepV4PatchAgentVerifierRequestMetadataInput | null;
		/** Replacement permitted strengths. The list cannot be empty or null. */
		permitted_strengths?: Array<ZepV4AgentVerificationStrengthInput>;
		/** Replacement exact principal bindings. The list cannot be empty or null. */
		principal_bindings?: Array<ZepV4AgentVerifierPrincipalBindingInputInput>;
	};
	'batches.addItems': {
		/** Batch UUID */
		batch_uuid: string;
		/** The batch items to append, each identified by its type field. */
		items: Array<ZepV4BatchItemInputInput>;
	};
	'batches.create': {
		/** Message roles to skip during graph extraction for thread message items in this batch. */
		ignore_roles?: Array<string>;
		/** Metadata to store on the batch. */
		metadata?: Record<string, ZepJsonValue>;
		/** When true, prevents extraction of generic entity nodes that do not match the configured ontology for episodes in this batch. */
		strict_ontology?: boolean;
	};
	'batches.delete': {
		/** Batch UUID */
		batch_uuid: string;
	};
	'batches.get': {
		/** Batch UUID */
		batch_uuid: string;
	};
	'batches.list': {
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Batch status filter */
		status?: ZepBatchesGetParametersStatusInput;
	};
	'batches.listItems': {
		/** Batch UUID */
		batch_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'batches.process': {
		/** Batch UUID */
		batch_uuid: string;
	};
	'contextTemplates.create': {
		/** A unique, human-readable name for the template. */
		name?: string;
		/** The template content used to render context blocks. */
		template?: string;
	};
	'contextTemplates.delete': {
		/** Template UUID */
		template_uuid: string;
	};
	'contextTemplates.get': {
		/** Template UUID */
		template_uuid: string;
	};
	'contextTemplates.list': {
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Filters results to the context template with this exact name. */
		name?: string;
	};
	'contextTemplates.update': {
		/** Template UUID */
		template_uuid: string;
		/** A unique, human-readable name for the template. */
		name?: string;
		/** The template content used to render context blocks. */
		template?: string;
	};
	'debugLogs.enable': Record<string, never>;
	'graphs.clone': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
	};
	'graphs.create': {
		/** Experimental. Content policy additions for the graph. The graph binds the current project content policy plus these additions, and the binding does not change after creation. */
		content_policy?: ZepV4GraphContentPolicyRequestInput;
		/** A description of the graph. */
		description?: string;
		/** A display name for the graph. */
		name?: string;
		/** The graph's IANA time zone. */
		time_zone?: string;
	};
	'graphs.delete': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
	};
	'graphs.documentSummaries.list': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort key: uuid (default) or created_at */
		order_by?: ZepGraphsGraphUuidDocumentSummariesListPostParametersOrderByInput;
		/** Sort direction: asc or desc (default desc) */
		order?: ZepGraphsGraphUuidDocumentSummariesListPostParametersOrderInput;
		/** Filters that limit the items in the list. The operation description names the filter fields that the operation does not support. */
		filters?: ZepV4DocumentSummaryListFiltersInput;
	};
	'graphs.edges.add': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** When true, Zep compares each edge with graph edges and can merge a duplicate or invalidate a contradicted edge. This adds an LLM call per edge. The default is false. */
		deduplicate?: boolean;
		/** The edges to add to the graph. The request accepts 1 to 100 edges. */
		edges: Array<ZepV4EdgeInputInput>;
	};
	'graphs.edges.delete': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Edge UUID */
		edge_uuid: string;
	};
	'graphs.edges.get': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Edge UUID */
		edge_uuid: string;
	};
	'graphs.edges.list': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort key: uuid (default), created_at, or valid_at */
		order_by?: ZepGraphsGraphUuidEdgesListPostParametersOrderByInput;
		/** Sort direction: asc or desc (default desc) */
		order?: ZepGraphsGraphUuidEdgesListPostParametersOrderInput;
		/** Filters that limit the items in the list. The operation description names the filter fields that the operation does not support. */
		filters?: ZepV4EdgeListFiltersInput;
	};
	'graphs.edges.update': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Edge UUID */
		edge_uuid: string;
		/** Additional attributes to merge onto the edge; a key set to null is removed. */
		attributes?: ZepV4PatchEdgeRequestAttributesInput | null;
		/** The fact text describing the relationship between the source and target nodes. */
		fact?: string;
	};
	'graphs.episodes.add': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The episode content to add to the graph. */
		data: string;
		/** Groups this episode as a chunk of a document on the graph. */
		document_id?: string;
		/** Metadata to store on the episode. Max 10 keys. Values must be strings, numbers, booleans, or arrays of scalars. */
		metadata?: Record<string, ZepJsonValue>;
		/** The episode's reference time, used for temporal reasoning rather than ingestion time. Defaults to the ingestion time. */
		reference_time?: string;
		/** A description of the source of this episode. */
		source_description?: string;
		/** When true, prevents extraction of generic entity nodes that do not match the configured ontology. */
		strict_ontology?: boolean;
		/** The data format of the episode: text, json, or message. Defaults to text. */
		type?: ZepV4AddEpisodeRequestTypeInput;
	};
	'graphs.episodes.delete': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Episode UUID */
		episode_uuid: string;
	};
	'graphs.episodes.get': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Episode UUID */
		episode_uuid: string;
	};
	'graphs.episodes.getDebugLogs': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Episode UUID */
		episode_uuid: string;
	};
	'graphs.episodes.list': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort field */
		order_by?: ZepGraphsGraphUuidEpisodesListPostParametersOrderByInput;
		/** Sort direction: asc or desc */
		order?: ZepGraphsGraphUuidEpisodesListPostParametersOrderInput;
		/** Filters that limit the episodes in the list. */
		filters?: ZepV4EpisodeListFiltersInput;
	};
	'graphs.episodes.listIngestionTraces': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Episode UUID */
		episode_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'graphs.episodes.update': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Episode UUID */
		episode_uuid: string;
		/** Metadata to merge onto the episode; a key set to null is removed. Max 10 keys after the merge. Values must be strings, numbers, booleans, or arrays of scalars. */
		metadata?: ZepV4PatchEpisodeRequestMetadataInput | null;
	};
	'graphs.get': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
	};
	'graphs.getContentPolicy': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
	};
	'graphs.getContext': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Filters constraining which graph data can be selected for the context block. */
		filters?: ZepV4SearchFiltersInput;
		/** When true, includes the raw graph results selected for the context block. */
		include_results?: boolean;
		/** The maximum number of characters in the assembled context block. */
		max_characters?: number;
		/** The search query used to assemble the context block. */
		query: string;
		/** Adjusts result selection to favor more recent graph data. */
		recency_bias?: ZepV4GraphContextRequestRecencyBiasInput;
		/** The UUID of a context template used to render the context block. */
		template_uuid?: string;
	};
	'graphs.getInclusionRules': {
		/** Graph UUID */
		graph_uuid: string;
	};
	'graphs.getInstructions': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
	};
	'graphs.getKnowledge': {
		/** The UUID of the graph or its user. */
		graph_uuid: string;
	};
	'graphs.getObservationSteering': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
	};
	'graphs.getOntology': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
	};
	'graphs.getSubgraph': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum traversal depth from the seed nodes. Defaults to 1. */
		depth?: number;
		/** The edge orientation to follow during expansion: in, out, or both. Defaults to both. */
		direction?: ZepV4SubgraphRequestDirectionInput;
		/** Filters constraining the traversed edges and included nodes. */
		filters?: ZepV4SearchFiltersInput;
		/** The maximum number of edges in the response. Defaults to 200. */
		max_edges?: number;
		/** The maximum number of nodes in the response. Defaults to 100. */
		max_nodes?: number;
		/** The node UUIDs to expand from, in traversal-priority order. */
		seed_node_uuids: Array<string>;
	};
	'graphs.hyperedges.add': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Additional attributes to store on every member edge. */
		attributes?: Record<string, ZepJsonValue>;
		/** The member edges to create. Each pair becomes one edge carrying the shared fact. */
		edges: Array<ZepV4HyperedgeInputInput>;
		/** The time at which the fact was superseded or invalidated. */
		expired_at?: string;
		/** The natural-language fact, written onto every member edge. */
		fact: string;
		/** The time at which the fact stopped being true. */
		invalid_at?: string;
		/** Metadata attached to the episode created for this hyperedge. */
		metadata?: Record<string, ZepJsonValue>;
		/** The time at which the fact became true. */
		valid_at?: string;
	};
	'graphs.hyperedges.createEdge': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Hyperedge UUID */
		hyperedge_uuid: string;
		/** The name of the new member edge, in upper snake case. */
		name: string;
		/** The source node of the new member. */
		source_node: ZepV4EdgeNodeRefInput;
		/** The target node of the new member. */
		target_node: ZepV4EdgeNodeRefInput;
	};
	'graphs.hyperedges.delete': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Hyperedge UUID */
		hyperedge_uuid: string;
	};
	'graphs.hyperedges.deleteEdge': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Hyperedge UUID */
		hyperedge_uuid: string;
		/** Edge UUID */
		edge_uuid: string;
	};
	'graphs.hyperedges.get': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Hyperedge UUID */
		hyperedge_uuid: string;
	};
	'graphs.hyperedges.list': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort key: uuid or created_at */
		order_by?: ZepGraphsGraphUuidHyperedgesListPostParametersOrderByInput;
		/** Sort direction: asc or desc */
		order?: ZepGraphsGraphUuidHyperedgesListPostParametersOrderInput;
		/** Filters that limit the hyperedges in the list. */
		filters?: ZepV4HyperedgeListFiltersInput;
	};
	'graphs.hyperedges.update': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Hyperedge UUID */
		hyperedge_uuid: string;
		/** The natural-language fact, rewritten onto every member edge. */
		fact?: string;
	};
	'graphs.list': {
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort field */
		order_by?: ZepGraphsListPostParametersOrderByInput;
		/** asc or desc */
		order?: ZepGraphsListPostParametersOrderInput;
		/** Filters results to graphs whose name, description, or graph ID contains this text. */
		search?: string;
	};
	'graphs.listContentPolicyEvents': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Exact-match filters that limit the events in the list. */
		filters?: ZepV4ContentPolicyEventListFiltersInput;
	};
	'graphs.listMetadataKeys': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of keys per page. */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'graphs.lookup': {
		/** The developer-assigned graph ID to resolve to a UUID. Mutually exclusive with user_id and thread_id. */
		graph_id?: string;
		/** The developer-assigned thread ID to resolve to a UUID. Mutually exclusive with user_id and graph_id. */
		thread_id?: string;
		/** The developer-assigned user ID to resolve to a UUID. Mutually exclusive with thread_id and graph_id. */
		user_id?: string;
	};
	'graphs.nodes.add': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The nodes to add to the graph. */
		nodes: Array<ZepV4NodeInputInput>;
	};
	'graphs.nodes.delete': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Node UUID */
		node_uuid: string;
	};
	'graphs.nodes.get': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Node UUID */
		node_uuid: string;
	};
	'graphs.nodes.list': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort key: uuid (default), created_at, or degree */
		order_by?: ZepGraphsGraphUuidNodesListPostParametersOrderByInput;
		/** Sort direction: asc or desc (default desc) */
		order?: ZepGraphsGraphUuidNodesListPostParametersOrderInput;
		/** Filters that limit the items in the list. The operation description names the filter fields that the operation does not support. */
		filters?: ZepV4NodeListFiltersInput;
	};
	'graphs.nodes.listNeighbors': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Node UUID */
		node_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort field */
		order_by?: ZepGraphsGraphUuidNodesNodeUuidNeighborsPostParametersOrderByInput;
		/** Sort direction: asc or desc */
		order?: ZepGraphsGraphUuidNodesNodeUuidNeighborsPostParametersOrderInput;
		/** The edge orientation to follow from the node: in, out, or both. */
		direction?: ZepV4NeighborsRequestDirectionInput;
		/** Filters constraining the connecting edges and the neighbor nodes. */
		filters?: ZepV4SearchFiltersInput;
	};
	'graphs.nodes.update': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Node UUID */
		node_uuid: string;
		/** Additional attributes to merge onto the node; a key set to null is removed. */
		attributes?: ZepV4PatchNodeRequestAttributesInput | null;
		/** The node's name. */
		name?: string;
		/** A summary of the node. */
		summary?: string;
	};
	'graphs.observations.get': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Observation UUID */
		observation_uuid: string;
	};
	'graphs.observations.list': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort key: uuid (default) or created_at */
		order_by?: ZepGraphsGraphUuidObservationsListPostParametersOrderByInput;
		/** Sort direction: asc or desc (default desc) */
		order?: ZepGraphsGraphUuidObservationsListPostParametersOrderInput;
		/** Filters that limit the items in the list. The operation description names the filter fields that the operation does not support. */
		filters?: ZepV4ObservationListFiltersInput;
	};
	'graphs.query': {
		/** When true, a model also writes an answer from the retrieved records. The default is false: the response has the records and no answer. */
		generate_answer?: boolean;
		/** The graph UUIDs to query. The current release accepts one UUID. */
		graph_uuids: Array<string>;
		/** Optional caller guidance for the answer. The agent treats it as untrusted text. */
		guidance?: string;
		/** The retrieval mode. The default is fast. Fast mode is optimized for latency. It retrieves the context for multi-hop queries. The query runs at most 3 search rounds. A BYOM project needs a decision model for fast mode. A BYOC deployment needs a decision model (SystemOne or Gemini Decisions) for… */
		mode?: ZepV4GraphQueryModeInput;
		/** The natural-language query for the graph. */
		query: string;
		/** When true, return the retrieval calls as server-sent events. */
		stream: true;
	};
	'graphs.searchEdges': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** The search query. */
		query: string;
		/** Nodes used as BFS origins for graph-distance-aware retrieval. */
		bfs_origin_node_uuids?: Array<string>;
		/** The node to rank results by distance from. Required when reranker is node_distance. */
		center_node_uuid?: string;
		/** The default is false. When true, Zep removes low-quality results at the knee of the cross-encoder score curve. The filter never removes a result with a score of 0.9 or more. It keeps at least 5 results, or all results when fewer than 5 are available. The filter only removes results, so a page… */
		filter_low_quality_results?: boolean;
		/** Filters constraining which items are returned. */
		filters?: ZepV4EdgeSearchFiltersInput;
		/** The diversity weighting used for maximal marginal relevance reranking. Required when reranker is mmr. */
		mmr_lambda?: number;
		/** The reranking strategy applied to retrieved results. Defaults to rrf. */
		reranker?: ZepGraphitiRerankerInput;
	};
	'graphs.searchEpisodes': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** The search query. */
		query: string;
		/** Nodes used as BFS origins for graph-distance-aware retrieval. */
		bfs_origin_node_uuids?: Array<string>;
		/** The node to rank results by distance from. Required when reranker is node_distance. */
		center_node_uuid?: string;
		/** The default is false. When true, Zep removes low-quality results at the knee of the cross-encoder score curve. The filter never removes a result with a score of 0.9 or more. It keeps at least 5 results, or all results when fewer than 5 are available. The filter only removes results, so a page… */
		filter_low_quality_results?: boolean;
		/** Filters constraining which items are returned. */
		filters?: ZepV4EpisodeSearchFiltersInput;
		/** The diversity weighting used for maximal marginal relevance reranking. Required when reranker is mmr. */
		mmr_lambda?: number;
		/** The reranking strategy applied to retrieved results. Defaults to rrf. */
		reranker?: ZepGraphitiRerankerInput;
	};
	'graphs.searchNodes': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** The search query. */
		query: string;
		/** Nodes used as BFS origins for graph-distance-aware retrieval. */
		bfs_origin_node_uuids?: Array<string>;
		/** The node to rank results by distance from. Required when reranker is node_distance. */
		center_node_uuid?: string;
		/** The default is false. When true, Zep removes low-quality results at the knee of the cross-encoder score curve. The filter never removes a result with a score of 0.9 or more. It keeps at least 5 results, or all results when fewer than 5 are available. The filter only removes results, so a page… */
		filter_low_quality_results?: boolean;
		/** Filters constraining which items are returned. */
		filters?: ZepV4NodeSearchFiltersInput;
		/** The diversity weighting used for maximal marginal relevance reranking. Required when reranker is mmr. */
		mmr_lambda?: number;
		/** The reranking strategy applied to retrieved results. Defaults to rrf. */
		reranker?: ZepGraphitiRerankerInput;
	};
	'graphs.searchObservations': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** The search query. */
		query: string;
		/** Nodes used as BFS origins for graph-distance-aware retrieval. */
		bfs_origin_node_uuids?: Array<string>;
		/** The node to rank results by distance from. Required when reranker is node_distance. */
		center_node_uuid?: string;
		/** The default is false. When true, Zep removes low-quality results at the knee of the cross-encoder score curve. The filter never removes a result with a score of 0.9 or more. It keeps at least 5 results, or all results when fewer than 5 are available. The filter only removes results, so a page… */
		filter_low_quality_results?: boolean;
		/** Filters constraining which items are returned. */
		filters?: ZepV4ObservationSearchFiltersInput;
		/** The diversity weighting used for maximal marginal relevance reranking. Required when reranker is mmr. */
		mmr_lambda?: number;
		/** The reranking strategy applied to retrieved results. Defaults to rrf. */
		reranker?: ZepGraphitiRerankerInput;
	};
	'graphs.searchThreadSummaries': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** The search query. */
		query: string;
		/** Nodes used as BFS origins for graph-distance-aware retrieval. */
		bfs_origin_node_uuids?: Array<string>;
		/** The node to rank results by distance from. Required when reranker is node_distance. */
		center_node_uuid?: string;
		/** The default is false. When true, Zep removes low-quality results at the knee of the cross-encoder score curve. The filter never removes a result with a score of 0.9 or more. It keeps at least 5 results, or all results when fewer than 5 are available. The filter only removes results, so a page… */
		filter_low_quality_results?: boolean;
		/** Filters constraining which items are returned. */
		filters?: ZepV4ThreadSummarySearchFiltersInput;
		/** The diversity weighting used for maximal marginal relevance reranking. Required when reranker is mmr. */
		mmr_lambda?: number;
		/** The reranking strategy applied to retrieved results. Defaults to rrf. */
		reranker?: ZepGraphitiRerankerInput;
	};
	'graphs.setInclusionRules': {
		/** Graph UUID */
		graph_uuid: string;
		/** InclusionRules replaces the complete rule set at this scope. */
		inclusion_rules?: Array<ZepV4InclusionRuleInput>;
		/** Inherited identifies a graph that uses project defaults. */
		inherited?: boolean;
	};
	'graphs.setInstructions': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Whether this is the project's default value rather than an override set on this graph. */
		inherited?: boolean;
		/** The custom extraction instructions in effect at this scope, each with a name and text. */
		instructions?: Array<ZepModelsCustomInstructionInput>;
	};
	'graphs.setKnowledge': {
		/** The UUID of the graph or its user. */
		graph_uuid: string;
		/** The complete set of domain knowledge entries. An empty list clears the scope. */
		knowledge?: Array<ZepV4KnowledgeEntryInput>;
	};
	'graphs.setObservationSteering': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** Whether this is the project's default value rather than an override set on this graph. */
		inherited?: boolean;
		/** The natural-language instruction steering how observations are generated at this scope. */
		instruction?: string;
		/** The named observation types, each with a description, that generation should steer toward at this scope. */
		types?: Array<ZepModelsObservationTypeInput>;
	};
	'graphs.setOntology': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The edge type hierarchy. Omitted when the ontology has no edge subtypes. */
		edge_type_hierarchy?: ZepV4OntologyEdgeTypeHierarchyInput;
		/** The edge types defined in the ontology in effect at this scope. */
		edge_types?: Array<ZepV4EdgeTypeInput>;
		/** The entity type hierarchy. Omitted when the ontology has no entity subtypes. */
		entity_type_hierarchy?: ZepV4OntologyEntityTypeHierarchyInput;
		/** The entity types defined in the ontology in effect at this scope. */
		entity_types?: Array<ZepV4EntityTypeInput>;
		/** Whether this is the project's default value rather than an override set on this graph. */
		inherited?: boolean;
	};
	'graphs.threadSummaries.list': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort key: uuid (default) or created_at */
		order_by?: ZepGraphsGraphUuidThreadSummariesListPostParametersOrderByInput;
		/** Sort direction: asc or desc (default desc) */
		order?: ZepGraphsGraphUuidThreadSummariesListPostParametersOrderInput;
		/** Filters that limit the items in the list. The operation description names the filter fields that the operation does not support. */
		filters?: ZepV4ThreadSummaryListFiltersInput;
	};
	'graphs.update': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
		/** A description of the graph. */
		description?: string;
		/** The graph's display name. */
		name?: string;
		/** The graph's IANA time zone. */
		time_zone?: string;
	};
	'graphs.warm': {
		/** The UUID of the graph. For a user graph, you can also use the UUID of the user. */
		graph_uuid: string;
	};
	'lookup.developerIds': {
		/** Developer-assigned graph IDs to resolve to UUIDs. */
		graphs?: Array<string>;
		/** Developer-assigned thread IDs to resolve to UUIDs. */
		threads?: Array<string>;
		/** Developer-assigned user IDs to resolve to UUIDs. */
		users?: Array<string>;
	};
	'project.get': Record<string, never>;
	'project.getContentPolicy': Record<string, never>;
	'project.getContentPolicyRevision': {
		/** Revision UUID */
		revision_uuid: string;
	};
	'project.getInclusionRules': Record<string, never>;
	'project.getInstructions': Record<string, never>;
	'project.getKnowledge': Record<string, never>;
	'project.getObservationSteering': Record<string, never>;
	'project.getOntology': Record<string, never>;
	'project.getUserSummaryInstructions': Record<string, never>;
	'project.listContentPolicyRevisions': {
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'project.setContentPolicy': {
		/** The categories of the policy. Maximum 16. An empty list with no rules means no content policy. */
		categories?: Array<ZepV4ContentPolicyCategoryRequestInput>;
		/** The rules of the policy. Maximum 32. */
		rules?: Array<ZepV4ContentPolicyRuleRequestInput>;
	};
	'project.setInclusionRules': {
		/** InclusionRules replaces the complete rule set at this scope. */
		inclusion_rules?: Array<ZepV4InclusionRuleInput>;
		/** Inherited identifies a graph that uses project defaults. */
		inherited?: boolean;
	};
	'project.setInstructions': {
		/** Whether this is the project's default value rather than an override set on this graph. */
		inherited?: boolean;
		/** The custom extraction instructions in effect at this scope, each with a name and text. */
		instructions?: Array<ZepModelsCustomInstructionInput>;
	};
	'project.setKnowledge': {
		/** The complete set of domain knowledge entries. An empty list clears the scope. */
		knowledge?: Array<ZepV4KnowledgeEntryInput>;
	};
	'project.setObservationSteering': {
		/** Whether this is the project's default value rather than an override set on this graph. */
		inherited?: boolean;
		/** The natural-language instruction steering how observations are generated at this scope. */
		instruction?: string;
		/** The named observation types, each with a description, that generation should steer toward at this scope. */
		types?: Array<ZepModelsObservationTypeInput>;
	};
	'project.setOntology': {
		/** The edge type hierarchy. Omitted when the ontology has no edge subtypes. */
		edge_type_hierarchy?: ZepV4OntologyEdgeTypeHierarchyInput;
		/** The edge types defined in the ontology in effect at this scope. */
		edge_types?: Array<ZepV4EdgeTypeInput>;
		/** The entity type hierarchy. Omitted when the ontology has no entity subtypes. */
		entity_type_hierarchy?: ZepV4OntologyEntityTypeHierarchyInput;
		/** The entity types defined in the ontology in effect at this scope. */
		entity_types?: Array<ZepV4EntityTypeInput>;
		/** Whether this is the project's default value rather than an override set on this graph. */
		inherited?: boolean;
	};
	'project.setUserSummaryInstructions': {
		/** Whether this is the project's default value rather than an override set on this graph. */
		inherited?: boolean;
		/** The custom instructions used when generating a user's summary at this scope, each with a name and text. */
		instructions?: Array<ZepModelsUserInstructionInput>;
	};
	'project.update': {
		/** The project's IANA fallback time zone. Set to null to clear the existing value. */
		default_time_zone?: string;
		/** Set to true to enable hyperedge extraction. This setting cannot be disabled. A member needs project.edit. Project API keys receive 403 permission_denied. */
		hyperedges_enabled?: boolean;
		/** When true, episode reads on graphs with a content policy include the episodes that violated the policy. */
		include_policy_violating_episodes?: boolean;
	};
	'tasks.get': {
		/** Task UUID */
		task_uuid: string;
	};
	'tasks.list': {
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Return only the tasks with this status */
		status?: ZepTasksGetParametersStatusInput;
		/** Return only the tasks of this type */
		type?: ZepTasksGetParametersTypeInput;
	};
	'threads.create': {
		/** The UUID of the user this thread belongs to. */
		user_uuid: string;
	};
	'threads.delete': {
		/** Thread UUID */
		thread_uuid: string;
	};
	'threads.get': {
		/** Thread UUID */
		thread_uuid: string;
	};
	'threads.getContext': {
		/** Thread UUID */
		thread_uuid: string;
		/** Context template UUID */
		template_uuid?: string;
	};
	'threads.getSummary': {
		/** Thread UUID */
		thread_uuid: string;
	};
	'threads.list': {
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort field */
		order_by?: ZepThreadsGetParametersOrderByInput;
		/** asc or desc */
		order?: ZepThreadsGetParametersOrderInput;
		/** Filter by user UUID */
		user_uuid?: string;
	};
	'threads.listEpisodes': {
		/** Thread UUID */
		thread_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'threads.lookup': {
		/** The developer-assigned graph ID to resolve to a UUID. Mutually exclusive with user_id and thread_id. */
		graph_id?: string;
		/** The developer-assigned thread ID to resolve to a UUID. Mutually exclusive with user_id and graph_id. */
		thread_id?: string;
		/** The developer-assigned user ID to resolve to a UUID. Mutually exclusive with thread_id and graph_id. */
		user_id?: string;
	};
	'threads.messages.add': {
		/** Thread UUID */
		thread_uuid: string;
		/** Message roles to skip during graph extraction; the messages are still stored. */
		ignore_roles?: Array<string>;
		/** The messages to add to the thread. */
		messages: Array<ZepV4AddMessageInput>;
		/** When true, returns the context block for the thread's most recent messages. */
		return_context?: boolean;
		/** When true, prevents extraction of generic entity nodes that do not match the configured ontology. */
		strict_ontology?: boolean;
	};
	'threads.messages.get': {
		/** Thread UUID */
		thread_uuid: string;
		/** Message UUID */
		message_uuid: string;
	};
	'threads.messages.list': {
		/** Thread UUID */
		thread_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort field */
		order_by?: ZepThreadsThreadUuidMessagesGetParametersOrderByInput;
		/** Sort direction: asc or desc */
		order?: ZepThreadsThreadUuidMessagesGetParametersOrderInput;
	};
	'threads.messages.update': {
		/** Thread UUID */
		thread_uuid: string;
		/** Message UUID */
		message_uuid: string;
		/** Metadata to merge onto the message; a key set to null is removed. Max 10 keys after the merge. Values must be strings, numbers, booleans, or arrays of scalars. */
		metadata?: ZepV4PatchMessageRequestMetadataInput | null;
	};
	'traceConnections.create': {
		/** APIURL is an optional custom provider endpoint. */
		api_url?: string;
		/** Credential is the write-only provider credential. */
		credential?: string;
		/** Name is the connection name. */
		name?: string;
		/** Provider is the Braintrust or LangSmith provider. */
		provider?: ZepV4CreateTraceConnectionRequestProviderInput;
		/** RequestsPerMinute is the request rate limit from 1 to 60 per minute. */
		requests_per_minute?: number;
		/** RetentionDays is an optional retention window in days. */
		retention_days?: number;
	};
	'traceConnections.delete': {
		/** Trace connection UUID */
		connection_uuid: string;
	};
	'traceConnections.get': {
		/** Trace connection UUID */
		connection_uuid: string;
	};
	'traceConnections.getTrace': {
		/** Trace connection UUID */
		connection_uuid: string;
		/** Mapping is an optional mapping preview configuration. Example: {"task_family":{"source":"fixed","value":"support"}}. */
		mapping?: ZepV4TraceMappingInput;
		/** The developer supplies the project ID from the selected provider. */
		provider_project_id: string;
		/** TraceID is the provider trace identifier. */
		trace_id: string;
	};
	'traceConnections.list': {
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'traceConnections.listProjects': {
		/** Trace connection UUID */
		connection_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Provider page cursor */
		cursor?: string;
	};
	'traceConnections.listTraces': {
		/** Trace connection UUID */
		connection_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Filter contains provider trace filters. Example: {"started_after":"2026-01-01T00:00:00Z"}. */
		filter?: ZepV4TraceFilterInput;
		/** The developer supplies the project ID from the selected provider. */
		provider_project_id: string;
	};
	'traceConnections.update': {
		/** Trace connection UUID */
		connection_uuid: string;
		/** APIURL is the new custom provider endpoint, when supplied. A request that changes api_url must also include credential. */
		api_url?: string;
		/** Credential is the new write-only provider credential, when supplied. */
		credential?: string;
		/** Name is the new connection name, when supplied. */
		name?: string;
		/** RequestsPerMinute is the new request rate limit, when supplied. */
		requests_per_minute?: number;
		/** RetentionDays is the new retention window in days, when supplied. */
		retention_days?: number;
	};
	'traceConnections.verify': {
		/** Trace connection UUID */
		connection_uuid: string;
	};
	'userGroups.addMembers': {
		/** User group UUID */
		group_uuid: string;
		/** The UUIDs of the users to add or remove. */
		user_uuids: Array<string>;
	};
	'userGroups.attachPolicySet': {
		/** User group UUID */
		group_uuid: string;
		/** The UUID of the policy set to attach to the user group. */
		policy_set_uuid: string;
	};
	'userGroups.create': {
		/** A description of the user group. */
		description?: string;
		/** The name of the user group. */
		name: string;
	};
	'userGroups.delete': {
		/** User group UUID */
		group_uuid: string;
	};
	'userGroups.detachPolicySet': {
		/** User group UUID */
		group_uuid: string;
		/** Policy set UUID */
		policy_set_uuid: string;
	};
	'userGroups.get': {
		/** User group UUID */
		group_uuid: string;
	};
	'userGroups.list': {
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Filters results to items matching this free-text search term. */
		search?: string;
	};
	'userGroups.listMemberCandidates': {
		/** User group UUID */
		group_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Filters results to items matching this free-text search term. */
		search?: string;
	};
	'userGroups.listMembers': {
		/** User group UUID */
		group_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Filters results to items matching this free-text search term. */
		search?: string;
	};
	'userGroups.listPolicySets': {
		/** User group UUID */
		group_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'userGroups.removeMember': {
		/** User group UUID */
		group_uuid: string;
		/** User UUID */
		user_uuid: string;
	};
	'userGroups.removeMembers': {
		/** User group UUID */
		group_uuid: string;
		/** The UUIDs of the users to add or remove. */
		user_uuids: Array<string>;
	};
	'userGroups.update': {
		/** User group UUID */
		group_uuid: string;
		/** A description of the user group. */
		description?: string;
		/** The user group's current version, used to detect concurrent updates. */
		expected_version?: number;
		/** The name of the user group. */
		name?: string;
	};
	'users.create': {
		/** Experimental. Content policy additions for the user's graph. The graph binds the current project content policy plus these additions, and the binding does not change after creation. */
		content_policy?: ZepV4GraphContentPolicyRequestInput;
		/** When true, disables the default ontology for the user's graph. */
		disable_default_ontology?: boolean;
		/** The email address of the user. */
		email?: string;
		/** The user's first name. */
		first_name?: string;
		/** The user's last name. */
		last_name?: string;
		/** Metadata to store on the user. */
		metadata?: Record<string, ZepJsonValue>;
		/** The user's IANA time zone. */
		time_zone?: string;
		/** An optional external identity identifier, such as an identity-provider subject claim. Zep uses it to match an identity-provider sign-in to this user. It is not an address; use uuid to address the user in v4. It is unique within the project, can contain at most 500 characters, and cannot be… */
		user_id?: string;
	};
	'users.delete': {
		/** User UUID */
		user_uuid: string;
	};
	'users.get': {
		/** User UUID */
		user_uuid: string;
	};
	'users.getByEmail': {
		/** The user's email address. Matching ignores case and leading and trailing whitespace. */
		email: string;
	};
	'users.getNode': {
		/** User UUID */
		user_uuid: string;
	};
	'users.getSummaryInstructions': {
		/** User UUID */
		user_uuid: string;
	};
	'users.list': {
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
		/** Sort field */
		order_by?: ZepUsersListPostParametersOrderByInput;
		/** asc or desc */
		order?: ZepUsersListPostParametersOrderInput;
		/** Filters results to users whose user ID, email, or name contains this text. */
		search?: string;
	};
	'users.listUserGroups': {
		/** User UUID */
		user_uuid: string;
		/** The maximum number of items in one page. The SDK method returns a pager. In Python, `.items` holds only the first page. In TypeScript, `.data` holds only the first page. To read every page, iterate the pager: use `for` or `list(...)` in Python, or `for await` in TypeScript. In Go, the method… */
		page_size?: number;
		/** Opaque page cursor */
		cursor?: string;
	};
	'users.lookup': {
		/** The developer-assigned graph ID to resolve to a UUID. Mutually exclusive with user_id and thread_id. */
		graph_id?: string;
		/** The developer-assigned thread ID to resolve to a UUID. Mutually exclusive with user_id and graph_id. */
		thread_id?: string;
		/** The developer-assigned user ID to resolve to a UUID. Mutually exclusive with thread_id and graph_id. */
		user_id?: string;
	};
	'users.setSummaryInstructions': {
		/** User UUID */
		user_uuid: string;
		/** Whether this is the project's default value rather than an override set on this graph. */
		inherited?: boolean;
		/** The custom instructions used when generating a user's summary at this scope, each with a name and text. */
		instructions?: Array<ZepModelsUserInstructionInput>;
	};
	'users.update': {
		/** User UUID */
		user_uuid: string;
		/** When true, disables the default ontology for the user's graph. */
		disable_default_ontology?: boolean;
		/** The email address of the user. */
		email?: string;
		/** The user's first name. */
		first_name?: string;
		/** The user's last name. */
		last_name?: string;
		/** Metadata to merge onto the user; a key set to null is removed. */
		metadata?: ZepV4PatchUserRequestMetadataInput | null;
		/** The user's IANA time zone. */
		time_zone?: string;
	};
};

export type ZepOperationOutputs = {
	'agents.create': ZepV4Agent;
	'agents.declareBreakingChange': ZepV4AgentBreakingChange;
	'agents.delete': ZepV4AgentDeleteResult;
	'agents.get': ZepV4Agent;
	'agents.getContext': ZepV4AgentContext;
	'agents.learning.get': ZepV4AgentLearningState;
	'agents.learning.listRuns': ZepV4PageV4AgentSkillCompilationOutcome;
	'agents.list': ZepV4AgentPage;
	'agents.literalPolicy.get': ZepV4AgentLiteralPolicy;
	'agents.literalPolicy.update': ZepV4AgentLiteralPolicy;
	'agents.planSplit': ZepV4AgentSplitPlan;
	'agents.skillCandidates.evaluate': ZepV4AgentSkillCandidateEvaluation;
	'agents.skillCandidates.get': ZepV4AgentSkillCandidateReview;
	'agents.skillCandidates.list': ZepV4PageV4AgentSkillCandidateReviewSummary;
	'agents.skillPublications.lookup': ZepV4AgentSkillPublicationLineage;
	'agents.skills.approve': ZepV4AgentSkillAdmissionDecision;
	'agents.skills.create': ZepV4AgentSkill;
	'agents.skills.createVersion': ZepV4AgentSkillVersion;
	'agents.skills.evaluations.create': ZepV4AgentSkillEvaluation;
	'agents.skills.evidence.list': ZepV4PageV4AgentSkillEvidence;
	'agents.skills.get': ZepV4AgentSkill;
	'agents.skills.getPublication': ZepV4AgentSkillPublicationLineage;
	'agents.skills.importPackage': ZepV4Task;
	'agents.skills.list': ZepV4PageV4AgentSkillSearchHit;
	'agents.skills.relations.list': ZepV4PageV4AgentSkillRelationship;
	'agents.skills.retire': ZepV4AgentSkill;
	'agents.skills.search': ZepV4AgentSkillSearchResponse;
	'agents.skills.uses.addOutcome': ZepV4AgentSkillUseOutcome;
	'agents.skills.uses.create': ZepV4AgentSkillUse;
	'agents.skills.versions.compare': ZepV4AgentSkillVersionComparison;
	'agents.skills.versions.exports.create': ZepV4Task;
	'agents.skills.versions.exports.get': FileOutput;
	'agents.skills.versions.get': ZepV4AgentSkillVersion;
	'agents.skills.versions.list': ZepV4PageV4AgentSkillVersion;
	'agents.skills.versions.restore': ZepV4AgentSkillVersion;
	'agents.taskFamilies.list': ZepV4AgentTaskFamilyDescriptorPage;
	'agents.taskFamilies.rename': ZepV4RenameAgentTaskFamilyResponse;
	'agents.traceImports.create': ZepV4TraceImportCreateResult;
	'agents.traceImports.delete': ZepV4Task;
	'agents.traceImports.get': ZepV4TraceImport;
	'agents.traceImports.list': ZepV4TraceImportPage;
	'agents.traceImports.pause': ZepV4TraceImport;
	'agents.traceImports.resume': ZepV4TraceImport;
	'agents.traceImports.runs.create': ZepV4Task;
	'agents.traceImports.runs.get': ZepV4TraceImportRun;
	'agents.traceImports.runs.items.list': ZepV4TraceImportRunItemPage;
	'agents.traceImports.runs.list': ZepV4TraceImportRunPage;
	'agents.traceImports.update': ZepV4TraceImport;
	'agents.traces.abandon': ZepV4AgentTraceFinalizationResult;
	'agents.traces.appendEvent': ZepV4AgentTraceEvent;
	'agents.traces.close': ZepV4AgentTraceFinalizationResult;
	'agents.traces.correctTaskFamily': ZepV4AgentTraceFinalizationResult;
	'agents.traces.create': ZepV4AgentTrace;
	'agents.traces.delete': ZepV4AgentTraceSourceDeletionResult;
	'agents.traces.deleteEvent': ZepV4AgentTraceSourceDeletionResult;
	'agents.traces.get': ZepV4AgentTrace;
	'agents.traces.getSummary': ZepV4AgentTraceSummaryVersion;
	'agents.traces.list': ZepV4AgentTracePage;
	'agents.traces.listEvents': ZepV4AgentTraceEventPage;
	'agents.traces.listSummaryVersions': ZepV4AgentTraceSummaryPage;
	'agents.traces.reopen': ZepV4AgentTrace;
	'agents.traces.update': ZepV4AgentTrace;
	'agents.update': ZepV4Agent;
	'agents.verifiers.get': ZepV4AgentVerifier;
	'agents.verifiers.invalidateEvidence': ZepV4AgentVerifierEvidenceInvalidationResult;
	'agents.verifiers.list': ZepV4PageV4AgentVerifier;
	'agents.verifiers.revoke': ZepV4AgentVerifier;
	'agents.verifiers.update': ZepV4AgentVerifier;
	'batches.addItems': ZepV4BatchItemsResponse;
	'batches.create': ZepV4Batch;
	'batches.delete': Record<string, ZepJsonValue>;
	'batches.get': ZepV4Batch;
	'batches.list': ZepV4BatchPage;
	'batches.listItems': ZepV4BatchItemPage;
	'batches.process': ZepV4ProcessBatchResult;
	'contextTemplates.create': ZepV4ContextTemplate;
	'contextTemplates.delete': Record<string, ZepJsonValue>;
	'contextTemplates.get': ZepV4ContextTemplate;
	'contextTemplates.list': ZepV4ContextTemplatePage;
	'contextTemplates.update': ZepV4ContextTemplate;
	'debugLogs.enable': ZepV4DebugLoggingEnablement;
	'graphs.clone': ZepV4CloneGraphResult;
	'graphs.create': ZepV4Graph;
	'graphs.delete': ZepV4GraphDeleteResult;
	'graphs.documentSummaries.list': ZepV4DocumentSummaryPage;
	'graphs.edges.add': ZepV4AddEdgesResult;
	'graphs.edges.delete': ZepV4AsyncResult;
	'graphs.edges.get': ZepV4Edge;
	'graphs.edges.list': ZepV4EdgePage;
	'graphs.edges.update': ZepV4Edge;
	'graphs.episodes.add': ZepV4AddEpisodeResult;
	'graphs.episodes.delete': ZepV4AsyncResult;
	'graphs.episodes.get': ZepV4Episode;
	'graphs.episodes.getDebugLogs': ZepV4EpisodeDebugLog;
	'graphs.episodes.list': ZepV4EpisodePage;
	'graphs.episodes.listIngestionTraces': ZepV4IngestionTracePage;
	'graphs.episodes.update': ZepV4Episode;
	'graphs.get': ZepV4Graph;
	'graphs.getContentPolicy': ZepV4GraphContentPolicy;
	'graphs.getContext': ZepV4GraphContextResponse;
	'graphs.getInclusionRules': ZepV4InclusionRules;
	'graphs.getInstructions': ZepV4Instructions;
	'graphs.getKnowledge': ZepV4KnowledgeResponse;
	'graphs.getObservationSteering': ZepV4ObservationSteering;
	'graphs.getOntology': ZepV4Ontology;
	'graphs.getSubgraph': ZepV4SubgraphResponse;
	'graphs.hyperedges.add': ZepV4AddHyperedgeResult;
	'graphs.hyperedges.createEdge': ZepV4AddHyperedgeEdgeResult;
	'graphs.hyperedges.delete': ZepV4AsyncResult;
	'graphs.hyperedges.deleteEdge': ZepV4AsyncResult;
	'graphs.hyperedges.get': ZepV4Hyperedge;
	'graphs.hyperedges.list': ZepV4HyperedgePage;
	'graphs.hyperedges.update': ZepV4Hyperedge;
	'graphs.list': ZepV4GraphPage;
	'graphs.listContentPolicyEvents': ZepV4ContentPolicyEventPage;
	'graphs.listMetadataKeys': ZepV4GraphMetadataKeyList;
	'graphs.lookup': ZepV4Graph;
	'graphs.nodes.add': ZepV4AddNodesResult;
	'graphs.nodes.delete': ZepV4AsyncResult;
	'graphs.nodes.get': ZepV4Node;
	'graphs.nodes.list': ZepV4NodePage;
	'graphs.nodes.listNeighbors': ZepV4NeighborPage;
	'graphs.nodes.update': ZepV4Node;
	'graphs.observations.get': ZepV4Observation;
	'graphs.observations.list': ZepV4ObservationPage;
	'graphs.query': {
		/** The response body as text. */
		text: string;
		/** The content type Zep answered with. */
		contentType: string | null;
	};
	'graphs.searchEdges': ZepV4EdgePage;
	'graphs.searchEpisodes': ZepV4EpisodePage;
	'graphs.searchNodes': ZepV4NodePage;
	'graphs.searchObservations': ZepV4ObservationPage;
	'graphs.searchThreadSummaries': ZepV4ThreadSummaryPage;
	'graphs.setInclusionRules': ZepV4InclusionRules;
	'graphs.setInstructions': ZepV4Instructions;
	'graphs.setKnowledge': ZepV4KnowledgeResponse;
	'graphs.setObservationSteering': ZepV4ObservationSteering;
	'graphs.setOntology': ZepV4Ontology;
	'graphs.threadSummaries.list': ZepV4ThreadSummaryPage;
	'graphs.update': ZepV4Graph;
	'graphs.warm': ZepV4AsyncResult;
	'lookup.developerIds': ZepV4LookupBatchResponse;
	'project.get': ZepV4Project;
	'project.getContentPolicy': ZepV4ContentPolicy;
	'project.getContentPolicyRevision': ZepV4ContentPolicy;
	'project.getInclusionRules': ZepV4InclusionRules;
	'project.getInstructions': ZepV4Instructions;
	'project.getKnowledge': ZepV4KnowledgeResponse;
	'project.getObservationSteering': ZepV4ObservationSteering;
	'project.getOntology': ZepV4Ontology;
	'project.getUserSummaryInstructions': ZepV4UserSummaryInstructions;
	'project.listContentPolicyRevisions': ZepV4ContentPolicyRevisionPage;
	'project.setContentPolicy': ZepV4ContentPolicy;
	'project.setInclusionRules': ZepV4InclusionRules;
	'project.setInstructions': ZepV4Instructions;
	'project.setKnowledge': ZepV4KnowledgeResponse;
	'project.setObservationSteering': ZepV4ObservationSteering;
	'project.setOntology': ZepV4Ontology;
	'project.setUserSummaryInstructions': ZepV4UserSummaryInstructions;
	'project.update': ZepV4Project;
	'tasks.get': ZepV4Task;
	'tasks.list': ZepV4TaskPage;
	'threads.create': ZepV4Thread;
	'threads.delete': ZepV4ThreadDeleteResult;
	'threads.get': ZepV4Thread;
	'threads.getContext': ZepV4ThreadContextResponse;
	'threads.getSummary': ZepV4ThreadSummary;
	'threads.list': ZepV4ThreadPage;
	'threads.listEpisodes': ZepV4EpisodePage;
	'threads.lookup': ZepV4Thread;
	'threads.messages.add': ZepV4AddMessagesResult;
	'threads.messages.get': ZepV4Message;
	'threads.messages.list': ZepV4MessagePage;
	'threads.messages.update': ZepV4Message;
	'traceConnections.create': ZepV4TraceConnection;
	'traceConnections.delete': Record<string, ZepJsonValue>;
	'traceConnections.get': ZepV4TraceConnection;
	'traceConnections.getTrace': ZepV4SourceTraceResponse;
	'traceConnections.list': ZepV4TraceConnectionPage;
	'traceConnections.listProjects': ZepV4TraceProviderProjectPage;
	'traceConnections.listTraces': ZepV4SourceTracePage;
	'traceConnections.update': ZepV4TraceConnection;
	'traceConnections.verify': ZepV4TraceConnection;
	'userGroups.addMembers': ZepV4MembershipMutationResult;
	'userGroups.attachPolicySet': ZepV4PolicySetSummaryList;
	'userGroups.create': ZepV4UserGroup;
	'userGroups.delete': Record<string, ZepJsonValue>;
	'userGroups.detachPolicySet': Record<string, ZepJsonValue>;
	'userGroups.get': ZepV4UserGroup;
	'userGroups.list': ZepV4UserGroupPage;
	'userGroups.listMemberCandidates': ZepV4UserPage;
	'userGroups.listMembers': ZepV4UserPage;
	'userGroups.listPolicySets': ZepV4PolicySetSummaryPage;
	'userGroups.removeMember': Record<string, ZepJsonValue>;
	'userGroups.removeMembers': ZepV4MembershipMutationResult;
	'userGroups.update': ZepV4UserGroup;
	'users.create': ZepV4User;
	'users.delete': ZepV4UserDeleteResult;
	'users.get': ZepV4User;
	'users.getByEmail': ZepV4User;
	'users.getNode': ZepV4Node;
	'users.getSummaryInstructions': ZepV4UserSummaryInstructions;
	'users.list': ZepV4UserPage;
	'users.listUserGroups': ZepV4UserGroupPage;
	'users.lookup': ZepV4User;
	'users.setSummaryInstructions': ZepV4UserSummaryInstructions;
	'users.update': ZepV4User;
};
