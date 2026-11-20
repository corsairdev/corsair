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
import {
	CredentialTemplates,
	Issuance,
	PresentationTemplates,
	Revocation,
	TrustedEntities,
	Verification,
	Wallets,
	Webhooks,
} from './endpoints';
import type {
	ParadymEndpointInputs,
	ParadymEndpointOutputs,
} from './endpoints/types';
import {
	ParadymEndpointInputSchemas,
	ParadymEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ParadymSchema } from './schema';
import { event } from './webhooks';
import {
	matchParadymWebhook,
	ParadymWebhookPayloadSchema,
} from './webhooks/types';

export type ParadymPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Wallet every wallet-scoped call is scoped to; overrides the stored one. */
	walletId?: string;
	webhookSecret?: string;
	hooks?: InternalParadymPlugin['hooks'];
	webhookHooks?: InternalParadymPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof paradymEndpointsNested>;
};

export type ParadymContext = CorsairPluginContext<
	typeof ParadymSchema,
	ParadymPluginOptions,
	undefined,
	typeof paradymAuthConfig
>;

export type ParadymKeyBuilderContext = KeyBuilderContext<
	ParadymPluginOptions,
	typeof paradymAuthConfig
>;

export type ParadymBoundEndpoints = BindEndpoints<
	typeof paradymEndpointsNested
>;

type ParadymEndpoint<K extends keyof ParadymEndpointOutputs> = CorsairEndpoint<
	ParadymContext,
	ParadymEndpointInputs[K],
	ParadymEndpointOutputs[K]
>;

export type ParadymEndpoints = {
	[K in keyof ParadymEndpointOutputs]: ParadymEndpoint<K>;
};

export type ParadymBoundWebhooks = BindWebhooks<typeof paradymWebhooksNested>;

const paradymEndpointsNested = {
	wallets: {
		list: Wallets.list,
		create: Wallets.create,
		get: Wallets.get,
		update: Wallets.update,
	},
	credentialTemplates: {
		list: CredentialTemplates.list,
		create: CredentialTemplates.create,
		get: CredentialTemplates.get,
		update: CredentialTemplates.update,
		archive: CredentialTemplates.archive,
		unarchive: CredentialTemplates.unarchive,
	},
	presentationTemplates: {
		list: PresentationTemplates.list,
		create: PresentationTemplates.create,
		get: PresentationTemplates.get,
		update: PresentationTemplates.update,
		archive: PresentationTemplates.archive,
	},
	issuance: {
		listSessions: Issuance.listSessions,
		createOffer: Issuance.createOffer,
		getSession: Issuance.getSession,
	},
	verification: {
		listSessions: Verification.listSessions,
		createRequest: Verification.createRequest,
		getSession: Verification.getSession,
		complete: Verification.complete,
	},
	revocation: {
		batch: Revocation.batch,
	},
	trustedEntities: {
		list: TrustedEntities.list,
		create: TrustedEntities.create,
		get: TrustedEntities.get,
		delete: TrustedEntities.remove,
	},
	webhooks: {
		listSubscriptions: Webhooks.listSubscriptions,
		createSubscription: Webhooks.createSubscription,
		deleteSubscription: Webhooks.deleteSubscription,
		listDeliveries: Webhooks.listDeliveries,
		getDelivery: Webhooks.getDelivery,
		redeliverDelivery: Webhooks.redeliverDelivery,
	},
} as const;

export const paradymWebhooksNested = {
	paradym: {
		event,
	},
} as const;

export const paradymEndpointSchemas = {
	'wallets.list': {
		input: ParadymEndpointInputSchemas.walletsList,
		output: ParadymEndpointOutputSchemas.walletsList,
	},
	'wallets.create': {
		input: ParadymEndpointInputSchemas.walletsCreate,
		output: ParadymEndpointOutputSchemas.walletsCreate,
	},
	'wallets.get': {
		input: ParadymEndpointInputSchemas.walletsGet,
		output: ParadymEndpointOutputSchemas.walletsGet,
	},
	'wallets.update': {
		input: ParadymEndpointInputSchemas.walletsUpdate,
		output: ParadymEndpointOutputSchemas.walletsUpdate,
	},
	'credentialTemplates.list': {
		input: ParadymEndpointInputSchemas.credentialTemplatesList,
		output: ParadymEndpointOutputSchemas.credentialTemplatesList,
	},
	'credentialTemplates.create': {
		input: ParadymEndpointInputSchemas.credentialTemplatesCreate,
		output: ParadymEndpointOutputSchemas.credentialTemplatesCreate,
	},
	'credentialTemplates.get': {
		input: ParadymEndpointInputSchemas.credentialTemplatesGet,
		output: ParadymEndpointOutputSchemas.credentialTemplatesGet,
	},
	'credentialTemplates.update': {
		input: ParadymEndpointInputSchemas.credentialTemplatesUpdate,
		output: ParadymEndpointOutputSchemas.credentialTemplatesUpdate,
	},
	'credentialTemplates.archive': {
		input: ParadymEndpointInputSchemas.credentialTemplatesArchive,
		output: ParadymEndpointOutputSchemas.credentialTemplatesArchive,
	},
	'credentialTemplates.unarchive': {
		input: ParadymEndpointInputSchemas.credentialTemplatesUnarchive,
		output: ParadymEndpointOutputSchemas.credentialTemplatesUnarchive,
	},
	'presentationTemplates.list': {
		input: ParadymEndpointInputSchemas.presentationTemplatesList,
		output: ParadymEndpointOutputSchemas.presentationTemplatesList,
	},
	'presentationTemplates.create': {
		input: ParadymEndpointInputSchemas.presentationTemplatesCreate,
		output: ParadymEndpointOutputSchemas.presentationTemplatesCreate,
	},
	'presentationTemplates.get': {
		input: ParadymEndpointInputSchemas.presentationTemplatesGet,
		output: ParadymEndpointOutputSchemas.presentationTemplatesGet,
	},
	'presentationTemplates.update': {
		input: ParadymEndpointInputSchemas.presentationTemplatesUpdate,
		output: ParadymEndpointOutputSchemas.presentationTemplatesUpdate,
	},
	'presentationTemplates.archive': {
		input: ParadymEndpointInputSchemas.presentationTemplatesArchive,
		output: ParadymEndpointOutputSchemas.presentationTemplatesArchive,
	},
	'issuance.listSessions': {
		input: ParadymEndpointInputSchemas.issuanceListSessions,
		output: ParadymEndpointOutputSchemas.issuanceListSessions,
	},
	'issuance.createOffer': {
		input: ParadymEndpointInputSchemas.issuanceCreateOffer,
		output: ParadymEndpointOutputSchemas.issuanceCreateOffer,
	},
	'issuance.getSession': {
		input: ParadymEndpointInputSchemas.issuanceGetSession,
		output: ParadymEndpointOutputSchemas.issuanceGetSession,
	},
	'verification.listSessions': {
		input: ParadymEndpointInputSchemas.verificationListSessions,
		output: ParadymEndpointOutputSchemas.verificationListSessions,
	},
	'verification.createRequest': {
		input: ParadymEndpointInputSchemas.verificationCreateRequest,
		output: ParadymEndpointOutputSchemas.verificationCreateRequest,
	},
	'verification.getSession': {
		input: ParadymEndpointInputSchemas.verificationGetSession,
		output: ParadymEndpointOutputSchemas.verificationGetSession,
	},
	'verification.complete': {
		input: ParadymEndpointInputSchemas.verificationComplete,
		output: ParadymEndpointOutputSchemas.verificationComplete,
	},
	'revocation.batch': {
		input: ParadymEndpointInputSchemas.revocationBatch,
		output: ParadymEndpointOutputSchemas.revocationBatch,
	},
	'trustedEntities.list': {
		input: ParadymEndpointInputSchemas.trustedEntitiesList,
		output: ParadymEndpointOutputSchemas.trustedEntitiesList,
	},
	'trustedEntities.create': {
		input: ParadymEndpointInputSchemas.trustedEntitiesCreate,
		output: ParadymEndpointOutputSchemas.trustedEntitiesCreate,
	},
	'trustedEntities.get': {
		input: ParadymEndpointInputSchemas.trustedEntitiesGet,
		output: ParadymEndpointOutputSchemas.trustedEntitiesGet,
	},
	'trustedEntities.delete': {
		input: ParadymEndpointInputSchemas.trustedEntitiesDelete,
		output: ParadymEndpointOutputSchemas.trustedEntitiesDelete,
	},
	'webhooks.listSubscriptions': {
		input: ParadymEndpointInputSchemas.webhooksListSubscriptions,
		output: ParadymEndpointOutputSchemas.webhooksListSubscriptions,
	},
	'webhooks.createSubscription': {
		input: ParadymEndpointInputSchemas.webhooksCreateSubscription,
		output: ParadymEndpointOutputSchemas.webhooksCreateSubscription,
	},
	'webhooks.deleteSubscription': {
		input: ParadymEndpointInputSchemas.webhooksDeleteSubscription,
		output: ParadymEndpointOutputSchemas.webhooksDeleteSubscription,
	},
	'webhooks.listDeliveries': {
		input: ParadymEndpointInputSchemas.webhooksListDeliveries,
		output: ParadymEndpointOutputSchemas.webhooksListDeliveries,
	},
	'webhooks.getDelivery': {
		input: ParadymEndpointInputSchemas.webhooksGetDelivery,
		output: ParadymEndpointOutputSchemas.webhooksGetDelivery,
	},
	'webhooks.redeliverDelivery': {
		input: ParadymEndpointInputSchemas.webhooksRedeliverDelivery,
		output: ParadymEndpointOutputSchemas.webhooksRedeliverDelivery,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof paradymEndpointsNested
>;

const paradymWebhookSchemas = {
	'paradym.event': {
		description:
			'A Paradym webhook event: issuance, verification or DIDComm updates',
		payload: ParadymWebhookPayloadSchema,
		response: ParadymWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof paradymWebhooksNested>;

const paradymEndpointMeta = {
	'wallets.list': {
		riskLevel: 'read',
		description: 'List wallets, searched by name or filtered by id and name',
	},
	'wallets.create': {
		riskLevel: 'write',
		description:
			'Create a wallet with its own agent, templates and credentials',
	},
	'wallets.get': {
		riskLevel: 'read',
		description: 'Read one wallet by id',
	},
	'wallets.update': {
		riskLevel: 'write',
		description: 'Rename a wallet or change its verification data access',
	},
	'credentialTemplates.list': {
		riskLevel: 'read',
		description: 'List SD-JWT VC credential templates',
	},
	'credentialTemplates.create': {
		riskLevel: 'write',
		description: 'Create an SD-JWT VC credential template with its attributes',
	},
	'credentialTemplates.get': {
		riskLevel: 'read',
		description: 'Read one SD-JWT VC credential template',
	},
	'credentialTemplates.update': {
		riskLevel: 'write',
		description: 'Update an SD-JWT VC credential template',
	},
	'credentialTemplates.archive': {
		riskLevel: 'destructive',
		description: 'Archive an SD-JWT VC credential template',
		irreversible: true,
	},
	'credentialTemplates.unarchive': {
		riskLevel: 'write',
		description: 'Unarchive an SD-JWT VC credential template',
	},
	'presentationTemplates.list': {
		riskLevel: 'read',
		description: 'List presentation templates',
	},
	'presentationTemplates.create': {
		riskLevel: 'write',
		description:
			'Create a presentation template defining what a holder must present',
	},
	'presentationTemplates.get': {
		riskLevel: 'read',
		description: 'Read one presentation template',
	},
	'presentationTemplates.update': {
		riskLevel: 'write',
		description: 'Update a presentation template',
	},
	'presentationTemplates.archive': {
		riskLevel: 'destructive',
		description: 'Archive a presentation template',
		irreversible: true,
	},
	'issuance.listSessions': {
		riskLevel: 'read',
		description: 'List OpenID4VC issuance sessions with their statuses',
	},
	'issuance.createOffer': {
		riskLevel: 'write',
		description: 'Create a credential offer a holder wallet can accept',
	},
	'issuance.getSession': {
		riskLevel: 'read',
		description: 'Read one OpenID4VC issuance session',
	},
	'verification.listSessions': {
		riskLevel: 'read',
		description: 'List OpenID4VC verification sessions with their statuses',
	},
	'verification.createRequest': {
		riskLevel: 'write',
		description: 'Create a verification session a holder wallet responds to',
	},
	'verification.getSession': {
		riskLevel: 'read',
		description:
			'Read one OpenID4VC verification session, including presented credentials',
	},
	'verification.complete': {
		riskLevel: 'write',
		description: 'Mark a succeeded verification session as completed',
	},
	'revocation.batch': {
		riskLevel: 'destructive',
		description:
			'Revoke issued credentials in one batch; revocation cannot be undone',
		irreversible: true,
	},
	'trustedEntities.list': {
		riskLevel: 'read',
		description: 'List trusted entities with their DIDs and certificates',
	},
	'trustedEntities.create': {
		riskLevel: 'write',
		description: 'Create a trusted entity from DIDs or X.509 certificates',
	},
	'trustedEntities.get': {
		riskLevel: 'read',
		description: 'Read one trusted entity',
	},
	'trustedEntities.delete': {
		riskLevel: 'destructive',
		description: 'Delete a trusted entity',
		irreversible: true,
	},
	'webhooks.listSubscriptions': {
		riskLevel: 'read',
		description: 'List the wallet webhook subscriptions',
	},
	'webhooks.createSubscription': {
		riskLevel: 'write',
		description: 'Create a webhook subscription for the event types you choose',
	},
	'webhooks.deleteSubscription': {
		riskLevel: 'destructive',
		description:
			'Delete a webhook subscription; deliveries stop until it is created again',
		irreversible: true,
	},
	'webhooks.listDeliveries': {
		riskLevel: 'read',
		description: 'List webhook deliveries with their statuses',
	},
	'webhooks.getDelivery': {
		riskLevel: 'read',
		description: 'Read one webhook delivery with its attempt history',
	},
	'webhooks.redeliverDelivery': {
		riskLevel: 'write',
		description: 'Redeliver a pending or failed webhook delivery',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof paradymEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const paradymAuthConfig = {
	api_key: {
		// Every wallet-scoped route is /v1/wallets/{walletId}/..., so the
		// account needs the wallet id beside the API key.
		account: ['wallet_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseParadymPlugin<T extends ParadymPluginOptions> = CorsairPlugin<
	'paradym',
	typeof ParadymSchema,
	typeof paradymEndpointsNested,
	typeof paradymWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof paradymAuthConfig
>;

export type InternalParadymPlugin = BaseParadymPlugin<ParadymPluginOptions>;

export type ExternalParadymPlugin<T extends ParadymPluginOptions> =
	BaseParadymPlugin<T>;

export function paradym<const T extends ParadymPluginOptions>(
	incomingOptions: ParadymPluginOptions & T = {} as ParadymPluginOptions & T,
): ExternalParadymPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'paradym',
		authConfig: paradymAuthConfig,
		schema: ParadymSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: paradymEndpointsNested,
		webhooks: paradymWebhooksNested,
		endpointMeta: paradymEndpointMeta,
		endpointSchemas: paradymEndpointSchemas,
		webhookSchemas: paradymWebhookSchemas,
		pluginWebhookMatcher: matchParadymWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ParadymKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Every Paradym delivery is signed with the subscription's
				// secret, so an empty secret makes the handler reject
				// deliveries with 401 rather than accept them unverified.
				if (options.webhookSecret) return options.webhookSecret;
				const stored = await ctx.keys.get_webhook_signature();
				return stored ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				// A key without a wallet id cannot reach any wallet-scoped
				// route. Failing here, not in the endpoint, lets core hand
				// back a connect link.
				if (res && !options.walletId && !(await ctx.keys.get_wallet_id())) {
					throw new AuthMissingError('paradym', ctx.authType ?? 'api_key');
				}
				if (res) return res;
			}

			throw new AuthMissingError('paradym', ctx.authType ?? 'api_key');
		},
	} satisfies InternalParadymPlugin;
}

export { ParadymAPIError } from './client';

export type {
	OpenId4VcIssuance,
	OpenId4VcVerification,
	ParadymEndpointInputs,
	ParadymEndpointOutputs,
	SdJwtCredentialTemplate,
	TrustedEntity,
	Wallet,
	WebhookDelivery,
	WebhookSubscription,
} from './endpoints/types';
export type { ParadymWebhookPayload } from './webhooks/types';
export {
	matchParadymWebhook,
	PARADYM_SIGNATURE_HEADER,
	verifyParadymWebhook,
} from './webhooks/types';
