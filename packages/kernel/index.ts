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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	createManagedPricingCredentialCache,
	resolveManagedPricingApiKey,
} from 'corsair/hub';
import { tryGetStoredKey } from './client';
import {
	kernelEndpointMeta as generatedEndpointMeta,
	kernelEndpointSchemas,
	kernelEndpointsNested,
} from './endpoints/catalog';
import type {
	KernelEndpointInputs,
	KernelEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { KernelSchema } from './schema';

export type KernelPluginOptions = {
	/**
	 * `api_key`: your own Kernel key (dashboard → API Keys).
	 * `managed_pricing`: Corsair Hub supplies Corsair's Kernel key and charges
	 * credits per call.
	 */
	authType?: PickAuth<'api_key' | 'managed_pricing'>;
	key?: string;
	/**
	 * A Kernel project id (`proj_…`, not its name). Sent as
	 * `X-Kernel-Project-Id` on every call, so an org-wide key only sees and
	 * creates resources in that project. Leave it out to use the org's default
	 * project, or when the key is already scoped to one project.
	 */
	projectId?: string;
	hooks?: InternalKernelPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kernelEndpointsNested>;
};

export type KernelContext = CorsairPluginContext<
	typeof KernelSchema,
	KernelPluginOptions
>;

export type KernelKeyBuilderContext = KeyBuilderContext<KernelPluginOptions>;

export type KernelBoundEndpoints = BindEndpoints<typeof kernelEndpointsNested>;

export type KernelEndpoints = {
	[Id in keyof KernelEndpointOutputs]: CorsairEndpoint<
		KernelContext,
		KernelEndpointInputs[Id],
		KernelEndpointOutputs[Id]
	>;
};

/**
 * No webhook capability. Kernel reports progress through server-sent event
 * streams (left out, see README) and its telemetry destinations export OTLP to
 * a collector, not signed webhooks, so there is nothing for this plugin to
 * receive or verify.
 */
const kernelWebhooksNested = {} as const;

export { kernelEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const kernelEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof kernelEndpointsNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const kernelAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

const kernelManagedPricingCache = createManagedPricingCredentialCache();

export type BaseKernelPlugin<T extends KernelPluginOptions> = CorsairPlugin<
	'kernel',
	typeof KernelSchema,
	typeof kernelEndpointsNested,
	typeof kernelWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalKernelPlugin = BaseKernelPlugin<KernelPluginOptions>;

export type ExternalKernelPlugin<T extends KernelPluginOptions> =
	BaseKernelPlugin<T>;

export function kernel<const T extends KernelPluginOptions>(
	incomingOptions: KernelPluginOptions & T = {} as KernelPluginOptions & T,
): ExternalKernelPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kernel',
		authConfig: kernelAuthConfig,
		schema: KernelSchema,
		options: options,
		hooks: options.hooks,
		endpoints: kernelEndpointsNested,
		webhooks: kernelWebhooksNested,
		endpointMeta: kernelEndpointMeta,
		endpointSchemas: kernelEndpointSchemas,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last; otherwise
			// it would shadow a handler a caller adds through options.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: KernelKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';

			if (options.key) return options.key;

			if (ctx.authType === 'managed_pricing') {
				// Core resolves the managed key itself when Hub is configured;
				// this covers a keyBuilder call made without that path.
				return resolveManagedPricingApiKey(ctx, {
					plugin: 'kernel',
					cache: kernelManagedPricingCache,
					operation: ctx.meteredOperationId,
				});
			}

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('kernel', 'api_key');
			return storedKey;
		},
	} satisfies InternalKernelPlugin;
}

export {
	createKernelOperation,
	getKernelInputSchema,
	getKernelOutputSchema,
	KERNEL_OPERATION_IDS,
	KernelFileInputSchema,
} from './endpoints';
export type {
	KernelEndpointInputs,
	KernelEndpointOutputs,
	KernelJsonValue,
	KernelOperationId,
} from './endpoints/types';
export {
	KernelEndpointInputSchemas,
	KernelEndpointOutputSchemas,
} from './endpoints/types';
