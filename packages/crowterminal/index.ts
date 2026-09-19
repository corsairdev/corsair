import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Agent,
	Data,
	Intelligence,
	Memory,
	Sandbox,
	Status,
	Webhooks,
} from './endpoints';
import type {
	CrowterminalEndpointInputs,
	CrowterminalEndpointOutputs,
} from './endpoints/types';
import {
	CrowterminalEndpointInputSchemas,
	CrowterminalEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CrowterminalSchema } from './schema';
import { CrowterminalWebhooks } from './webhooks';
import type { CrowterminalWebhookOutputs } from './webhooks/types';
import {
	DataIngestedEventSchema,
	hasCrowterminalWebhookSignature,
	PostingCompletedEventSchema,
	PostingFailedEventSchema,
	SkillUpdatedEventSchema,
	SkillVersionCreatedEventSchema,
	ValidationBlockedEventSchema,
} from './webhooks/types';

export type CrowterminalPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCrowterminalPlugin['hooks'];
	webhookHooks?: InternalCrowterminalPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof crowterminalEndpointsNested>;
};

export type CrowterminalContext = CorsairPluginContext<
	typeof CrowterminalSchema,
	CrowterminalPluginOptions
>;

export type CrowterminalKeyBuilderContext =
	KeyBuilderContext<CrowterminalPluginOptions>;

export type CrowterminalBoundEndpoints = BindEndpoints<
	typeof crowterminalEndpointsNested
>;

type CrowterminalEndpoint<K extends keyof CrowterminalEndpointOutputs> =
	CorsairEndpoint<
		CrowterminalContext,
		CrowterminalEndpointInputs[K],
		CrowterminalEndpointOutputs[K]
	>;

export type CrowterminalEndpoints = {
	memoryGet: CrowterminalEndpoint<'memoryGet'>;
	memoryGetBulk: CrowterminalEndpoint<'memoryGetBulk'>;
	memoryGetChangelog: CrowterminalEndpoint<'memoryGetChangelog'>;
	memoryGetPattern: CrowterminalEndpoint<'memoryGetPattern'>;
	memoryEngagementAnalysis: CrowterminalEndpoint<'memoryEngagementAnalysis'>;
	memoryCompareMd: CrowterminalEndpoint<'memoryCompareMd'>;
	memoryValidateChanges: CrowterminalEndpoint<'memoryValidateChanges'>;
	dataIngest: CrowterminalEndpoint<'dataIngest'>;
	dataIngestBulk: CrowterminalEndpoint<'dataIngestBulk'>;
	dataGetTypes: CrowterminalEndpoint<'dataGetTypes'>;
	intelGetPlatform: CrowterminalEndpoint<'intelGetPlatform'>;
	intelGetByokPlatform: CrowterminalEndpoint<'intelGetByokPlatform'>;
	statusGet: CrowterminalEndpoint<'statusGet'>;
	statusPing: CrowterminalEndpoint<'statusPing'>;
	statusGetComponents: CrowterminalEndpoint<'statusGetComponents'>;
	statusGetIncidents: CrowterminalEndpoint<'statusGetIncidents'>;
	statusGetHistory: CrowterminalEndpoint<'statusGetHistory'>;
	statusGetUptime: CrowterminalEndpoint<'statusGetUptime'>;
	sandboxGetClient: CrowterminalEndpoint<'sandboxGetClient'>;
	sandboxGetMemory: CrowterminalEndpoint<'sandboxGetMemory'>;
	sandboxEngagementAnalysis: CrowterminalEndpoint<'sandboxEngagementAnalysis'>;
	sandboxValidate: CrowterminalEndpoint<'sandboxValidate'>;
	agentRegister: CrowterminalEndpoint<'agentRegister'>;
	webhooksCreate: CrowterminalEndpoint<'webhooksCreate'>;
	webhooksList: CrowterminalEndpoint<'webhooksList'>;
	webhooksUpdate: CrowterminalEndpoint<'webhooksUpdate'>;
	webhooksDelete: CrowterminalEndpoint<'webhooksDelete'>;
	webhooksTest: CrowterminalEndpoint<'webhooksTest'>;
};

type CrowterminalWebhook<
	K extends keyof CrowterminalWebhookOutputs,
	TEvent,
> = CorsairWebhook<CrowterminalContext, TEvent, CrowterminalWebhookOutputs[K]>;

export type CrowterminalWebhooks = {
	skillUpdated: CrowterminalWebhook<
		'skillUpdated',
		CrowterminalWebhookOutputs['skillUpdated']
	>;
	skillVersionCreated: CrowterminalWebhook<
		'skillVersionCreated',
		CrowterminalWebhookOutputs['skillVersionCreated']
	>;
	dataIngested: CrowterminalWebhook<
		'dataIngested',
		CrowterminalWebhookOutputs['dataIngested']
	>;
	validationBlocked: CrowterminalWebhook<
		'validationBlocked',
		CrowterminalWebhookOutputs['validationBlocked']
	>;
	postingCompleted: CrowterminalWebhook<
		'postingCompleted',
		CrowterminalWebhookOutputs['postingCompleted']
	>;
	postingFailed: CrowterminalWebhook<
		'postingFailed',
		CrowterminalWebhookOutputs['postingFailed']
	>;
};

export type CrowterminalBoundWebhooks = BindWebhooks<CrowterminalWebhooks>;

const crowterminalEndpointsNested = {
	memory: {
		get: Memory.get,
		getBulk: Memory.getBulk,
		getChangelog: Memory.getChangelog,
		getPattern: Memory.getPattern,
		engagementAnalysis: Memory.engagementAnalysis,
		compareMd: Memory.compareMd,
		validateChanges: Memory.validateChanges,
	},
	data: {
		ingest: Data.ingest,
		ingestBulk: Data.ingestBulk,
		getTypes: Data.getTypes,
	},
	intelligence: {
		getPlatform: Intelligence.getPlatform,
		getByokPlatform: Intelligence.getByokPlatform,
	},
	status: {
		get: Status.get,
		ping: Status.ping,
		getComponents: Status.getComponents,
		getIncidents: Status.getIncidents,
		getHistory: Status.getHistory,
		getUptime: Status.getUptime,
	},
	sandbox: {
		getClient: Sandbox.getClient,
		getMemory: Sandbox.getMemory,
		engagementAnalysis: Sandbox.engagementAnalysis,
		validate: Sandbox.validate,
	},
	agent: {
		register: Agent.register,
	},
	webhooks: {
		create: Webhooks.create,
		list: Webhooks.list,
		update: Webhooks.update,
		delete: Webhooks.delete,
		test: Webhooks.test,
	},
} as const;

const crowterminalWebhooksNested = {
	skill: {
		updated: CrowterminalWebhooks.skillUpdated,
		versionCreated: CrowterminalWebhooks.skillVersionCreated,
	},
	data: {
		ingested: CrowterminalWebhooks.dataIngested,
	},
	validation: {
		blocked: CrowterminalWebhooks.validationBlocked,
	},
	posting: {
		completed: CrowterminalWebhooks.postingCompleted,
		failed: CrowterminalWebhooks.postingFailed,
	},
} as const;

export const crowterminalEndpointSchemas = {
	'memory.get': {
		input: CrowterminalEndpointInputSchemas.memoryGet,
		output: CrowterminalEndpointOutputSchemas.memoryGet,
	},
	'memory.getBulk': {
		input: CrowterminalEndpointInputSchemas.memoryGetBulk,
		output: CrowterminalEndpointOutputSchemas.memoryGetBulk,
	},
	'memory.getChangelog': {
		input: CrowterminalEndpointInputSchemas.memoryGetChangelog,
		output: CrowterminalEndpointOutputSchemas.memoryGetChangelog,
	},
	'memory.getPattern': {
		input: CrowterminalEndpointInputSchemas.memoryGetPattern,
		output: CrowterminalEndpointOutputSchemas.memoryGetPattern,
	},
	'memory.engagementAnalysis': {
		input: CrowterminalEndpointInputSchemas.memoryEngagementAnalysis,
		output: CrowterminalEndpointOutputSchemas.memoryEngagementAnalysis,
	},
	'memory.compareMd': {
		input: CrowterminalEndpointInputSchemas.memoryCompareMd,
		output: CrowterminalEndpointOutputSchemas.memoryCompareMd,
	},
	'memory.validateChanges': {
		input: CrowterminalEndpointInputSchemas.memoryValidateChanges,
		output: CrowterminalEndpointOutputSchemas.memoryValidateChanges,
	},
	'data.ingest': {
		input: CrowterminalEndpointInputSchemas.dataIngest,
		output: CrowterminalEndpointOutputSchemas.dataIngest,
	},
	'data.ingestBulk': {
		input: CrowterminalEndpointInputSchemas.dataIngestBulk,
		output: CrowterminalEndpointOutputSchemas.dataIngestBulk,
	},
	'data.getTypes': {
		input: CrowterminalEndpointInputSchemas.dataGetTypes,
		output: CrowterminalEndpointOutputSchemas.dataGetTypes,
	},
	'intelligence.getPlatform': {
		input: CrowterminalEndpointInputSchemas.intelGetPlatform,
		output: CrowterminalEndpointOutputSchemas.intelGetPlatform,
	},
	'intelligence.getByokPlatform': {
		input: CrowterminalEndpointInputSchemas.intelGetByokPlatform,
		output: CrowterminalEndpointOutputSchemas.intelGetByokPlatform,
	},
	'status.get': {
		input: CrowterminalEndpointInputSchemas.statusGet,
		output: CrowterminalEndpointOutputSchemas.statusGet,
	},
	'status.ping': {
		input: CrowterminalEndpointInputSchemas.statusPing,
		output: CrowterminalEndpointOutputSchemas.statusPing,
	},
	'status.getComponents': {
		input: CrowterminalEndpointInputSchemas.statusGetComponents,
		output: CrowterminalEndpointOutputSchemas.statusGetComponents,
	},
	'status.getIncidents': {
		input: CrowterminalEndpointInputSchemas.statusGetIncidents,
		output: CrowterminalEndpointOutputSchemas.statusGetIncidents,
	},
	'status.getHistory': {
		input: CrowterminalEndpointInputSchemas.statusGetHistory,
		output: CrowterminalEndpointOutputSchemas.statusGetHistory,
	},
	'status.getUptime': {
		input: CrowterminalEndpointInputSchemas.statusGetUptime,
		output: CrowterminalEndpointOutputSchemas.statusGetUptime,
	},
	'sandbox.getClient': {
		input: CrowterminalEndpointInputSchemas.sandboxGetClient,
		output: CrowterminalEndpointOutputSchemas.sandboxGetClient,
	},
	'sandbox.getMemory': {
		input: CrowterminalEndpointInputSchemas.sandboxGetMemory,
		output: CrowterminalEndpointOutputSchemas.sandboxGetMemory,
	},
	'sandbox.engagementAnalysis': {
		input: CrowterminalEndpointInputSchemas.sandboxEngagementAnalysis,
		output: CrowterminalEndpointOutputSchemas.sandboxEngagementAnalysis,
	},
	'sandbox.validate': {
		input: CrowterminalEndpointInputSchemas.sandboxValidate,
		output: CrowterminalEndpointOutputSchemas.sandboxValidate,
	},
	'agent.register': {
		input: CrowterminalEndpointInputSchemas.agentRegister,
		output: CrowterminalEndpointOutputSchemas.agentRegister,
	},
	'webhooks.create': {
		input: CrowterminalEndpointInputSchemas.webhooksCreate,
		output: CrowterminalEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.list': {
		input: CrowterminalEndpointInputSchemas.webhooksList,
		output: CrowterminalEndpointOutputSchemas.webhooksList,
	},
	'webhooks.update': {
		input: CrowterminalEndpointInputSchemas.webhooksUpdate,
		output: CrowterminalEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: CrowterminalEndpointInputSchemas.webhooksDelete,
		output: CrowterminalEndpointOutputSchemas.webhooksDelete,
	},
	'webhooks.test': {
		input: CrowterminalEndpointInputSchemas.webhooksTest,
		output: CrowterminalEndpointOutputSchemas.webhooksTest,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof crowterminalEndpointsNested
>;

const crowterminalWebhookSchemas = {
	'skill.updated': {
		description: 'A client skill was updated',
		payload: SkillUpdatedEventSchema,
		response: SkillUpdatedEventSchema,
	},
	'skill.versionCreated': {
		description: 'A new skill version was created',
		payload: SkillVersionCreatedEventSchema,
		response: SkillVersionCreatedEventSchema,
	},
	'data.ingested': {
		description: 'Agent data was ingested',
		payload: DataIngestedEventSchema,
		response: DataIngestedEventSchema,
	},
	'validation.blocked': {
		description: 'A proposed memory change was blocked',
		payload: ValidationBlockedEventSchema,
		response: ValidationBlockedEventSchema,
	},
	'posting.completed': {
		description: 'Content posting completed successfully',
		payload: PostingCompletedEventSchema,
		response: PostingCompletedEventSchema,
	},
	'posting.failed': {
		description: 'Content posting failed',
		payload: PostingFailedEventSchema,
		response: PostingFailedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof crowterminalWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const crowterminalEndpointMeta = {
	'memory.get': {
		riskLevel: 'read',
		description: 'Get the stored skill for one client',
	},
	'memory.getBulk': {
		riskLevel: 'read',
		description: 'Read stored skills for up to 50 clients',
	},
	'memory.getChangelog': {
		riskLevel: 'read',
		description: 'Read the change history of a client skill',
	},
	'memory.getPattern': {
		riskLevel: 'read',
		description: 'Trend one skill field across stored versions',
	},
	'memory.engagementAnalysis': {
		riskLevel: 'read',
		description: 'Correlate every agent field with historical engagement',
	},
	'memory.compareMd': {
		riskLevel: 'read',
		description: 'Diff an agent markdown against all stored versions',
	},
	'memory.validateChanges': {
		riskLevel: 'read',
		description: 'Check proposed edits against historical outcomes',
	},
	'data.ingest': {
		riskLevel: 'write',
		description: 'Ingest one platform analytics data point',
	},
	'data.ingestBulk': {
		riskLevel: 'write',
		description: 'Ingest up to 50 analytics data points at once',
	},
	'data.getTypes': {
		riskLevel: 'read',
		description: 'List the analytics data types each platform accepts',
	},
	'intelligence.getPlatform': {
		riskLevel: 'read',
		description: 'Get TikTok, Instagram and YouTube algorithm insights',
	},
	'intelligence.getByokPlatform': {
		riskLevel: 'read',
		description: 'Get raw algorithm context without LLM inference charges',
	},
	'status.get': {
		riskLevel: 'read',
		description: 'Get CrowTerminal service health',
	},
	'status.ping': {
		riskLevel: 'read',
		description: 'Check that CrowTerminal is responding',
	},
	'status.getComponents': {
		riskLevel: 'read',
		description: 'Get per-component health and latency',
	},
	'status.getIncidents': {
		riskLevel: 'read',
		description: 'List recent incidents and affected components',
	},
	'status.getHistory': {
		riskLevel: 'read',
		description: 'Get seven days of uptime points for charting',
	},
	'status.getUptime': {
		riskLevel: 'read',
		description: 'Get 24h and 7d uptime percentages',
	},
	'sandbox.getClient': {
		riskLevel: 'read',
		description: 'Get mock client data for testing',
	},
	'sandbox.getMemory': {
		riskLevel: 'read',
		description: 'Get mock skill data for testing',
	},
	'sandbox.engagementAnalysis': {
		riskLevel: 'read',
		description: 'Run a mock engagement analysis',
	},
	'sandbox.validate': {
		riskLevel: 'read',
		description: 'Run a mock validation',
	},
	'agent.register': {
		riskLevel: 'write',
		description: 'Self-register an agent and receive a new API key',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Register a CrowTerminal webhook',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description: 'List registered CrowTerminal webhooks',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a CrowTerminal webhook',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a CrowTerminal webhook',
	},
	'webhooks.test': {
		riskLevel: 'write',
		description: 'Send a test delivery to a webhook URL',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof crowterminalEndpointsNested
>;

export const crowterminalAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseCrowterminalPlugin<T extends CrowterminalPluginOptions> =
	CorsairPlugin<
		'crowterminal',
		typeof CrowterminalSchema,
		typeof crowterminalEndpointsNested,
		typeof crowterminalWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCrowterminalPlugin =
	BaseCrowterminalPlugin<CrowterminalPluginOptions>;

export type ExternalCrowterminalPlugin<T extends CrowterminalPluginOptions> =
	BaseCrowterminalPlugin<T>;

export function crowterminal<const T extends CrowterminalPluginOptions>(
	incomingOptions: CrowterminalPluginOptions &
		T = {} as CrowterminalPluginOptions & T,
): ExternalCrowterminalPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'crowterminal',
		authConfig: crowterminalAuthConfig,
		schema: CrowterminalSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: crowterminalEndpointsNested,
		webhooks: crowterminalWebhooksNested,
		endpointMeta: crowterminalEndpointMeta,
		endpointSchemas: crowterminalEndpointSchemas,
		webhookSchemas: crowterminalWebhookSchemas,
		pluginWebhookMatcher: hasCrowterminalWebhookSignature,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CrowterminalKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new AuthMissingError('crowterminal', 'webhook_signature');
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			const res = await ctx.keys.get_api_key();
			if (!res) throw new AuthMissingError('crowterminal', 'api_key');
			return res;
		},
	} satisfies InternalCrowterminalPlugin;
}

export type {
	CrowterminalEndpointInputs,
	CrowterminalEndpointOutputs,
	CrowterminalSkill,
	CrowterminalWebhookEventName,
} from './endpoints/types';
export type {
	CrowterminalWebhookOutputs,
	CrowterminalWebhookPayload,
	DataIngestedEvent,
	PostingCompletedEvent,
	PostingFailedEvent,
	SkillUpdatedEvent,
	SkillVersionCreatedEvent,
	ValidationBlockedEvent,
} from './webhooks/types';
