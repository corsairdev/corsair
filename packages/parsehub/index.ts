import type {
	AuthTypes,
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { ParsehubContext } from './context';
import { Projects, Runs } from './endpoints';
import * as T from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ParsehubSchema } from './schema';

export type { ParsehubContext };

export type ParsehubPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalParsehubPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof parsehubEndpointsNested>;
};

export type ParsehubKeyBuilderContext =
	KeyBuilderContext<ParsehubPluginOptions>;

const parsehubEndpointsNested = {
	projects: Projects,
	runs: Runs,
} as const;

const parsehubWebhooksNested = {} as const;

export type ParsehubBoundEndpoints = BindEndpoints<
	typeof parsehubEndpointsNested
>;

export const parsehubEndpointSchemas = {
	'projects.list': {
		input: T.ListProjectsInputSchema,
		output: T.ListProjectsResponseSchema,
	},
	'projects.get': {
		input: T.GetProjectInputSchema,
		output: T.GetProjectResponseSchema,
	},
	'projects.run': {
		input: T.RunProjectInputSchema,
		output: T.RunProjectResponseSchema,
	},
	'projects.getLastReadyData': {
		input: T.GetLastReadyDataInputSchema,
		output: T.GetLastReadyDataResponseSchema,
	},
	'runs.get': {
		input: T.GetRunInputSchema,
		output: T.GetRunResponseSchema,
	},
	'runs.getData': {
		input: T.GetRunDataInputSchema,
		output: T.GetRunDataResponseSchema,
	},
	'runs.cancel': {
		input: T.CancelRunInputSchema,
		output: T.CancelRunResponseSchema,
	},
	'runs.delete': {
		input: T.DeleteRunInputSchema,
		output: T.DeleteRunResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof parsehubEndpointsNested
>;

const parsehubEndpointMeta = {
	'projects.list': {
		riskLevel: 'read',
		description:
			'List the scraping projects on the ParseHub account, 20 at a time.',
	},
	'projects.get': {
		riskLevel: 'read',
		description:
			'Get one project with its last run, last ready run and the 20 most recent runs.',
	},
	'projects.run': {
		riskLevel: 'destructive',
		description:
			'Start a run of a project on the ParseHub cloud. Returns the new run; poll runs.get until data_ready.',
	},
	'projects.getLastReadyData': {
		riskLevel: 'read',
		description:
			'Get the extracted data of the most recent run of a project that has data ready.',
	},
	'runs.get': {
		riskLevel: 'read',
		description: 'Get one run: status, data_ready, page count and timing.',
	},
	'runs.getData': {
		riskLevel: 'read',
		description: 'Get the data a run extracted, as JSON or CSV.',
	},
	'runs.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a running run. Data extracted so far stays available.',
	},
	'runs.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a run and its data, cancelling it first if it is running.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof parsehubEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const parsehubAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseParsehubPlugin<T extends ParsehubPluginOptions> = CorsairPlugin<
	'parsehub',
	typeof ParsehubSchema,
	typeof parsehubEndpointsNested,
	typeof parsehubWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalParsehubPlugin = BaseParsehubPlugin<ParsehubPluginOptions>;

export type ExternalParsehubPlugin<T extends ParsehubPluginOptions> =
	BaseParsehubPlugin<T>;

export function parsehub<const T extends ParsehubPluginOptions>(
	incomingOptions: ParsehubPluginOptions & T = {} as ParsehubPluginOptions & T,
): ExternalParsehubPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'parsehub',
		authConfig: parsehubAuthConfig,
		schema: ParsehubSchema,
		options,
		hooks: options.hooks,
		endpoints: parsehubEndpointsNested,
		webhooks: parsehubWebhooksNested,
		endpointMeta: parsehubEndpointMeta,
		endpointSchemas: parsehubEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ParsehubKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('parsehub', 'api_key');
				}
				return key;
			}

			return '';
		},
	} satisfies InternalParsehubPlugin;
}
