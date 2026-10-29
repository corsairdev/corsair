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
import { Jobs } from './endpoints';
import type {
	AsyncInterviewEndpointInputs,
	AsyncInterviewEndpointOutputs,
} from './endpoints/types';
import {
	AsyncInterviewEndpointInputSchemas,
	AsyncInterviewEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AsyncInterviewSchema } from './schema';

export type AsyncInterviewPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAsyncInterviewPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof asyncInterviewEndpointsNested>;
};

export type AsyncInterviewContext = CorsairPluginContext<
	typeof AsyncInterviewSchema,
	AsyncInterviewPluginOptions
>;

export type AsyncInterviewKeyBuilderContext =
	KeyBuilderContext<AsyncInterviewPluginOptions>;

export type AsyncInterviewBoundEndpoints = BindEndpoints<
	typeof asyncInterviewEndpointsNested
>;

type AsyncInterviewEndpoint<K extends keyof AsyncInterviewEndpointOutputs> =
	CorsairEndpoint<
		AsyncInterviewContext,
		AsyncInterviewEndpointInputs[K],
		AsyncInterviewEndpointOutputs[K]
	>;

export type AsyncInterviewEndpoints = {
	'jobs.delete': AsyncInterviewEndpoint<'jobs.delete'>;
	'jobs.listResponses': AsyncInterviewEndpoint<'jobs.listResponses'>;
	'jobs.list': AsyncInterviewEndpoint<'jobs.list'>;
	'jobs.update': AsyncInterviewEndpoint<'jobs.update'>;
};

const asyncInterviewEndpointsNested = {
	jobs: {
		delete: Jobs.deleteJob,
		listResponses: Jobs.listResponses,
		list: Jobs.listJobs,
		update: Jobs.updateJob,
	},
} as const;

export const asyncInterviewEndpointSchemas = {
	'jobs.delete': {
		input: AsyncInterviewEndpointInputSchemas['jobs.delete'],
		output: AsyncInterviewEndpointOutputSchemas['jobs.delete'],
	},
	'jobs.listResponses': {
		input: AsyncInterviewEndpointInputSchemas['jobs.listResponses'],
		output: AsyncInterviewEndpointOutputSchemas['jobs.listResponses'],
	},
	'jobs.list': {
		input: AsyncInterviewEndpointInputSchemas['jobs.list'],
		output: AsyncInterviewEndpointOutputSchemas['jobs.list'],
	},
	'jobs.update': {
		input: AsyncInterviewEndpointInputSchemas['jobs.update'],
		output: AsyncInterviewEndpointOutputSchemas['jobs.update'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof asyncInterviewEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const asyncInterviewEndpointMeta = {
	'jobs.delete': {
		riskLevel: 'destructive',
		description: 'Deletes an interview job permanently.',
	},
	'jobs.listResponses': {
		riskLevel: 'read',
		description: 'Retrieves all interview responses with candidate details.',
	},
	'jobs.list': {
		riskLevel: 'read',
		description: 'Retrieves a list of all interview jobs.',
	},
	'jobs.update': {
		riskLevel: 'write',
		description: "Updates an existing interview job's details after creation.",
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof asyncInterviewEndpointsNested
>;

export const asyncInterviewAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseAsyncInterviewPlugin<T extends AsyncInterviewPluginOptions> =
	CorsairPlugin<
		'asyncinterview',
		typeof AsyncInterviewSchema,
		typeof asyncInterviewEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalAsyncInterviewPlugin =
	BaseAsyncInterviewPlugin<AsyncInterviewPluginOptions>;

export type ExternalAsyncInterviewPlugin<
	T extends AsyncInterviewPluginOptions,
> = BaseAsyncInterviewPlugin<T>;

export function asyncinterview<const T extends AsyncInterviewPluginOptions>(
	incomingOptions: AsyncInterviewPluginOptions &
		T = {} as AsyncInterviewPluginOptions & T,
): ExternalAsyncInterviewPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'asyncinterview',
		authConfig: asyncInterviewAuthConfig,
		schema: AsyncInterviewSchema,
		options: options,
		hooks: options.hooks,
		endpoints: asyncInterviewEndpointsNested,
		webhooks: {},
		endpointMeta: asyncInterviewEndpointMeta,
		endpointSchemas: asyncInterviewEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AsyncInterviewKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				if (typeof ctx.keys?.get_api_key !== 'function') {
					throw new AuthMissingError('asyncinterview', 'api_key');
				}
				try {
					const res = await ctx.keys.get_api_key();
					if (!res) {
						throw new AuthMissingError('asyncinterview', 'api_key');
					}
					return res;
				} catch (error) {
					if (error instanceof AuthMissingError) throw error;
					const msg = error instanceof Error ? error.message : '';
					if (
						msg.includes('Account not found') ||
						(msg.includes('Integration "') && msg.includes('not found')) ||
						msg.includes('No DEK found')
					) {
						throw new AuthMissingError('asyncinterview', 'api_key');
					}
					throw error;
				}
			}

			throw new AuthMissingError('asyncinterview', 'api_key');
		},
	} satisfies InternalAsyncInterviewPlugin;
}

export type {
	AsyncInterviewEndpointInputs,
	AsyncInterviewEndpointOutputs,
} from './endpoints/types';
