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
	Conversations,
	Licenses,
	Limits,
	Messages,
	Pages,
	Personas,
	Projects,
	Reports,
	Settings,
	Sources,
	User,
} from './endpoints';
import type {
	CustomGPTEndpointInputs,
	CustomGPTEndpointOutputs,
} from './endpoints/types';
import {
	CustomGPTEndpointInputSchemas,
	CustomGPTEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CustomGPTSchema } from './schema';

export type CustomGPTPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCustomGPTPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof customGPTEndpointsNested>;
};

export type CustomGPTContext = CorsairPluginContext<
	typeof CustomGPTSchema,
	CustomGPTPluginOptions
>;

export type CustomGPTKeyBuilderContext =
	KeyBuilderContext<CustomGPTPluginOptions>;

export type CustomGPTBoundEndpoints = BindEndpoints<
	typeof customGPTEndpointsNested
>;

type CustomGPTEndpoint<K extends keyof CustomGPTEndpointOutputs> =
	CorsairEndpoint<
		CustomGPTContext,
		CustomGPTEndpointInputs[K],
		CustomGPTEndpointOutputs[K]
	>;

export type CustomGPTEndpoints = {
	listProjects: CustomGPTEndpoint<'listProjects'>;
	getProject: CustomGPTEndpoint<'getProject'>;
	createProject: CustomGPTEndpoint<'createProject'>;
	updateProject: CustomGPTEndpoint<'updateProject'>;
	deleteProject: CustomGPTEndpoint<'deleteProject'>;
	cloneProject: CustomGPTEndpoint<'cloneProject'>;
	getStats: CustomGPTEndpoint<'getStats'>;
	getPlugins: CustomGPTEndpoint<'getPlugins'>;
	listPages: CustomGPTEndpoint<'listPages'>;
	deletePage: CustomGPTEndpoint<'deletePage'>;
	reindexPage: CustomGPTEndpoint<'reindexPage'>;
	getPageMetadata: CustomGPTEndpoint<'getPageMetadata'>;
	updatePageMetadata: CustomGPTEndpoint<'updatePageMetadata'>;
	listSources: CustomGPTEndpoint<'listSources'>;
	addSource: CustomGPTEndpoint<'addSource'>;
	updateSource: CustomGPTEndpoint<'updateSource'>;
	deleteSource: CustomGPTEndpoint<'deleteSource'>;
	listProjectLicenses: CustomGPTEndpoint<'listProjectLicenses'>;
	getProjectLicense: CustomGPTEndpoint<'getProjectLicense'>;
	updateProjectLicense: CustomGPTEndpoint<'updateProjectLicense'>;
	deleteProjectLicense: CustomGPTEndpoint<'deleteProjectLicense'>;
	getProjectSettings: CustomGPTEndpoint<'getProjectSettings'>;
	updateProjectSettings: CustomGPTEndpoint<'updateProjectSettings'>;
	listPersonas: CustomGPTEndpoint<'listPersonas'>;
	activatePersonaVersion: CustomGPTEndpoint<'activatePersonaVersion'>;
	createConversation: CustomGPTEndpoint<'createConversation'>;
	listConversationMessages: CustomGPTEndpoint<'listConversationMessages'>;
	getMessage: CustomGPTEndpoint<'getMessage'>;
	getMessageTrustScore: CustomGPTEndpoint<'getMessageTrustScore'>;
	verifyMessage: CustomGPTEndpoint<'verifyMessage'>;
	submitMessageFeedback: CustomGPTEndpoint<'submitMessageFeedback'>;
	getReportAnalysis: CustomGPTEndpoint<'getReportAnalysis'>;
	getReportConversations: CustomGPTEndpoint<'getReportConversations'>;
	getReportTraffic: CustomGPTEndpoint<'getReportTraffic'>;
	getReportIntelligence: CustomGPTEndpoint<'getReportIntelligence'>;
	exportLeads: CustomGPTEndpoint<'exportLeads'>;
	getUsageLimits: CustomGPTEndpoint<'getUsageLimits'>;
	getUserProfile: CustomGPTEndpoint<'getUserProfile'>;
	updateUserProfile: CustomGPTEndpoint<'updateUserProfile'>;
	searchTeamMembers: CustomGPTEndpoint<'searchTeamMembers'>;
};

const customGPTEndpointsNested = {
	projects: {
		list: Projects.list,
		get: Projects.get,
		create: Projects.create,
		update: Projects.update,
		delete: Projects.delete,
		clone: Projects.clone,
		stats: Projects.stats,
		plugins: Projects.plugins,
	},
	pages: {
		list: Pages.list,
		delete: Pages.delete,
		reindex: Pages.reindex,
		getMetadata: Pages.getMetadata,
		updateMetadata: Pages.updateMetadata,
	},
	sources: {
		list: Sources.list,
		add: Sources.add,
		update: Sources.update,
		delete: Sources.delete,
	},
	licenses: {
		list: Licenses.list,
		get: Licenses.get,
		update: Licenses.update,
		delete: Licenses.delete,
	},
	settings: {
		get: Settings.get,
		update: Settings.update,
	},
	personas: {
		list: Personas.list,
		activate: Personas.activate,
	},
	conversations: {
		create: Conversations.create,
	},
	messages: {
		list: Messages.list,
		get: Messages.get,
		getTrustScore: Messages.getTrustScore,
		verify: Messages.verify,
		submitFeedback: Messages.submitFeedback,
	},
	reports: {
		getAnalysis: Reports.getAnalysis,
		getConversations: Reports.getConversations,
		getTraffic: Reports.getTraffic,
		getIntelligence: Reports.getIntelligence,
		exportLeads: Reports.exportLeads,
	},
	limits: {
		getUsage: Limits.getUsage,
	},
	user: {
		getProfile: User.getProfile,
		updateProfile: User.updateProfile,
		searchTeamMembers: User.searchTeamMembers,
	},
} as const;

const customGPTWebhooksNested = {} as const;

export const customGPTEndpointSchemas = {
	'projects.list': {
		input: CustomGPTEndpointInputSchemas.listProjects,
		output: CustomGPTEndpointOutputSchemas.listProjects,
	},
	'projects.get': {
		input: CustomGPTEndpointInputSchemas.getProject,
		output: CustomGPTEndpointOutputSchemas.getProject,
	},
	'projects.create': {
		input: CustomGPTEndpointInputSchemas.createProject,
		output: CustomGPTEndpointOutputSchemas.createProject,
	},
	'projects.update': {
		input: CustomGPTEndpointInputSchemas.updateProject,
		output: CustomGPTEndpointOutputSchemas.updateProject,
	},
	'projects.delete': {
		input: CustomGPTEndpointInputSchemas.deleteProject,
		output: CustomGPTEndpointOutputSchemas.deleteProject,
	},
	'projects.clone': {
		input: CustomGPTEndpointInputSchemas.cloneProject,
		output: CustomGPTEndpointOutputSchemas.cloneProject,
	},
	'projects.stats': {
		input: CustomGPTEndpointInputSchemas.getStats,
		output: CustomGPTEndpointOutputSchemas.getStats,
	},
	'projects.plugins': {
		input: CustomGPTEndpointInputSchemas.getPlugins,
		output: CustomGPTEndpointOutputSchemas.getPlugins,
	},
	'pages.list': {
		input: CustomGPTEndpointInputSchemas.listPages,
		output: CustomGPTEndpointOutputSchemas.listPages,
	},
	'pages.delete': {
		input: CustomGPTEndpointInputSchemas.deletePage,
		output: CustomGPTEndpointOutputSchemas.deletePage,
	},
	'pages.reindex': {
		input: CustomGPTEndpointInputSchemas.reindexPage,
		output: CustomGPTEndpointOutputSchemas.reindexPage,
	},
	'pages.getMetadata': {
		input: CustomGPTEndpointInputSchemas.getPageMetadata,
		output: CustomGPTEndpointOutputSchemas.getPageMetadata,
	},
	'pages.updateMetadata': {
		input: CustomGPTEndpointInputSchemas.updatePageMetadata,
		output: CustomGPTEndpointOutputSchemas.updatePageMetadata,
	},
	'sources.list': {
		input: CustomGPTEndpointInputSchemas.listSources,
		output: CustomGPTEndpointOutputSchemas.listSources,
	},
	'sources.add': {
		input: CustomGPTEndpointInputSchemas.addSource,
		output: CustomGPTEndpointOutputSchemas.addSource,
	},
	'sources.update': {
		input: CustomGPTEndpointInputSchemas.updateSource,
		output: CustomGPTEndpointOutputSchemas.updateSource,
	},
	'sources.delete': {
		input: CustomGPTEndpointInputSchemas.deleteSource,
		output: CustomGPTEndpointOutputSchemas.deleteSource,
	},
	'licenses.list': {
		input: CustomGPTEndpointInputSchemas.listProjectLicenses,
		output: CustomGPTEndpointOutputSchemas.listProjectLicenses,
	},
	'licenses.get': {
		input: CustomGPTEndpointInputSchemas.getProjectLicense,
		output: CustomGPTEndpointOutputSchemas.getProjectLicense,
	},
	'licenses.update': {
		input: CustomGPTEndpointInputSchemas.updateProjectLicense,
		output: CustomGPTEndpointOutputSchemas.updateProjectLicense,
	},
	'licenses.delete': {
		input: CustomGPTEndpointInputSchemas.deleteProjectLicense,
		output: CustomGPTEndpointOutputSchemas.deleteProjectLicense,
	},
	'settings.get': {
		input: CustomGPTEndpointInputSchemas.getProjectSettings,
		output: CustomGPTEndpointOutputSchemas.getProjectSettings,
	},
	'settings.update': {
		input: CustomGPTEndpointInputSchemas.updateProjectSettings,
		output: CustomGPTEndpointOutputSchemas.updateProjectSettings,
	},
	'personas.list': {
		input: CustomGPTEndpointInputSchemas.listPersonas,
		output: CustomGPTEndpointOutputSchemas.listPersonas,
	},
	'personas.activate': {
		input: CustomGPTEndpointInputSchemas.activatePersonaVersion,
		output: CustomGPTEndpointOutputSchemas.activatePersonaVersion,
	},
	'conversations.create': {
		input: CustomGPTEndpointInputSchemas.createConversation,
		output: CustomGPTEndpointOutputSchemas.createConversation,
	},
	'messages.list': {
		input: CustomGPTEndpointInputSchemas.listConversationMessages,
		output: CustomGPTEndpointOutputSchemas.listConversationMessages,
	},
	'messages.get': {
		input: CustomGPTEndpointInputSchemas.getMessage,
		output: CustomGPTEndpointOutputSchemas.getMessage,
	},
	'messages.getTrustScore': {
		input: CustomGPTEndpointInputSchemas.getMessageTrustScore,
		output: CustomGPTEndpointOutputSchemas.getMessageTrustScore,
	},
	'messages.verify': {
		input: CustomGPTEndpointInputSchemas.verifyMessage,
		output: CustomGPTEndpointOutputSchemas.verifyMessage,
	},
	'messages.submitFeedback': {
		input: CustomGPTEndpointInputSchemas.submitMessageFeedback,
		output: CustomGPTEndpointOutputSchemas.submitMessageFeedback,
	},
	'reports.getAnalysis': {
		input: CustomGPTEndpointInputSchemas.getReportAnalysis,
		output: CustomGPTEndpointOutputSchemas.getReportAnalysis,
	},
	'reports.getConversations': {
		input: CustomGPTEndpointInputSchemas.getReportConversations,
		output: CustomGPTEndpointOutputSchemas.getReportConversations,
	},
	'reports.getTraffic': {
		input: CustomGPTEndpointInputSchemas.getReportTraffic,
		output: CustomGPTEndpointOutputSchemas.getReportTraffic,
	},
	'reports.getIntelligence': {
		input: CustomGPTEndpointInputSchemas.getReportIntelligence,
		output: CustomGPTEndpointOutputSchemas.getReportIntelligence,
	},
	'reports.exportLeads': {
		input: CustomGPTEndpointInputSchemas.exportLeads,
		output: CustomGPTEndpointOutputSchemas.exportLeads,
	},
	'limits.getUsage': {
		input: CustomGPTEndpointInputSchemas.getUsageLimits,
		output: CustomGPTEndpointOutputSchemas.getUsageLimits,
	},
	'user.getProfile': {
		input: CustomGPTEndpointInputSchemas.getUserProfile,
		output: CustomGPTEndpointOutputSchemas.getUserProfile,
	},
	'user.updateProfile': {
		input: CustomGPTEndpointInputSchemas.updateUserProfile,
		output: CustomGPTEndpointOutputSchemas.updateUserProfile,
	},
	'user.searchTeamMembers': {
		input: CustomGPTEndpointInputSchemas.searchTeamMembers,
		output: CustomGPTEndpointOutputSchemas.searchTeamMembers,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof customGPTEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const customGPTEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description:
			"Lists all CustomGPT projects (agents) for the authenticated user. Returns projects with full details including ID, name, type, chat status, and timestamps. Supports pagination via the 'page' parameter. Use this to discover available projects or iterate through all projects.",
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Tool to get agent details. Returns the full configuration and current status for a specific agent. Use this to check processing status, view settings, or retrieve metadata about the agent.',
	},
	'projects.create': {
		riskLevel: 'write',
		description:
			'Tool to create a new CustomGPT agent from a sitemap URL or file upload. The agent immediately begins processing the content to build its knowledge base. Use when you need to create a new AI agent with custom knowledge from web content or documents. Either sitemap_path or file must be provided.',
	},
	'projects.update': {
		riskLevel: 'write',
		description:
			"Updates an existing CustomGPT agent's name or configuration settings. Use this to rename an agent or modify its basic properties without affecting its knowledge base. Returns the complete updated project details including all metadata.",
	},
	'projects.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Tool to delete a CustomGPT project by ID. Use when you need to permanently remove an existing agent after confirming the ID. [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'projects.clone': {
		riskLevel: 'write',
		description:
			'Tool to clone a CustomGPT agent (project). Creates a complete copy of an existing agent, including its knowledge base, persona, and settings. Use this to create variations of an agent for testing, or to use an existing agent as a template for a new one.',
	},
	'projects.stats': {
		riskLevel: 'read',
		description:
			'Tool to get agent statistics. Returns usage metrics and performance statistics for an agent, including total conversations, query counts, document statistics, and processing information. Use when you need to monitor agent performance or generate usage reports.',
	},
	'projects.plugins': {
		riskLevel: 'read',
		description:
			'Tool to retrieve plugin details for a specific CustomGPT agent (project). Use when you need to inspect plugin configuration, status, and metadata for an agent.',
	},
	'pages.list': {
		riskLevel: 'read',
		description:
			"Lists all documents in a CustomGPT agent's knowledge base. Returns indexed content including webpages, PDFs, and uploaded files that the agent can reference. Supports filtering by crawl/index status and pagination. Use this to audit knowledge sources or verify successful document ingestion.",
	},
	'pages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Tool to delete a document from a CustomGPT agent's knowledge base. Permanently removes a document and the agent will no longer reference this content when answering questions. Use this to remove outdated or incorrect information. Warning: This action cannot be undone. [DESTRUCTIVE · IRREVERSIBLE]",
	},
	'pages.reindex': {
		riskLevel: 'write',
		description:
			'Tool to reindex a document in CustomGPT knowledge base. Re-crawls and re-indexes a URL-based document to update its content. Use this when the source content has changed and you want the agent to use the updated version. Only works for URL-based documents.',
	},
	'pages.getMetadata': {
		riskLevel: 'read',
		description:
			'Tool to get document metadata including title, source URL, word count, and custom metadata fields. Use this to display document information or manage your knowledge base.',
	},
	'pages.updateMetadata': {
		riskLevel: 'write',
		description:
			'Update document metadata for a specific page in a CustomGPT project. Updates custom metadata fields such as title, description, URL, and image that help organize and manage your knowledge base. Use when you need to add tags, categories, or other organizational information to documents.',
	},
	'sources.list': {
		riskLevel: 'read',
		description:
			"Tool to list all data sources connected to an agent. Returns sources from various origins like sitemaps, Google Drive folders, SharePoint sites, or uploaded files. Use this to manage what content feeds into an agent's knowledge base.",
	},
	'sources.add': {
		riskLevel: 'write',
		description:
			"Add a data source to a CustomGPT agent's knowledge base. Connects content via sitemap URL, file upload, or integration. The system begins indexing immediately after creation. Use when adding documentation, FAQs, or knowledge content to an agent.",
	},
	'sources.update': {
		riskLevel: 'write',
		description:
			'Update source settings for a CustomGPT agent data source. Configure how the source is indexed and kept up to date by adjusting auto-sync frequency, crawl depth, file filters, and refresh behavior. Use this to fine-tune sitemap crawling (JavaScript execution, image extraction), control which pages are added or removed during syncs, and set up custom refresh schedules.',
	},
	'sources.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Tool to delete a data source from a CustomGPT agent. Removes the source and all its documents from the agent's knowledge base. Use this to disconnect content that's no longer relevant or to clean up after testing. [DESTRUCTIVE · IRREVERSIBLE]",
	},
	'licenses.list': {
		riskLevel: 'read',
		description:
			'List all licenses for a CustomGPT project/agent. Returns an array of license objects with details like ID, type, status, and timestamps. Returns an empty array if the project has no licenses or if licenses are not enabled for the project. Use this when you need to check what licenses exist for a specific project/agent.',
	},
	'licenses.get': {
		riskLevel: 'read',
		description:
			'Tool to retrieve a license for a specific project. Use when you need to fetch license details by license ID.',
	},
	'licenses.update': {
		riskLevel: 'write',
		description:
			'Updates the name of an existing license for a CustomGPT project/agent. Prerequisites: - The project must have licenses enabled in its plan - Both project ID and license ID must be valid and exist - Use List Projects to get valid project IDs - Use List Project Licenses to get valid license IDs for a project This action only updates the license name. Other license properties cannot be modified through this endpoint.',
	},
	'licenses.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			"Deletes a license from a CustomGPT project/agent. Requires numeric project ID and license ID. This action is idempotent - it succeeds even if the license doesn't exist (404). The project must have licenses enabled in its plan for this endpoint to work properly. [DESTRUCTIVE · IRREVERSIBLE]",
	},
	'settings.get': {
		riskLevel: 'read',
		description:
			'Retrieve configuration settings for a specific CustomGPT agent/project. Returns settings including: chatbot avatar, background, default prompt, example questions, response source, language, and branding preferences. Use this to inspect agent configuration, audit settings, or retrieve values before making updates. Note: Some newly created projects may not have settings initialized yet and will return a 404.',
	},
	'settings.update': {
		riskLevel: 'write',
		description:
			'Update CustomGPT agent configuration settings. Updates persona instructions, response format, citation style, branding, and deployment settings. Only include fields you want to change - omitted fields retain their current values. Use this to configure agent behavior, customize appearance, or adjust user experience settings.',
	},
	'personas.list': {
		riskLevel: 'read',
		description:
			"Tool to list persona versions for a CustomGPT agent. Use when you need to view the version history of an agent's persona. Every time the persona is updated, a snapshot is automatically saved, allowing you to view changes over time or restore a previous version. Results are paginated. Requires Custom plan.",
	},
	'personas.activate': {
		riskLevel: 'write',
		description:
			"Restore a previous persona version for a CustomGPT agent. Activates a previous persona version, making it the current active persona. This creates a new version entry in the history (it doesn't overwrite), preserving the full audit trail. Use this to roll back to a known-good configuration. Requires Custom plan.",
	},
	'conversations.create': {
		riskLevel: 'write',
		description:
			"Tool to create a new conversation session for a CustomGPT agent. Use this when starting a new chat interaction - it returns a session ID that you'll use to send messages. Optionally provide a name to help identify the conversation later.",
	},
	'messages.list': {
		riskLevel: 'read',
		description:
			"Retrieves all messages from a CustomGPT conversation, including both user queries and AI responses. Use this to view the complete chat history for a specific conversation session. Returns an empty list if the conversation doesn't exist or has no messages.",
	},
	'messages.get': {
		riskLevel: 'read',
		description:
			"Tool to get message details from a CustomGPT conversation. Returns the complete details for a single message, including the user's prompt, the agent's response, timestamps, citations, and any attached metadata.",
	},
	'messages.getTrustScore': {
		riskLevel: 'read',
		description:
			"Tool to retrieve verification trust score for a message in a CustomGPT conversation. Returns a score calculated by checking how well the agent's claims are supported by source documents. Higher scores indicate better-grounded responses with stronger evidence.",
	},
	'messages.verify': {
		riskLevel: 'write',
		description:
			'Tool to verify message accuracy by triggering a fact-checking verification process. Use when you need to verify claims in a conversation message against source documents. The system compares each claim and reports which claims are supported, partially supported, or unsupported.',
	},
	'messages.submitFeedback': {
		riskLevel: 'write',
		description:
			'Tool to submit feedback (thumbs up/down) for a message in a CustomGPT conversation. Use this to record user satisfaction signals that help identify which AI responses are helpful and which need improvement. Feedback can be changed by submitting a new reaction value.',
	},
	'reports.getAnalysis': {
		riskLevel: 'read',
		description:
			'Tool to retrieve analytics chart data for a CustomGPT project. Returns time-series data formatted for charts, with daily or weekly breakdowns of key metrics including conversation counts, query counts, and queries-per-conversation ratios. Use this to generate usage reports, track project engagement over time, or visualize chatbot performance trends.',
	},
	'reports.getConversations': {
		riskLevel: 'read',
		description:
			'Tool to get conversation analytics for a CustomGPT project. Returns conversation metrics including total conversations, average queries per conversation, and other engagement statistics. Use this to understand how users engage with your agent and analyze conversation patterns over time.',
	},
	'reports.getTraffic': {
		riskLevel: 'read',
		description:
			"Tool to retrieve traffic analytics for a CustomGPT agent/project. Returns user traffic metrics including unique visitors, session counts, geographic distribution, and device types. Use this to understand who's using your agent and how they're accessing it.",
	},
	'reports.getIntelligence': {
		riskLevel: 'read',
		description:
			'Tool to get customer intelligence for a CustomGPT project. Returns AI-analyzed insights about users including common intents, emotional sentiment, frequently discussed topics, and emerging trends. Use this to understand what users are asking about and identify patterns in user behavior.',
	},
	'reports.exportLeads': {
		riskLevel: 'read',
		description:
			'Export leads from a CustomGPT project. Returns lead information captured from conversations including email addresses, names, phone numbers, and custom fields. Supports pagination and date range filtering. Use this to sync leads with CRM or marketing tools.',
	},
	'limits.getUsage': {
		riskLevel: 'read',
		description:
			"Get account usage limits showing current usage vs. maximum allowed for projects, storage credits, and API queries. This returns how many projects, storage credits (characters indexed), and queries you've used compared to your account's maximum limits. Use this to monitor quota consumption.",
	},
	'user.getProfile': {
		riskLevel: 'read',
		description:
			"Tool to retrieve the current user's profile information. Use when you need to display or verify authenticated user details after login.",
	},
	'user.updateProfile': {
		riskLevel: 'write',
		description:
			"Updates the authenticated user's profile information in CustomGPT. Use this action to modify profile details such as the user's display name, email address, or profile photo URL. All fields are optional - only the fields you provide will be updated. The action returns the complete updated user profile.",
	},
	'user.searchTeamMembers': {
		riskLevel: 'read',
		description:
			'Tool to search for team members by email address or user ID. Use this to find users when assigning permissions or managing team access. Requires Owner or Admin role to execute.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof customGPTEndpointsNested
>;

export const customGPTAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseCustomGPTPlugin<T extends CustomGPTPluginOptions> =
	CorsairPlugin<
		'customgpt',
		typeof CustomGPTSchema,
		typeof customGPTEndpointsNested,
		typeof customGPTWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCustomGPTPlugin =
	BaseCustomGPTPlugin<CustomGPTPluginOptions>;

export type ExternalCustomGPTPlugin<T extends CustomGPTPluginOptions> =
	BaseCustomGPTPlugin<T>;

export function customgpt<const T extends CustomGPTPluginOptions>(
	incomingOptions: CustomGPTPluginOptions & T = {} as CustomGPTPluginOptions &
		T,
): ExternalCustomGPTPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'customgpt',
		authConfig: customGPTAuthConfig,
		schema: CustomGPTSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: customGPTEndpointsNested,
		webhooks: customGPTWebhooksNested,
		endpointMeta: customGPTEndpointMeta,
		endpointSchemas: customGPTEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: CustomGPTKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('customgpt', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('customgpt', 'api_key');
		},
	} satisfies InternalCustomGPTPlugin;
}

export type {
	ActivatePersonaVersionResponse,
	AddSourceResponse,
	CloneProjectResponse,
	CreateConversationResponse,
	CreateProjectResponse,
	CustomGPTEndpointInputs,
	CustomGPTEndpointOutputs,
	DeletePageResponse,
	DeleteProjectLicenseResponse,
	DeleteProjectResponse,
	DeleteSourceResponse,
	ExportLeadsResponse,
	GetMessageResponse,
	GetMessageTrustScoreResponse,
	GetPageMetadataResponse,
	GetPluginsResponse,
	GetProjectLicenseResponse,
	GetProjectResponse,
	GetProjectSettingsResponse,
	GetReportAnalysisResponse,
	GetReportConversationsResponse,
	GetReportIntelligenceResponse,
	GetReportTrafficResponse,
	GetStatsResponse,
	GetUsageLimitsResponse,
	GetUserProfileResponse,
	ListConversationMessagesResponse,
	ListPagesResponse,
	ListPersonasResponse,
	ListProjectLicensesResponse,
	ListProjectsResponse,
	ListSourcesResponse,
	ReindexPageResponse,
	SearchTeamMembersResponse,
	SubmitMessageFeedbackResponse,
	UpdatePageMetadataResponse,
	UpdateProjectLicenseResponse,
	UpdateProjectResponse,
	UpdateProjectSettingsResponse,
	UpdateSourceResponse,
	UpdateUserProfileResponse,
	VerifyMessageResponse,
} from './endpoints/types';

export type {
	CustomGPTConversation,
	CustomGPTCustomerIntelligence,
	CustomGPTLead,
	CustomGPTLicense,
	CustomGPTMessage,
	CustomGPTPage,
	CustomGPTProject,
	CustomGPTSource,
	CustomGPTSourceSettings,
} from './schema/database';
