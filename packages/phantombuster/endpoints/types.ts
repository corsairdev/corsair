import { z } from 'zod';

// Shared schemas

export const PhantomBusterAgentStatusSchema = z.enum([
	'idle',
	'running',
	'launching',
	'error',
]);
export type PhantomBusterAgentStatus = z.infer<
	typeof PhantomBusterAgentStatusSchema
>;

// Agent schemas

const PhantomBusterAgentSchema = z
	.object({
		id: z.string(),
		// docs (/agents/fetch-all): name is nullable and not guaranteed.
		name: z.string().nullable().optional(),
		scriptId: z.string().nullable().optional(),
		scriptName: z.string().nullable().optional(),
		status: PhantomBusterAgentStatusSchema.optional(),
		nbLaunches: z.number().int().optional(),
		fileMgmt: z.string().optional(),
		fileMgmtValue: z.number().optional(),
		launchType: z.string().optional(),
		launchTimes: z.array(z.string()).optional(),
		launchTimezone: z.string().nullable().optional(),
		cronString: z.string().nullable().optional(),
		loadChrome: z.boolean().optional(),
		disableWebSecurity: z.boolean().optional(),
		ignoreSslErrors: z.boolean().optional(),
		// unknown: Phantom argument values are free-form per-script JSON (docs: string or plain object), validated by zod.
		argument: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export type PhantomBusterAgent = z.infer<typeof PhantomBusterAgentSchema>;

// fetchAllAgents — docs: GET /agents/fetch-all, no params, returns array.
const FetchAllAgentsInputSchema = z.object({});
export type FetchAllAgentsInput = z.infer<typeof FetchAllAgentsInputSchema>;

const FetchAllAgentsResponseSchema = z.array(PhantomBusterAgentSchema);
export type FetchAllAgentsResponse = z.infer<
	typeof FetchAllAgentsResponseSchema
>;

// fetchAgent
const FetchAgentInputSchema = z.object({
	/** The agent ID. */
	id: z.string().min(1),
});
export type FetchAgentInput = z.infer<typeof FetchAgentInputSchema>;

// docs (/agents/fetch): response is the flat agent object itself
// (IAgentFetch) — NOT wrapped in {agent}. Only id is guaranteed.
const FetchAgentResponseSchema = z
	.object({
		id: z.string(),
		scriptOrgName: z.string().nullable().optional(),
		scriptId: z.string().nullable().optional(),
		script: z.string().nullable().optional(),
		branch: z.string().nullable().optional(),
		environment: z.enum(['staging', 'release']).nullable().optional(),
		// docs: argument is a JSON string here (nullable).
		argument: z.string().nullable().optional(),
		lastEndType: z
			.enum([
				'finished',
				'killed',
				'global timeout',
				'org timeout',
				'agent timeout',
				'unknown',
				'no log timeout',
			])
			.nullable()
			.optional(),
	})
	.loose();
export type FetchAgentResponse = z.infer<typeof FetchAgentResponseSchema>;

// saveAgent — docs: POST /agents/save, all optional; launchType enum is
// manually | repeatedly | once | after agent.
const SaveAgentInputSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().max(100).optional(),
		org: z.string().optional(),
		script: z.string().optional(),
		branch: z.string().min(1).max(50).nullable().optional(),
		environment: z.enum(['staging', 'release']).nullable().optional(),
		// unknown: save-time argument is free-form per-script JSON (docs: string or plain object), validated by zod.
		argument: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.optional(),
		launchType: z
			.enum(['manually', 'repeatedly', 'once', 'after agent'])
			.optional(),
		launchTimes: z.array(z.string()).optional(),
		launchTimezone: z.string().optional(),
		cronString: z.string().nullable().optional(),
		fileMgmt: z.enum(['folders', 'mix', 'delete']).nullable().optional(),
		fileMgmtValue: z.number().optional(),
		loadChrome: z.boolean().optional(),
		disableWebSecurity: z.boolean().optional(),
		ignoreSslErrors: z.boolean().optional(),
	})
	.loose();
export type SaveAgentInput = z.infer<typeof SaveAgentInputSchema>;

const SaveAgentResponseSchema = z.object({
	id: z.string(),
});
export type SaveAgentResponse = z.infer<typeof SaveAgentResponseSchema>;

// deleteAgent
const DeleteAgentInputSchema = z.object({
	/** The agent ID to delete. */
	id: z.string().min(1),
});
export type DeleteAgentInput = z.infer<typeof DeleteAgentInputSchema>;

// docs (/agents/delete): 200 carries no response schema.
const DeleteAgentResponseSchema = z.object({}).loose();
export type DeleteAgentResponse = z.infer<typeof DeleteAgentResponseSchema>;

// launchAgent — docs: POST /agents/launch, required id; argument/arguments/
// bonusArgument are string-or-object; saveArgument(s), manualLaunch,
// maxInstanceCount are optional. No manualCookieSession in the docs.
const LaunchAgentInputSchema = z.object({
	id: z.string().min(1),
	// unknown: launch-time argument is free-form per-script JSON (docs: string or plain object), validated by zod.
	argument: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
	// unknown: alias of argument, free-form per-script JSON, validated by zod.
	arguments: z
		.union([z.string(), z.record(z.string(), z.unknown())])
		.optional(),
	// unknown: single-use bonus argument merged with argument, free-form JSON, validated by zod.
	bonusArgument: z
		.union([z.string(), z.record(z.string(), z.unknown())])
		.optional(),
	saveArgument: z.boolean().optional(),
	saveArguments: z.boolean().optional(),
	manualLaunch: z.boolean().optional(),
	maxInstanceCount: z.number().int().min(1).optional(),
});
export type LaunchAgentInput = z.infer<typeof LaunchAgentInputSchema>;

const LaunchAgentResponseSchema = z
	.object({
		containerId: z.string().optional(),
	})
	.loose();
export type LaunchAgentResponse = z.infer<typeof LaunchAgentResponseSchema>;

// stopAgent — docs (/agents/stop): required id plus four optional flags.
const StopAgentInputSchema = z.object({
	/** The agent ID to stop. */
	id: z.string().min(1),
	/** If true, tries to softly abort the agent. */
	softAbort: z.boolean().optional(),
	/** If true, slave agents will recursively be stopped. */
	cascadeToAllSlaves: z.boolean().optional(),
	/** If true, disables the next scheduled "launch soon" of the agent. */
	dontLaunchSoon: z.boolean().optional(),
	/** If true, the agent will switch to manual launch. */
	switchToManualLaunch: z.boolean().optional(),
});
export type StopAgentInput = z.infer<typeof StopAgentInputSchema>;

const StopAgentResponseSchema = z
	.object({
		containerId: z.string().optional(),
	})
	.loose();
export type StopAgentResponse = z.infer<typeof StopAgentResponseSchema>;

// fetchAgentOutput — docs: GET /agents/fetch-output, required agent id;
// incremental pagination via fromOutputPos / prevContainerId / prevStatus /
// prevRuntimeEventIndex. Response requires status/isAgentRunning/canSoftAbort.
const FetchAgentOutputInputSchema = z.object({
	/** Id of the agent to fetch output from. */
	id: z.string().min(1),
	/** If set, the returned output will start from the specified position. */
	fromOutputPos: z.number().optional(),
	/** If set, output is retrieved from the container after this id. */
	prevContainerId: z.string().min(1).optional(),
	/** Previously retrieved status, for incremental polling. */
	prevStatus: z
		.enum([
			'starting',
			'running',
			'finished',
			'unknown',
			'launch error',
			'never launched',
		])
		.optional(),
	/** Runtime events are returned starting from this index. */
	prevRuntimeEventIndex: z.number().optional(),
});
export type FetchAgentOutputInput = z.infer<typeof FetchAgentOutputInputSchema>;

const FetchAgentOutputResponseSchema = z
	.object({
		containerId: z.string().optional(),
		status: z.enum([
			'starting',
			'running',
			'finished',
			'unknown',
			'launch error',
			'never launched',
		]),
		output: z.string().optional(),
		outputPos: z.number().optional(),
		mostRecentEndedAt: z.number().optional(),
		progress: z.number().optional(),
		progressLabel: z.string().optional(),
		isAgentRunning: z.boolean(),
		canSoftAbort: z.boolean(),
	})
	.loose();
export type FetchAgentOutputResponse = z.infer<
	typeof FetchAgentOutputResponseSchema
>;

//   Container schemas

const PhantomBusterContainerSchema = z
	.object({
		id: z.string(),
		agentId: z.string().optional(),
		status: z.string().optional(),
		exitCode: z.number().nullable().optional(),
		duration: z.number().nullable().optional(),
		startTime: z.number().nullable().optional(),
		endTime: z.number().nullable().optional(),
		output: z.string().nullable().optional(),
		resultObject: z.string().nullable().optional(),
	})
	.loose();

export type PhantomBusterContainer = z.infer<
	typeof PhantomBusterContainerSchema
>;

// fetchAllContainers — docs: GET /containers/fetch-all, required agentId;
// optional beforeEndedAt/limit/mode/withRuntimeEvents. Response requires
// maxLimitReached + containers.
const FetchAllContainersInputSchema = z.object({
	/** The agent ID to fetch containers for. */
	agentId: z.string().min(1),
	beforeEndedAt: z.string().min(1).optional(),
	limit: z.string().min(1).optional(),
	mode: z.enum(['all', 'finalized']).optional(),
	withRuntimeEvents: z.string().min(1).optional(),
});
export type FetchAllContainersInput = z.infer<
	typeof FetchAllContainersInputSchema
>;

const FetchAllContainersResponseSchema = z
	.object({
		maxLimitReached: z.boolean(),
		containers: z.array(PhantomBusterContainerSchema),
	})
	.loose();
export type FetchAllContainersResponse = z.infer<
	typeof FetchAllContainersResponseSchema
>;

// fetchContainer — docs: GET /containers/fetch, required id; response is the
// container object itself (not wrapped).
const FetchContainerInputSchema = z.object({
	/** The container ID. */
	id: z.string().min(1),
	withResultObject: z.string().min(1).optional(),
	withOutput: z.string().min(1).optional(),
	withRuntimeEvents: z.string().min(1).optional(),
	withNewerAndOlderContainerId: z.string().min(1).optional(),
});
export type FetchContainerInput = z.infer<typeof FetchContainerInputSchema>;

const FetchContainerResponseSchema = PhantomBusterContainerSchema;
export type FetchContainerResponse = z.infer<
	typeof FetchContainerResponseSchema
>;

// fetchContainerOutput — docs: GET /containers/fetch-output, required id;
// optional mode json|raw (omitted = json).
const FetchContainerOutputInputSchema = z.object({
	/** The container ID. */
	id: z.string().min(1),
	mode: z.enum(['json', 'raw']).optional(),
});
export type FetchContainerOutputInput = z.infer<
	typeof FetchContainerOutputInputSchema
>;

const FetchContainerOutputResponseSchema = z
	.object({
		output: z.string().nullable().optional(),
	})
	.loose();
export type FetchContainerOutputResponse = z.infer<
	typeof FetchContainerOutputResponseSchema
>;

// fetchContainerResultObject
const FetchContainerResultObjectInputSchema = z.object({
	/** The container ID. */
	id: z.string().min(1),
});
export type FetchContainerResultObjectInput = z.infer<
	typeof FetchContainerResultObjectInputSchema
>;

const FetchContainerResultObjectResponseSchema = z
	.object({
		resultObject: z.string().nullable().optional(),
	})
	.loose();
export type FetchContainerResultObjectResponse = z.infer<
	typeof FetchContainerResultObjectResponseSchema
>;

// ── Users schemas ─────────────────────────────────────────────────────────────

// fetchMe — docs: GET /users/fetch-me, optional detailedOrgId/
// withCustomPrompts; response requires sessionId and nests the user record.
const FetchMeInputSchema = z.object({
	/** If set, the corresponding detailedOrg will be returned. */
	detailedOrgId: z.string().min(1).optional(),
	/** If true, includes custom prompt fields in the response. */
	withCustomPrompts: z.string().min(1).optional(),
});
export type FetchMeInput = z.infer<typeof FetchMeInputSchema>;

const FetchMeUserSchema = z
	.object({
		id: z.string(),
		email: z.string(),
		firstName: z.string(),
		lastName: z.string(),
		newsletter: z.boolean(),
		isEmailValidated: z.boolean(),
		createdAt: z.number(),
	})
	.loose();

const FetchMeResponseSchema = z
	.object({
		sessionId: z.string(),
		zendeskToken: z.string().optional(),
		user: FetchMeUserSchema.optional(),
	})
	.loose();
export type FetchMeResponse = z.infer<typeof FetchMeResponseSchema>;

// ── Org schemas ───────────────────────────────────────────────────────────────

// fetchOrg — docs (/orgs/fetch): optional with* flags include extra blocks.
const FetchOrgInputSchema = z.object({
	/** If set, the organization's globalObject is returned. */
	withGlobalObject: z.string().min(1).optional(),
	/** If set, the organization's proxies are returned. */
	withProxies: z.string().min(1).optional(),
	/** If set, the organization's CRM integrations are returned. */
	withCrmIntegrations: z.string().min(1).optional(),
	/** If set, the organization's custom prompt is returned. */
	withCustomPrompts: z.string().min(1).optional(),
});
export type FetchOrgInput = z.infer<typeof FetchOrgInputSchema>;

const FetchOrgResponseSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();
export type FetchOrgResponse = z.infer<typeof FetchOrgResponseSchema>;

// fetchOrgResources — docs (/orgs/fetch-resources): quota/usage object.
// Only documented quota fields are listed; all optional + loose.
const FetchOrgResourcesInputSchema = z.object({});
export type FetchOrgResourcesInput = z.infer<
	typeof FetchOrgResourcesInputSchema
>;

const FetchOrgResourcesResponseSchema = z
	.object({
		dailyExecutionTime: z.number().optional(),
		dailyMail: z.number().optional(),
		dailyCaptcha: z.number().optional(),
		dailyDiscoveredMail: z.number().optional(),
		dailyAiCredit: z.number().optional(),
		dailySerpCredits: z.number().optional(),
		monthlyExecutionTime: z.number().optional(),
		monthlyMail: z.number().optional(),
		monthlyCaptcha: z.number().optional(),
		monthlyDiscoveredMail: z.number().optional(),
		monthlyAiCredit: z.number().optional(),
		monthlySerpCredits: z.number().optional(),
		s3Storage: z.number().optional(),
		agentCount: z.number().optional(),
		planName: z.string().optional(),
		dailyResourceNextResetAt: z.number().optional(),
		monthlyResourceNextResetAt: z.number().optional(),
		planShouldCancelAt: z.number().nullable().optional(),
	})
	.loose();
export type FetchOrgResourcesResponse = z.infer<
	typeof FetchOrgResourcesResponseSchema
>;

// ── Leads schemas (docs: linkedinProfileUrl is the required key; bulk max 20;
// save-many returns a per-lead success/error array, not a count) ─────────────

const PhantomBusterLeadSchema = z
	.object({
		/** LinkedIn profile URL — the required key for a lead. */
		linkedinProfileUrl: z.string().min(1),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		companyName: z.string().optional(),
	})
	.loose();

// saveLead
const SaveLeadInputSchema = z.object({
	lead: PhantomBusterLeadSchema,
});
export type SaveLeadInput = z.infer<typeof SaveLeadInputSchema>;

// docs (/org-storage/leads/save): response requires id + linkedinProfileSlug,
// optionally reports isCreation.
const SaveLeadResponseSchema = z
	.object({
		id: z.string().optional(),
		linkedinProfileSlug: z.string().optional(),
		isCreation: z.boolean().optional(),
	})
	.loose();
export type SaveLeadResponse = z.infer<typeof SaveLeadResponseSchema>;

// saveLeads (bulk) — docs: min 1, max 20 per request.
const SaveLeadsInputSchema = z.object({
	leads: z.array(PhantomBusterLeadSchema).min(1).max(20),
});
export type SaveLeadsInput = z.infer<typeof SaveLeadsInputSchema>;

const SaveLeadsItemSchema = z.union([
	z
		.object({
			linkedinProfileUrl: z.string(),
			status: z.literal('success'),
			isCreation: z.boolean(),
		})
		.loose(),
	z
		.object({
			linkedinProfileUrl: z.string(),
			status: z.literal('error'),
			error: z.string(),
		})
		.loose(),
]);

const SaveLeadsResponseSchema = z.array(SaveLeadsItemSchema);
export type SaveLeadsResponse = z.infer<typeof SaveLeadsResponseSchema>;

// fetchLeadsByList — docs: POST /org-storage/leads/by-list/{listId} with
// optional paginationOptions / withLeadObjectsOfTypes (max 3) / withCompanies.
const FetchLeadsByListInputSchema = z.object({
	/** The list ID (also sent as the {listId} path segment). */
	listId: z.string().min(1),
	paginationOptions: z
		.object({
			paginationOrder: z.enum(['ASC', 'DESC']).optional(),
			paginationSize: z.number().optional(),
			paginationOffset: z.number().optional(),
			paginationProperty: z.string().optional(),
			includeTotalCount: z.boolean().optional(),
		})
		.loose()
		.optional(),
	withLeadObjectsOfTypes: z.array(z.string()).max(3).optional(),
	withCompanies: z.boolean().optional(),
});
export type FetchLeadsByListInput = z.infer<typeof FetchLeadsByListInputSchema>;

const FetchLeadsByListResponseSchema = z
	.object({
		leads: z.array(PhantomBusterLeadSchema),
		totalCount: z.number().int().optional(),
	})
	.loose();
export type FetchLeadsByListResponse = z.infer<
	typeof FetchLeadsByListResponseSchema
>;

// ── Lists schemas ─────────────────────────────────────────────────────────────

const PhantomBusterListSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		description: z.string().nullable().optional(),
		totalLeads: z.number().int().optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

// fetchAllLists — docs (Beta) specify no response schema, but the live API
// returns a bare array (verified against a real key).
const FetchAllListsInputSchema = z.object({});
export type FetchAllListsInput = z.infer<typeof FetchAllListsInputSchema>;

const FetchAllListsResponseSchema = z.array(PhantomBusterListSchema);
export type FetchAllListsResponse = z.infer<typeof FetchAllListsResponseSchema>;

// fetchList
const FetchListInputSchema = z.object({
	/** The list ID. */
	id: z.string().min(1),
});
export type FetchListInput = z.infer<typeof FetchListInputSchema>;

// docs (Beta) specify no response schema and no list exists on the verified
// account to check live, so this follows the API's established pattern where
// every single-fetch (agent, container, script) returns the flat object.
const FetchListResponseSchema = PhantomBusterListSchema;
export type FetchListResponse = z.infer<typeof FetchListResponseSchema>;

// saveList
const SaveListInputSchema = z.object({
	/** If provided, updates the existing list. Otherwise creates a new one. */
	id: z.string().optional(),
	name: z.string().min(1),
	description: z.string().optional(),
});
export type SaveListInput = z.infer<typeof SaveListInputSchema>;

const SaveListResponseSchema = z.object({
	id: z.string(),
});
export type SaveListResponse = z.infer<typeof SaveListResponseSchema>;

// deleteList
const DeleteListInputSchema = z.object({
	/** The list ID to delete. */
	id: z.string().min(1),
});
export type DeleteListInput = z.infer<typeof DeleteListInputSchema>;

const DeleteListResponseSchema = z
	.object({
		id: z.string(),
	})
	.loose();
export type DeleteListResponse = z.infer<typeof DeleteListResponseSchema>;

// ── Branches schemas (verified against hub.phantombuster.com/reference) ──────

const PhantomBusterBranchSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		created_at: z.number(),
	})
	.loose();

const FetchAllBranchesInputSchema = z.object({});
export type FetchAllBranchesInput = z.infer<typeof FetchAllBranchesInputSchema>;

const FetchAllBranchesResponseSchema = z.array(PhantomBusterBranchSchema);
export type FetchAllBranchesResponse = z.infer<
	typeof FetchAllBranchesResponseSchema
>;

const FetchBranchesDiffInputSchema = z.object({
	/**
	 * Name of the script branch to fetch the diff from. Documented as
	 * optional but the live API 400s without it, so it is required here.
	 */
	name: z.string().min(1).max(50),
});
export type FetchBranchesDiffInput = z.infer<
	typeof FetchBranchesDiffInputSchema
>;

const BranchDiffSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		diffLength: z.number(),
		stagingVisibility: z.enum([
			'private',
			'semi public',
			'public',
			'semi open source',
			'open source',
		]),
		releaseVisibility: z
			.enum([
				'private',
				'semi public',
				'public',
				'semi open source',
				'open source',
			])
			.optional(),
		stagingAccessList: z.array(z.string()).nullable().optional(),
		releaseAccessList: z.array(z.string()).nullable().optional(),
	})
	.loose();

const FetchBranchesDiffResponseSchema = z.array(BranchDiffSchema);
export type FetchBranchesDiffResponse = z.infer<
	typeof FetchBranchesDiffResponseSchema
>;

const CreateBranchInputSchema = z.object({
	/** Name of the branch to create (^[\w-]{1,50}$). */
	name: z.string().min(1).max(50),
});
export type CreateBranchInput = z.infer<typeof CreateBranchInputSchema>;

const CreateBranchResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.loose();
export type CreateBranchResponse = z.infer<typeof CreateBranchResponseSchema>;

const DeleteBranchInputSchema = z.object({
	/** Id of the branch to delete. */
	id: z.string().min(1),
});
export type DeleteBranchInput = z.infer<typeof DeleteBranchInputSchema>;

const DeleteBranchResponseSchema = z.object({}).loose();
export type DeleteBranchResponse = z.infer<typeof DeleteBranchResponseSchema>;

const ReleaseBranchInputSchema = z.object({
	/** Name of the branch to release. */
	name: z.string().min(1).max(50),
	/** Ids of the scripts to release. */
	scriptIds: z.array(z.string().min(1)).min(1),
});
export type ReleaseBranchInput = z.infer<typeof ReleaseBranchInputSchema>;

const ReleaseBranchResponseSchema = z.object({}).loose();
export type ReleaseBranchResponse = z.infer<typeof ReleaseBranchResponseSchema>;

// ── Scripts schemas (verified against hub.phantombuster.com/reference) ───────

const ScriptVisibilitySchema = z.enum([
	'private',
	'semi public',
	'public',
	'semi open source',
	'open source',
]);

const ScriptEnvironmentSchema = z.enum(['staging', 'release']);

const PhantomBusterScriptSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		orgId: z.string(),
		orgSlug: z.string(),
		environment: ScriptEnvironmentSchema,
		visibility: ScriptVisibilitySchema,
		description: z.string().nullable().optional(),
		code: z.string().nullable().optional(),
		branch: z.string().nullable().optional(),
		branches: z
			.array(
				z
					.object({
						id: z.string(),
						name: z.string(),
						visibility: ScriptVisibilitySchema,
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

const FetchScriptInputSchema = z.object({
	/** Id of the script. */
	id: z.string().min(1),
	/** If set, the specified branch will be used to retrieve the script. */
	branch: z.string().min(1).max(50).optional(),
	/** If set, the specified environment will be used to retrieve the script. */
	environment: ScriptEnvironmentSchema.optional(),
	/** If set, the code will be returned in the response. */
	withCode: ScriptEnvironmentSchema.optional(),
});
export type FetchScriptInput = z.infer<typeof FetchScriptInputSchema>;

const FetchScriptResponseSchema = PhantomBusterScriptSchema;
export type FetchScriptResponse = z.infer<typeof FetchScriptResponseSchema>;

const FetchAllScriptsInputSchema = z.object({
	/** Name of the org to fetch scripts from. */
	org: z.string().min(1).optional(),
	/** If set, only the specified branch will be fetched. */
	branch: z.string().min(1).max(50).optional(),
	/** If "modules", module scripts are excluded; if "non-modules", only modules are returned. */
	exclude: z.enum(['modules', 'non-modules']).optional(),
	/** If set, only the specified script ids will be retrieved (max 100). */
	scriptIds: z.union([z.string(), z.array(z.string()).max(100)]).optional(),
});
export type FetchAllScriptsInput = z.infer<typeof FetchAllScriptsInputSchema>;

const FetchAllScriptsResponseSchema = z.array(PhantomBusterScriptSchema);
export type FetchAllScriptsResponse = z.infer<
	typeof FetchAllScriptsResponseSchema
>;

const FetchScriptCodeInputSchema = z.object({
	/** Name of the script to fetch the code from. */
	script: z.string().min(1),
	/** If set, the specified org will be used to fetch the code. */
	org: z.string().min(1).optional(),
	/** If set, the specified branch will be used to fetch the code. */
	branch: z.string().min(1).max(50).optional(),
	/** If set, the specified environment will be used to fetch the code. */
	environment: ScriptEnvironmentSchema.optional(),
});
export type FetchScriptCodeInput = z.infer<typeof FetchScriptCodeInputSchema>;

const FetchScriptCodeResponseSchema = z
	.object({
		code: z.string(),
	})
	.loose();
export type FetchScriptCodeResponse = z.infer<
	typeof FetchScriptCodeResponseSchema
>;

const UpdateScriptVisibilityInputSchema = z.object({
	/** Name of the script to change visibility for. */
	name: z.string().min(1),
	/** Name of the branch to change visibility for. */
	branch: z.string().min(1).max(50),
	/** New branch visibility. */
	visibility: ScriptVisibilitySchema,
});
export type UpdateScriptVisibilityInput = z.infer<
	typeof UpdateScriptVisibilityInputSchema
>;

const UpdateScriptVisibilityResponseSchema = z.object({}).loose();
export type UpdateScriptVisibilityResponse = z.infer<
	typeof UpdateScriptVisibilityResponseSchema
>;

const UpdateScriptAccessListInputSchema = z.object({
	/** Name of the script to update the access list of. */
	name: z.string().min(1),
	/** Name of the branch to update the access list of. */
	branch: z.string().min(1).max(50),
	/** Org or user to add to the access list. */
	add: z.string().min(1).optional(),
	/** Org or user to remove from the access list. */
	remove: z.string().min(1).optional(),
});
export type UpdateScriptAccessListInput = z.infer<
	typeof UpdateScriptAccessListInputSchema
>;

const UpdateScriptAccessListResponseSchema = z.object({}).loose();
export type UpdateScriptAccessListResponse = z.infer<
	typeof UpdateScriptAccessListResponseSchema
>;

const SaveScriptInputSchema = z
	.object({
		/** If set, the script with the corresponding id will be updated. */
		id: z.string().min(1).optional(),
		/** Name of the script. */
		name: z.string().min(1).optional(),
		/** Name of the branch to associate with the script. */
		branch: z.string().min(1).max(50).nullable().optional(),
		/** Javascript source code of the script (max 600k chars). */
		code: z.string().max(600000).nullable().optional(),
		/** Markdown description of the script (max 200k chars). */
		markdown: z.string().max(200000).nullable().optional(),
	})
	.loose();
export type SaveScriptInput = z.infer<typeof SaveScriptInputSchema>;

const SaveScriptResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.loose();
export type SaveScriptResponse = z.infer<typeof SaveScriptResponseSchema>;

const DeleteScriptInputSchema = z.object({
	/** Id of the script to delete. */
	id: z.string().min(1),
	/** Branch of the script to delete. */
	branch: z.string().min(1).max(50).nullable().optional(),
	/** Environment of the script to delete. */
	environment: ScriptEnvironmentSchema.optional(),
});
export type DeleteScriptInput = z.infer<typeof DeleteScriptInputSchema>;

const DeleteScriptResponseSchema = z.object({}).loose();
export type DeleteScriptResponse = z.infer<typeof DeleteScriptResponseSchema>;

// ── Orgs extras + agents extras + misc (verified against docs) ───────────────

const ExportAgentUsageInputSchema = z.object({
	/** How many days of usage to export (should not exceed 6 months). */
	days: z.string().min(1),
});
export type ExportAgentUsageInput = z.infer<typeof ExportAgentUsageInputSchema>;

// CSV download: raw text, no JSON envelope.
const ExportAgentUsageResponseSchema = z.string();
export type ExportAgentUsageResponse = z.infer<
	typeof ExportAgentUsageResponseSchema
>;

const ExportContainerUsageInputSchema = z.object({
	/** How many days of usage to export (should not exceed 6 months). */
	days: z.string().min(1),
	/** If set, only containers for this agent are exported. */
	agentId: z.string().min(1).optional(),
});
export type ExportContainerUsageInput = z.infer<
	typeof ExportContainerUsageInputSchema
>;

const ExportContainerUsageResponseSchema = z.string();
export type ExportContainerUsageResponse = z.infer<
	typeof ExportContainerUsageResponseSchema
>;

const AgentGroupSchema = z
	.object({
		id: z.string(),
		name: z.string().max(100),
		agents: z.array(z.string()),
	})
	.loose();

const AgentGroupOrNameSchema = z.union([z.string(), AgentGroupSchema]);

const FetchAgentGroupsInputSchema = z.object({});
export type FetchAgentGroupsInput = z.infer<typeof FetchAgentGroupsInputSchema>;

const FetchAgentGroupsResponseSchema = z.array(AgentGroupOrNameSchema);
export type FetchAgentGroupsResponse = z.infer<
	typeof FetchAgentGroupsResponseSchema
>;

const SaveAgentGroupsInputSchema = z.object({
	agentGroups: z.array(AgentGroupOrNameSchema),
});
export type SaveAgentGroupsInput = z.infer<typeof SaveAgentGroupsInputSchema>;

const SaveAgentGroupsResponseSchema = z
	.object({
		agentGroups: z.array(AgentGroupOrNameSchema),
	})
	.loose();
export type SaveAgentGroupsResponse = z.infer<
	typeof SaveAgentGroupsResponseSchema
>;

const FetchRunningContainersInputSchema = z.object({});
export type FetchRunningContainersInput = z.infer<
	typeof FetchRunningContainersInputSchema
>;

const RunningContainerSchema = z
	.object({
		id: z.string(),
		agentId: z.string(),
		agentName: z.string().max(100).nullable().optional(),
		createdAt: z.number(),
		retryNumber: z.number(),
		launchType: z.string(),
		scriptSlug: z.string(),
	})
	.loose();

const FetchRunningContainersResponseSchema = z
	.object({
		containers: z.array(RunningContainerSchema),
	})
	.loose();
export type FetchRunningContainersResponse = z.infer<
	typeof FetchRunningContainersResponseSchema
>;

const LaunchAgentSoonInputSchema = z.object({
	/** Id of the agent to launch. */
	id: z.string().min(1),
	/** Minutes before the agent is launched (>= 0). */
	minutes: z.number().int().min(0),
	// unknown: launch argument is free-form per-script JSON (docs: string or plain object), validated by zod.
	argument: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
	// unknown: alias of argument, free-form per-script JSON, validated by zod.
	arguments: z
		.union([z.string(), z.record(z.string(), z.unknown())])
		.optional(),
	saveArgument: z.boolean().optional(),
	saveArguments: z.boolean().optional(),
});
export type LaunchAgentSoonInput = z.infer<typeof LaunchAgentSoonInputSchema>;

const LaunchAgentSoonResponseSchema = z.object({}).loose();
export type LaunchAgentSoonResponse = z.infer<
	typeof LaunchAgentSoonResponseSchema
>;

const UnscheduleAllAgentsInputSchema = z.object({});
export type UnscheduleAllAgentsInput = z.infer<
	typeof UnscheduleAllAgentsInputSchema
>;

const UnscheduleAllAgentsResponseSchema = z.object({}).loose();
export type UnscheduleAllAgentsResponse = z.infer<
	typeof UnscheduleAllAgentsResponseSchema
>;

const FetchDeletedAgentsInputSchema = z.object({});
export type FetchDeletedAgentsInput = z.infer<
	typeof FetchDeletedAgentsInputSchema
>;

const DeletedAgentSchema = z
	.object({
		id: z.string(),
		name: z.string().nullable().optional(),
		createdAt: z.number(),
		deletedAt: z.number(),
		deletedBy: z.string().nullable().optional(),
		nbContainersRunning: z.number(),
	})
	.loose();

const FetchDeletedAgentsResponseSchema = z.array(DeletedAgentSchema);
export type FetchDeletedAgentsResponse = z.infer<
	typeof FetchDeletedAgentsResponseSchema
>;

const UpdateMeInputSchema = z
	.object({
		firstName: z.string().max(100).optional(),
		lastName: z.string().max(100).optional(),
		phone: z.string().max(100).nullable().optional(),
		company: z.string().nullable().optional(),
		job: z.string().nullable().optional(),
		newsletter: z.boolean().optional(),
		developerMode: z.boolean().optional(),
	})
	.loose();
export type UpdateMeInput = z.infer<typeof UpdateMeInputSchema>;

const UpdateMeResponseSchema = z.object({}).loose();
export type UpdateMeResponse = z.infer<typeof UpdateMeResponseSchema>;

const DeleteManyLeadsInputSchema = z.object({
	ids: z.array(z.string().min(1)).min(1),
});
export type DeleteManyLeadsInput = z.infer<typeof DeleteManyLeadsInputSchema>;

const DeleteManyLeadsResponseSchema = z
	.object({
		deletedCount: z.number(),
	})
	.loose();
export type DeleteManyLeadsResponse = z.infer<
	typeof DeleteManyLeadsResponseSchema
>;

const FetchIpLocationInputSchema = z.object({
	/** IPv4 or IPv6 address to geolocate. */
	ip: z.string().min(1),
});
export type FetchIpLocationInput = z.infer<typeof FetchIpLocationInputSchema>;

const FetchIpLocationResponseSchema = z
	.object({
		country: z.string(),
	})
	.loose();
export type FetchIpLocationResponse = z.infer<
	typeof FetchIpLocationResponseSchema
>;

const SolveHCaptchaInputSchema = z.object({
	url: z.string().max(3000),
	key: z.string().max(500),
});
export type SolveHCaptchaInput = z.infer<typeof SolveHCaptchaInputSchema>;

const SolveHCaptchaResponseSchema = z
	.object({
		response: z.string(),
	})
	.loose();
export type SolveHCaptchaResponse = z.infer<typeof SolveHCaptchaResponseSchema>;

const SolveRecaptchaInputSchema = z.object({
	url: z.string().max(3000),
	key: z.string().max(500),
	type: z.enum(['v2', 'v3']),
	minScore: z.enum(['0.3', '0.7', '0.9']).optional(),
	pageAction: z.string().optional(),
	enterprise: z.boolean().optional(),
});
export type SolveRecaptchaInput = z.infer<typeof SolveRecaptchaInputSchema>;

const SolveRecaptchaResponseSchema = z
	.object({
		response: z.string(),
	})
	.loose();
export type SolveRecaptchaResponse = z.infer<
	typeof SolveRecaptchaResponseSchema
>;

const AiMessageSchema = z.object({
	role: z.enum(['system', 'assistant', 'user']),
	content: z.string(),
});

const RequestAiCompletionInputSchema = z.object({
	messages: z.array(AiMessageSchema).min(1),
	model: z
		.enum([
			'gpt-35-turbo',
			'gpt-4',
			'gpt-4o',
			'gpt-4o-mini',
			'gpt-4.1-mini',
			'gpt-5.1',
		])
		.optional(),
	temperature: z.number().min(0).max(2).optional(),
});
export type RequestAiCompletionInput = z.infer<
	typeof RequestAiCompletionInputSchema
>;

const RequestAiCompletionResponseSchema = z
	.object({
		choices: z.array(z.string()),
		creditsCost: z.number().int(),
	})
	.loose();
export type RequestAiCompletionResponse = z.infer<
	typeof RequestAiCompletionResponseSchema
>;

const GenerateIdentityTokenInputSchema = z.object({});
export type GenerateIdentityTokenInput = z.infer<
	typeof GenerateIdentityTokenInputSchema
>;

const GenerateIdentityTokenResponseSchema = z
	.object({
		token: z.string().optional(),
	})
	.loose();
export type GenerateIdentityTokenResponse = z.infer<
	typeof GenerateIdentityTokenResponseSchema
>;

const SaveIdentityEventInputSchema = z.object({
	identity_type: z.string().min(1),
	profile_id: z.string().min(1),
	event_type: z.string().min(1),
	// unknown: event payload is provider-defined JSON, validated by zod as a record.
	event_data: z.record(z.string(), z.unknown()),
	timestamp: z.number().int().min(1000000000000).max(9999999999999).optional(),
});
export type SaveIdentityEventInput = z.infer<
	typeof SaveIdentityEventInputSchema
>;

const SaveIdentityEventResponseSchema = z.object({}).loose();
export type SaveIdentityEventResponse = z.infer<
	typeof SaveIdentityEventResponseSchema
>;

// ── Org-storage objects (verified against docs, Beta) ────────────────────────

const LeadObjectSchema = z
	.object({
		id: z.string(),
		orgId: z.string(),
		type: z.string(),
		slug: z.string(),
		// unknown: lead-object properties are provider-defined JSON, validated by zod as a record.
		properties: z.record(z.string(), z.unknown()),
		leadId: z.string().nullable().optional(),
		leadSlug: z.string().nullable().optional(),
		leadUrn: z.string().nullable().optional(),
	})
	.loose();

const SaveLeadObjectInputSchema = z.object({
	type: z.string().min(1),
	slug: z.string().min(1).max(470),
	// unknown: lead-object properties are provider-defined JSON, validated by zod as a record.
	properties: z.record(z.string(), z.unknown()),
	agentId: z.string().min(1),
	leadObjectId: z.string().min(1).optional(),
	leadId: z.string().nullable().optional(),
	leadSlug: z.string().nullable().optional(),
	leadUrn: z.string().nullable().optional(),
});
export type SaveLeadObjectInput = z.infer<typeof SaveLeadObjectInputSchema>;

const SaveLeadObjectResponseSchema = LeadObjectSchema;
export type SaveLeadObjectResponse = z.infer<
	typeof SaveLeadObjectResponseSchema
>;

const SaveManyLeadObjectsInputSchema = z.object({
	objects: z
		.array(
			z.object({
				type: z.string().min(1),
				slug: z.string().min(1).max(470),
				// unknown: lead-object properties are provider-defined JSON, validated by zod as a record.
				properties: z.record(z.string(), z.unknown()),
				agentId: z.string().min(1),
				leadObjectId: z.string().min(1).optional(),
			}),
		)
		.min(1)
		.max(20),
});
export type SaveManyLeadObjectsInput = z.infer<
	typeof SaveManyLeadObjectsInputSchema
>;

const LeadObjectSaveResultSchema = z.union([
	z
		.object({
			status: z.literal('success'),
			slug: z.string(),
			id: z.string(),
		})
		.loose(),
	z
		.object({
			status: z.literal('error'),
			slug: z.string(),
			error: z.string(),
		})
		.loose(),
]);

const SaveManyLeadObjectsResponseSchema = z.array(LeadObjectSaveResultSchema);
export type SaveManyLeadObjectsResponse = z.infer<
	typeof SaveManyLeadObjectsResponseSchema
>;

const DeleteLeadObjectsInputSchema = z
	.object({
		type: z.string().min(1).optional(),
		slug: z.string().min(1).optional(),
		leadObjectId: z.string().min(1).optional(),
	})
	.loose();
export type DeleteLeadObjectsInput = z.infer<
	typeof DeleteLeadObjectsInputSchema
>;

const DeleteLeadObjectsResponseSchema = z
	.object({
		deletedCount: z.number(),
	})
	.loose();
export type DeleteLeadObjectsResponse = z.infer<
	typeof DeleteLeadObjectsResponseSchema
>;

const SearchLeadObjectsInputSchema = z
	.object({
		type: z.string().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.loose();
export type SearchLeadObjectsInput = z.infer<
	typeof SearchLeadObjectsInputSchema
>;

const SearchLeadObjectsResponseSchema = z.union([
	z.array(LeadObjectSchema),
	z
		.object({
			leadsObjects: z.array(LeadObjectSchema),
			totalCount: z.number().int(),
		})
		.loose(),
]);
export type SearchLeadObjectsResponse = z.infer<
	typeof SearchLeadObjectsResponseSchema
>;

const CompanyObjectSchema = z
	.object({
		id: z.string(),
		linkedinCompanyId: z.string(),
		type: z.string(),
		slug: z.string(),
		// unknown: company-object properties are provider-defined JSON, validated by zod as a record.
		properties: z.record(z.string(), z.unknown()),
		orgId: z.string().nullable().optional(),
	})
	.loose();

const SaveCompanyObjectInputSchema = z.object({
	linkedinCompanyId: z.string().min(1),
	type: z.string().min(1).max(500),
	slug: z.string().min(1).max(470),
	// unknown: company-object properties are provider-defined JSON, validated by zod as a record.
	properties: z.record(z.string(), z.unknown()),
	id: z.string().min(1).optional(),
	orgId: z.string().min(1).optional(),
});
export type SaveCompanyObjectInput = z.infer<
	typeof SaveCompanyObjectInputSchema
>;

const SaveCompanyObjectResponseSchema = CompanyObjectSchema;
export type SaveCompanyObjectResponse = z.infer<
	typeof SaveCompanyObjectResponseSchema
>;

const SaveManyCompanyObjectsInputSchema = z.object({
	objects: z
		.array(
			z.object({
				linkedinCompanyId: z.string().min(1),
				type: z.string().min(1).max(500),
				slug: z.string().min(1).max(470),
				// unknown: company-object properties are provider-defined JSON, validated by zod as a record.
				properties: z.record(z.string(), z.unknown()),
			}),
		)
		.min(1)
		.max(20),
});
export type SaveManyCompanyObjectsInput = z.infer<
	typeof SaveManyCompanyObjectsInputSchema
>;

const SaveManyCompanyObjectsResponseSchema = z.array(
	z.union([
		z
			.object({
				status: z.literal('success'),
				slug: z.string(),
				result: CompanyObjectSchema,
			})
			.loose(),
		z
			.object({
				status: z.literal('error'),
				slug: z.string(),
				error: z.string(),
			})
			.loose(),
	]),
);
export type SaveManyCompanyObjectsResponse = z.infer<
	typeof SaveManyCompanyObjectsResponseSchema
>;

const SearchCompanyObjectsInputSchema = z
	.object({
		type: z.string().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.loose();
export type SearchCompanyObjectsInput = z.infer<
	typeof SearchCompanyObjectsInputSchema
>;

const SearchCompanyObjectsResponseSchema = z.union([
	z.array(CompanyObjectSchema),
	z
		.object({
			companiesObjects: z.array(CompanyObjectSchema),
			totalCount: z.number().int(),
		})
		.loose(),
]);
export type SearchCompanyObjectsResponse = z.infer<
	typeof SearchCompanyObjectsResponseSchema
>;

// ── Endpoint input/output maps ────────────────────────────────────────────────

export type PhantomBusterEndpointInputs = {
	// agents
	fetchAllAgents: FetchAllAgentsInput;
	fetchAgent: FetchAgentInput;
	saveAgent: SaveAgentInput;
	deleteAgent: DeleteAgentInput;
	launchAgent: LaunchAgentInput;
	stopAgent: StopAgentInput;
	fetchAgentOutput: FetchAgentOutputInput;
	// containers
	fetchAllContainers: FetchAllContainersInput;
	fetchContainer: FetchContainerInput;
	fetchContainerOutput: FetchContainerOutputInput;
	fetchContainerResultObject: FetchContainerResultObjectInput;
	// users
	fetchMe: FetchMeInput;
	// orgs
	fetchOrg: FetchOrgInput;
	fetchOrgResources: FetchOrgResourcesInput;
	// leads
	saveLead: SaveLeadInput;
	saveLeads: SaveLeadsInput;
	fetchLeadsByList: FetchLeadsByListInput;
	// lists
	fetchAllLists: FetchAllListsInput;
	fetchList: FetchListInput;
	saveList: SaveListInput;
	deleteList: DeleteListInput;
	// branches
	fetchAllBranches: FetchAllBranchesInput;
	fetchBranchesDiff: FetchBranchesDiffInput;
	createBranch: CreateBranchInput;
	deleteBranch: DeleteBranchInput;
	releaseBranch: ReleaseBranchInput;
	// scripts
	fetchScript: FetchScriptInput;
	fetchAllScripts: FetchAllScriptsInput;
	fetchScriptCode: FetchScriptCodeInput;
	updateScriptVisibility: UpdateScriptVisibilityInput;
	updateScriptAccessList: UpdateScriptAccessListInput;
	saveScript: SaveScriptInput;
	deleteScript: DeleteScriptInput;
	// orgs extras
	exportAgentUsage: ExportAgentUsageInput;
	exportContainerUsage: ExportContainerUsageInput;
	fetchAgentGroups: FetchAgentGroupsInput;
	saveAgentGroups: SaveAgentGroupsInput;
	fetchRunningContainers: FetchRunningContainersInput;
	// agents extras
	launchAgentSoon: LaunchAgentSoonInput;
	unscheduleAllAgents: UnscheduleAllAgentsInput;
	fetchDeletedAgents: FetchDeletedAgentsInput;
	// users
	updateMe: UpdateMeInput;
	// leads extras
	deleteManyLeads: DeleteManyLeadsInput;
	// misc
	fetchIpLocation: FetchIpLocationInput;
	solveHCaptcha: SolveHCaptchaInput;
	solveRecaptcha: SolveRecaptchaInput;
	requestAiCompletion: RequestAiCompletionInput;
	// identities
	generateIdentityToken: GenerateIdentityTokenInput;
	saveIdentityEvent: SaveIdentityEventInput;
	// storage objects
	saveLeadObject: SaveLeadObjectInput;
	saveManyLeadObjects: SaveManyLeadObjectsInput;
	deleteLeadObjects: DeleteLeadObjectsInput;
	searchLeadObjects: SearchLeadObjectsInput;
	saveCompanyObject: SaveCompanyObjectInput;
	saveManyCompanyObjects: SaveManyCompanyObjectsInput;
	searchCompanyObjects: SearchCompanyObjectsInput;
};

export type PhantomBusterEndpointOutputs = {
	// agents
	fetchAllAgents: FetchAllAgentsResponse;
	fetchAgent: FetchAgentResponse;
	saveAgent: SaveAgentResponse;
	deleteAgent: DeleteAgentResponse;
	launchAgent: LaunchAgentResponse;
	stopAgent: StopAgentResponse;
	fetchAgentOutput: FetchAgentOutputResponse;
	// containers
	fetchAllContainers: FetchAllContainersResponse;
	fetchContainer: FetchContainerResponse;
	fetchContainerOutput: FetchContainerOutputResponse;
	fetchContainerResultObject: FetchContainerResultObjectResponse;
	// users
	fetchMe: FetchMeResponse;
	// orgs
	fetchOrg: FetchOrgResponse;
	fetchOrgResources: FetchOrgResourcesResponse;
	// leads
	saveLead: SaveLeadResponse;
	saveLeads: SaveLeadsResponse;
	fetchLeadsByList: FetchLeadsByListResponse;
	// lists
	fetchAllLists: FetchAllListsResponse;
	fetchList: FetchListResponse;
	saveList: SaveListResponse;
	deleteList: DeleteListResponse;
	// branches
	fetchAllBranches: FetchAllBranchesResponse;
	fetchBranchesDiff: FetchBranchesDiffResponse;
	createBranch: CreateBranchResponse;
	deleteBranch: DeleteBranchResponse;
	releaseBranch: ReleaseBranchResponse;
	// scripts
	fetchScript: FetchScriptResponse;
	fetchAllScripts: FetchAllScriptsResponse;
	fetchScriptCode: FetchScriptCodeResponse;
	updateScriptVisibility: UpdateScriptVisibilityResponse;
	updateScriptAccessList: UpdateScriptAccessListResponse;
	saveScript: SaveScriptResponse;
	deleteScript: DeleteScriptResponse;
	// orgs extras
	exportAgentUsage: ExportAgentUsageResponse;
	exportContainerUsage: ExportContainerUsageResponse;
	fetchAgentGroups: FetchAgentGroupsResponse;
	saveAgentGroups: SaveAgentGroupsResponse;
	fetchRunningContainers: FetchRunningContainersResponse;
	// agents extras
	launchAgentSoon: LaunchAgentSoonResponse;
	unscheduleAllAgents: UnscheduleAllAgentsResponse;
	fetchDeletedAgents: FetchDeletedAgentsResponse;
	// users
	updateMe: UpdateMeResponse;
	// leads extras
	deleteManyLeads: DeleteManyLeadsResponse;
	// misc
	fetchIpLocation: FetchIpLocationResponse;
	solveHCaptcha: SolveHCaptchaResponse;
	solveRecaptcha: SolveRecaptchaResponse;
	requestAiCompletion: RequestAiCompletionResponse;
	// identities
	generateIdentityToken: GenerateIdentityTokenResponse;
	saveIdentityEvent: SaveIdentityEventResponse;
	// storage objects
	saveLeadObject: SaveLeadObjectResponse;
	saveManyLeadObjects: SaveManyLeadObjectsResponse;
	deleteLeadObjects: DeleteLeadObjectsResponse;
	searchLeadObjects: SearchLeadObjectsResponse;
	saveCompanyObject: SaveCompanyObjectResponse;
	saveManyCompanyObjects: SaveManyCompanyObjectsResponse;
	searchCompanyObjects: SearchCompanyObjectsResponse;
};

// ── Schema exports ────────────────────────────────────────────────────────────

export const PhantomBusterEndpointInputSchemas = {
	fetchAllAgents: FetchAllAgentsInputSchema,
	fetchAgent: FetchAgentInputSchema,
	saveAgent: SaveAgentInputSchema,
	deleteAgent: DeleteAgentInputSchema,
	launchAgent: LaunchAgentInputSchema,
	stopAgent: StopAgentInputSchema,
	fetchAgentOutput: FetchAgentOutputInputSchema,
	fetchAllContainers: FetchAllContainersInputSchema,
	fetchContainer: FetchContainerInputSchema,
	fetchContainerOutput: FetchContainerOutputInputSchema,
	fetchContainerResultObject: FetchContainerResultObjectInputSchema,
	fetchMe: FetchMeInputSchema,
	fetchOrg: FetchOrgInputSchema,
	fetchOrgResources: FetchOrgResourcesInputSchema,
	saveLead: SaveLeadInputSchema,
	saveLeads: SaveLeadsInputSchema,
	fetchLeadsByList: FetchLeadsByListInputSchema,
	fetchAllLists: FetchAllListsInputSchema,
	fetchList: FetchListInputSchema,
	saveList: SaveListInputSchema,
	deleteList: DeleteListInputSchema,
	fetchAllBranches: FetchAllBranchesInputSchema,
	fetchBranchesDiff: FetchBranchesDiffInputSchema,
	createBranch: CreateBranchInputSchema,
	deleteBranch: DeleteBranchInputSchema,
	releaseBranch: ReleaseBranchInputSchema,
	fetchScript: FetchScriptInputSchema,
	fetchAllScripts: FetchAllScriptsInputSchema,
	fetchScriptCode: FetchScriptCodeInputSchema,
	updateScriptVisibility: UpdateScriptVisibilityInputSchema,
	updateScriptAccessList: UpdateScriptAccessListInputSchema,
	saveScript: SaveScriptInputSchema,
	deleteScript: DeleteScriptInputSchema,
	exportAgentUsage: ExportAgentUsageInputSchema,
	exportContainerUsage: ExportContainerUsageInputSchema,
	fetchAgentGroups: FetchAgentGroupsInputSchema,
	saveAgentGroups: SaveAgentGroupsInputSchema,
	fetchRunningContainers: FetchRunningContainersInputSchema,
	launchAgentSoon: LaunchAgentSoonInputSchema,
	unscheduleAllAgents: UnscheduleAllAgentsInputSchema,
	fetchDeletedAgents: FetchDeletedAgentsInputSchema,
	updateMe: UpdateMeInputSchema,
	deleteManyLeads: DeleteManyLeadsInputSchema,
	fetchIpLocation: FetchIpLocationInputSchema,
	solveHCaptcha: SolveHCaptchaInputSchema,
	solveRecaptcha: SolveRecaptchaInputSchema,
	requestAiCompletion: RequestAiCompletionInputSchema,
	generateIdentityToken: GenerateIdentityTokenInputSchema,
	saveIdentityEvent: SaveIdentityEventInputSchema,
	saveLeadObject: SaveLeadObjectInputSchema,
	saveManyLeadObjects: SaveManyLeadObjectsInputSchema,
	deleteLeadObjects: DeleteLeadObjectsInputSchema,
	searchLeadObjects: SearchLeadObjectsInputSchema,
	saveCompanyObject: SaveCompanyObjectInputSchema,
	saveManyCompanyObjects: SaveManyCompanyObjectsInputSchema,
	searchCompanyObjects: SearchCompanyObjectsInputSchema,
} as const;

export const PhantomBusterEndpointOutputSchemas = {
	fetchAllAgents: FetchAllAgentsResponseSchema,
	fetchAgent: FetchAgentResponseSchema,
	saveAgent: SaveAgentResponseSchema,
	deleteAgent: DeleteAgentResponseSchema,
	launchAgent: LaunchAgentResponseSchema,
	stopAgent: StopAgentResponseSchema,
	fetchAgentOutput: FetchAgentOutputResponseSchema,
	fetchAllContainers: FetchAllContainersResponseSchema,
	fetchContainer: FetchContainerResponseSchema,
	fetchContainerOutput: FetchContainerOutputResponseSchema,
	fetchContainerResultObject: FetchContainerResultObjectResponseSchema,
	fetchMe: FetchMeResponseSchema,
	fetchOrg: FetchOrgResponseSchema,
	fetchOrgResources: FetchOrgResourcesResponseSchema,
	saveLead: SaveLeadResponseSchema,
	saveLeads: SaveLeadsResponseSchema,
	fetchLeadsByList: FetchLeadsByListResponseSchema,
	fetchAllLists: FetchAllListsResponseSchema,
	fetchList: FetchListResponseSchema,
	saveList: SaveListResponseSchema,
	deleteList: DeleteListResponseSchema,
	fetchAllBranches: FetchAllBranchesResponseSchema,
	fetchBranchesDiff: FetchBranchesDiffResponseSchema,
	createBranch: CreateBranchResponseSchema,
	deleteBranch: DeleteBranchResponseSchema,
	releaseBranch: ReleaseBranchResponseSchema,
	fetchScript: FetchScriptResponseSchema,
	fetchAllScripts: FetchAllScriptsResponseSchema,
	fetchScriptCode: FetchScriptCodeResponseSchema,
	updateScriptVisibility: UpdateScriptVisibilityResponseSchema,
	updateScriptAccessList: UpdateScriptAccessListResponseSchema,
	saveScript: SaveScriptResponseSchema,
	deleteScript: DeleteScriptResponseSchema,
	exportAgentUsage: ExportAgentUsageResponseSchema,
	exportContainerUsage: ExportContainerUsageResponseSchema,
	fetchAgentGroups: FetchAgentGroupsResponseSchema,
	saveAgentGroups: SaveAgentGroupsResponseSchema,
	fetchRunningContainers: FetchRunningContainersResponseSchema,
	launchAgentSoon: LaunchAgentSoonResponseSchema,
	unscheduleAllAgents: UnscheduleAllAgentsResponseSchema,
	fetchDeletedAgents: FetchDeletedAgentsResponseSchema,
	updateMe: UpdateMeResponseSchema,
	deleteManyLeads: DeleteManyLeadsResponseSchema,
	fetchIpLocation: FetchIpLocationResponseSchema,
	solveHCaptcha: SolveHCaptchaResponseSchema,
	solveRecaptcha: SolveRecaptchaResponseSchema,
	requestAiCompletion: RequestAiCompletionResponseSchema,
	generateIdentityToken: GenerateIdentityTokenResponseSchema,
	saveIdentityEvent: SaveIdentityEventResponseSchema,
	saveLeadObject: SaveLeadObjectResponseSchema,
	saveManyLeadObjects: SaveManyLeadObjectsResponseSchema,
	deleteLeadObjects: DeleteLeadObjectsResponseSchema,
	searchLeadObjects: SearchLeadObjectsResponseSchema,
	saveCompanyObject: SaveCompanyObjectResponseSchema,
	saveManyCompanyObjects: SaveManyCompanyObjectsResponseSchema,
	searchCompanyObjects: SearchCompanyObjectsResponseSchema,
} as const;
