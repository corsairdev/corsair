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
import { Apps, Lists, Records } from './endpoints';
import type {
	WorkiomEndpointInputs,
	WorkiomEndpointOutputs,
} from './endpoints/types';
import {
	WorkiomEndpointInputSchemas,
	WorkiomEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WorkiomSchema } from './schema';

export type WorkiomPluginOptions = {
	/** Authentication method. Workiom only supports API keys. */
	authType?: PickAuth<'api_key'>;
	/**
	 * Workiom API key, sent as the `X-Api-Key` header. When omitted the key is
	 * resolved from the account key manager instead.
	 */
	key?: string;
	hooks?: InternalWorkiomPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof workiomEndpointsNested>;
};

export type WorkiomContext = CorsairPluginContext<
	typeof WorkiomSchema,
	WorkiomPluginOptions,
	undefined,
	typeof workiomAuthConfig
>;

export type WorkiomKeyBuilderContext = KeyBuilderContext<
	WorkiomPluginOptions,
	typeof workiomAuthConfig
>;

export type WorkiomBoundEndpoints = BindEndpoints<
	typeof workiomEndpointsNested
>;

type WorkiomEndpoint<K extends keyof WorkiomEndpointOutputs> = CorsairEndpoint<
	WorkiomContext,
	WorkiomEndpointInputs[K],
	WorkiomEndpointOutputs[K]
>;

export type WorkiomEndpoints = {
	appsGetAll: WorkiomEndpoint<'appsGetAll'>;
	listsGet: WorkiomEndpoint<'listsGet'>;
	recordsGetAll: WorkiomEndpoint<'recordsGetAll'>;
	recordsCreate: WorkiomEndpoint<'recordsCreate'>;
};

const workiomEndpointsNested = {
	apps: {
		getAll: Apps.getAll,
	},
	lists: {
		get: Lists.get,
	},
	records: {
		getAll: Records.getAll,
		create: Records.create,
	},
} as const;

// No webhooks — Workiom integration is pull-based only for this contribution.
const workiomWebhooksNested = {} as const;

export const workiomEndpointSchemas = {
	'apps.getAll': {
		input: WorkiomEndpointInputSchemas.appsGetAll,
		output: WorkiomEndpointOutputSchemas.appsGetAll,
	},
	'lists.get': {
		input: WorkiomEndpointInputSchemas.listsGet,
		output: WorkiomEndpointOutputSchemas.listsGet,
	},
	'records.getAll': {
		input: WorkiomEndpointInputSchemas.recordsGetAll,
		output: WorkiomEndpointOutputSchemas.recordsGetAll,
	},
	'records.create': {
		input: WorkiomEndpointInputSchemas.recordsCreate,
		output: WorkiomEndpointOutputSchemas.recordsCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof workiomEndpointsNested
>;

const workiomEndpointMeta = {
	'apps.getAll': {
		riskLevel: 'read',
		description: 'List all apps in the Workiom account',
	},
	'lists.get': {
		riskLevel: 'read',
		description: "Get a list's meta-data (fields, views, filters)",
	},
	'records.getAll': {
		riskLevel: 'read',
		description:
			'Get records from a list, with sorting, pagination, and filters',
	},
	'records.create': {
		riskLevel: 'write',
		description: 'Create a new record in a list',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof workiomEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

/** Workiom issues a single account-level API key sent via the X-Api-Key header. */
export const workiomAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseWorkiomPlugin<T extends WorkiomPluginOptions> = CorsairPlugin<
	'workiom',
	typeof WorkiomSchema,
	typeof workiomEndpointsNested,
	typeof workiomWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof workiomAuthConfig
>;

export type InternalWorkiomPlugin = BaseWorkiomPlugin<WorkiomPluginOptions>;

export type ExternalWorkiomPlugin<T extends WorkiomPluginOptions> =
	BaseWorkiomPlugin<T>;

export function workiom<const T extends WorkiomPluginOptions>(
	incomingOptions: WorkiomPluginOptions & T = {} as WorkiomPluginOptions & T,
): ExternalWorkiomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'workiom',
		authConfig: workiomAuthConfig,
		schema: WorkiomSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: workiomEndpointsNested,
		webhooks: workiomWebhooksNested,
		endpointMeta: workiomEndpointMeta,
		endpointSchemas: workiomEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: WorkiomKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const res = await ctx.keys?.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalWorkiomPlugin;
}

export { WORKIOM_API_BASE, WorkiomAPIError } from './client';
export type {
	AppsGetAllInput,
	AppsGetAllResponse,
	ListsGetInput,
	ListsGetResponse,
	RecordsCreateInput,
	RecordsCreateResponse,
	RecordsGetAllInput,
	RecordsGetAllResponse,
	WorkiomEndpointInputs,
	WorkiomEndpointOutputs,
} from './endpoints/types';
export {
	WorkiomEndpointInputSchemas,
	WorkiomEndpointOutputSchemas,
} from './endpoints/types';
