import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	AgentsEndpoints,
	ContainersEndpoints,
	LeadsEndpoints,
	ListsEndpoints,
	OrgsEndpoints,
	UsersEndpoints,
} from './endpoints';
import type {
	PhantomBusterEndpointInputs,
	PhantomBusterEndpointOutputs,
} from './endpoints/types';
import {
	PhantomBusterEndpointInputSchemas,
	PhantomBusterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PhantomBusterSchema } from './schema';

export type PhantomBusterPluginOptions = {
	authType?: PickAuth<'api_key'>;
 
	key?: string;
	hooks?: InternalPhantomBusterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof phantombusterEndpointsNested>;
};

export type PhantomBusterContext = CorsairPluginContext<
	typeof PhantomBusterSchema,
	PhantomBusterPluginOptions
>;

export type PhantomBusterKeyBuilderContext =
	KeyBuilderContext<PhantomBusterPluginOptions>;

export type PhantomBusterBoundEndpoints = BindEndpoints<
	typeof phantombusterEndpointsNested
>;

type PhantomBusterEndpoint<K extends keyof PhantomBusterEndpointOutputs> =
	CorsairEndpoint<
		PhantomBusterContext,
		PhantomBusterEndpointInputs[K],
		PhantomBusterEndpointOutputs[K]
	>;

export type PhantomBusterEndpoints = {
	// agents
	fetchAllAgents: PhantomBusterEndpoint<'fetchAllAgents'>;
	fetchAgent: PhantomBusterEndpoint<'fetchAgent'>;
	saveAgent: PhantomBusterEndpoint<'saveAgent'>;
	deleteAgent: PhantomBusterEndpoint<'deleteAgent'>;
	launchAgent: PhantomBusterEndpoint<'launchAgent'>;
	stopAgent: PhantomBusterEndpoint<'stopAgent'>;
	fetchAgentOutput: PhantomBusterEndpoint<'fetchAgentOutput'>;
	// containers
	fetchAllContainers: PhantomBusterEndpoint<'fetchAllContainers'>;
	fetchContainer: PhantomBusterEndpoint<'fetchContainer'>;
	fetchContainerOutput: PhantomBusterEndpoint<'fetchContainerOutput'>;
	fetchContainerResultObject: PhantomBusterEndpoint<'fetchContainerResultObject'>;
	// users
	fetchMe: PhantomBusterEndpoint<'fetchMe'>;
	// orgs
	fetchOrg: PhantomBusterEndpoint<'fetchOrg'>;
	fetchOrgResources: PhantomBusterEndpoint<'fetchOrgResources'>;
	// leads
	saveLead: PhantomBusterEndpoint<'saveLead'>;
	saveLeads: PhantomBusterEndpoint<'saveLeads'>;
	fetchLeadsByList: PhantomBusterEndpoint<'fetchLeadsByList'>;
	// lists
	fetchAllLists: PhantomBusterEndpoint<'fetchAllLists'>;
	fetchList: PhantomBusterEndpoint<'fetchList'>;
	saveList: PhantomBusterEndpoint<'saveList'>;
	deleteList: PhantomBusterEndpoint<'deleteList'>;
};

const phantombusterEndpointsNested = {
	agents: {
		fetchAll: AgentsEndpoints.fetchAll,
		fetch: AgentsEndpoints.fetch,
		save: AgentsEndpoints.save,
		delete: AgentsEndpoints.remove,
		launch: AgentsEndpoints.launch,
		stop: AgentsEndpoints.stop,
		fetchOutput: AgentsEndpoints.fetchOutput,
	},
	containers: {
		fetchAll: ContainersEndpoints.fetchAll,
		fetch: ContainersEndpoints.fetch,
		fetchOutput: ContainersEndpoints.fetchOutput,
		fetchResultObject: ContainersEndpoints.fetchResultObject,
	},
	users: {
		fetchMe: UsersEndpoints.fetchMe,
	},
	orgs: {
		fetch: OrgsEndpoints.fetch,
		fetchResources: OrgsEndpoints.fetchResources,
	},
	leads: {
		save: LeadsEndpoints.save,
		saveMany: LeadsEndpoints.saveMany,
		fetchByList: LeadsEndpoints.fetchByList,
	},
	lists: {
		fetchAll: ListsEndpoints.fetchAll,
		fetch: ListsEndpoints.fetch,
		save: ListsEndpoints.save,
		delete: ListsEndpoints.remove,
	},
} as const;

const phantombusterWebhooksNested = {} as const;

export const phantombusterEndpointSchemas = {
	'agents.fetchAll': {
		input: PhantomBusterEndpointInputSchemas.fetchAllAgents,
		output: PhantomBusterEndpointOutputSchemas.fetchAllAgents,
	},
	'agents.fetch': {
		input: PhantomBusterEndpointInputSchemas.fetchAgent,
		output: PhantomBusterEndpointOutputSchemas.fetchAgent,
	},
	'agents.save': {
		input: PhantomBusterEndpointInputSchemas.saveAgent,
		output: PhantomBusterEndpointOutputSchemas.saveAgent,
	},
	'agents.delete': {
		input: PhantomBusterEndpointInputSchemas.deleteAgent,
		output: PhantomBusterEndpointOutputSchemas.deleteAgent,
	},
	'agents.launch': {
		input: PhantomBusterEndpointInputSchemas.launchAgent,
		output: PhantomBusterEndpointOutputSchemas.launchAgent,
	},
	'agents.stop': {
		input: PhantomBusterEndpointInputSchemas.stopAgent,
		output: PhantomBusterEndpointOutputSchemas.stopAgent,
	},
	'agents.fetchOutput': {
		input: PhantomBusterEndpointInputSchemas.fetchAgentOutput,
		output: PhantomBusterEndpointOutputSchemas.fetchAgentOutput,
	},
	'containers.fetchAll': {
		input: PhantomBusterEndpointInputSchemas.fetchAllContainers,
		output: PhantomBusterEndpointOutputSchemas.fetchAllContainers,
	},
	'containers.fetch': {
		input: PhantomBusterEndpointInputSchemas.fetchContainer,
		output: PhantomBusterEndpointOutputSchemas.fetchContainer,
	},
	'containers.fetchOutput': {
		input: PhantomBusterEndpointInputSchemas.fetchContainerOutput,
		output: PhantomBusterEndpointOutputSchemas.fetchContainerOutput,
	},
	'containers.fetchResultObject': {
		input: PhantomBusterEndpointInputSchemas.fetchContainerResultObject,
		output: PhantomBusterEndpointOutputSchemas.fetchContainerResultObject,
	},
	'users.fetchMe': {
		input: PhantomBusterEndpointInputSchemas.fetchMe,
		output: PhantomBusterEndpointOutputSchemas.fetchMe,
	},
	'orgs.fetch': {
		input: PhantomBusterEndpointInputSchemas.fetchOrg,
		output: PhantomBusterEndpointOutputSchemas.fetchOrg,
	},
	'orgs.fetchResources': {
		input: PhantomBusterEndpointInputSchemas.fetchOrgResources,
		output: PhantomBusterEndpointOutputSchemas.fetchOrgResources,
	},
	'leads.save': {
		input: PhantomBusterEndpointInputSchemas.saveLead,
		output: PhantomBusterEndpointOutputSchemas.saveLead,
	},
	'leads.saveMany': {
		input: PhantomBusterEndpointInputSchemas.saveLeads,
		output: PhantomBusterEndpointOutputSchemas.saveLeads,
	},
	'leads.fetchByList': {
		input: PhantomBusterEndpointInputSchemas.fetchLeadsByList,
		output: PhantomBusterEndpointOutputSchemas.fetchLeadsByList,
	},
	'lists.fetchAll': {
		input: PhantomBusterEndpointInputSchemas.fetchAllLists,
		output: PhantomBusterEndpointOutputSchemas.fetchAllLists,
	},
	'lists.fetch': {
		input: PhantomBusterEndpointInputSchemas.fetchList,
		output: PhantomBusterEndpointOutputSchemas.fetchList,
	},
	'lists.save': {
		input: PhantomBusterEndpointInputSchemas.saveList,
		output: PhantomBusterEndpointOutputSchemas.saveList,
	},
	'lists.delete': {
		input: PhantomBusterEndpointInputSchemas.deleteList,
		output: PhantomBusterEndpointOutputSchemas.deleteList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof phantombusterEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const phantombusterEndpointMeta = {
	'agents.fetchAll': {
		riskLevel: 'read',
		description: 'Get all PhantomBuster agents (Phantoms) in the organization',
	},
	'agents.fetch': {
		riskLevel: 'read',
		description: 'Get details for a specific PhantomBuster agent by ID',
	},
	'agents.save': {
		riskLevel: 'write',
		description: 'Create a new agent or update an existing one',
	},
	'agents.delete': {
		riskLevel: 'destructive',
		description: 'Delete a PhantomBuster agent by ID',
	},
	'agents.launch': {
		riskLevel: 'write',
		description: 'Add a PhantomBuster agent to the launch queue',
	},
	'agents.stop': {
		riskLevel: 'write',
		description: 'Stop a currently running PhantomBuster agent',
	},
	'agents.fetchOutput': {
		riskLevel: 'read',
		description:
			'Get the output of the most recent container for an agent, including status, progress, console log, and result object',
	},
	'containers.fetchAll': {
		riskLevel: 'read',
		description: 'Get all run containers for a specific agent',
	},
	'containers.fetch': {
		riskLevel: 'read',
		description: 'Get details for a specific run container by ID',
	},
	'containers.fetchOutput': {
		riskLevel: 'read',
		description: 'Get the console output for a specific container',
	},
	'containers.fetchResultObject': {
		riskLevel: 'read',
		description: 'Get the result object (JSON data) from a specific container',
	},
	'users.fetchMe': {
		riskLevel: 'read',
		description: 'Get info about the currently authenticated PhantomBuster user',
	},
	'orgs.fetch': {
		riskLevel: 'read',
		description: 'Get the current organization info',
	},
	'orgs.fetchResources': {
		riskLevel: 'read',
		description: 'Get the organization resource usage (slots, limits)',
	},
	'leads.save': {
		riskLevel: 'write',
		description: 'Save a single lead to PhantomBuster org storage',
	},
	'leads.saveMany': {
		riskLevel: 'write',
		description: 'Bulk-save multiple leads to PhantomBuster org storage',
	},
	'leads.fetchByList': {
		riskLevel: 'read',
		description: 'Fetch leads belonging to a specific lead list',
	},
	'lists.fetchAll': {
		riskLevel: 'read',
		description: 'Get all lead lists in the organization',
	},
	'lists.fetch': {
		riskLevel: 'read',
		description: 'Get details for a specific lead list by ID',
	},
	'lists.save': {
		riskLevel: 'write',
		description: 'Create a new lead list or update an existing one',
	},
	'lists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a lead list by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof phantombusterEndpointsNested
>;

export const phantombusterAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BasePhantomBusterPlugin<T extends PhantomBusterPluginOptions> =
	CorsairPlugin<
		'phantombuster',
		typeof PhantomBusterSchema,
		typeof phantombusterEndpointsNested,
		typeof phantombusterWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalPhantomBusterPlugin =
	BasePhantomBusterPlugin<PhantomBusterPluginOptions>;

export type ExternalPhantomBusterPlugin<T extends PhantomBusterPluginOptions> =
	BasePhantomBusterPlugin<T>;

export function phantombuster<const T extends PhantomBusterPluginOptions>(
	incomingOptions: PhantomBusterPluginOptions & T = {} as PhantomBusterPluginOptions & T,
): ExternalPhantomBusterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'phantombuster',
		schema: PhantomBusterSchema,
		options: options,
		hooks: options.hooks,
		endpoints: phantombusterEndpointsNested,
		webhooks: phantombusterWebhooksNested,
		endpointMeta: phantombusterEndpointMeta,
		endpointSchemas: phantombusterEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: PhantomBusterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			throw new AuthMissingError('phantombuster', 'api_key');
		},
	} satisfies InternalPhantomBusterPlugin;
}

export type {
	DeleteAgentInput,
	DeleteAgentResponse,
	DeleteListInput,
	DeleteListResponse,
	FetchAgentInput,
	FetchAgentOutputInput,
	FetchAgentOutputResponse,
	FetchAgentResponse,
	FetchAllAgentsInput,
	FetchAllAgentsResponse,
	FetchAllContainersInput,
	FetchAllContainersResponse,
	FetchAllListsInput,
	FetchAllListsResponse,
	FetchContainerInput,
	FetchContainerOutputInput,
	FetchContainerOutputResponse,
	FetchContainerResponse,
	FetchContainerResultObjectInput,
	FetchContainerResultObjectResponse,
	FetchLeadsByListInput,
	FetchLeadsByListResponse,
	FetchListInput,
	FetchListResponse,
	FetchMeInput,
	FetchMeResponse,
	FetchOrgInput,
	FetchOrgResourcesInput,
	FetchOrgResourcesResponse,
	FetchOrgResponse,
	LaunchAgentInput,
	LaunchAgentResponse,
	PhantomBusterAgent,
	PhantomBusterAgentStatus,
	PhantomBusterContainer,
	PhantomBusterEndpointInputs,
	PhantomBusterEndpointOutputs,
	SaveAgentInput,
	SaveAgentResponse,
	SaveLeadInput,
	SaveLeadResponse,
	SaveLeadsInput,
	SaveLeadsResponse,
	SaveListInput,
	SaveListResponse,
	StopAgentInput,
	StopAgentResponse,
} from './endpoints/types';

export {
	PhantomBusterEndpointInputSchemas,
	PhantomBusterEndpointOutputSchemas,
} from './endpoints/types';
