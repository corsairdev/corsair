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
import { Records, WorkspaceMembers } from './endpoints';
import type {
	AttioEndpointInputs,
	AttioEndpointOutputs,
} from './endpoints/types';
import {
	AttioEndpointInputSchemas,
	AttioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AttioSchema } from './schema';
import { RecordWebhooks } from './webhooks';
import { resolveAttioOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchAttioTenantWebhook } from './webhooks/tenant-matcher';
import type {
	AttioWebhookOutputs,
	RecordCreatedEvent,
	RecordDeletedEvent,
	RecordUpdatedEvent,
} from './webhooks/types';
import {
	RecordCreatedEventSchema,
	RecordDeletedEventSchema,
	RecordUpdatedEventSchema,
} from './webhooks/types';

export type AttioPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAttioPlugin['hooks'];
	webhookHooks?: InternalAttioPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof attioEndpointsNested>;
};

export type AttioContext = CorsairPluginContext<
	typeof AttioSchema,
	AttioPluginOptions
>;

export type AttioKeyBuilderContext = KeyBuilderContext<AttioPluginOptions>;

export type AttioBoundEndpoints = BindEndpoints<typeof attioEndpointsNested>;

type AttioEndpoint<K extends keyof AttioEndpointOutputs> = CorsairEndpoint<
	AttioContext,
	AttioEndpointInputs[K],
	AttioEndpointOutputs[K]
>;

export type AttioEndpoints = {
	workspaceMembersList: AttioEndpoint<'workspaceMembersList'>;
	recordsList: AttioEndpoint<'recordsList'>;
	recordsGet: AttioEndpoint<'recordsGet'>;
	recordsCreate: AttioEndpoint<'recordsCreate'>;
};

type AttioWebhook<K extends keyof AttioWebhookOutputs, TEvent> = CorsairWebhook<
	AttioContext,
	TEvent,
	AttioWebhookOutputs[K]
>;

export type AttioWebhooks = {
	recordCreated: AttioWebhook<'recordCreated', RecordCreatedEvent>;
	recordUpdated: AttioWebhook<'recordUpdated', RecordUpdatedEvent>;
	recordDeleted: AttioWebhook<'recordDeleted', RecordDeletedEvent>;
};

export type AttioBoundWebhooks = BindWebhooks<AttioWebhooks>;

const attioEndpointsNested = {
	workspaceMembers: {
		list: WorkspaceMembers.list,
	},
	records: {
		list: Records.list,
		get: Records.get,
		create: Records.create,
	},
} as const;

const attioWebhooksNested = {
	record: {
		created: RecordWebhooks.recordCreated,
		updated: RecordWebhooks.recordUpdated,
		deleted: RecordWebhooks.recordDeleted,
	},
} as const;

export const attioEndpointSchemas = {
	'workspaceMembers.list': {
		input: AttioEndpointInputSchemas.workspaceMembersList,
		output: AttioEndpointOutputSchemas.workspaceMembersList,
	},
	'records.list': {
		input: AttioEndpointInputSchemas.recordsList,
		output: AttioEndpointOutputSchemas.recordsList,
	},
	'records.get': {
		input: AttioEndpointInputSchemas.recordsGet,
		output: AttioEndpointOutputSchemas.recordsGet,
	},
	'records.create': {
		input: AttioEndpointInputSchemas.recordsCreate,
		output: AttioEndpointOutputSchemas.recordsCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof attioEndpointsNested>;

const attioWebhookSchemas = {
	'record.created': {
		description: 'Triggered when a record is created',
		payload: RecordCreatedEventSchema,
		response: RecordCreatedEventSchema,
	},
	'record.updated': {
		description: 'Triggered when a record is updated',
		payload: RecordUpdatedEventSchema,
		response: RecordUpdatedEventSchema,
	},
	'record.deleted': {
		description: 'Triggered when a record is deleted',
		payload: RecordDeletedEventSchema,
		response: RecordDeletedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof attioWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const attioEndpointMeta = {
	'workspaceMembers.list': {
		riskLevel: 'read',
		description: 'List workspace members',
	},
	'records.list': {
		riskLevel: 'read',
		description: 'List or query records of an object type',
	},
	'records.get': {
		riskLevel: 'read',
		description: 'Retrieve a specific record by ID',
	},
	'records.create': {
		riskLevel: 'write',
		description: 'Create a new record',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof attioEndpointsNested>;

export const attioAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAttioPlugin<T extends AttioPluginOptions> = CorsairPlugin<
	'attio',
	typeof AttioSchema,
	typeof attioEndpointsNested,
	typeof attioWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAttioPlugin = BaseAttioPlugin<AttioPluginOptions>;

export type ExternalAttioPlugin<T extends AttioPluginOptions> =
	BaseAttioPlugin<T>;

export function attio<const T extends AttioPluginOptions>(
	incomingOptions: AttioPluginOptions & T = {} as AttioPluginOptions & T,
): ExternalAttioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'attio',
		authConfig: attioAuthConfig,
		schema: AttioSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: attioEndpointsNested,
		webhooks: attioWebhooksNested,
		endpointMeta: attioEndpointMeta,
		endpointSchemas: attioEndpointSchemas,
		webhookSchemas: attioWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'attio-signature' in headers || 'Attio-Signature' in headers;
		},
		pluginTenantWebhookMatcher: matchAttioTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveAttioOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AttioKeyBuilderContext, source) => {
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

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalAttioPlugin;
}

export type {
	AttioEndpointInputs,
	AttioEndpointOutputs,
	RecordsCreateInput,
	RecordsCreateResponse,
	RecordsGetInput,
	RecordsGetResponse,
	RecordsListInput,
	RecordsListResponse,
	WorkspaceMembersListInput,
	WorkspaceMembersListResponse,
} from './endpoints/types';
export type {
	AttioWebhookOutputs,
	RecordCreatedEvent,
	RecordDeletedEvent,
	RecordUpdatedEvent,
} from './webhooks/types';
