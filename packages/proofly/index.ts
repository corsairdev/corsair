import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { ProoflyContext } from './context';
import {
	getNotificationData,
	getUser,
	listActivity,
	listCampaigns,
	listNotifications,
	setCampaignEnabled,
} from './endpoints';
import {
	GetNotificationDataInputSchema,
	GetNotificationDataResponseSchema,
	GetUserInputSchema,
	GetUserResponseSchema,
	ListActivityInputSchema,
	ListActivityResponseSchema,
	ListCampaignsInputSchema,
	ListCampaignsResponseSchema,
	ListNotificationsInputSchema,
	ListNotificationsResponseSchema,
	SetCampaignEnabledInputSchema,
	SetCampaignEnabledResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ProoflySchema } from './schema';

export type { ProoflyContext };

export type ProoflyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalProoflyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof prooflyEndpointsNested>;
};

export type ProoflyKeyBuilderContext = KeyBuilderContext<ProoflyPluginOptions>;

const prooflyEndpointsNested = {
	campaigns: { list: listCampaigns, setEnabled: setCampaignEnabled },
	notifications: { list: listNotifications, getData: getNotificationData },
	user: { get: getUser },
	activity: { list: listActivity },
} as const;

const prooflyWebhooksNested = {} as const;

export const prooflyEndpointSchemas = {
	'campaigns.list': {
		input: ListCampaignsInputSchema,
		output: ListCampaignsResponseSchema,
	},
	'user.get': {
		input: GetUserInputSchema,
		output: GetUserResponseSchema,
	},
	'activity.list': {
		input: ListActivityInputSchema,
		output: ListActivityResponseSchema,
	},
	'campaigns.setEnabled': {
		input: SetCampaignEnabledInputSchema,
		output: SetCampaignEnabledResponseSchema,
	},
	'notifications.list': {
		input: ListNotificationsInputSchema,
		output: ListNotificationsResponseSchema,
	},
	'notifications.getData': {
		input: GetNotificationDataInputSchema,
		output: GetNotificationDataResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof prooflyEndpointsNested
>;

const prooflyEndpointMeta = {
	'campaigns.list': {
		riskLevel: 'read',
		description: 'List Proofly campaigns for the connected account.',
	},
	'user.get': {
		riskLevel: 'read',
		description:
			'Read the signed-in Proofly user. The pixel key is removed from the result.',
	},
	'activity.list': {
		riskLevel: 'read',
		description: 'Read Proofly activity logs. The logs are not stored.',
	},
	'campaigns.setEnabled': {
		riskLevel: 'write',
		description:
			'Turn a campaign on or off; sends nothing when it already has that state.',
	},
	'notifications.list': {
		riskLevel: 'read',
		description:
			'List the notifications in a campaign with their settings and stats.',
	},
	'notifications.getData': {
		riskLevel: 'read',
		description:
			'Read the leads and conversions a notification collected. Not stored.',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof prooflyEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const prooflyAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseProoflyPlugin<T extends ProoflyPluginOptions> = CorsairPlugin<
	'proofly',
	typeof ProoflySchema,
	typeof prooflyEndpointsNested,
	typeof prooflyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalProoflyPlugin = BaseProoflyPlugin<ProoflyPluginOptions>;

export type ExternalProoflyPlugin<T extends ProoflyPluginOptions> =
	BaseProoflyPlugin<T>;

export function proofly<const T extends ProoflyPluginOptions>(
	incomingOptions: ProoflyPluginOptions & T = {} as ProoflyPluginOptions & T,
): ExternalProoflyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'proofly',
		authConfig: prooflyAuthConfig,
		schema: ProoflySchema,
		options,
		hooks: options.hooks,
		endpoints: prooflyEndpointsNested,
		webhooks: prooflyWebhooksNested,
		endpointMeta: prooflyEndpointMeta,
		endpointSchemas: prooflyEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ProoflyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}
			throw new AuthMissingError('proofly', 'api_key');
		},
	} satisfies InternalProoflyPlugin;
}
