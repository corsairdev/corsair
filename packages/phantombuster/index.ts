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
	BranchesEndpoints,
	ContainersEndpoints,
	IdentitiesEndpoints,
	LeadsEndpoints,
	ListsEndpoints,
	MiscEndpoints,
	OrgsEndpoints,
	ScriptsEndpoints,
	StorageEndpoints,
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
	launchAgentSoon: PhantomBusterEndpoint<'launchAgentSoon'>;
	unscheduleAllAgents: PhantomBusterEndpoint<'unscheduleAllAgents'>;
	fetchDeletedAgents: PhantomBusterEndpoint<'fetchDeletedAgents'>;
	stopAgent: PhantomBusterEndpoint<'stopAgent'>;
	fetchAgentOutput: PhantomBusterEndpoint<'fetchAgentOutput'>;
	// containers
	fetchAllContainers: PhantomBusterEndpoint<'fetchAllContainers'>;
	fetchContainer: PhantomBusterEndpoint<'fetchContainer'>;
	fetchContainerOutput: PhantomBusterEndpoint<'fetchContainerOutput'>;
	fetchContainerResultObject: PhantomBusterEndpoint<'fetchContainerResultObject'>;
	// users
	fetchMe: PhantomBusterEndpoint<'fetchMe'>;
	updateMe: PhantomBusterEndpoint<'updateMe'>;
	// orgs
	fetchOrg: PhantomBusterEndpoint<'fetchOrg'>;
	fetchOrgResources: PhantomBusterEndpoint<'fetchOrgResources'>;
	exportAgentUsage: PhantomBusterEndpoint<'exportAgentUsage'>;
	exportContainerUsage: PhantomBusterEndpoint<'exportContainerUsage'>;
	fetchAgentGroups: PhantomBusterEndpoint<'fetchAgentGroups'>;
	saveAgentGroups: PhantomBusterEndpoint<'saveAgentGroups'>;
	fetchRunningContainers: PhantomBusterEndpoint<'fetchRunningContainers'>;
	// leads
	saveLead: PhantomBusterEndpoint<'saveLead'>;
	saveLeads: PhantomBusterEndpoint<'saveLeads'>;
	fetchLeadsByList: PhantomBusterEndpoint<'fetchLeadsByList'>;
	deleteManyLeads: PhantomBusterEndpoint<'deleteManyLeads'>;
	// lists
	fetchAllLists: PhantomBusterEndpoint<'fetchAllLists'>;
	fetchList: PhantomBusterEndpoint<'fetchList'>;
	saveList: PhantomBusterEndpoint<'saveList'>;
	deleteList: PhantomBusterEndpoint<'deleteList'>;
	// branches
	fetchAllBranches: PhantomBusterEndpoint<'fetchAllBranches'>;
	fetchBranchesDiff: PhantomBusterEndpoint<'fetchBranchesDiff'>;
	createBranch: PhantomBusterEndpoint<'createBranch'>;
	deleteBranch: PhantomBusterEndpoint<'deleteBranch'>;
	releaseBranch: PhantomBusterEndpoint<'releaseBranch'>;
	// scripts
	fetchScript: PhantomBusterEndpoint<'fetchScript'>;
	fetchAllScripts: PhantomBusterEndpoint<'fetchAllScripts'>;
	fetchScriptCode: PhantomBusterEndpoint<'fetchScriptCode'>;
	updateScriptVisibility: PhantomBusterEndpoint<'updateScriptVisibility'>;
	updateScriptAccessList: PhantomBusterEndpoint<'updateScriptAccessList'>;
	saveScript: PhantomBusterEndpoint<'saveScript'>;
	deleteScript: PhantomBusterEndpoint<'deleteScript'>;
	// storage objects
	saveLeadObject: PhantomBusterEndpoint<'saveLeadObject'>;
	saveManyLeadObjects: PhantomBusterEndpoint<'saveManyLeadObjects'>;
	deleteLeadObjects: PhantomBusterEndpoint<'deleteLeadObjects'>;
	searchLeadObjects: PhantomBusterEndpoint<'searchLeadObjects'>;
	saveCompanyObject: PhantomBusterEndpoint<'saveCompanyObject'>;
	saveManyCompanyObjects: PhantomBusterEndpoint<'saveManyCompanyObjects'>;
	searchCompanyObjects: PhantomBusterEndpoint<'searchCompanyObjects'>;
	// identities
	generateIdentityToken: PhantomBusterEndpoint<'generateIdentityToken'>;
	saveIdentityEvent: PhantomBusterEndpoint<'saveIdentityEvent'>;
	// misc
	fetchIpLocation: PhantomBusterEndpoint<'fetchIpLocation'>;
	solveHCaptcha: PhantomBusterEndpoint<'solveHCaptcha'>;
	solveRecaptcha: PhantomBusterEndpoint<'solveRecaptcha'>;
	requestAiCompletion: PhantomBusterEndpoint<'requestAiCompletion'>;
};

const phantombusterEndpointsNested = {
	agents: {
		fetchAll: AgentsEndpoints.fetchAll,
		fetch: AgentsEndpoints.fetch,
		save: AgentsEndpoints.save,
		delete: AgentsEndpoints.remove,
		launch: AgentsEndpoints.launch,
		launchSoon: AgentsEndpoints.launchSoon,
		unscheduleAll: AgentsEndpoints.unscheduleAll,
		fetchDeleted: AgentsEndpoints.fetchDeleted,
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
		updateMe: UsersEndpoints.updateMe,
	},
	orgs: {
		fetch: OrgsEndpoints.fetch,
		fetchResources: OrgsEndpoints.fetchResources,
		exportAgentUsage: OrgsEndpoints.exportAgentUsage,
		exportContainerUsage: OrgsEndpoints.exportContainerUsage,
		fetchAgentGroups: OrgsEndpoints.fetchAgentGroups,
		saveAgentGroups: OrgsEndpoints.saveAgentGroups,
		fetchRunningContainers: OrgsEndpoints.fetchRunningContainers,
	},
	leads: {
		save: LeadsEndpoints.save,
		saveMany: LeadsEndpoints.saveMany,
		fetchByList: LeadsEndpoints.fetchByList,
		deleteMany: LeadsEndpoints.deleteMany,
	},
	lists: {
		fetchAll: ListsEndpoints.fetchAll,
		fetch: ListsEndpoints.fetch,
		save: ListsEndpoints.save,
		delete: ListsEndpoints.remove,
	},
	branches: {
		fetchAll: BranchesEndpoints.fetchAll,
		fetchDiff: BranchesEndpoints.fetchDiff,
		create: BranchesEndpoints.create,
		delete: BranchesEndpoints.remove,
		release: BranchesEndpoints.release,
	},
	scripts: {
		fetch: ScriptsEndpoints.fetch,
		fetchAll: ScriptsEndpoints.fetchAll,
		fetchCode: ScriptsEndpoints.fetchCode,
		updateVisibility: ScriptsEndpoints.updateVisibility,
		updateAccessList: ScriptsEndpoints.updateAccessList,
		save: ScriptsEndpoints.save,
		delete: ScriptsEndpoints.remove,
	},
	storage: {
		saveLeadObject: StorageEndpoints.saveLeadObject,
		saveManyLeadObjects: StorageEndpoints.saveManyLeadObjects,
		deleteLeadObjects: StorageEndpoints.deleteLeadObjects,
		searchLeadObjects: StorageEndpoints.searchLeadObjects,
		saveCompanyObject: StorageEndpoints.saveCompanyObject,
		saveManyCompanyObjects: StorageEndpoints.saveManyCompanyObjects,
		searchCompanyObjects: StorageEndpoints.searchCompanyObjects,
	},
	identities: {
		generateToken: IdentitiesEndpoints.generateToken,
		saveEvent: IdentitiesEndpoints.saveEvent,
	},
	misc: {
		fetchIpLocation: MiscEndpoints.fetchIpLocation,
		solveHCaptcha: MiscEndpoints.solveHCaptcha,
		solveRecaptcha: MiscEndpoints.solveRecaptcha,
		requestAiCompletion: MiscEndpoints.requestAiCompletion,
	},
} as const;

/** No webhook support — PhantomBuster v2 is a synchronous request/response API with no webhook triggers. */
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
	'agents.launchSoon': {
		input: PhantomBusterEndpointInputSchemas.launchAgentSoon,
		output: PhantomBusterEndpointOutputSchemas.launchAgentSoon,
	},
	'agents.unscheduleAll': {
		input: PhantomBusterEndpointInputSchemas.unscheduleAllAgents,
		output: PhantomBusterEndpointOutputSchemas.unscheduleAllAgents,
	},
	'agents.fetchDeleted': {
		input: PhantomBusterEndpointInputSchemas.fetchDeletedAgents,
		output: PhantomBusterEndpointOutputSchemas.fetchDeletedAgents,
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
	'users.updateMe': {
		input: PhantomBusterEndpointInputSchemas.updateMe,
		output: PhantomBusterEndpointOutputSchemas.updateMe,
	},
	'orgs.fetch': {
		input: PhantomBusterEndpointInputSchemas.fetchOrg,
		output: PhantomBusterEndpointOutputSchemas.fetchOrg,
	},
	'orgs.fetchResources': {
		input: PhantomBusterEndpointInputSchemas.fetchOrgResources,
		output: PhantomBusterEndpointOutputSchemas.fetchOrgResources,
	},
	'orgs.exportAgentUsage': {
		input: PhantomBusterEndpointInputSchemas.exportAgentUsage,
		output: PhantomBusterEndpointOutputSchemas.exportAgentUsage,
	},
	'orgs.exportContainerUsage': {
		input: PhantomBusterEndpointInputSchemas.exportContainerUsage,
		output: PhantomBusterEndpointOutputSchemas.exportContainerUsage,
	},
	'orgs.fetchAgentGroups': {
		input: PhantomBusterEndpointInputSchemas.fetchAgentGroups,
		output: PhantomBusterEndpointOutputSchemas.fetchAgentGroups,
	},
	'orgs.saveAgentGroups': {
		input: PhantomBusterEndpointInputSchemas.saveAgentGroups,
		output: PhantomBusterEndpointOutputSchemas.saveAgentGroups,
	},
	'orgs.fetchRunningContainers': {
		input: PhantomBusterEndpointInputSchemas.fetchRunningContainers,
		output: PhantomBusterEndpointOutputSchemas.fetchRunningContainers,
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
	'leads.deleteMany': {
		input: PhantomBusterEndpointInputSchemas.deleteManyLeads,
		output: PhantomBusterEndpointOutputSchemas.deleteManyLeads,
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
	'branches.fetchAll': {
		input: PhantomBusterEndpointInputSchemas.fetchAllBranches,
		output: PhantomBusterEndpointOutputSchemas.fetchAllBranches,
	},
	'branches.fetchDiff': {
		input: PhantomBusterEndpointInputSchemas.fetchBranchesDiff,
		output: PhantomBusterEndpointOutputSchemas.fetchBranchesDiff,
	},
	'branches.create': {
		input: PhantomBusterEndpointInputSchemas.createBranch,
		output: PhantomBusterEndpointOutputSchemas.createBranch,
	},
	'branches.delete': {
		input: PhantomBusterEndpointInputSchemas.deleteBranch,
		output: PhantomBusterEndpointOutputSchemas.deleteBranch,
	},
	'branches.release': {
		input: PhantomBusterEndpointInputSchemas.releaseBranch,
		output: PhantomBusterEndpointOutputSchemas.releaseBranch,
	},
	'scripts.fetch': {
		input: PhantomBusterEndpointInputSchemas.fetchScript,
		output: PhantomBusterEndpointOutputSchemas.fetchScript,
	},
	'scripts.fetchAll': {
		input: PhantomBusterEndpointInputSchemas.fetchAllScripts,
		output: PhantomBusterEndpointOutputSchemas.fetchAllScripts,
	},
	'scripts.fetchCode': {
		input: PhantomBusterEndpointInputSchemas.fetchScriptCode,
		output: PhantomBusterEndpointOutputSchemas.fetchScriptCode,
	},
	'scripts.updateVisibility': {
		input: PhantomBusterEndpointInputSchemas.updateScriptVisibility,
		output: PhantomBusterEndpointOutputSchemas.updateScriptVisibility,
	},
	'scripts.updateAccessList': {
		input: PhantomBusterEndpointInputSchemas.updateScriptAccessList,
		output: PhantomBusterEndpointOutputSchemas.updateScriptAccessList,
	},
	'scripts.save': {
		input: PhantomBusterEndpointInputSchemas.saveScript,
		output: PhantomBusterEndpointOutputSchemas.saveScript,
	},
	'scripts.delete': {
		input: PhantomBusterEndpointInputSchemas.deleteScript,
		output: PhantomBusterEndpointOutputSchemas.deleteScript,
	},
	'storage.saveLeadObject': {
		input: PhantomBusterEndpointInputSchemas.saveLeadObject,
		output: PhantomBusterEndpointOutputSchemas.saveLeadObject,
	},
	'storage.saveManyLeadObjects': {
		input: PhantomBusterEndpointInputSchemas.saveManyLeadObjects,
		output: PhantomBusterEndpointOutputSchemas.saveManyLeadObjects,
	},
	'storage.deleteLeadObjects': {
		input: PhantomBusterEndpointInputSchemas.deleteLeadObjects,
		output: PhantomBusterEndpointOutputSchemas.deleteLeadObjects,
	},
	'storage.searchLeadObjects': {
		input: PhantomBusterEndpointInputSchemas.searchLeadObjects,
		output: PhantomBusterEndpointOutputSchemas.searchLeadObjects,
	},
	'storage.saveCompanyObject': {
		input: PhantomBusterEndpointInputSchemas.saveCompanyObject,
		output: PhantomBusterEndpointOutputSchemas.saveCompanyObject,
	},
	'storage.saveManyCompanyObjects': {
		input: PhantomBusterEndpointInputSchemas.saveManyCompanyObjects,
		output: PhantomBusterEndpointOutputSchemas.saveManyCompanyObjects,
	},
	'storage.searchCompanyObjects': {
		input: PhantomBusterEndpointInputSchemas.searchCompanyObjects,
		output: PhantomBusterEndpointOutputSchemas.searchCompanyObjects,
	},
	'identities.generateToken': {
		input: PhantomBusterEndpointInputSchemas.generateIdentityToken,
		output: PhantomBusterEndpointOutputSchemas.generateIdentityToken,
	},
	'identities.saveEvent': {
		input: PhantomBusterEndpointInputSchemas.saveIdentityEvent,
		output: PhantomBusterEndpointOutputSchemas.saveIdentityEvent,
	},
	'misc.fetchIpLocation': {
		input: PhantomBusterEndpointInputSchemas.fetchIpLocation,
		output: PhantomBusterEndpointOutputSchemas.fetchIpLocation,
	},
	'misc.solveHCaptcha': {
		input: PhantomBusterEndpointInputSchemas.solveHCaptcha,
		output: PhantomBusterEndpointOutputSchemas.solveHCaptcha,
	},
	'misc.solveRecaptcha': {
		input: PhantomBusterEndpointInputSchemas.solveRecaptcha,
		output: PhantomBusterEndpointOutputSchemas.solveRecaptcha,
	},
	'misc.requestAiCompletion': {
		input: PhantomBusterEndpointInputSchemas.requestAiCompletion,
		output: PhantomBusterEndpointOutputSchemas.requestAiCompletion,
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
	'agents.launchSoon': {
		riskLevel: 'write',
		description:
			'Schedule a PhantomBuster agent to launch before a specific time',
	},
	'agents.unscheduleAll': {
		riskLevel: 'write',
		description: 'Disable automatic launch for all agents in the organization',
	},
	'agents.fetchDeleted': {
		riskLevel: 'read',
		description: 'Get all deleted agents in the organization',
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
		description:
			'Get info about the currently authenticated PhantomBuster user',
	},
	'users.updateMe': {
		riskLevel: 'write',
		description: "Update the current user's info",
	},
	'orgs.fetch': {
		riskLevel: 'read',
		description: 'Get the current organization info',
	},
	'orgs.fetchResources': {
		riskLevel: 'read',
		description: 'Get the organization resource usage (slots, limits)',
	},
	'orgs.exportAgentUsage': {
		riskLevel: 'read',
		description: 'Export agent usage CSV for the organization',
	},
	'orgs.exportContainerUsage': {
		riskLevel: 'read',
		description: 'Export container usage CSV for the organization',
	},
	'orgs.fetchAgentGroups': {
		riskLevel: 'read',
		description: 'Get agent groups and order for the organization',
	},
	'orgs.saveAgentGroups': {
		riskLevel: 'write',
		description: 'Update agent groups and order for the organization',
	},
	'orgs.fetchRunningContainers': {
		riskLevel: 'read',
		description: "Get the organization's running containers",
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
	'leads.deleteMany': {
		riskLevel: 'destructive',
		description: 'Delete multiple leads by their IDs',
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
	'branches.fetchAll': {
		riskLevel: 'read',
		description: 'Fetch all branches in the organization',
	},
	'branches.fetchDiff': {
		riskLevel: 'read',
		description: 'Get the staging/release diff for script branches',
	},
	'branches.create': {
		riskLevel: 'write',
		description: 'Create a new branch',
	},
	'branches.delete': {
		riskLevel: 'destructive',
		description: 'Delete a branch by ID',
	},
	'branches.release': {
		riskLevel: 'write',
		description: 'Release a script branch',
	},
	'scripts.fetch': {
		riskLevel: 'read',
		description: 'Fetch a script by ID',
	},
	'scripts.fetchAll': {
		riskLevel: 'read',
		description: 'Fetch all scripts for the current user',
	},
	'scripts.fetchCode': {
		riskLevel: 'read',
		description: 'Get the code of a script',
	},
	'scripts.updateVisibility': {
		riskLevel: 'write',
		description: 'Update the visibility of a script',
	},
	'scripts.updateAccessList': {
		riskLevel: 'write',
		description: "Update a script's access list",
	},
	'scripts.save': {
		riskLevel: 'write',
		description: 'Create a new script or update an existing one',
	},
	'scripts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a script by ID',
	},
	'storage.saveLeadObject': {
		riskLevel: 'write',
		description: 'Save a lead object to organization storage',
	},
	'storage.saveManyLeadObjects': {
		riskLevel: 'write',
		description: 'Bulk-save lead objects to organization storage',
	},
	'storage.deleteLeadObjects': {
		riskLevel: 'destructive',
		description: 'Delete lead objects from organization storage',
	},
	'storage.searchLeadObjects': {
		riskLevel: 'read',
		description: 'Search lead objects in organization storage',
	},
	'storage.saveCompanyObject': {
		riskLevel: 'write',
		description: 'Save a company object to organization storage',
	},
	'storage.saveManyCompanyObjects': {
		riskLevel: 'write',
		description: 'Bulk-save company objects to organization storage',
	},
	'storage.searchCompanyObjects': {
		riskLevel: 'read',
		description: 'Search company objects in organization storage',
	},
	'identities.generateToken': {
		riskLevel: 'write',
		description: 'Generate an identity token',
	},
	'identities.saveEvent': {
		riskLevel: 'write',
		description: 'Save an identity event',
	},
	'misc.fetchIpLocation': {
		riskLevel: 'read',
		description: 'Retrieve the country of an IP address',
	},
	'misc.solveHCaptcha': {
		riskLevel: 'write',
		description: 'Solve an hCaptcha challenge',
	},
	'misc.solveRecaptcha': {
		riskLevel: 'write',
		description: 'Solve a reCAPTCHA challenge (v2 or v3)',
	},
	'misc.requestAiCompletion': {
		riskLevel: 'write',
		description: 'Request a text completion from the AI module',
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
	incomingOptions: PhantomBusterPluginOptions &
		T = {} as PhantomBusterPluginOptions & T,
): ExternalPhantomBusterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'phantombuster',
		authConfig: phantombusterAuthConfig,
		schema: PhantomBusterSchema,
		options: options,
		hooks: options.hooks,
		endpoints: phantombusterEndpointsNested,
		webhooks: phantombusterWebhooksNested,
		endpointMeta: phantombusterEndpointMeta,
		endpointSchemas: phantombusterEndpointSchemas,
		webhookSchemas: {},
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
				if (res) return res;
			}

			throw new AuthMissingError('phantombuster', 'api_key');
		},
	} satisfies InternalPhantomBusterPlugin;
}

export type {
	CreateBranchInput,
	CreateBranchResponse,
	DeleteAgentInput,
	DeleteAgentResponse,
	DeleteBranchInput,
	DeleteBranchResponse,
	DeleteLeadObjectsInput,
	DeleteLeadObjectsResponse,
	DeleteListInput,
	DeleteListResponse,
	DeleteManyLeadsInput,
	DeleteManyLeadsResponse,
	DeleteScriptInput,
	DeleteScriptResponse,
	ExportAgentUsageInput,
	ExportAgentUsageResponse,
	ExportContainerUsageInput,
	ExportContainerUsageResponse,
	FetchAgentGroupsInput,
	FetchAgentGroupsResponse,
	FetchAgentInput,
	FetchAgentOutputInput,
	FetchAgentOutputResponse,
	FetchAgentResponse,
	FetchAllAgentsInput,
	FetchAllAgentsResponse,
	FetchAllBranchesInput,
	FetchAllBranchesResponse,
	FetchAllContainersInput,
	FetchAllContainersResponse,
	FetchAllListsInput,
	FetchAllListsResponse,
	FetchAllScriptsInput,
	FetchAllScriptsResponse,
	FetchBranchesDiffInput,
	FetchBranchesDiffResponse,
	FetchContainerInput,
	FetchContainerOutputInput,
	FetchContainerOutputResponse,
	FetchContainerResponse,
	FetchContainerResultObjectInput,
	FetchContainerResultObjectResponse,
	FetchDeletedAgentsInput,
	FetchDeletedAgentsResponse,
	FetchIpLocationInput,
	FetchIpLocationResponse,
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
	FetchRunningContainersInput,
	FetchRunningContainersResponse,
	FetchScriptCodeInput,
	FetchScriptCodeResponse,
	FetchScriptInput,
	FetchScriptResponse,
	GenerateIdentityTokenInput,
	GenerateIdentityTokenResponse,
	LaunchAgentInput,
	LaunchAgentResponse,
	LaunchAgentSoonInput,
	LaunchAgentSoonResponse,
	PhantomBusterAgent,
	PhantomBusterAgentStatus,
	PhantomBusterContainer,
	PhantomBusterEndpointInputs,
	PhantomBusterEndpointOutputs,
	ReleaseBranchInput,
	ReleaseBranchResponse,
	RequestAiCompletionInput,
	RequestAiCompletionResponse,
	SaveAgentGroupsInput,
	SaveAgentGroupsResponse,
	SaveAgentInput,
	SaveAgentResponse,
	SaveCompanyObjectInput,
	SaveCompanyObjectResponse,
	SaveIdentityEventInput,
	SaveIdentityEventResponse,
	SaveLeadInput,
	SaveLeadObjectInput,
	SaveLeadObjectResponse,
	SaveLeadResponse,
	SaveLeadsInput,
	SaveLeadsResponse,
	SaveListInput,
	SaveListResponse,
	SaveManyCompanyObjectsInput,
	SaveManyCompanyObjectsResponse,
	SaveManyLeadObjectsInput,
	SaveManyLeadObjectsResponse,
	SaveScriptInput,
	SaveScriptResponse,
	SearchCompanyObjectsInput,
	SearchCompanyObjectsResponse,
	SearchLeadObjectsInput,
	SearchLeadObjectsResponse,
	SolveHCaptchaInput,
	SolveHCaptchaResponse,
	SolveRecaptchaInput,
	SolveRecaptchaResponse,
	StopAgentInput,
	StopAgentResponse,
	UnscheduleAllAgentsInput,
	UnscheduleAllAgentsResponse,
	UpdateMeInput,
	UpdateMeResponse,
	UpdateScriptAccessListInput,
	UpdateScriptAccessListResponse,
	UpdateScriptVisibilityInput,
	UpdateScriptVisibilityResponse,
} from './endpoints/types';

export {
	PhantomBusterEndpointInputSchemas,
	PhantomBusterEndpointOutputSchemas,
} from './endpoints/types';
