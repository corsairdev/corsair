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
import { DeletePerson } from './endpoints';
import type {
	TimelinkEndpointInputs,
	TimelinkEndpointOutputs,
} from './endpoints/types';
import {
	TimelinkEndpointInputSchemas,
	TimelinkEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TimelinkSchema } from './schema';

export type TimelinkPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTimelinkPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof timelinkEndpointsNested>;
};

export type TimelinkContext = CorsairPluginContext<
	typeof TimelinkSchema,
	TimelinkPluginOptions
>;

export type TimelinkKeyBuilderContext =
	KeyBuilderContext<TimelinkPluginOptions>;

export type TimelinkBoundEndpoints = BindEndpoints<
	typeof timelinkEndpointsNested
>;

type TimelinkEndpoint<K extends keyof TimelinkEndpointOutputs> =
	CorsairEndpoint<
		TimelinkContext,
		TimelinkEndpointInputs[K],
		TimelinkEndpointOutputs[K]
	>;

export type TimelinkEndpoints = {
	deletePerson: TimelinkEndpoint<'deletePerson'>;
};

const timelinkEndpointsNested = {
	deletePerson: {
		delete: DeletePerson.delete,
	},
} as const;

export const timelinkEndpointSchemas = {
	'deletePerson.delete': {
		input: TimelinkEndpointInputSchemas.deletePerson,
		output: TimelinkEndpointOutputSchemas.deletePerson,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof timelinkEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const timelinkEndpointMeta = {
	'deletePerson.delete': {
		riskLevel: 'destructive',
		description: 'Delete a person record by their unique identifier.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof timelinkEndpointsNested>;

export const timelinkAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTimelinkPlugin<T extends TimelinkPluginOptions> = CorsairPlugin<
	'timelink',
	typeof TimelinkSchema,
	typeof timelinkEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalTimelinkPlugin = BaseTimelinkPlugin<TimelinkPluginOptions>;

export type ExternalTimelinkPlugin<T extends TimelinkPluginOptions> =
	BaseTimelinkPlugin<T>;

export function timelink<const T extends TimelinkPluginOptions>(
	incomingOptions: TimelinkPluginOptions & T = {} as TimelinkPluginOptions & T,
): ExternalTimelinkPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'timelink',
		authConfig: timelinkAuthConfig,
		schema: TimelinkSchema,
		options,
		hooks: options.hooks,
		endpoints: timelinkEndpointsNested,
		webhooks: {},
		endpointMeta: timelinkEndpointMeta,
		endpointSchemas: timelinkEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TimelinkKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('timelink', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('timelink', 'api_key');
		},
	} satisfies InternalTimelinkPlugin;
}

export type {
	DeletePersonInput,
	DeletePersonResponse,
	TimelinkEndpointInputs,
	TimelinkEndpointOutputs,
} from './endpoints/types';
