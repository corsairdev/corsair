import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { ActionItems, Incidents } from './endpoints';
import type {
	RootlyEndpointInputs,
	RootlyEndpointOutputs,
} from './endpoints/types';
import {
	RootlyEndpointInputSchemas,
	RootlyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { RootlySchema } from './schema';

export type RootlyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRootlyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof rootlyEndpointsNested>;
};

export type RootlyContext = CorsairPluginContext<
	typeof RootlySchema,
	RootlyPluginOptions
>;

export type RootlyKeyBuilderContext = KeyBuilderContext<RootlyPluginOptions>;

export type RootlyBoundEndpoints = BindEndpoints<typeof rootlyEndpointsNested>;

type RootlyEndpoint<K extends keyof RootlyEndpointOutputs> = CorsairEndpoint<
	RootlyContext,
	RootlyEndpointInputs[K],
	RootlyEndpointOutputs[K]
>;

export type RootlyEndpoints = {
	actionItemsList: RootlyEndpoint<'actionItemsList'>;
	actionItemGet: RootlyEndpoint<'actionItemGet'>;
	actionItemDelete: RootlyEndpoint<'actionItemDelete'>;
	incidentGet: RootlyEndpoint<'incidentGet'>;
	incidentUpdate: RootlyEndpoint<'incidentUpdate'>;
	incidentDelete: RootlyEndpoint<'incidentDelete'>;
};

export type RootlyWebhooks = {};

export type RootlyBoundWebhooks = BindWebhooks<RootlyWebhooks>;

const rootlyEndpointsNested = {
	actionItems: {
		list: ActionItems.list,
		get: ActionItems.get,
		delete: ActionItems.delete,
	},
	incidents: {
		get: Incidents.get,
		update: Incidents.update,
		delete: Incidents.delete,
	},
} as const;

export const rootlyEndpointSchemas = {
	'actionItems.list': {
		input: RootlyEndpointInputSchemas.actionItemsList,
		output: RootlyEndpointOutputSchemas.actionItemsList,
	},
	'actionItems.get': {
		input: RootlyEndpointInputSchemas.actionItemGet,
		output: RootlyEndpointOutputSchemas.actionItemGet,
	},
	'actionItems.delete': {
		input: RootlyEndpointInputSchemas.actionItemDelete,
		output: RootlyEndpointOutputSchemas.actionItemDelete,
	},
	'incidents.get': {
		input: RootlyEndpointInputSchemas.incidentGet,
		output: RootlyEndpointOutputSchemas.incidentGet,
	},
	'incidents.update': {
		input: RootlyEndpointInputSchemas.incidentUpdate,
		output: RootlyEndpointOutputSchemas.incidentUpdate,
	},
	'incidents.delete': {
		input: RootlyEndpointInputSchemas.incidentDelete,
		output: RootlyEndpointOutputSchemas.incidentDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof rootlyEndpointsNested
>;

const rootlyEndpointMeta = {
	'actionItems.list': {
		riskLevel: 'read',
		description: 'List action items for a Rootly incident',
	},
	'actionItems.get': {
		riskLevel: 'read',
		description: 'Get a Rootly incident action item',
	},
	'actionItems.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Rootly incident action item',
	},
	'incidents.get': {
		riskLevel: 'read',
		description: 'Get a Rootly incident',
	},
	'incidents.update': {
		riskLevel: 'write',
		description: 'Update a Rootly incident',
	},
	'incidents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Rootly incident',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof rootlyEndpointsNested>;

export const rootlyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key';

export type BaseRootlyPlugin<T extends RootlyPluginOptions> = CorsairPlugin<
	'rootly',
	typeof RootlySchema,
	typeof rootlyEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRootlyPlugin = BaseRootlyPlugin<RootlyPluginOptions>;

export type ExternalRootlyPlugin<T extends RootlyPluginOptions> =
	BaseRootlyPlugin<T>;

export function rootly<const T extends RootlyPluginOptions>(
	incomingOptions: RootlyPluginOptions & T = {} as RootlyPluginOptions & T,
): ExternalRootlyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'rootly',
		schema: RootlySchema,
		options,
		authConfig: rootlyAuthConfig,
		hooks: options.hooks,
		endpoints: rootlyEndpointsNested,
		webhooks: {},
		endpointMeta: rootlyEndpointMeta,
		endpointSchemas: rootlyEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: RootlyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('rootly', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('rootly', ctx.authType ?? defaultAuthType);
		},
	} satisfies InternalRootlyPlugin;
}

export const rootlyWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<RootlyWebhooks>;

export type {
	RootlyEndpointInputs,
	RootlyEndpointOutputs,
} from './endpoints/types';
