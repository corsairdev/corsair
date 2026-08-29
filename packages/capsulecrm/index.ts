import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';

import type { AuthTypes } from 'corsair/core';

import type {
	CapsuleCrmEndpointInputs,
	CapsuleCrmEndpointOutputs,
} from './endpoints/types';

import {
	CapsuleCrmEndpointInputSchemas,
	CapsuleCrmEndpointOutputSchemas,
} from './endpoints/types';

import { CapsuleCrmEndpoints } from './endpoints';

import { CapsuleCrmSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type CapsuleCrmPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalCapsuleCrmPlugin['hooks'];
	webhookHooks?: InternalCapsuleCrmPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof capsuleCrmEndpointsNested
	>;
};

export type CapsuleCrmContext = CorsairPluginContext<
	typeof CapsuleCrmSchema,
	CapsuleCrmPluginOptions
>;

export type CapsuleCrmKeyBuilderContext =
	KeyBuilderContext<CapsuleCrmPluginOptions>;

export type CapsuleCrmBoundEndpoints =
	BindEndpoints<typeof capsuleCrmEndpointsNested>;

type CapsuleCrmEndpoint<
	K extends keyof CapsuleCrmEndpointOutputs,
> = CorsairEndpoint<
	CapsuleCrmContext,
	CapsuleCrmEndpointInputs[K],
	CapsuleCrmEndpointOutputs[K]
>;

export type CapsuleCrmEndpoints = {
	partyGet: CapsuleCrmEndpoint<'partyGet'>;
	opportunityGet: CapsuleCrmEndpoint<'opportunityGet'>;
	projectGet: CapsuleCrmEndpoint<'projectGet'>;
};

export type CapsuleCrmWebhooks = {};

export type CapsuleCrmBoundWebhooks =
	BindWebhooks<CapsuleCrmWebhooks>;

const capsuleCrmEndpointsNested = {
	party: {
		get: CapsuleCrmEndpoints.party.get,
	},
	opportunity: {
		get: CapsuleCrmEndpoints.opportunity.get,
	},
	project: {
		get: CapsuleCrmEndpoints.project.get,
	},
} as const;

const capsuleCrmWebhooksNested = {} as const;

export const capsuleCrmEndpointSchemas = {
	'party.get': {
		input: CapsuleCrmEndpointInputSchemas.partyGet,
		output: CapsuleCrmEndpointOutputSchemas.partyGet,
	},
	'opportunity.get': {
		input: CapsuleCrmEndpointInputSchemas.opportunityGet,
		output: CapsuleCrmEndpointOutputSchemas.opportunityGet,
	},
	'project.get': {
		input: CapsuleCrmEndpointInputSchemas.projectGet,
		output: CapsuleCrmEndpointOutputSchemas.projectGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof capsuleCrmEndpointsNested
>;

const capsuleCrmWebhookSchemas = {} as const satisfies
	RequiredPluginWebhookSchemas<typeof capsuleCrmWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key';

const capsuleCrmEndpointMeta = {
	'party.get': {
		riskLevel: 'read',
		description: 'Get a Capsule CRM party by ID',
	},
	'opportunity.get': {
		riskLevel: 'read',
		description: 'Get a Capsule CRM opportunity by ID',
	},
	'project.get': {
		riskLevel: 'read',
		description: 'Get a Capsule CRM project by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof capsuleCrmEndpointsNested
>;

export const capsuleCrmAuthConfig = {
	api_key: {
		account: [],
	},
	oauth_2: {
		account: [],
	},
} as const satisfies PluginAuthConfig;

export type BaseCapsuleCrmPlugin<
	T extends CapsuleCrmPluginOptions,
> = CorsairPlugin<
	'capsulecrm',
	typeof CapsuleCrmSchema,
	typeof capsuleCrmEndpointsNested,
	typeof capsuleCrmWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalCapsuleCrmPlugin =
	BaseCapsuleCrmPlugin<CapsuleCrmPluginOptions>;

export type ExternalCapsuleCrmPlugin<
	T extends CapsuleCrmPluginOptions,
> = BaseCapsuleCrmPlugin<T>;

export function capsulecrm<
	const T extends CapsuleCrmPluginOptions,
>(
	incomingOptions: CapsuleCrmPluginOptions & T = {} as CapsuleCrmPluginOptions & T,
): ExternalCapsuleCrmPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'capsulecrm',
		authConfig: capsuleCrmAuthConfig,
		schema: CapsuleCrmSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: capsuleCrmEndpointsNested,
		webhooks: capsuleCrmWebhooksNested,
		endpointMeta: capsuleCrmEndpointMeta,
		endpointSchemas: capsuleCrmEndpointSchemas,
		webhookSchemas: capsuleCrmWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (
			ctx: CapsuleCrmKeyBuilderContext,
			source,
		) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalCapsuleCrmPlugin;
}

export type {
	CapsuleCrmEndpointInputs,
	CapsuleCrmEndpointOutputs,
	PartyGetInput,
	PartyGetResponse,
	OpportunityGetInput,
	OpportunityGetResponse,
	ProjectGetInput,
	ProjectGetResponse,
} from './endpoints/types';