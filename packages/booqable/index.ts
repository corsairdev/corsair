import type {
	AuthTypes,
	BindEndpoints,
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
	booqableEndpointSchemas,
	booqableEndpointsNested,
	booqableEndpointMeta as generatedBooqableEndpointMeta,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { BooqableSchema } from './schema';

export const booqableAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export const booqableEndpointMeta =
	generatedBooqableEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof booqableEndpointsNested
	>;

export type BooqablePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Booqable company slug (subdomain); defaults to tenant_external_id credential. */
	companySlug?: string;
	key?: string;
	hooks?: InternalBooqablePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof booqableEndpointsNested>;
};

export type BooqableContext = CorsairPluginContext<
	typeof BooqableSchema,
	BooqablePluginOptions,
	undefined,
	typeof booqableAuthConfig
>;

export type BooqableKeyBuilderContext = KeyBuilderContext<
	BooqablePluginOptions,
	typeof booqableAuthConfig
>;

export type BooqableBoundEndpoints = BindEndpoints<
	typeof booqableEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseBooqablePlugin<T extends BooqablePluginOptions> = CorsairPlugin<
	'booqable',
	typeof BooqableSchema,
	typeof booqableEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof booqableAuthConfig
>;

export type InternalBooqablePlugin = BaseBooqablePlugin<BooqablePluginOptions>;

export type ExternalBooqablePlugin<T extends BooqablePluginOptions> =
	BaseBooqablePlugin<T>;

export function booqable<const T extends BooqablePluginOptions>(
	incomingOptions: BooqablePluginOptions & T = {} as BooqablePluginOptions & T,
): ExternalBooqablePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const ensureCompanySlug = async (ctx: BooqableKeyBuilderContext) => {
		if (options.companySlug) return;
		const slug = await ctx.keys.get_tenant_external_id();
		if (!slug) {
			throw new AuthMissingError('booqable', 'api_key');
		}
	};

	return {
		id: 'booqable',
		authConfig: booqableAuthConfig,
		schema: BooqableSchema,
		options,
		hooks: options.hooks,
		endpoints: booqableEndpointsNested,
		webhooks: {},
		endpointMeta: booqableEndpointMeta,
		endpointSchemas: booqableEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BooqableKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				await ensureCompanySlug(ctx);
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				await ensureCompanySlug(ctx);
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('booqable', 'api_key');
				}
				return res;
			}

			return '';
		},
	} satisfies InternalBooqablePlugin;
}

export type {
	BooqableEndpointInput,
	BooqableEndpointInputs,
	BooqableEndpointOutputs,
} from './endpoints/types';
export { booqableEndpointSchemas, booqableEndpointsNested };
