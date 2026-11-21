import type {
	AuthTypes,
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
import { AuthMissingError } from 'corsair/core';
import {
	Businesses,
	Contacts,
	Giftcards,
	Loyalty,
	Points,
	Promotions,
	Rewards,
	Vouchers,
	Webhooks,
} from './endpoints';
import type {
	PiggyEndpointInputs,
	PiggyEndpointOutputs,
} from './endpoints/types';
import {
	PiggyEndpointInputSchemas,
	PiggyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PiggySchema } from './schema';
import { event } from './webhooks';
import type { PiggyWebhookPayload } from './webhooks/types';
import { matchPiggyWebhook, PiggyWebhookPayloadSchema } from './webhooks/types';

export type PiggyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPiggyPlugin['hooks'];
	webhookHooks?: InternalPiggyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof piggyEndpointsNested>;
};

export type PiggyContext = CorsairPluginContext<
	typeof PiggySchema,
	PiggyPluginOptions,
	undefined,
	typeof piggyAuthConfig
>;

export type PiggyKeyBuilderContext = KeyBuilderContext<
	PiggyPluginOptions,
	typeof piggyAuthConfig
>;

export type PiggyBoundEndpoints = BindEndpoints<typeof piggyEndpointsNested>;

type PiggyEndpoint<K extends keyof PiggyEndpointOutputs> = CorsairEndpoint<
	PiggyContext,
	PiggyEndpointInputs[K],
	PiggyEndpointOutputs[K]
>;

export type PiggyEndpoints = {
	[K in keyof PiggyEndpointOutputs]: PiggyEndpoint<K>;
};

type PiggyWebhook = CorsairWebhook<
	PiggyContext,
	PiggyWebhookPayload,
	PiggyWebhookPayload
>;

export type PiggyBoundWebhooks = BindWebhooks<typeof piggyWebhooksNested>;

const piggyEndpointsNested = {
	contacts: {
		list: Contacts.list,
		create: Contacts.create,
		createAnonymous: Contacts.createAnonymous,
		findOneByEmail: Contacts.findOneByEmail,
		findOrCreate: Contacts.findOrCreate,
		get: Contacts.get,
		update: Contacts.update,
		delete: Contacts.deleteContact,
		claim: Contacts.claim,
		merge: Contacts.merge,
		getCreditBalance: Contacts.getCreditBalance,
		getPrepaidBalance: Contacts.getPrepaidBalance,
		getTier: Contacts.getTier,
	},
	loyalty: {
		getProgram: Loyalty.getProgram,
		listTransactions: Loyalty.listTransactions,
	},
	points: {
		create: Points.create,
		get: Points.get,
		reverse: Points.reverse,
	},
	rewards: {
		list: Rewards.list,
		get: Rewards.get,
		update: Rewards.update,
		redeem: Rewards.redeem,
		reverseRedemption: Rewards.reverseRedemption,
	},
	promotions: {
		list: Promotions.list,
		get: Promotions.get,
	},
	vouchers: {
		list: Vouchers.list,
		create: Vouchers.create,
		find: Vouchers.find,
		update: Vouchers.update,
		validate: Vouchers.validate,
		redeem: Vouchers.redeem,
		lock: Vouchers.lock,
		release: Vouchers.release,
		reverseRedemption: Vouchers.reverseRedemption,
	},
	giftcards: {
		list: Giftcards.list,
		get: Giftcards.get,
		findOneByHash: Giftcards.findOneByHash,
		create: Giftcards.create,
		sendByEmail: Giftcards.sendByEmail,
		listPrograms: Giftcards.listPrograms,
	},
	businesses: {
		listProfiles: Businesses.listProfiles,
		getProfile: Businesses.getProfile,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		get: Webhooks.get,
		update: Webhooks.update,
		delete: Webhooks.deleteSubscription,
	},
} as const;

export const piggyWebhooksNested = {
	piggy: {
		event,
	},
} as const;

export const piggyEndpointSchemas = {
	'contacts.list': {
		input: PiggyEndpointInputSchemas.contactsList,
		output: PiggyEndpointOutputSchemas.contactsList,
	},
	'contacts.create': {
		input: PiggyEndpointInputSchemas.contactsCreate,
		output: PiggyEndpointOutputSchemas.contactsCreate,
	},
	'contacts.createAnonymous': {
		input: PiggyEndpointInputSchemas.contactsCreateAnonymous,
		output: PiggyEndpointOutputSchemas.contactsCreateAnonymous,
	},
	'contacts.findOneByEmail': {
		input: PiggyEndpointInputSchemas.contactsFindOneByEmail,
		output: PiggyEndpointOutputSchemas.contactsFindOneByEmail,
	},
	'contacts.findOrCreate': {
		input: PiggyEndpointInputSchemas.contactsFindOrCreate,
		output: PiggyEndpointOutputSchemas.contactsFindOrCreate,
	},
	'contacts.get': {
		input: PiggyEndpointInputSchemas.contactsGet,
		output: PiggyEndpointOutputSchemas.contactsGet,
	},
	'contacts.update': {
		input: PiggyEndpointInputSchemas.contactsUpdate,
		output: PiggyEndpointOutputSchemas.contactsUpdate,
	},
	'contacts.delete': {
		input: PiggyEndpointInputSchemas.contactsDelete,
		output: PiggyEndpointOutputSchemas.contactsDelete,
	},
	'contacts.claim': {
		input: PiggyEndpointInputSchemas.contactsClaim,
		output: PiggyEndpointOutputSchemas.contactsClaim,
	},
	'contacts.merge': {
		input: PiggyEndpointInputSchemas.contactsMerge,
		output: PiggyEndpointOutputSchemas.contactsMerge,
	},
	'contacts.getCreditBalance': {
		input: PiggyEndpointInputSchemas.contactsGetCreditBalance,
		output: PiggyEndpointOutputSchemas.contactsGetCreditBalance,
	},
	'contacts.getPrepaidBalance': {
		input: PiggyEndpointInputSchemas.contactsGetPrepaidBalance,
		output: PiggyEndpointOutputSchemas.contactsGetPrepaidBalance,
	},
	'contacts.getTier': {
		input: PiggyEndpointInputSchemas.contactsGetTier,
		output: PiggyEndpointOutputSchemas.contactsGetTier,
	},
	'loyalty.getProgram': {
		input: PiggyEndpointInputSchemas.loyaltyGetProgram,
		output: PiggyEndpointOutputSchemas.loyaltyGetProgram,
	},
	'loyalty.listTransactions': {
		input: PiggyEndpointInputSchemas.loyaltyListTransactions,
		output: PiggyEndpointOutputSchemas.loyaltyListTransactions,
	},
	'points.create': {
		input: PiggyEndpointInputSchemas.pointsCreate,
		output: PiggyEndpointOutputSchemas.pointsCreate,
	},
	'points.get': {
		input: PiggyEndpointInputSchemas.pointsGet,
		output: PiggyEndpointOutputSchemas.pointsGet,
	},
	'points.reverse': {
		input: PiggyEndpointInputSchemas.pointsReverse,
		output: PiggyEndpointOutputSchemas.pointsReverse,
	},
	'rewards.list': {
		input: PiggyEndpointInputSchemas.rewardsList,
		output: PiggyEndpointOutputSchemas.rewardsList,
	},
	'rewards.get': {
		input: PiggyEndpointInputSchemas.rewardsGet,
		output: PiggyEndpointOutputSchemas.rewardsGet,
	},
	'rewards.update': {
		input: PiggyEndpointInputSchemas.rewardsUpdate,
		output: PiggyEndpointOutputSchemas.rewardsUpdate,
	},
	'rewards.redeem': {
		input: PiggyEndpointInputSchemas.rewardsRedeem,
		output: PiggyEndpointOutputSchemas.rewardsRedeem,
	},
	'rewards.reverseRedemption': {
		input: PiggyEndpointInputSchemas.rewardsReverseRedemption,
		output: PiggyEndpointOutputSchemas.rewardsReverseRedemption,
	},
	'promotions.list': {
		input: PiggyEndpointInputSchemas.promotionsList,
		output: PiggyEndpointOutputSchemas.promotionsList,
	},
	'promotions.get': {
		input: PiggyEndpointInputSchemas.promotionsGet,
		output: PiggyEndpointOutputSchemas.promotionsGet,
	},
	'vouchers.list': {
		input: PiggyEndpointInputSchemas.vouchersList,
		output: PiggyEndpointOutputSchemas.vouchersList,
	},
	'vouchers.create': {
		input: PiggyEndpointInputSchemas.vouchersCreate,
		output: PiggyEndpointOutputSchemas.vouchersCreate,
	},
	'vouchers.find': {
		input: PiggyEndpointInputSchemas.vouchersFind,
		output: PiggyEndpointOutputSchemas.vouchersFind,
	},
	'vouchers.update': {
		input: PiggyEndpointInputSchemas.vouchersUpdate,
		output: PiggyEndpointOutputSchemas.vouchersUpdate,
	},
	'vouchers.validate': {
		input: PiggyEndpointInputSchemas.vouchersValidate,
		output: PiggyEndpointOutputSchemas.vouchersValidate,
	},
	'vouchers.redeem': {
		input: PiggyEndpointInputSchemas.vouchersRedeem,
		output: PiggyEndpointOutputSchemas.vouchersRedeem,
	},
	'vouchers.lock': {
		input: PiggyEndpointInputSchemas.vouchersLock,
		output: PiggyEndpointOutputSchemas.vouchersLock,
	},
	'vouchers.release': {
		input: PiggyEndpointInputSchemas.vouchersRelease,
		output: PiggyEndpointOutputSchemas.vouchersRelease,
	},
	'vouchers.reverseRedemption': {
		input: PiggyEndpointInputSchemas.vouchersReverseRedemption,
		output: PiggyEndpointOutputSchemas.vouchersReverseRedemption,
	},
	'giftcards.list': {
		input: PiggyEndpointInputSchemas.giftcardsList,
		output: PiggyEndpointOutputSchemas.giftcardsList,
	},
	'giftcards.get': {
		input: PiggyEndpointInputSchemas.giftcardsGet,
		output: PiggyEndpointOutputSchemas.giftcardsGet,
	},
	'giftcards.findOneByHash': {
		input: PiggyEndpointInputSchemas.giftcardsFindOneByHash,
		output: PiggyEndpointOutputSchemas.giftcardsFindOneByHash,
	},
	'giftcards.create': {
		input: PiggyEndpointInputSchemas.giftcardsCreate,
		output: PiggyEndpointOutputSchemas.giftcardsCreate,
	},
	'giftcards.sendByEmail': {
		input: PiggyEndpointInputSchemas.giftcardsSendByEmail,
		output: PiggyEndpointOutputSchemas.giftcardsSendByEmail,
	},
	'giftcards.listPrograms': {
		input: PiggyEndpointInputSchemas.giftcardsListPrograms,
		output: PiggyEndpointOutputSchemas.giftcardsListPrograms,
	},
	'businesses.listProfiles': {
		input: PiggyEndpointInputSchemas.businessesListProfiles,
		output: PiggyEndpointOutputSchemas.businessesListProfiles,
	},
	'businesses.getProfile': {
		input: PiggyEndpointInputSchemas.businessesGetProfile,
		output: PiggyEndpointOutputSchemas.businessesGetProfile,
	},
	'webhooks.list': {
		input: PiggyEndpointInputSchemas.webhooksList,
		output: PiggyEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: PiggyEndpointInputSchemas.webhooksCreate,
		output: PiggyEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.get': {
		input: PiggyEndpointInputSchemas.webhooksGet,
		output: PiggyEndpointOutputSchemas.webhooksGet,
	},
	'webhooks.update': {
		input: PiggyEndpointInputSchemas.webhooksUpdate,
		output: PiggyEndpointOutputSchemas.webhooksUpdate,
	},
	'webhooks.delete': {
		input: PiggyEndpointInputSchemas.webhooksDelete,
		output: PiggyEndpointOutputSchemas.webhooksDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof piggyEndpointsNested>;

const piggyWebhookSchemas = {
	'piggy.event': {
		description:
			'A Piggy webhook delivery: a V1 single event or a V2 batch, signature-verified',
		payload: PiggyWebhookPayloadSchema,
		response: PiggyWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof piggyWebhooksNested>;

export const piggyEndpointMeta = {
	'contacts.list': {
		riskLevel: 'read',
		description: 'List contacts with paging, date and attribute filters',
	},
	'contacts.create': {
		riskLevel: 'write',
		description: 'Create a contact from an email address',
	},
	'contacts.createAnonymous': {
		riskLevel: 'write',
		description: 'Create an anonymous contact with a fictional email',
	},
	'contacts.findOneByEmail': {
		riskLevel: 'read',
		description: 'Read one contact by email address',
	},
	'contacts.findOrCreate': {
		riskLevel: 'write',
		description: 'Read a contact by email, creating one when missing',
	},
	'contacts.get': {
		riskLevel: 'read',
		description: 'Read one contact by UUID with balances and subscriptions',
	},
	'contacts.update': {
		riskLevel: 'write',
		description: 'Update contact attributes keyed by attribute name',
	},
	'contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact (DEFAULT or GDPR); cannot be undone',
	},
	'contacts.claim': {
		riskLevel: 'write',
		description:
			'Claim an anonymous contact with a real email, merging on match',
	},
	'contacts.merge': {
		riskLevel: 'destructive',
		description:
			'Merge a source contact into a destination contact; cannot be undone',
	},
	'contacts.getCreditBalance': {
		riskLevel: 'read',
		description: 'Read a contact credit balance',
	},
	'contacts.getPrepaidBalance': {
		riskLevel: 'read',
		description: 'Read a contact prepaid balance',
	},
	'contacts.getTier': {
		riskLevel: 'read',
		description: 'Read the contact current loyalty tier',
	},
	'loyalty.getProgram': {
		riskLevel: 'read',
		description: 'Read the account loyalty program settings',
	},
	'loyalty.listTransactions': {
		riskLevel: 'read',
		description: 'List loyalty transactions with type, shop and date filters',
	},
	'points.create': {
		riskLevel: 'write',
		description: 'Add or subtract points on a contact balance directly',
	},
	'points.get': {
		riskLevel: 'read',
		description: 'Read one direct points transaction',
	},
	'points.reverse': {
		riskLevel: 'write',
		description: 'Reverse a direct points transaction (once per transaction)',
	},
	'rewards.list': {
		riskLevel: 'read',
		description: 'List rewards, optionally claimable by a contact',
	},
	'rewards.get': {
		riskLevel: 'read',
		description: 'Read one reward by UUID',
	},
	'rewards.update': {
		riskLevel: 'write',
		description: 'Update a reward title, description or required credits',
	},
	'rewards.redeem': {
		riskLevel: 'write',
		description: 'Create a reward reception: claim a reward for a contact',
	},
	'rewards.reverseRedemption': {
		riskLevel: 'write',
		description: 'Reverse a reward redemption, reissuing the credits',
	},
	'promotions.list': {
		riskLevel: 'read',
		description: 'List the account promotions',
	},
	'promotions.get': {
		riskLevel: 'read',
		description: 'Read one promotion by UUID',
	},
	'vouchers.list': {
		riskLevel: 'read',
		description: 'List vouchers with promotion, contact and status filters',
	},
	'vouchers.create': {
		riskLevel: 'write',
		description: 'Create a voucher for a promotion',
	},
	'vouchers.find': {
		riskLevel: 'read',
		description: 'Read one voucher by code',
	},
	'vouchers.update': {
		riskLevel: 'write',
		description: 'Update voucher status, attributes or expiration',
	},
	'vouchers.validate': {
		riskLevel: 'read',
		description: 'Check whether a voucher is redeemable at a business profile',
	},
	'vouchers.redeem': {
		riskLevel: 'write',
		description: 'Redeem a voucher by code at a business profile',
	},
	'vouchers.lock': {
		riskLevel: 'write',
		description: 'Lock a voucher and receive a release key',
	},
	'vouchers.release': {
		riskLevel: 'write',
		description: 'Release a locked voucher with its release key',
	},
	'vouchers.reverseRedemption': {
		riskLevel: 'write',
		description: 'Reverse a voucher redemption',
	},
	'giftcards.list': {
		riskLevel: 'read',
		description: 'List giftcards with program and paging filters',
	},
	'giftcards.get': {
		riskLevel: 'read',
		description: 'Read one giftcard by UUID',
	},
	'giftcards.findOneByHash': {
		riskLevel: 'read',
		description: 'Read one giftcard by hash or QR value',
	},
	'giftcards.create': {
		riskLevel: 'destructive',
		description:
			'Issue a digital giftcard with a balance; it carries real value and uses Leat tokens',
	},
	'giftcards.sendByEmail': {
		riskLevel: 'destructive',
		description: 'Email a giftcard to a contact; the email cannot be recalled',
	},
	'giftcards.listPrograms': {
		riskLevel: 'read',
		description: 'List the giftcard programs',
	},
	'businesses.listProfiles': {
		riskLevel: 'read',
		description: 'List the account business profiles',
	},
	'businesses.getProfile': {
		riskLevel: 'read',
		description: 'Read one business profile by UUID',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List webhook subscriptions with event type and status filters',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description: 'Create a webhook subscription for one event type',
	},
	'webhooks.get': {
		riskLevel: 'read',
		description: 'Read one webhook subscription by UUID',
	},
	'webhooks.update': {
		riskLevel: 'write',
		description: 'Update a subscription name, URL or status',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a webhook subscription; it cannot be restored',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof piggyEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const piggyAuthConfig = {
	api_key: {
		// Personal Access Tokens authenticate a private app; no account-level
		// field is needed beside the token.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePiggyPlugin<T extends PiggyPluginOptions> = CorsairPlugin<
	'piggy',
	typeof PiggySchema,
	typeof piggyEndpointsNested,
	typeof piggyWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof piggyAuthConfig
>;

export type InternalPiggyPlugin = BasePiggyPlugin<PiggyPluginOptions>;

export type ExternalPiggyPlugin<T extends PiggyPluginOptions> =
	BasePiggyPlugin<T>;

export function piggy<const T extends PiggyPluginOptions>(
	incomingOptions: PiggyPluginOptions & T = {} as PiggyPluginOptions & T,
): ExternalPiggyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'piggy',
		authConfig: piggyAuthConfig,
		schema: PiggySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: piggyEndpointsNested,
		webhooks: piggyWebhooksNested,
		endpointMeta: piggyEndpointMeta,
		endpointSchemas: piggyEndpointSchemas,
		webhookSchemas: piggyWebhookSchemas,
		pluginWebhookMatcher: matchPiggyWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PiggyKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// Deliveries are HMAC-signed with the subscription secret; an
				// empty secret makes the handler reject deliveries with 401
				// rather than accept them unverified.
				if (options.webhookSecret) return options.webhookSecret;
				const stored = await ctx.keys.get_webhook_signature();
				return stored ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('piggy', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPiggyPlugin;
}

export type {
	BusinessProfile,
	Contact,
	CreditReception,
	DirectPointsTransaction,
	Giftcard,
	GiftcardProgram,
	LoyaltyProgram,
	LoyaltyTransaction,
	PiggyEndpointInputs,
	PiggyEndpointOutputs,
	Promotion,
	Reward,
	RewardReception,
	Voucher,
	VoucherLock,
	WebhookSubscription,
} from './endpoints/types';

export type {
	PiggyV1Envelope,
	PiggyV2Envelope,
	PiggyWebhookPayload,
} from './webhooks/types';
