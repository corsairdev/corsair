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
} from 'corsair/core';
import { Bases, Records, Webhooks } from './endpoints';
import type {
	AirtableEndpointInputs,
	AirtableEndpointOutputs,
} from './endpoints/types';
import {
	AirtableEndpointInputSchemas,
	AirtableEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AirtableSchema } from './schema';
import { EventWebhooks } from './webhooks';
import type { AirtableEvent, AirtableWebhookOutputs } from './webhooks/types';
import {
	AirtableEventPayloadSchema,
	AirtableEventSchema,
} from './webhooks/types';

export type AirtablePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAirtablePlugin['hooks'];
	webhookHooks?: InternalAirtablePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof airtableEndpointsNested>;
};

export type AirtableContext = CorsairPluginContext<
	typeof AirtableSchema,
	AirtablePluginOptions
>;

export type AirtableKeyBuilderContext =
	KeyBuilderContext<AirtablePluginOptions>;

export type AirtableBoundEndpoints = BindEndpoints<
	typeof airtableEndpointsNested
>;

type AirtableEndpoint<K extends keyof AirtableEndpointOutputs> =
	CorsairEndpoint<
		AirtableContext,
		AirtableEndpointInputs[K],
		AirtableEndpointOutputs[K]
	>;

export type AirtableEndpoints = {
	basesGetMany: AirtableEndpoint<'basesGetMany'>;
	basesGetSchema: AirtableEndpoint<'basesGetSchema'>;
	recordsCreate: AirtableEndpoint<'recordsCreate'>;
	recordsCreateOrUpdate: AirtableEndpoint<'recordsCreateOrUpdate'>;
	recordsDelete: AirtableEndpoint<'recordsDelete'>;
	recordsGet: AirtableEndpoint<'recordsGet'>;
	recordsSearch: AirtableEndpoint<'recordsSearch'>;
	recordsUpdate: AirtableEndpoint<'recordsUpdate'>;
};

type AirtableWebhook<
	K extends keyof AirtableWebhookOutputs,
	TEvent,
> = CorsairWebhook<AirtableContext, TEvent, AirtableWebhookOutputs[K]>;

export type AirtableWebhooks = {
	event: AirtableWebhook<'event', AirtableEvent>;
};

export type AirtableBoundWebhooks = BindWebhooks<AirtableWebhooks>;

const airtableEndpointsNested = {
	bases: {
		getMany: Bases.getMany,
		getSchema: Bases.getSchema,
	},
	records: {
		create: Records.create,
		createOrUpdate: Records.createOrUpdate,
		delete: Records.delete,
		get: Records.get,
		search: Records.search,
		update: Records.update,
	},
	webhooks: {
		getPayloads: Webhooks.getPayloads,
	},
} as const;

const airtableWebhooksNested = {
	events: {
		event: EventWebhooks.event,
	},
} as const;

export const airtableEndpointSchemas = {
	'bases.getMany': {
		input: AirtableEndpointInputSchemas.basesGetMany,
		output: AirtableEndpointOutputSchemas.basesGetMany,
	},
	'bases.getSchema': {
		input: AirtableEndpointInputSchemas.basesGetSchema,
		output: AirtableEndpointOutputSchemas.basesGetSchema,
	},
	'records.create': {
		input: AirtableEndpointInputSchemas.recordsCreate,
		output: AirtableEndpointOutputSchemas.recordsCreate,
	},
	'records.createOrUpdate': {
		input: AirtableEndpointInputSchemas.recordsCreateOrUpdate,
		output: AirtableEndpointOutputSchemas.recordsCreateOrUpdate,
	},
	'records.delete': {
		input: AirtableEndpointInputSchemas.recordsDelete,
		output: AirtableEndpointOutputSchemas.recordsDelete,
	},
	'records.get': {
		input: AirtableEndpointInputSchemas.recordsGet,
		output: AirtableEndpointOutputSchemas.recordsGet,
	},
	'records.search': {
		input: AirtableEndpointInputSchemas.recordsSearch,
		output: AirtableEndpointOutputSchemas.recordsSearch,
	},
	'records.update': {
		input: AirtableEndpointInputSchemas.recordsUpdate,
		output: AirtableEndpointOutputSchemas.recordsUpdate,
	},
} as const;

const airtableWebhookSchemas = {
	'events.event': {
		description: 'On new Airtable event — fires when records or tables change',
		payload: AirtableEventPayloadSchema,
		response: AirtableEventSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const airtableEndpointMeta = {
	'bases.getMany': {
		riskLevel: 'read',
		description: 'List all accessible bases',
	},
	'bases.getSchema': {
		riskLevel: 'read',
		description: 'Get the schema (tables, fields, views) of a base',
	},
	'records.create': {
		riskLevel: 'write',
		description: 'Create a record in a table',
	},
	'records.createOrUpdate': {
		riskLevel: 'write',
		description: 'Create or update a record using upsert',
	},
	'records.delete': {
		riskLevel: 'destructive',
		description: 'Delete a record from a table [DESTRUCTIVE]',
	},
	'records.get': {
		riskLevel: 'read',
		description: 'Get a single record by ID',
	},
	'records.search': {
		riskLevel: 'read',
		description: 'Search and list records with optional filters',
	},
	'records.update': {
		riskLevel: 'write',
		description: 'Update fields on an existing record',
	},
} as const;

export const airtableAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAirtablePlugin<T extends AirtablePluginOptions> = CorsairPlugin<
	'airtable',
	typeof AirtableSchema,
	typeof airtableEndpointsNested,
	typeof airtableWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAirtablePlugin = BaseAirtablePlugin<AirtablePluginOptions>;

export type ExternalAirtablePlugin<T extends AirtablePluginOptions> =
	BaseAirtablePlugin<T>;

export function airtable<const T extends AirtablePluginOptions>(
	incomingOptions: AirtablePluginOptions & T = {} as AirtablePluginOptions & T,
): ExternalAirtablePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'airtable',
		schema: AirtableSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: airtableEndpointsNested,
		webhooks: airtableWebhooksNested,
		endpointMeta: airtableEndpointMeta,
		endpointSchemas: airtableEndpointSchemas,
		webhookSchemas: airtableWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const hasMac = 'x-airtable-content-mac' in headers;
			return hasMac;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AirtableKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalAirtablePlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AirtableActionMetadata,
	AirtableEvent,
	AirtableWebhookOutputs,
	AirtableWebhookPayload,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	AirtableEndpointInputs,
	AirtableEndpointOutputs,
	BasesGetManyInput,
	BasesGetManyResponse,
	BasesGetSchemaInput,
	BasesGetSchemaResponse,
	RecordsCreateInput,
	RecordsCreateOrUpdateInput,
	RecordsCreateOrUpdateResponse,
	RecordsCreateResponse,
	RecordsDeleteInput,
	RecordsDeleteResponse,
	RecordsGetInput,
	RecordsGetResponse,
	RecordsSearchInput,
	RecordsSearchResponse,
	RecordsUpdateInput,
	RecordsUpdateResponse,
} from './endpoints/types';
