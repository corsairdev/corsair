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
import { Rows } from './endpoints';
import type {
	BaserowEndpointInputs,
	BaserowEndpointOutputs,
} from './endpoints/types';
import {
	BaserowEndpointInputSchemas,
	BaserowEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BaserowSchema } from './schema';

export type BaserowPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalBaserowPlugin['hooks'];
	webhookHooks?: InternalBaserowPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof baserowEndpointsNested>;
};

export type BaserowContext = CorsairPluginContext<
	typeof BaserowSchema,
	BaserowPluginOptions
>;

export type BaserowKeyBuilderContext = KeyBuilderContext<BaserowPluginOptions>;

export type BaserowBoundEndpoints = BindEndpoints<
	typeof baserowEndpointsNested
>;

type BaserowEndpoint<K extends keyof BaserowEndpointOutputs> = CorsairEndpoint<
	BaserowContext,
	BaserowEndpointInputs[K],
	BaserowEndpointOutputs[K]
>;

export type BaserowEndpoints = {
	listRows: BaserowEndpoint<'listRows'>;
	getRow: BaserowEndpoint<'getRow'>;
	createRow: BaserowEndpoint<'createRow'>;
	updateRow: BaserowEndpoint<'updateRow'>;
	deleteRow: BaserowEndpoint<'deleteRow'>;
};

const baserowEndpointsNested = {
	rows: {
		list: Rows.list,
		get: Rows.get,
		create: Rows.create,
		update: Rows.update,
		delete: Rows.delete,
	},
} as const;

export const baserowEndpointSchemas = {
	'rows.list': {
		input: BaserowEndpointInputSchemas.listRows,
		output: BaserowEndpointOutputSchemas.listRows,
	},

	'rows.get': {
		input: BaserowEndpointInputSchemas.getRow,
		output: BaserowEndpointOutputSchemas.getRow,
	},

	'rows.create': {
		input: BaserowEndpointInputSchemas.createRow,
		output: BaserowEndpointOutputSchemas.createRow,
	},

	'rows.update': {
		input: BaserowEndpointInputSchemas.updateRow,
		output: BaserowEndpointOutputSchemas.updateRow,
	},

	'rows.delete': {
		input: BaserowEndpointInputSchemas.deleteRow,
		output: BaserowEndpointOutputSchemas.deleteRow,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof baserowEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const baserowEndpointMeta = {
	'rows.list': {
		riskLevel: 'read',
		description: 'List rows from a Baserow table',
	},

	'rows.get': {
		riskLevel: 'read',
		description: 'Get a specific row from a Baserow table',
	},

	'rows.create': {
		riskLevel: 'write',
		description: 'Create a new row in a Baserow table',
	},

	'rows.update': {
		riskLevel: 'write',
		description: 'Update an existing row in a Baserow table',
	},

	'rows.delete': {
		riskLevel: 'write',
		description: 'Delete a row from a Baserow table',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof baserowEndpointsNested>;

export const baserowAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBaserowPlugin<T extends BaserowPluginOptions> = CorsairPlugin<
	'baserow',
	typeof BaserowSchema,
	typeof baserowEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalBaserowPlugin = BaseBaserowPlugin<BaserowPluginOptions>;

export type ExternalBaserowPlugin<T extends BaserowPluginOptions> =
	BaseBaserowPlugin<T>;

export function baserow<const T extends BaserowPluginOptions>(
	incomingOptions: BaserowPluginOptions & T = {} as BaserowPluginOptions & T,
): ExternalBaserowPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'baserow',
		authConfig: baserowAuthConfig,
		schema: BaserowSchema,
		options: options,
		hooks: options.hooks,
		endpoints: baserowEndpointsNested,
		endpointMeta: baserowEndpointMeta,
		endpointSchemas: baserowEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BaserowKeyBuilderContext, source) => {
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
	} satisfies InternalBaserowPlugin;
}

export type {
	BaserowEndpointInputs,
	BaserowEndpointOutputs,
} from './endpoints/types';
