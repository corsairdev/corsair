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
import { CodaActions } from './endpoints';
import type {
	CodaEndpointInputs,
	CodaEndpointOutputs,
} from './endpoints/types';
import {
	CodaEndpointInputSchemas,
	CodaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CodaSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveCodaOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchCodaTenantWebhook } from './webhooks/tenant-matcher';
import type { CodaWebhookOutputs, ExampleEvent } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type CodaPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCodaPlugin['hooks'];
	webhookHooks?: InternalCodaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof codaEndpointsNested>;
};

export type CodaContext = CorsairPluginContext<
	typeof CodaSchema,
	CodaPluginOptions
>;

export type CodaKeyBuilderContext = KeyBuilderContext<CodaPluginOptions>;

export type CodaBoundEndpoints = BindEndpoints<typeof codaEndpointsNested>;

type CodaEndpoint<K extends keyof CodaEndpointOutputs> = CorsairEndpoint<
	CodaContext,
	CodaEndpointInputs[K],
	CodaEndpointOutputs[K]
>;

export type CodaEndpoints = {
	whoami: CodaEndpoint<'whoami'>;
	listDocs: CodaEndpoint<'listDocs'>;
	listTables: CodaEndpoint<'listTables'>;
	insertRows: CodaEndpoint<'insertRows'>;
};

type CodaWebhook<K extends keyof CodaWebhookOutputs, TEvent> = CorsairWebhook<
	CodaContext,
	TEvent,
	CodaWebhookOutputs[K]
>;

export type CodaWebhooks = {
	example: CodaWebhook<'example', ExampleEvent>;
};

export type CodaBoundWebhooks = BindWebhooks<CodaWebhooks>;

const codaEndpointsNested = {
	auth: {
		whoami: CodaActions.whoami,
	},
	docs: {
		list: CodaActions.listDocs,
	},
	tables: {
		list: CodaActions.listTables,
		insertRows: CodaActions.insertRows,
	},
} as const;

const codaWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const codaEndpointSchemas = {
	'auth.whoami': {
		input: CodaEndpointInputSchemas.whoami,
		output: CodaEndpointOutputSchemas.whoami,
	},
	'docs.list': {
		input: CodaEndpointInputSchemas.listDocs,
		output: CodaEndpointOutputSchemas.listDocs,
	},
	'tables.list': {
		input: CodaEndpointInputSchemas.listTables,
		output: CodaEndpointOutputSchemas.listTables,
	},
	'tables.insertRows': {
		input: CodaEndpointInputSchemas.insertRows,
		output: CodaEndpointOutputSchemas.insertRows,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof codaEndpointsNested>;

const codaWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof codaWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const codaEndpointMeta = {
	'auth.whoami': {
		riskLevel: 'read',
		description: 'Fetch current user information',
	},
	'docs.list': {
		riskLevel: 'read',
		description: 'List accessible Coda documents',
	},
	'tables.list': {
		riskLevel: 'read',
		description: 'List tables within a Coda doc',
	},
	'tables.insertRows': {
		riskLevel: 'write',
		description: 'Insert new rows into a Coda table',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof codaEndpointsNested>;

export const codaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCodaPlugin<T extends CodaPluginOptions> = CorsairPlugin<
	'coda',
	typeof CodaSchema,
	typeof codaEndpointsNested,
	typeof codaWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCodaPlugin = BaseCodaPlugin<CodaPluginOptions>;

export type ExternalCodaPlugin<T extends CodaPluginOptions> = BaseCodaPlugin<T>;

export function coda<const T extends CodaPluginOptions>(
	incomingOptions: CodaPluginOptions & T = {} as CodaPluginOptions & T,
): ExternalCodaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'coda',
		authConfig: codaAuthConfig,
		schema: CodaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: codaEndpointsNested,
		webhooks: codaWebhooksNested,
		endpointMeta: codaEndpointMeta,
		endpointSchemas: codaEndpointSchemas,
		webhookSchemas: codaWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-coda-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchCodaTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveCodaOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CodaKeyBuilderContext, source) => {
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
	} satisfies InternalCodaPlugin;
}

export type {
	CodaEndpointInputs,
	CodaEndpointOutputs,
	InsertRowsInput,
	InsertRowsResponse,
	ListDocsInput,
	ListDocsResponse,
	ListTablesInput,
	ListTablesResponse,
	WhoamiInput,
	WhoamiResponse,
} from './endpoints/types';
export type {
	CodaWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
