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
import { Data, Memory, Status, Webhooks } from './endpoints';
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
	memoryEngagementAnalysis: CrowterminalEndpoint<'memoryEngagementAnalysis'>;
	dataIngest: CrowterminalEndpoint<'dataIngest'>;
	statusGet: CrowterminalEndpoint<'statusGet'>;
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
		engagementAnalysis: Memory.engagementAnalysis,
	},
	data: {
		ingest: Data.ingest,
	},
	status: {
		get: Status.get,
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
	'memory.engagementAnalysis': {
		input: CrowterminalEndpointInputSchemas.memoryEngagementAnalysis,
		output: CrowterminalEndpointOutputSchemas.memoryEngagementAnalysis,
	},
	'data.ingest': {
		input: CrowterminalEndpointInputSchemas.dataIngest,
		output: CrowterminalEndpointOutputSchemas.dataIngest,
	},
	'status.get': {
		input: CrowterminalEndpointInputSchemas.statusGet,
		output: CrowterminalEndpointOutputSchemas.statusGet,
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
		description: 'Get the latest version of a client skill',
	},
	'memory.engagementAnalysis': {
		riskLevel: 'read',
		description: 'Analyze a client skill against historical engagement',
	},
	'data.ingest': {
		riskLevel: 'write',
		description: 'Ingest a platform data point for a client',
	},
	'status.get': {
		riskLevel: 'read',
		description: 'Get CrowTerminal service health',
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
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCrowterminalPlugin;
}

export type {
	CreateWebhookInput,
	CreateWebhookResponse,
	CrowterminalEndpointInputs,
	CrowterminalEndpointOutputs,
	DeleteWebhookInput,
	DeleteWebhookResponse,
	EngagementAnalysisInput,
	EngagementAnalysisResponse,
	GetMemoryInput,
	GetMemoryResponse,
	GetStatusInput,
	GetStatusResponse,
	IngestDataInput,
	IngestDataResponse,
	ListWebhooksInput,
	ListWebhooksResponse,
	TestWebhookInput,
	TestWebhookResponse,
	UpdateWebhookInput,
	UpdateWebhookResponse,
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
