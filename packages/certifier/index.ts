import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Handlers } from './endpoints';
import type {
	CertifierEndpointInputs,
	CertifierEndpointOutputs,
} from './endpoints/types';
import {
	CertifierEndpointInputSchemas,
	CertifierEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CertifierSchema } from './schema';

export type CertifierPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCertifierPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof certifierEndpointsNested>;
};

export type CertifierContext = CorsairPluginContext<
	typeof CertifierSchema,
	CertifierPluginOptions
>;

export type CertifierKeyBuilderContext =
	KeyBuilderContext<CertifierPluginOptions>;

export type CertifierBoundEndpoints = BindEndpoints<
	typeof certifierEndpointsNested
>;

type CertifierEndpoint<K extends keyof CertifierEndpointOutputs> =
	CorsairEndpoint<
		CertifierContext,
		CertifierEndpointInputs[K],
		CertifierEndpointOutputs[K]
	>;

export type CertifierEndpoints = {
	[K in keyof CertifierEndpointOutputs]: CertifierEndpoint<K>;
};

export type CertifierWebhooks = {};

export type CertifierBoundWebhooks = BindWebhooks<CertifierWebhooks>;

const certifierEndpointsNested = {
	attributes: {
		list: Handlers.listAttributes,
	},
	credentials: {
		createIssueSend: Handlers.createIssueSend,
		list: Handlers.listCredentials,
		search: Handlers.searchCredentials,
		send: Handlers.sendCredential,
	},
	credentialInteractions: {
		list: Handlers.listCredentialInteractions,
	},
	designs: {
		list: Handlers.listDesigns,
	},
	emailTemplates: {
		list: Handlers.listEmailTemplates,
	},
	groups: {
		list: Handlers.listGroups,
	},
} as const;

const certifierWebhooksNested = {};

export const certifierEndpointSchemas = {
	'attributes.list': {
		input: CertifierEndpointInputSchemas.listAttributes,
		output: CertifierEndpointOutputSchemas.listAttributes,
	},
	'credentials.createIssueSend': {
		input: CertifierEndpointInputSchemas.createIssueSend,
		output: CertifierEndpointOutputSchemas.createIssueSend,
	},
	'credentials.list': {
		input: CertifierEndpointInputSchemas.listCredentials,
		output: CertifierEndpointOutputSchemas.listCredentials,
	},
	'credentials.search': {
		input: CertifierEndpointInputSchemas.searchCredentials,
		output: CertifierEndpointOutputSchemas.searchCredentials,
	},
	'credentials.send': {
		input: CertifierEndpointInputSchemas.sendCredential,
		output: CertifierEndpointOutputSchemas.sendCredential,
	},
	'credentialInteractions.list': {
		input: CertifierEndpointInputSchemas.listCredentialInteractions,
		output: CertifierEndpointOutputSchemas.listCredentialInteractions,
	},
	'designs.list': {
		input: CertifierEndpointInputSchemas.listDesigns,
		output: CertifierEndpointOutputSchemas.listDesigns,
	},
	'emailTemplates.list': {
		input: CertifierEndpointInputSchemas.listEmailTemplates,
		output: CertifierEndpointOutputSchemas.listEmailTemplates,
	},
	'groups.list': {
		input: CertifierEndpointInputSchemas.listGroups,
		output: CertifierEndpointOutputSchemas.listGroups,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof certifierEndpointsNested
>;

const certifierWebhookSchemas =
	{} as const satisfies RequiredPluginWebhookSchemas<
		typeof certifierWebhooksNested
	>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const certifierEndpointMeta = {
	'attributes.list': {
		riskLevel: 'read',
		description:
			'List attribute definitions available for credentials, with pagination.',
	},
	'credentials.createIssueSend': {
		riskLevel: 'write',
		description: 'Create, issue, and send a credential in a single request.',
	},
	'credentials.list': {
		riskLevel: 'read',
		description: 'List credentials with cursor pagination.',
	},
	'credentials.search': {
		riskLevel: 'read',
		description:
			'Search credentials with AND/OR/NOT filters, sort, and pagination.',
	},
	'credentials.send': {
		riskLevel: 'write',
		description: 'Send an issued credential by email.',
	},
	'credentialInteractions.list': {
		riskLevel: 'read',
		description:
			'List credential interaction events, optionally filtered by credential.',
	},
	'designs.list': {
		riskLevel: 'read',
		description: 'List certificate and badge design templates.',
	},
	'emailTemplates.list': {
		riskLevel: 'read',
		description: 'List email templates used for credential delivery.',
	},
	'groups.list': {
		riskLevel: 'read',
		description: 'List credential templates (groups) with pagination.',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof certifierEndpointsNested
>;

export const certifierAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseCertifierPlugin<T extends CertifierPluginOptions> =
	CorsairPlugin<
		'certifier',
		typeof CertifierSchema,
		typeof certifierEndpointsNested,
		typeof certifierWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCertifierPlugin =
	BaseCertifierPlugin<CertifierPluginOptions>;

export type ExternalCertifierPlugin<T extends CertifierPluginOptions> =
	BaseCertifierPlugin<T>;

export function certifier<const T extends CertifierPluginOptions>(
	incomingOptions: CertifierPluginOptions & T = {} as CertifierPluginOptions &
		T,
): ExternalCertifierPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'certifier',
		authConfig: certifierAuthConfig,
		schema: CertifierSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: certifierEndpointsNested,
		webhooks: certifierWebhooksNested,
		endpointMeta: certifierEndpointMeta,
		endpointSchemas: certifierEndpointSchemas,
		webhookSchemas: certifierWebhookSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: CertifierKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('certifier', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('certifier', 'api_key');
		},
	} satisfies InternalCertifierPlugin;
}

export type {
	CertifierEndpointInputs,
	CertifierEndpointOutputs,
	CreateIssueSendInput,
	CreateIssueSendResponse,
	ListAttributesInput,
	ListAttributesResponse,
	ListCredentialInteractionsInput,
	ListCredentialInteractionsResponse,
	ListCredentialsInput,
	ListCredentialsResponse,
	ListDesignsInput,
	ListDesignsResponse,
	ListEmailTemplatesInput,
	ListEmailTemplatesResponse,
	ListGroupsInput,
	ListGroupsResponse,
	SearchCredentialsInput,
	SearchCredentialsResponse,
	SendCredentialInput,
	SendCredentialResponse,
} from './endpoints/types';
