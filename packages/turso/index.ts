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
import { Databases } from './endpoints';
import type {
	TursoEndpointInputs,
	TursoEndpointOutputs,
} from './endpoints/types';
import {
	TursoEndpointInputSchemas,
	TursoEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TursoSchema } from './schema';

export type TursoPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTursoPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tursoEndpointsNested>;
};

export type TursoContext = CorsairPluginContext<
	typeof TursoSchema,
	TursoPluginOptions
>;

export type TursoKeyBuilderContext = KeyBuilderContext<TursoPluginOptions>;

export type TursoBoundEndpoints = BindEndpoints<typeof tursoEndpointsNested>;

type TursoEndpoint<K extends keyof TursoEndpointOutputs> = CorsairEndpoint<
	TursoContext,
	TursoEndpointInputs[K],
	TursoEndpointOutputs[K]
>;

export type TursoEndpoints = {
	listDatabases: TursoEndpoint<'listDatabases'>;
	createDatabase: TursoEndpoint<'createDatabase'>;
	deleteDatabase: TursoEndpoint<'deleteDatabase'>;
};

export type TursoWebhooks = {};

export type TursoBoundWebhooks = BindWebhooks<TursoWebhooks>;

const tursoEndpointsNested = {
	database: {
		list: Databases.list,
		create: Databases.create,
		delete: Databases.delete,
	},
} as const;

const tursoWebhooksNested = {} as const;

export const tursoEndpointSchemas = {
	'database.list': {
		input: TursoEndpointInputSchemas.listDatabases,
		output: TursoEndpointOutputSchemas.listDatabases,
	},
	'database.create': {
		input: TursoEndpointInputSchemas.createDatabase,
		output: TursoEndpointOutputSchemas.createDatabase,
	},
	'database.delete': {
		input: TursoEndpointInputSchemas.deleteDatabase,
		output: TursoEndpointOutputSchemas.deleteDatabase,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof tursoEndpointsNested>;

const tursoWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof tursoWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const tursoEndpointMeta = {
	'database.list': {
		riskLevel: 'read',
		description: 'List Turso databases',
	},
	'database.create': {
		riskLevel: 'write',
		description: 'Create a Turso database',
	},
	'database.delete': {
		riskLevel: 'write',
		description: 'Delete a Turso database',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tursoEndpointsNested>;

export const tursoAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTursoPlugin<T extends TursoPluginOptions> = CorsairPlugin<
	'turso',
	typeof TursoSchema,
	typeof tursoEndpointsNested,
	typeof tursoWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTursoPlugin = BaseTursoPlugin<TursoPluginOptions>;

export type ExternalTursoPlugin<T extends TursoPluginOptions> =
	BaseTursoPlugin<T>;

export function turso<const T extends TursoPluginOptions>(
	incomingOptions: TursoPluginOptions & T = {} as TursoPluginOptions & T,
): ExternalTursoPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'turso',
		authConfig: tursoAuthConfig,
		schema: TursoSchema,
		options,
		hooks: options.hooks,
		endpoints: tursoEndpointsNested,
		webhooks: tursoWebhooksNested,
		endpointMeta: tursoEndpointMeta,
		endpointSchemas: tursoEndpointSchemas,
		webhookSchemas: tursoWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TursoKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalTursoPlugin;
}

export type {
	CreateDatabaseInput,
	CreateDatabaseResponse,
	Database,
	DeleteDatabaseInput,
	DeleteDatabaseResponse,
	ListDatabasesInput,
	ListDatabasesResponse,
	TursoEndpointInputs,
	TursoEndpointOutputs,
} from './endpoints/types';
