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
import { tryGetStoredKey } from './client';
import { Projects } from './endpoints';
import type {
	TimecampEndpointInputs,
	TimecampEndpointOutputs,
} from './endpoints/types';
import {
	TimecampEndpointInputSchemas,
	TimecampEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TimecampSchema } from './schema';

export type TimecampPluginOptions = {
	/** Authentication method. TimeCamp only issues account API tokens. */
	authType?: PickAuth<'api_key'>;
	/**
	 * TimeCamp API token, from Account Settings. Account-level rather than
	 * per-user, and sent as a bearer token on every request.
	 */
	key?: string;
	hooks?: InternalTimecampPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof timecampEndpointsNested>;
};

export type TimecampContext = CorsairPluginContext<
	typeof TimecampSchema,
	TimecampPluginOptions,
	undefined,
	typeof timecampAuthConfig
>;

export type TimecampKeyBuilderContext = KeyBuilderContext<
	TimecampPluginOptions,
	typeof timecampAuthConfig
>;

export type TimecampBoundEndpoints = BindEndpoints<
	typeof timecampEndpointsNested
>;

type TimecampEndpoint<K extends keyof TimecampEndpointOutputs> =
	CorsairEndpoint<
		TimecampContext,
		TimecampEndpointInputs[K],
		TimecampEndpointOutputs[K]
	>;

export type TimecampEndpoints = {
	getProjectsList: TimecampEndpoint<'getProjectsList'>;
};

const timecampEndpointsNested = {
	projects: {
		getList: Projects.getList,
	},
} as const;

// No webhooks — TimeCamp exposes no event delivery, so the integration is
// pull-based only.
const timecampWebhooksNested = {} as const;

export const timecampEndpointSchemas = {
	'projects.getList': {
		input: TimecampEndpointInputSchemas.getProjectsList,
		output: TimecampEndpointOutputSchemas.getProjectsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof timecampEndpointsNested
>;

const timecampEndpointMeta = {
	'projects.getList': {
		riskLevel: 'read',
		description:
			'List TimeCamp projects (root-level tasks), returning task id, name, archived status, colour, budget information and assigned users',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof timecampEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const timecampAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTimecampPlugin<T extends TimecampPluginOptions> = CorsairPlugin<
	'timecamp',
	typeof TimecampSchema,
	typeof timecampEndpointsNested,
	typeof timecampWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof timecampAuthConfig
>;

export type InternalTimecampPlugin = BaseTimecampPlugin<TimecampPluginOptions>;

export type ExternalTimecampPlugin<T extends TimecampPluginOptions> =
	BaseTimecampPlugin<T>;

export function timecamp<const T extends TimecampPluginOptions>(
	// Safe: T extends TimecampPluginOptions, so an empty object is a valid
	// no-op default. TypeScript cannot verify T = {} on its own.
	incomingOptions: TimecampPluginOptions & T = {} as TimecampPluginOptions & T,
): ExternalTimecampPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'timecamp',
		authConfig: timecampAuthConfig,
		schema: TimecampSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: timecampEndpointsNested,
		webhooks: timecampWebhooksNested,
		endpointMeta: timecampEndpointMeta,
		endpointSchemas: timecampEndpointSchemas,
		// No webhooks — nothing to match against.
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TimecampKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint') {
				const stored = await tryGetStoredKey(() => ctx.keys?.get_api_key());
				if (!stored) {
					throw new AuthMissingError('timecamp', 'api_key');
				}
				return stored;
			}

			return '';
		},
	} satisfies InternalTimecampPlugin;
}

export { TIMECAMP_API_BASE, TimecampAPIError } from './client';
export { Projects } from './endpoints';
export type {
	GetProjectsListInput,
	GetProjectsListResponse,
	TimecampEndpointInputs,
	TimecampEndpointOutputs,
	TimecampProject,
} from './endpoints/types';
export {
	GetProjectsListInputSchema,
	GetProjectsListResponseSchema,
	TimecampProjectSchema,
} from './endpoints/types';
export { TimecampSchema } from './schema';
