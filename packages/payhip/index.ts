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
import { Coupons, License } from './endpoints';
import type {
	PayhipEndpointInputs,
	PayhipEndpointOutputs,
} from './endpoints/types';
import {
	PayhipEndpointInputSchemas,
	PayhipEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PayhipSchema } from './schema';

export type PayhipPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPayhipPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof payhipEndpointsNested>;
};

export type PayhipContext = CorsairPluginContext<
	typeof PayhipSchema,
	PayhipPluginOptions,
	undefined,
	typeof payhipAuthConfig
>;

export type PayhipKeyBuilderContext = KeyBuilderContext<
	PayhipPluginOptions,
	typeof payhipAuthConfig
>;

export type PayhipBoundEndpoints = BindEndpoints<typeof payhipEndpointsNested>;

type PayhipEndpoint<K extends keyof PayhipEndpointOutputs> = CorsairEndpoint<
	PayhipContext,
	PayhipEndpointInputs[K],
	PayhipEndpointOutputs[K]
>;

export type PayhipEndpoints = {
	[K in keyof PayhipEndpointOutputs]: PayhipEndpoint<K>;
};

const payhipEndpointsNested = {
	coupons: {
		create: Coupons.create,
		list: Coupons.list,
		get: Coupons.get,
	},
	license: {
		verify: License.verify,
		disable: License.disable,
		enable: License.enable,
		increaseUsage: License.increaseUsage,
		decreaseUsage: License.decreaseUsage,
	},
} as const;

export const payhipEndpointSchemas = {
	'coupons.create': {
		input: PayhipEndpointInputSchemas.couponsCreate,
		output: PayhipEndpointOutputSchemas.couponsCreate,
	},
	'coupons.list': {
		input: PayhipEndpointInputSchemas.couponsList,
		output: PayhipEndpointOutputSchemas.couponsList,
	},
	'coupons.get': {
		input: PayhipEndpointInputSchemas.couponsGet,
		output: PayhipEndpointOutputSchemas.couponsGet,
	},
	'license.verify': {
		input: PayhipEndpointInputSchemas.licenseVerify,
		output: PayhipEndpointOutputSchemas.licenseVerify,
	},
	'license.disable': {
		input: PayhipEndpointInputSchemas.licenseDisable,
		output: PayhipEndpointOutputSchemas.licenseDisable,
	},
	'license.enable': {
		input: PayhipEndpointInputSchemas.licenseEnable,
		output: PayhipEndpointOutputSchemas.licenseEnable,
	},
	'license.increaseUsage': {
		input: PayhipEndpointInputSchemas.licenseIncreaseUsage,
		output: PayhipEndpointOutputSchemas.licenseIncreaseUsage,
	},
	'license.decreaseUsage': {
		input: PayhipEndpointInputSchemas.licenseDecreaseUsage,
		output: PayhipEndpointOutputSchemas.licenseDecreaseUsage,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof payhipEndpointsNested
>;

const payhipEndpointMeta = {
	'coupons.create': {
		riskLevel: 'write',
		description:
			'Create a discount coupon for one product, all products or a collection',
	},
	'coupons.list': {
		riskLevel: 'read',
		description: 'List the coupons of the account, paged by limit and offset',
	},
	'coupons.get': {
		riskLevel: 'read',
		description: 'Read one coupon by id',
	},
	'license.verify': {
		riskLevel: 'read',
		description:
			'Verify a license key against a product secret; read-only check',
	},
	'license.disable': {
		riskLevel: 'write',
		description: 'Disable a license key so it stops validating',
	},
	'license.enable': {
		riskLevel: 'write',
		description: 'Enable a license key that was disabled',
	},
	'license.increaseUsage': {
		riskLevel: 'write',
		description: 'Increase the usage count of a license key (an activation)',
	},
	'license.decreaseUsage': {
		riskLevel: 'write',
		description: 'Decrease the usage count of a license key (a deactivation)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof payhipEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const payhipAuthConfig = {
	api_key: {
		// License-key operations authenticate with a per-product secret, so
		// the account stores it beside the API key.
		account: ['product_secret_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePayhipPlugin<T extends PayhipPluginOptions> = CorsairPlugin<
	'payhip',
	typeof PayhipSchema,
	typeof payhipEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof payhipAuthConfig
>;

export type InternalPayhipPlugin = BasePayhipPlugin<PayhipPluginOptions>;

export type ExternalPayhipPlugin<T extends PayhipPluginOptions> =
	BasePayhipPlugin<T>;

export function payhip<const T extends PayhipPluginOptions>(
	incomingOptions: PayhipPluginOptions & T = {} as PayhipPluginOptions & T,
): ExternalPayhipPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'payhip',
		authConfig: payhipAuthConfig,
		schema: PayhipSchema,
		options: options,
		hooks: options.hooks,
		endpoints: payhipEndpointsNested,
		webhooks: {},
		endpointMeta: payhipEndpointMeta,
		endpointSchemas: payhipEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PayhipKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('payhip', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPayhipPlugin;
}

export type {
	Coupon,
	LicenseKey,
	PayhipEndpointInputs,
	PayhipEndpointOutputs,
} from './endpoints/types';
