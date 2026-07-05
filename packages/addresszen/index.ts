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
import { Autocomplete, Verify } from './endpoints';
import type {
	AddresszenEndpointInputs,
	AddresszenEndpointOutputs,
} from './endpoints/types';
import {
	AddresszenEndpointInputSchemas,
	AddresszenEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AddresszenSchema } from './schema';

export type AddresszenPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalAddresszenPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof addresszenEndpointsNested>;
};

export type AddresszenContext = CorsairPluginContext<
	typeof AddresszenSchema,
	AddresszenPluginOptions
>;

export type AddresszenKeyBuilderContext =
	KeyBuilderContext<AddresszenPluginOptions>;

export type AddresszenBoundEndpoints = BindEndpoints<
	typeof addresszenEndpointsNested
>;

type AddresszenEndpoint<K extends keyof AddresszenEndpointOutputs> =
	CorsairEndpoint<
		AddresszenContext,
		AddresszenEndpointInputs[K],
		AddresszenEndpointOutputs[K]
	>;

export type AddresszenEndpoints = {
	autocompleteAddresses: AddresszenEndpoint<'autocompleteAddresses'>;
	verifyAddress: AddresszenEndpoint<'verifyAddress'>;
};

const addresszenEndpointsNested = {
	autocomplete: {
		addresses: Autocomplete.addresses,
	},
	verify: {
		address: Verify.address,
	},
} as const;

const addresszenWebhooksNested = {} as const;

export const addresszenEndpointSchemas = {
	'autocomplete.addresses': {
		input: AddresszenEndpointInputSchemas.autocompleteAddresses,
		output: AddresszenEndpointOutputSchemas.autocompleteAddresses,
	},
	'verify.address': {
		input: AddresszenEndpointInputSchemas.verifyAddress,
		output: AddresszenEndpointOutputSchemas.verifyAddress,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof addresszenEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const addresszenEndpointMeta = {
	'autocomplete.addresses': {
		riskLevel: 'read',
		description:
			'Get address autocomplete suggestions for a partial address query',
	},
	'verify.address': {
		riskLevel: 'read',
		description:
			'Verify and standardize a US address using USPS CASS validation',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof addresszenEndpointsNested
>;

export const addresszenAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseAddresszenPlugin<T extends AddresszenPluginOptions> =
	CorsairPlugin<
		'addresszen',
		typeof AddresszenSchema,
		typeof addresszenEndpointsNested,
		typeof addresszenWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalAddresszenPlugin =
	BaseAddresszenPlugin<AddresszenPluginOptions>;

export type ExternalAddresszenPlugin<T extends AddresszenPluginOptions> =
	BaseAddresszenPlugin<T>;

export function addresszen<const T extends AddresszenPluginOptions>(
	incomingOptions: AddresszenPluginOptions & T = {} as AddresszenPluginOptions &
		T,
): ExternalAddresszenPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'addresszen',
		authConfig: addresszenAuthConfig,
		schema: AddresszenSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: addresszenEndpointsNested,
		webhooks: addresszenWebhooksNested,
		endpointMeta: addresszenEndpointMeta,
		endpointSchemas: addresszenEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AddresszenKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('addresszen', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('addresszen', 'api_key');
		},
	} satisfies InternalAddresszenPlugin;
}

export type {
	AddressSuggestion,
	AddresszenEndpointInputs,
	AddresszenEndpointOutputs,
	AutocompleteAddressesInput,
	AutocompleteAddressesResponse,
	VerifyAddressInput,
	VerifyAddressResponse,
} from './endpoints/types';

export {
	AddresszenEndpointInputSchemas,
	AddresszenEndpointOutputSchemas,
	AutocompleteAddressesInputSchema,
	AutocompleteAddressesResponseSchema,
	VerifyAddressInputSchema,
	VerifyAddressResponseSchema,
} from './endpoints/types';
