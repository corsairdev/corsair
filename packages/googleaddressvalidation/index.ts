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
import { Address } from './endpoints';
import type {
	GoogleAddressValidationEndpointInputs,
	GoogleAddressValidationEndpointOutputs,
} from './endpoints/types';
import {
	GoogleAddressValidationEndpointInputSchemas,
	GoogleAddressValidationEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GoogleAddressValidationSchema } from './schema';

export type GoogleAddressValidationPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalGoogleAddressValidationPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof googleAddressValidationEndpointsNested
	>;
};

export type GoogleAddressValidationContext = CorsairPluginContext<
	typeof GoogleAddressValidationSchema,
	GoogleAddressValidationPluginOptions
>;

export type GoogleAddressValidationKeyBuilderContext =
	KeyBuilderContext<GoogleAddressValidationPluginOptions>;

export type GoogleAddressValidationBoundEndpoints = BindEndpoints<
	typeof googleAddressValidationEndpointsNested
>;

type GoogleAddressValidationEndpoint<
	K extends keyof GoogleAddressValidationEndpointOutputs,
> = CorsairEndpoint<
	GoogleAddressValidationContext,
	GoogleAddressValidationEndpointInputs[K],
	GoogleAddressValidationEndpointOutputs[K]
>;

export type GoogleAddressValidationEndpoints = {
	validateAddress: GoogleAddressValidationEndpoint<'validateAddress'>;
	provideValidationFeedback: GoogleAddressValidationEndpoint<'provideValidationFeedback'>;
};

const googleAddressValidationEndpointsNested = {
	address: {
		validate: Address.validate,
		provideFeedback: Address.provideFeedback,
	},
} as const;

const googleAddressValidationWebhooksNested = {} as const;

export const googleAddressValidationEndpointSchemas = {
	'address.validate': {
		input: GoogleAddressValidationEndpointInputSchemas.validateAddress,
		output: GoogleAddressValidationEndpointOutputSchemas.validateAddress,
	},
	'address.provideFeedback': {
		input:
			GoogleAddressValidationEndpointInputSchemas.provideValidationFeedback,
		output:
			GoogleAddressValidationEndpointOutputSchemas.provideValidationFeedback,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googleAddressValidationEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const googleAddressValidationEndpointMeta = {
	'address.validate': {
		riskLevel: 'read',
		description: 'Validate a postal address and get standardized results',
	},
	'address.provideFeedback': {
		riskLevel: 'write',
		description:
			'Report the outcome of a previous address validation sequence back to Google',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof googleAddressValidationEndpointsNested
>;

export const googleAddressValidationAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseGoogleAddressValidationPlugin<
	T extends GoogleAddressValidationPluginOptions,
> = CorsairPlugin<
	'googleaddressvalidation',
	typeof GoogleAddressValidationSchema,
	typeof googleAddressValidationEndpointsNested,
	typeof googleAddressValidationWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalGoogleAddressValidationPlugin =
	BaseGoogleAddressValidationPlugin<GoogleAddressValidationPluginOptions>;

export type ExternalGoogleAddressValidationPlugin<
	T extends GoogleAddressValidationPluginOptions,
> = BaseGoogleAddressValidationPlugin<T>;

export function googleaddressvalidation<
	const T extends GoogleAddressValidationPluginOptions,
>(
	incomingOptions: GoogleAddressValidationPluginOptions &
		T = {} as GoogleAddressValidationPluginOptions & T,
): ExternalGoogleAddressValidationPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googleaddressvalidation',
		authConfig: googleAddressValidationAuthConfig,
		schema: GoogleAddressValidationSchema,
		options: options,
		hooks: options.hooks,
		endpoints: googleAddressValidationEndpointsNested,
		webhooks: googleAddressValidationWebhooksNested,
		endpointMeta: googleAddressValidationEndpointMeta,
		endpointSchemas: googleAddressValidationEndpointSchemas,

		pluginWebhookMatcher: () => false,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: GoogleAddressValidationKeyBuilderContext,
			source,
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (res) {
					return res;
				}

				throw new AuthMissingError('googleaddressvalidation', 'api_key');
			}

			throw new AuthMissingError('googleaddressvalidation', ctx.authType);
		},
	} satisfies InternalGoogleAddressValidationPlugin;
}

export type {
	GoogleAddressValidationEndpointInputs,
	GoogleAddressValidationEndpointOutputs,
	ProvideValidationFeedbackInput,
	ProvideValidationFeedbackResponse,
	ValidateAddressInput,
	ValidateAddressResponse,
} from './endpoints/types';
