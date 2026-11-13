import type {
	BindEndpoints,
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
import * as endpoints from './endpoints';
import { schemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { StackAISchema } from './schema';
import { createWriteContext } from './write-guard';

export type StackAIPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	baseURL?: string;
	hooks?: InternalStackAIPlugin['hooks'];
	permissions?: PluginPermissionsConfig<typeof stackAIEndpoints>;
};
export type StackAIContext = CorsairPluginContext<
	typeof StackAISchema,
	StackAIPluginOptions
>;
export type StackAIBoundEndpoints = BindEndpoints<typeof stackAIEndpoints>;
const stackAIEndpoints = {
	projects: { ioSchema: endpoints.ioSchema },
	runs: {
		start: endpoints.start,
		list: endpoints.list,
		get: endpoints.get,
		cancel: endpoints.cancel,
		resume: endpoints.resume,
	},
} as const;
export const stackAIEndpointSchemas =
	schemas satisfies RequiredPluginEndpointSchemas<typeof stackAIEndpoints>;
const endpointMeta = {
	'projects.ioSchema': {
		riskLevel: 'read',
		description: 'Inspect a project version input and output schema.',
	},
	'runs.start': {
		riskLevel: 'write',
		description: 'Start an asynchronous project run.',
	},
	'runs.list': {
		riskLevel: 'read',
		description: 'List runs using cursor pagination and filters.',
	},
	'runs.get': {
		riskLevel: 'read',
		description: 'Get a run and its current state.',
	},
	'runs.cancel': {
		riskLevel: 'write',
		description: 'Request cancellation of an owned run.',
	},
	'runs.resume': {
		riskLevel: 'write',
		description: 'Resume an ask-human paused run.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof stackAIEndpoints>;
const defaultAuthType = 'api_key' as const;
export const stackAIAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;
export type InternalStackAIPlugin = CorsairPlugin<
	'stackai',
	typeof StackAISchema,
	typeof stackAIEndpoints,
	Record<string, never>,
	StackAIPluginOptions,
	typeof defaultAuthType
>;
export type ExternalStackAIPlugin<T extends StackAIPluginOptions> =
	CorsairPlugin<
		'stackai',
		typeof StackAISchema,
		typeof stackAIEndpoints,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export function stackai<const T extends StackAIPluginOptions>(
	incomingOptions: StackAIPluginOptions & T = {} as StackAIPluginOptions & T,
): ExternalStackAIPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const writeHook = <A, R>(userHook?: {
		before?: (
			ctx: StackAIContext,
			args: A,
		) =>
			| {
					ctx: StackAIContext;
					args: A;
					continue?: boolean;
					passToAfter?: string;
			  }
			| Promise<{
					ctx: StackAIContext;
					args: A;
					continue?: boolean;
					passToAfter?: string;
			  }>;
		after?: (
			ctx: StackAIContext,
			result: R,
			passToAfter?: string,
		) => void | Promise<void>;
	}) => {
		return {
			...userHook,
			before: async (ctx: StackAIContext, args: A) => {
				const result = userHook?.before
					? await userHook.before(ctx, args)
					: { ctx, args };
				return { ...result, ctx: createWriteContext(result.ctx) };
			},
		};
	};
	return {
		id: 'stackai',
		authConfig: stackAIAuthConfig,
		schema: StackAISchema,
		options,
		hooks: {
			...options.hooks,
			runs: {
				...options.hooks?.runs,
				start: writeHook(options.hooks?.runs?.start),
				cancel: writeHook(options.hooks?.runs?.cancel),
				resume: writeHook(options.hooks?.runs?.resume),
			},
		},
		endpoints: stackAIEndpoints,
		webhooks: {},
		endpointMeta,
		endpointSchemas: stackAIEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: errorHandlers satisfies CorsairErrorHandler,
		keyBuilder: async (
			ctx: KeyBuilderContext<StackAIPluginOptions>,
			source,
		) => {
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (
				source === 'endpoint' &&
				ctx.authType === 'api_key' &&
				typeof ctx.keys?.get_api_key === 'function'
			) {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key;
			}
			throw new AuthMissingError('stackai', 'api_key');
		},
	} satisfies InternalStackAIPlugin;
}

export { StackAIAPIError } from './client';
export type {
	StackAIEndpointInputs,
	StackAIEndpointOutputs,
} from './endpoints/types';
