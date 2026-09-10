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
import { Batch, Gifts, Membership, OneRoster, Payments } from './endpoints';
import type {
	BlackbaudEndpointInputs,
	BlackbaudEndpointOutputs,
} from './endpoints/types';
import {
	BlackbaudEndpointInputSchemas,
	BlackbaudEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BlackbaudSchema } from './schema';

export type BlackbaudPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	subscriptionKey?: string;
	hooks?: InternalBlackbaudPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof blackbaudEndpointsNested>;
};

export type BlackbaudContext = CorsairPluginContext<
	typeof BlackbaudSchema,
	BlackbaudPluginOptions
>;

export type BlackbaudKeyBuilderContext =
	KeyBuilderContext<BlackbaudPluginOptions>;

export type BlackbaudBoundEndpoints = BindEndpoints<
	typeof blackbaudEndpointsNested
>;

type BlackbaudEndpoint<K extends keyof BlackbaudEndpointOutputs> =
	CorsairEndpoint<
		BlackbaudContext,
		BlackbaudEndpointInputs[K],
		BlackbaudEndpointOutputs[K]
	>;

export type BlackbaudEndpoints = {
	addGiftsToBatch: BlackbaudEndpoint<'addGiftsToBatch'>;
	getGiftById: BlackbaudEndpoint<'getGiftById'>;
	listMemberships: BlackbaudEndpoint<'listMemberships'>;
	getPaymentTransaction: BlackbaudEndpoint<'getPaymentTransaction'>;
	oneRosterOAuth2BaseApi: BlackbaudEndpoint<'oneRosterOAuth2BaseApi'>;
};

const blackbaudEndpointsNested = {
	batch: {
		addGiftsToBatch: Batch.addGiftsToBatch,
	},
	gifts: {
		getGiftById: Gifts.getGiftById,
	},
	membership: {
		listMemberships: Membership.listMemberships,
	},
	payments: {
		getPaymentTransaction: Payments.getPaymentTransaction,
	},
	oneRoster: {
		oneRosterOAuth2BaseApi: OneRoster.oneRosterOAuth2BaseApi,
	},
} as const;

export const blackbaudEndpointSchemas = {
	'batch.addGiftsToBatch': {
		input: BlackbaudEndpointInputSchemas.addGiftsToBatch,
		output: BlackbaudEndpointOutputSchemas.addGiftsToBatch,
	},
	'gifts.getGiftById': {
		input: BlackbaudEndpointInputSchemas.getGiftById,
		output: BlackbaudEndpointOutputSchemas.getGiftById,
	},
	'membership.listMemberships': {
		input: BlackbaudEndpointInputSchemas.listMemberships,
		output: BlackbaudEndpointOutputSchemas.listMemberships,
	},
	'payments.getPaymentTransaction': {
		input: BlackbaudEndpointInputSchemas.getPaymentTransaction,
		output: BlackbaudEndpointOutputSchemas.getPaymentTransaction,
	},
	'oneRoster.oneRosterOAuth2BaseApi': {
		input: BlackbaudEndpointInputSchemas.oneRosterOAuth2BaseApi,
		output: BlackbaudEndpointOutputSchemas.oneRosterOAuth2BaseApi,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof blackbaudEndpointsNested
>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

const blackbaudEndpointMeta = {
	'batch.addGiftsToBatch': {
		riskLevel: 'write',
		description:
			"Add one or more gifts (donations) to an existing open gift batch in Blackbaud Raiser's Edge NXT. Success returns status_code 200; failures throw (rate-limit retries via error handlers).",
	},
	'gifts.getGiftById': {
		riskLevel: 'read',
		description:
			"Retrieves comprehensive gift details from Blackbaud Raiser's Edge NXT by gift ID.",
	},
	'membership.listMemberships': {
		riskLevel: 'read',
		description:
			"Lists memberships for a constituent from Blackbaud Raiser's Edge NXT Constituent API (ListConstituentMemberships), with optional member-junction filter and limit/offset pagination.",
	},
	'payments.getPaymentTransaction': {
		riskLevel: 'read',
		description:
			'Retrieves payment transaction details from Blackbaud SKY Payments API.',
	},
	'oneRoster.oneRosterOAuth2BaseApi': {
		riskLevel: 'read',
		description:
			'Reads Blackbaud OneRoster OAuth2 discovery metadata (openid-configuration, public keys).',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof blackbaudEndpointsNested
>;

export const blackbaudAuthConfig = {
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseBlackbaudPlugin<T extends BlackbaudPluginOptions> =
	CorsairPlugin<
		'blackbaud',
		typeof BlackbaudSchema,
		typeof blackbaudEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof blackbaudAuthConfig
	>;

export type InternalBlackbaudPlugin =
	BaseBlackbaudPlugin<BlackbaudPluginOptions>;

export type ExternalBlackbaudPlugin<T extends BlackbaudPluginOptions> =
	BaseBlackbaudPlugin<T>;

export function blackbaud<const T extends BlackbaudPluginOptions>(
	// Test/scaffold default: empty options satisfy the generic bound.
	incomingOptions: BlackbaudPluginOptions & T = {} as BlackbaudPluginOptions &
		T,
): ExternalBlackbaudPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'blackbaud',
		authConfig: blackbaudAuthConfig,
		oauthConfig: {
			providerName: 'Blackbaud',
			authUrl: 'https://app.blackbaud.com/oauth/authorize',
			tokenUrl: 'https://oauth2.sky.blackbaud.com/token',
			scopes: [],
		},
		schema: BlackbaudSchema,
		options: options,
		hooks: options.hooks,
		endpoints: blackbaudEndpointsNested,
		webhooks: {},
		endpointMeta: blackbaudEndpointMeta,
		endpointSchemas: blackbaudEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BlackbaudKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('blackbaud', 'oauth_2');
				}
				return res;
			}

			return '';
		},
	} satisfies InternalBlackbaudPlugin;
}

export type {
	AddGiftsToBatchInput,
	AddGiftsToBatchResponse,
	BlackbaudEndpointInputs,
	BlackbaudEndpointOutputs,
	GetGiftByIdInput,
	GetGiftByIdResponse,
	GetPaymentTransactionInput,
	GetPaymentTransactionResponse,
	ListMembershipsInput,
	ListMembershipsResponse,
	MembershipRecord,
	OneRosterOAuth2BaseApiInput,
	OneRosterOAuth2BaseApiResponse,
} from './endpoints/types';
