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
		name: z.string(),
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
		argument: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.loose();

export type PhantomBusterAgent = z.infer<typeof PhantomBusterAgentSchema>;

// fetchAllAgents
const FetchAllAgentsInputSchema = z.object({
	 
	search: z.string().optional(),
});
export type FetchAllAgentsInput = z.infer<typeof FetchAllAgentsInputSchema>;

const FetchAllAgentsResponseSchema = z.object({
	agents: z.array(PhantomBusterAgentSchema),
});
export type FetchAllAgentsResponse = z.infer<
	typeof FetchAllAgentsResponseSchema
>;

// fetchAgent
const FetchAgentInputSchema = z.object({
	/** The agent ID. */
	id: z.string().min(1),
});
export type FetchAgentInput = z.infer<typeof FetchAgentInputSchema>;

const FetchAgentResponseSchema = z.object({
	agent: PhantomBusterAgentSchema,
});
export type FetchAgentResponse = z.infer<typeof FetchAgentResponseSchema>;

// saveAgent 
const SaveAgentInputSchema = z
	.object({
		 
		id: z.string().optional(),
		name: z.string().optional(),
		scriptId: z.string().optional(),
		argument: z
			.union([z.string(), z.record(z.string(), z.unknown())])
			.optional(),
		launchType: z
			.enum(['manually', 'repeatedly', 'oneShot', 'cron'])
			.optional(),
		launchTimes: z.array(z.string()).optional(),
		launchTimezone: z.string().optional(),
		cronString: z.string().optional(),
		fileMgmt: z.string().optional(),
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

const DeleteAgentResponseSchema = z.object({
	id: z.string(),
});
export type DeleteAgentResponse = z.infer<typeof DeleteAgentResponseSchema>;

// launchAgent
const LaunchAgentInputSchema = z.object({
	 
	id: z.string().min(1),
	 
	argument: z
		.union([z.string(), z.record(z.string(), z.unknown())])
		.optional(),
	 
	manualCookieSession: z.string().optional(),
});
export type LaunchAgentInput = z.infer<typeof LaunchAgentInputSchema>;

const LaunchAgentResponseSchema = z
	.object({
		containerId: z.string().optional(),
	})
	.loose();
export type LaunchAgentResponse = z.infer<typeof LaunchAgentResponseSchema>;

// stopAgent
const StopAgentInputSchema = z.object({
	/** The agent ID to stop. */
	id: z.string().min(1),
});
export type StopAgentInput = z.infer<typeof StopAgentInputSchema>;

const StopAgentResponseSchema = z
	.object({
		containerId: z.string().optional(),
	})
	.loose();
export type StopAgentResponse = z.infer<typeof StopAgentResponseSchema>;

// fetchAgentOutput
const FetchAgentOutputInputSchema = z.object({
	 
	id: z.string().min(1),
 
	status: z.enum(['running', 'finished', 'error']).optional(),
	 
	mode: z.enum(['most-recent', 'specific-time']).optional(),
	 
	since: z.string().optional(),
});
export type FetchAgentOutputInput = z.infer<typeof FetchAgentOutputInputSchema>;

const FetchAgentOutputResponseSchema = z
	.object({
		status: z.string().optional(),
		progress: z
			.object({
				progress: z.number().optional(),
				label: z.string().optional(),
			})
			.optional(),
		output: z.string().nullable().optional(),
		resultObject: z.string().nullable().optional(),
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

// fetchAllContainers
const FetchAllContainersInputSchema = z.object({
	/** The agent ID to fetch containers for. */
	agentId: z.string().min(1),
	 
	limit: z.number().int().min(1).max(100).optional(),
});
export type FetchAllContainersInput = z.infer<
	typeof FetchAllContainersInputSchema
>;

const FetchAllContainersResponseSchema = z.object({
	containers: z.array(PhantomBusterContainerSchema),
});
export type FetchAllContainersResponse = z.infer<
	typeof FetchAllContainersResponseSchema
>;

// fetchContainer
const FetchContainerInputSchema = z.object({
	/** The container ID. */
	id: z.string().min(1),
});
export type FetchContainerInput = z.infer<typeof FetchContainerInputSchema>;

const FetchContainerResponseSchema = z.object({
	container: PhantomBusterContainerSchema,
});
export type FetchContainerResponse = z.infer<
	typeof FetchContainerResponseSchema
>;

// fetchContainerOutput
const FetchContainerOutputInputSchema = z.object({
	/** The container ID. */
	id: z.string().min(1),
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

// fetchMe
const FetchMeInputSchema = z.object({});
export type FetchMeInput = z.infer<typeof FetchMeInputSchema>;

const FetchMeResponseSchema = z
	.object({
		id: z.string().optional(),
		email: z.string().optional(),
		name: z.string().nullable().optional(),
		timeZone: z.string().optional(),
	})
	.loose();
export type FetchMeResponse = z.infer<typeof FetchMeResponseSchema>;

// ── Org schemas ───────────────────────────────────────────────────────────────

// fetchOrg
const FetchOrgInputSchema = z.object({});
export type FetchOrgInput = z.infer<typeof FetchOrgInputSchema>;

const FetchOrgResponseSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
	})
	.loose();
export type FetchOrgResponse = z.infer<typeof FetchOrgResponseSchema>;

// fetchOrgResources
const FetchOrgResourcesInputSchema = z.object({});
export type FetchOrgResourcesInput = z.infer<
	typeof FetchOrgResourcesInputSchema
>;

const FetchOrgResourcesResponseSchema = z
	.object({
		remainingSlots: z.number().int().optional(),
		usedSlots: z.number().int().optional(),
	})
	.loose();
export type FetchOrgResourcesResponse = z.infer<
	typeof FetchOrgResourcesResponseSchema
>;

// ── Leads schemas ─────────────────────────────────────────────────────────────

const PhantomBusterLeadSchema = z
	.object({
		id: z.string().optional(),
		email: z.string().nullable().optional(),
		firstName: z.string().nullable().optional(),
		lastName: z.string().nullable().optional(),
		linkedinUrl: z.string().nullable().optional(),
		companyName: z.string().nullable().optional(),
	})
	.loose();

// saveLead
const SaveLeadInputSchema = z.object({
	lead: PhantomBusterLeadSchema,
});
export type SaveLeadInput = z.infer<typeof SaveLeadInputSchema>;

const SaveLeadResponseSchema = z
	.object({
		id: z.string().optional(),
	})
	.loose();
export type SaveLeadResponse = z.infer<typeof SaveLeadResponseSchema>;

// saveLeads (bulk)
const SaveLeadsInputSchema = z.object({
	leads: z.array(PhantomBusterLeadSchema).min(1).max(1000),
});
export type SaveLeadsInput = z.infer<typeof SaveLeadsInputSchema>;

const SaveLeadsResponseSchema = z
	.object({
		savedCount: z.number().int().optional(),
	})
	.loose();
export type SaveLeadsResponse = z.infer<typeof SaveLeadsResponseSchema>;

// fetchLeadsByList
const FetchLeadsByListInputSchema = z.object({
	/** The list ID. */
	listId: z.string().min(1),
	/** Page token for pagination. */
	pageToken: z.string().optional(),
	/** Max items per page. */
	limit: z.number().int().min(1).max(1000).optional(),
});
export type FetchLeadsByListInput = z.infer<typeof FetchLeadsByListInputSchema>;

const FetchLeadsByListResponseSchema = z
	.object({
		leads: z.array(PhantomBusterLeadSchema),
		nextPageToken: z.string().nullable().optional(),
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

// fetchAllLists
const FetchAllListsInputSchema = z.object({});
export type FetchAllListsInput = z.infer<typeof FetchAllListsInputSchema>;

const FetchAllListsResponseSchema = z.object({
	lists: z.array(PhantomBusterListSchema),
});
export type FetchAllListsResponse = z.infer<typeof FetchAllListsResponseSchema>;

// fetchList
const FetchListInputSchema = z.object({
	/** The list ID. */
	id: z.string().min(1),
});
export type FetchListInput = z.infer<typeof FetchListInputSchema>;

const FetchListResponseSchema = z.object({
	list: PhantomBusterListSchema,
});
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
} as const;
