import { z } from 'zod';

// ── Shared building blocks ─────────────────────────────────────────────────

/** The page block Piggy lists answer with; empty {} or [] on singles. */
export const PageMetaSchema = z
	.object({
		page: z.number().nullish().describe('Page returned'),
		limit: z.number().nullish().describe('Records per page'),
		viewing_from: z
			.number()
			.nullish()
			.describe('First record index on the page'),
		viewing_to: z.number().nullish().describe('Last record index on the page'),
		last_page: z.number().nullish().describe('Total number of pages'),
		total: z.number().nullish().describe('Total records'),
	})
	.loose()
	.describe('Pagination metadata');
export type PageMeta = z.infer<typeof PageMetaSchema>;

/**
 * List answers carry paging details in `meta` on paged resources, but the
 * docs show plain `[]` or `{}` on others, so the parsed type accepts both.
 */
export const ListMetaSchema = z
	.union([
		PageMetaSchema,
		z.array(z.unknown()),
		z.record(z.string(), z.unknown()),
	])
	.describe('Paging metadata; an empty value on lists Piggy does not page');
export type ListMeta = z.infer<typeof ListMetaSchema>;

/** Single-resource answers carry a `{ data, meta }` envelope with an empty meta. */
function envelope<T extends z.ZodType>(
	data: T,
	note: string,
): z.ZodObject<{ data: T; meta: z.ZodOptional<z.ZodUnknown> }> {
	return z
		.object({ data, meta: z.unknown().optional() })
		.loose()
		.describe(note) as z.ZodObject<{
		data: T;
		meta: z.ZodOptional<z.ZodUnknown>;
	}>;
}

/** A contact reference: the short contact shape most answers embed. */
export const ContactRefSchema = z
	.object({
		uuid: z.string().nullish().describe('Contact UUID'),
		email: z.string().nullish().describe('Contact email'),
		credit_balance: z
			.object({ id: z.number().nullish(), balance: z.number().nullish() })
			.loose()
			.nullish()
			.describe('Credit balance at lookup time'),
	})
	.loose()
	.describe('A Piggy contact reference');
export type ContactRef = z.infer<typeof ContactRefSchema>;

/** The tier object contacts and tier answers carry. */
export const TierInfoSchema = z
	.object({
		uuid: z.string().nullish().describe('Tier UUID'),
		name: z.string().nullish().describe('Tier name'),
		description: z.string().nullish().describe('Tier description'),
		position: z.number().nullish().describe('Tier order'),
		media: z.unknown().nullish().describe('Tier media'),
		perks: z
			.array(z.unknown())
			.nullish()
			.describe('Perks attached to the tier'),
	})
	.loose()
	.describe('A loyalty tier');
export type TierInfo = z.infer<typeof TierInfoSchema>;

/** One subscription state embedded on a contact. */
export const SubscriptionSchema = z
	.object({
		is_subscribed: z
			.boolean()
			.nullish()
			.describe('Whether the contact is subscribed'),
		status: z
			.string()
			.nullish()
			.describe('Subscription status, e.g. SUBSCRIBED'),
		subscription_type: z
			.object({
				id: z.number().nullish(),
				uuid: z.string().nullish(),
				name: z.string().nullish(),
				active: z.boolean().nullish(),
				description: z.string().nullish(),
				strategy: z.string().nullish(),
			})
			.loose()
			.nullish()
			.describe('The subscription type'),
	})
	.loose()
	.describe('A contact subscription');
export type Subscription = z.infer<typeof SubscriptionSchema>;

/** A contact, as the contacts endpoints return it. */
export const ContactSchema = z
	.object({
		id: z.number().nullish().describe('Contact id'),
		uuid: z.string().nullish().describe('Contact UUID'),
		email: z.string().nullish().describe('Contact email'),
		attributes: z
			.array(z.unknown())
			.nullish()
			.describe('Deprecated attribute array'),
		tier: TierInfoSchema.nullish().describe('Current tier'),
		subscriptions: z
			.array(SubscriptionSchema)
			.nullish()
			.describe('Subscription states per type'),
		credit_balance: z
			.object({ id: z.number().nullish(), balance: z.number().nullish() })
			.loose()
			.nullish()
			.describe('Credit balance'),
		prepaid_balance: z
			.object({ balance_in_cents: z.number().nullish() })
			.loose()
			.nullish()
			.describe('Prepaid balance in cents'),
		current_values: z
			// unknown: current_values is an open map of system and custom
			// attribute values keyed by attribute name.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Stored attribute values keyed by name'),
		current_display_values: z
			// unknown: display values mirror current_values in display format.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Display-formatted attribute values keyed by name'),
	})
	.loose()
	.describe('A Piggy contact');
export type Contact = z.infer<typeof ContactSchema>;

/** A shop/business profile reference embedded in transaction answers. */
export const ShopRefSchema = z
	.object({
		id: z.number().nullish().describe('Shop id'),
		uuid: z.string().nullish().describe('Shop UUID'),
		type: z.string().nullish().describe('physical or web'),
		name: z.string().nullish().describe('Shop name'),
		address: z.unknown().nullish().describe('Address record'),
	})
	.loose()
	.describe('A shop (business profile) reference');
export type ShopRef = z.infer<typeof ShopRefSchema>;

/** A unit reference embedded in transaction answers. */
export const UnitRefSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		label: z.string().nullish(),
		prefix: z.string().nullish(),
		is_default: z.boolean().nullish(),
	})
	.loose()
	.describe('A unit reference');

/** The account's loyalty program. */
export const LoyaltyProgramSchema = z
	.object({
		id: z.number().nullish().describe('Program id'),
		name: z.string().nullish().describe('Program name'),
		max_amount: z.number().nullish().describe('Maximum credit amount'),
		custom_credit_name: z
			.string()
			.nullish()
			.describe('Display name for credits'),
		unit: z
			.object({
				name: z.string().nullish(),
				label: z.string().nullish(),
				prefix: z.string().nullish(),
			})
			.loose()
			.nullish()
			.describe('Program unit'),
	})
	.loose()
	.describe('The loyalty program');
export type LoyaltyProgram = z.infer<typeof LoyaltyProgramSchema>;

/** A loyalty transaction: a credit or reward reception line. */
export const LoyaltyTransactionSchema = z
	.object({
		uuid: z.string().nullish().describe('Transaction UUID'),
		credits: z.number().nullish().describe('Credit delta of the transaction'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		type: z.string().nullish().describe('credit_reception or reward_reception'),
		contact_identifier: z
			.string()
			.nullish()
			.describe('Identifier used, if any'),
		contact: ContactRefSchema.nullish().describe('The contact'),
		shop: ShopRefSchema.nullish().describe('The shop'),
		unit_value: z.number().nullish().describe('Measured unit value'),
		unit: UnitRefSchema.nullish().describe('The unit'),
	})
	.loose()
	.describe('A loyalty transaction');
export type LoyaltyTransaction = z.infer<typeof LoyaltyTransactionSchema>;

/** A direct points transaction. */
export const DirectPointsTransactionSchema = z
	.object({
		uuid: z.string().nullish().describe('Transaction UUID'),
		contact: ContactRefSchema.nullish().describe('The contact'),
		business_profile: z
			.object({ uuid: z.string().nullish(), name: z.string().nullish() })
			.loose()
			.nullish()
			.describe('The business profile the points were given at'),
		points: z.number().nullish().describe('Points added (negative subtracts)'),
		channel: z.string().nullish().describe('Creation channel, e.g. OAUTH_API'),
		custom_attributes: z
			// unknown: custom attribute values keyed by attribute name.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Custom attributes of the transaction'),
		created_at: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A direct points transaction');
export type DirectPointsTransaction = z.infer<
	typeof DirectPointsTransactionSchema
>;

/** A reward. */
export const RewardSchema = z
	.object({
		uuid: z.string().nullish().describe('Reward UUID'),
		title: z.string().nullish().describe('Reward title'),
		type: z.string().nullish().describe('DIGITAL or PHYSICAL'),
		reward_type: z.string().nullish().describe('DIGITAL or PHYSICAL'),
		is_active: z.boolean().nullish().describe('Whether the reward is active'),
		active: z.boolean().nullish().describe('Whether the reward is active'),
		description: z.string().nullish().describe('Reward description'),
		required_credits: z.number().nullish().describe('Credits needed to claim'),
		stock: z.number().nullish().describe('Remaining stock'),
		media: z.unknown().nullish().describe('Media record'),
		// unknown: rewards carry custom attributes as top-level fields.
	})
	.loose()
	.describe('A Piggy reward');
export type Reward = z.infer<typeof RewardSchema>;

/** A reward reception (a claimed reward). */
export const RewardReceptionSchema = z
	.object({
		title: z.string().nullish().describe('Reward title'),
		type: z.string().nullish().describe('reward_reception'),
		uuid: z.string().nullish().describe('Reception UUID'),
		credits: z.number().nullish().describe('Credits spent (negative)'),
		contact: ContactRefSchema.nullish().describe('The contact'),
		shop: ShopRefSchema.nullish().describe('The shop'),
		contact_identifier: z
			.string()
			.nullish()
			.describe('Identifier used, if any'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		reward: RewardSchema.nullish().describe('The reward'),
	})
	.loose()
	.describe('A reward reception');
export type RewardReception = z.infer<typeof RewardReceptionSchema>;

/** A credit reception, as reward reversals return to reissue credits. */
export const CreditReceptionSchema = z
	.object({
		type: z.string().nullish().describe('credit_reception'),
		contact_identifier: z
			.string()
			.nullish()
			.describe('Identifier used, if any'),
		contact: ContactRefSchema.nullish().describe('The contact'),
		shop: ShopRefSchema.nullish().describe('The shop'),
		credits: z.number().nullish().describe('Credits reissued'),
		created_at: z.string().nullish().describe('Creation timestamp'),
		uuid: z.string().nullish().describe('Reception UUID'),
		unit: UnitRefSchema.nullish().describe('The unit'),
		unit_value: z.number().nullish().describe('Measured unit value'),
	})
	.loose()
	.describe('A credit reception');
export type CreditReception = z.infer<typeof CreditReceptionSchema>;

/** A promotion (voucher campaign). */
export const PromotionSchema = z
	.object({
		uuid: z.string().nullish().describe('Promotion UUID'),
		name: z.string().nullish().describe('Promotion name'),
		description: z.string().nullish().describe('Promotion description'),
		voucher_limit: z.number().nullish().describe('Maximum vouchers issued'),
		limit_per_contact: z
			.number()
			.nullish()
			.describe('Claims allowed per contact'),
		expiration_duration: z.number().nullish().describe('Validity in seconds'),
		attributes: z
			// unknown: custom attribute values keyed by attribute name.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Custom attributes of the promotion'),
		media: z.unknown().nullish().describe('Media record'),
	})
	.loose()
	.describe('A Piggy promotion');
export type Promotion = z.infer<typeof PromotionSchema>;

/** A promotion reference embedded in voucher answers. */
export const PromotionRefSchema = z
	.object({
		uuid: z.string().nullish().describe('Promotion UUID'),
		name: z.string().nullish().describe('Promotion name'),
		description: z.string().nullish().describe('Promotion description'),
		voucher_limit: z.number().nullish().describe('Maximum vouchers issued'),
		limit_per_contact: z
			.number()
			.nullish()
			.describe('Claims allowed per contact'),
		expiration_duration: z.number().nullish().describe('Validity in seconds'),
		media: z.unknown().nullish().describe('Media record'),
		type: z.string().nullish().describe('Promotion type, e.g. SINGLE_USE'),
	})
	.loose()
	.describe('The voucher promotion');

/** A voucher. */
export const VoucherSchema = z
	.object({
		uuid: z.string().nullish().describe('Voucher UUID'),
		code: z.string().nullish().describe('Unique voucher code'),
		status: z.string().nullish().describe('ACTIVE, REDEEMED, LOCKED, …'),
		name: z.string().nullish().describe('Voucher name'),
		description: z.string().nullish().describe('Voucher description'),
		expiration_date: z.string().nullish().describe('Expiration timestamp'),
		activation_date: z.string().nullish().describe('Activation timestamp'),
		redeemed_at: z.string().nullish().describe('Redemption timestamp'),
		is_redeemed: z
			.boolean()
			.nullish()
			.describe('Whether the voucher is redeemed'),
		attributes: z
			// unknown: custom attribute values keyed by attribute name.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Custom attributes of the voucher'),
		contact: ContactRefSchema.nullish().describe('Linked contact, if any'),
		promotion: PromotionRefSchema.nullish().describe('The promotion'),
		total_redemptions_allowed: z
			.number()
			.nullish()
			.describe('Times this voucher can be redeemed'),
		times_redeemed: z.number().nullish().describe('Times redeemed so far'),
		redemptions_remaining: z.number().nullish().describe('Redemptions left'),
		add_to_wallet_url: z.string().nullish().describe('Wallet link'),
		voucher_redemption: z
			// unknown: the redemption record answers embed on redeem.
			.record(z.string(), z.unknown())
			.nullish()
			.describe('Redemption record, on redeem answers'),
	})
	.loose()
	.describe('A Piggy voucher');
export type Voucher = z.infer<typeof VoucherSchema>;

/** The lock record a lock or release call returns. */
export const VoucherLockSchema = z
	.object({
		voucher: z
			.object({ uuid: z.string().nullish(), status: z.string().nullish() })
			.loose()
			.nullish()
			.describe('The locked voucher'),
		lock: z
			.object({
				release_key: z
					.string()
					.nullish()
					.describe('Key needed to release or redeem'),
				locked_at: z.string().nullish(),
				unlocked_at: z.string().nullish(),
				system_release_at: z
					.string()
					.nullish()
					.describe('When the system auto-releases the lock (one hour)'),
			})
			.loose()
			.nullish()
			.describe('The lock state'),
	})
	.loose()
	.describe('A voucher lock result');
export type VoucherLock = z.infer<typeof VoucherLockSchema>;

/** A giftcard program. */
export const GiftcardProgramSchema = z
	.object({
		id: z.number().nullish().describe('Program id'),
		uuid: z.string().nullish().describe('Program UUID'),
		name: z.string().nullish().describe('Program name'),
		active: z.boolean().nullish().describe('Whether the program is active'),
		card_count: z.number().nullish().describe('Giftcards in the program'),
		settles: z.number().nullish().describe('Settles flag'),
		expiration_days: z.number().nullish().describe('Card validity in days'),
		max_amount_in_cents: z.number().nullish().describe('Maximum card balance'),
		min_amount_in_cents: z.number().nullish().describe('Minimum card balance'),
		calculator_flow: z.string().nullish().describe('Calculator flow'),
	})
	.loose()
	.describe('A giftcard program');
export type GiftcardProgram = z.infer<typeof GiftcardProgramSchema>;

/** A giftcard. */
export const GiftcardSchema = z
	.object({
		id: z.number().nullish().describe('Giftcard id'),
		uuid: z.string().nullish().describe('Giftcard UUID'),
		type: z.string().nullish().describe('DIGITAL or PHYSICAL'),
		hash: z.string().nullish().describe('Card hash / QR value'),
		amount_in_cents: z.number().nullish().describe('Balance in cents'),
		amount: z.number().nullish().describe('Balance'),
		display_amount: z.string().nullish().describe('Formatted balance'),
		upgradeable: z
			.boolean()
			.nullish()
			.describe('Whether the card can be topped up'),
		active: z.boolean().nullish().describe('Whether the card is active'),
		expiration_date: z.string().nullish().describe('Expiration timestamp'),
		formatted_expiration_date: z
			.string()
			.nullish()
			.describe('Formatted expiration'),
		url: z.string().nullish().describe('Balance page URL'),
		giftcard_program: GiftcardProgramSchema.nullish().describe('The program'),
		giftcard_recipients: z
			.array(z.unknown())
			.nullish()
			.describe('Recipients the card was sent to'),
	})
	.loose()
	.describe('A Piggy giftcard');
export type Giftcard = z.infer<typeof GiftcardSchema>;

/** A business profile (a shop under its old name). */
export const BusinessProfileSchema = z
	.object({
		uuid: z.string().nullish().describe('Profile UUID'),
		name: z.string().nullish().describe('Profile name'),
		type: z.string().nullish().describe('physical or web'),
		reference: z.string().nullish().describe('External reference'),
	})
	.loose()
	.describe('A business profile');
export type BusinessProfile = z.infer<typeof BusinessProfileSchema>;

/** A webhook subscription. */
export const WebhookSubscriptionSchema = z
	.object({
		uuid: z.string().nullish().describe('Subscription UUID'),
		name: z.string().nullish().describe('Subscription name'),
		event_type: z.string().nullish().describe('Event type subscribed to'),
		url: z.string().nullish().describe('Delivery URL'),
		status: z.string().nullish().describe('ACTIVE or INACTIVE'),
		version: z.string().nullish().describe('V1 or V2 envelope'),
		properties: z.unknown().nullish().describe('Subscription properties'),
		created_at: z.string().nullish().describe('Creation timestamp'),
	})
	.loose()
	.describe('A webhook subscription');
export type WebhookSubscription = z.infer<typeof WebhookSubscriptionSchema>;

/** Input for operations that take no parameters. */
export const EmptyInputSchema = z.object({}).describe('No input parameters');
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

/** Sort parameter shared by list endpoints; `-` prefix sorts descending. */
const sortParam = z
	.enum(['created_at', '-created_at'])
	.optional()
	.describe('Sort field; prefix - for descending');

/** created_at range filter parameters shared by list endpoints. */
const createdAtFilters = {
	createdAtGt: z
		.string()
		.optional()
		.describe('created_at after this ISO 8601 value'),
	createdAtGte: z
		.string()
		.optional()
		.describe('created_at at or after this ISO 8601 value'),
	createdAtLt: z
		.string()
		.optional()
		.describe('created_at before this ISO 8601 value'),
	createdAtLte: z
		.string()
		.optional()
		.describe('created_at at or before this ISO 8601 value'),
};

type CreatedAtFilters = {
	createdAtGt?: string;
	createdAtGte?: string;
	createdAtLt?: string;
	createdAtLte?: string;
};

/** Maps the camelCase created_at filters to Piggy's bracketed query keys. */
export function createdAtQuery(f: CreatedAtFilters): Record<string, string> {
	const query: Record<string, string> = {};
	if (f.createdAtGt !== undefined) query['created_at[gt]'] = f.createdAtGt;
	if (f.createdAtGte !== undefined) query['created_at[gte]'] = f.createdAtGte;
	if (f.createdAtLt !== undefined) query['created_at[lt]'] = f.createdAtLt;
	if (f.createdAtLte !== undefined) query['created_at[lte]'] = f.createdAtLte;
	return query;
}

// ── contacts ───────────────────────────────────────────────────────────────

export const ContactsListInputSchema = z
	.object({
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Records per page (default 10, max 100)'),
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Page number (default 1)'),
		sort: sortParam,
		...createdAtFilters,
		attributesQuery: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional()
			.describe(
				'Attribute filters as Piggy query parameters: each key is the full bracketed parameter name, e.g. "attributes[likes_pizza]" or "attributes[visits][gte]". See the attribute operators in the Piggy contacts docs',
			),
	})
	.describe('Query parameters for listing contacts');
export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

export const ContactsListOutputSchema = z
	.object({ data: z.array(ContactSchema), meta: ListMetaSchema })
	.loose()
	.describe('A page of contacts');

export const ContactOutputSchema = envelope(
	ContactSchema.describe('The contact'),
	'The contact',
);

export const ContactsCreateInputSchema = z
	.object({
		email: z.string().email().describe('The contact email address'),
		referralCode: z
			.string()
			.optional()
			.describe('A referral code for the referral programme'),
	})
	.describe('Input for creating a contact');
export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

export const ContactsCreatedOutputSchema = envelope(
	z.object({ uuid: z.string() }).loose().describe('The created contact UUID'),
	'The created contact: Piggy answers with its UUID only',
);

export const ContactsCreateAnonymousInputSchema = z
	.object({
		contactIdentifierValue: z
			.string()
			.optional()
			.describe('Value for the contact identifier to serve as the identifier'),
	})
	.describe('Input for creating an anonymous contact');
export type ContactsCreateAnonymousInput = z.infer<
	typeof ContactsCreateAnonymousInputSchema
>;

export const ContactsFindOneByEmailInputSchema = z
	.object({ email: z.string().email().describe('The contact email address') })
	.describe('Input for finding a contact by email');
export type ContactsFindOneByEmailInput = z.infer<
	typeof ContactsFindOneByEmailInputSchema
>;

export const ContactsFindOrCreateInputSchema = z
	.object({ email: z.string().email().describe('The contact email address') })
	.describe('Input for finding or creating a contact by email');
export type ContactsFindOrCreateInput = z.infer<
	typeof ContactsFindOrCreateInputSchema
>;

export const ContactsGetInputSchema = z
	.object({ contactUuid: z.string().min(1).describe('The contact UUID') })
	.describe('Input for reading one contact');
export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

export const ContactsUpdateInputSchema = z
	.object({
		contactUuid: z.string().min(1).describe('The contact UUID'),
		attributes: z
			.record(
				z.string(),
				z.union([z.string(), z.number(), z.boolean(), z.null()]),
			)
			.describe(
				'Attribute values keyed by attribute name; system values such as credit balance cannot be updated',
			),
	})
	.describe('Input for updating contact attributes');
export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;

export const ContactsDeleteInputSchema = z
	.object({
		contactUuid: z.string().min(1).describe('The contact UUID'),
		type: z
			.enum(['DEFAULT', 'GDPR'])
			.describe(
				'DEFAULT keeps a detailed log; GDPR removes personal data references',
			),
	})
	.describe('Input for deleting a contact');
export type ContactsDeleteInput = z.infer<typeof ContactsDeleteInputSchema>;

export const ContactsDeletedOutputSchema = envelope(
	z.null().nullish().describe('Piggy answers with a null data value'),
	'The contact was scheduled for deletion',
);

export const ContactsClaimInputSchema = z
	.object({
		anonymousContactUuid: z
			.string()
			.min(1)
			.describe('The anonymous contact UUID with a fictional email'),
		email: z
			.string()
			.email()
			.describe('The real email address to claim the contact with'),
	})
	.describe('Input for claiming an anonymous contact');
export type ContactsClaimInput = z.infer<typeof ContactsClaimInputSchema>;

export const ContactsMergeInputSchema = z
	.object({
		sourceContactUuid: z
			.string()
			.min(1)
			.describe('UUID of the contact that ceases to exist'),
		destinationContactUuid: z
			.string()
			.min(1)
			.describe('UUID of the contact that remains'),
	})
	.describe('Input for merging two contacts');
export type ContactsMergeInput = z.infer<typeof ContactsMergeInputSchema>;

/**
 * The docs give no response example for merge, so the answer parses as an
 * open object.
 */
export const ContactsMergeOutputSchema = z
	.object({})
	.loose()
	.describe('Merge answer; Piggy documents no response shape');

export const ContactsCreditBalanceOutputSchema = envelope(
	z.object({ balance: z.number() }).loose().describe('The credit balance'),
	'The contact credit balance',
);

export const ContactsPrepaidBalanceOutputSchema = envelope(
	z
		.object({
			balance_in_cents: z.number().describe('Balance in cents'),
			balance: z.string().nullish().describe('Formatted balance'),
		})
		.loose()
		.describe('The prepaid balance'),
	'The contact prepaid balance',
);

export const ContactsTierOutputSchema = envelope(
	TierInfoSchema.describe('The current tier'),
	'The contact current tier',
);

// ── loyalty ────────────────────────────────────────────────────────────────

export const LoyaltyGetProgramInputSchema = z
	.object({})
	.describe('No input; Piggy serves the token account loyalty program');
export type LoyaltyGetProgramInput = z.infer<
	typeof LoyaltyGetProgramInputSchema
>;

export const LoyaltyProgramOutputSchema = envelope(
	LoyaltyProgramSchema.describe('The loyalty program'),
	'The account loyalty program',
);

export const LoyaltyListTransactionsInputSchema = z
	.object({
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Records per page (default 10, max 100)'),
		page: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Page number (default 1)'),
		type: z
			.enum(['credit_receptions', 'reward_receptions'])
			.optional()
			.describe('Transaction type filter'),
		shopUuid: z.string().optional().describe('Business profile UUID filter'),
		sort: sortParam,
		...createdAtFilters,
	})
	.describe('Query parameters for listing loyalty transactions');
export type LoyaltyListTransactionsInput = z.infer<
	typeof LoyaltyListTransactionsInputSchema
>;

export const LoyaltyTransactionsListOutputSchema = z
	.object({ data: z.array(LoyaltyTransactionSchema), meta: ListMetaSchema })
	.loose()
	.describe('A page of loyalty transactions');

// ── points ─────────────────────────────────────────────────────────────────

export const PointsCreateInputSchema = z
	.object({
		contactUuid: z
			.string()
			.min(1)
			.describe('UUID of the contact the points are for'),
		businessProfileUuid: z
			.string()
			.min(1)
			.describe('UUID of the business profile the points are given at'),
		points: z
			.number()
			.int()
			.describe('Whole number of points; a negative number subtracts'),
		customAttributes: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional()
			.describe('Custom attribute values keyed by attribute name'),
	})
	.describe('Input for adding points directly');
export type PointsCreateInput = z.infer<typeof PointsCreateInputSchema>;

export const PointsTransactionOutputSchema = envelope(
	DirectPointsTransactionSchema.describe('The points transaction'),
	'A direct points transaction',
);

export const PointsGetInputSchema = z
	.object({
		uuid: z.string().min(1).describe('UUID of the points transaction'),
	})
	.describe('Input for reading one points transaction');
export type PointsGetInput = z.infer<typeof PointsGetInputSchema>;

export const PointsReverseInputSchema = z
	.object({
		uuid: z
			.string()
			.min(1)
			.describe('UUID of the points transaction to reverse'),
	})
	.describe('Input for reversing a points transaction');
export type PointsReverseInput = z.infer<typeof PointsReverseInputSchema>;

// ── rewards ────────────────────────────────────────────────────────────────

export const RewardsListInputSchema = z
	.object({
		shopUuid: z.string().optional().describe('Business profile UUID filter'),
		contactUuid: z
			.string()
			.optional()
			.describe('List the rewards claimable by this contact'),
	})
	.describe('Query parameters for listing rewards');
export type RewardsListInput = z.infer<typeof RewardsListInputSchema>;

export const RewardsListOutputSchema = z
	.object({ data: z.array(RewardSchema), meta: ListMetaSchema })
	.loose()
	.describe('A page of rewards');

export const RewardOutputSchema = envelope(
	RewardSchema.describe('The reward'),
	'The reward',
);

export const RewardsGetInputSchema = z
	.object({ rewardUuid: z.string().min(1).describe('The reward UUID') })
	.describe('Input for reading one reward');
export type RewardsGetInput = z.infer<typeof RewardsGetInputSchema>;

export const RewardsUpdateInputSchema = z
	.object({
		rewardUuid: z.string().min(1).describe('The reward UUID'),
		title: z.string().optional().describe('A new title'),
		description: z.string().optional().describe('A new description'),
		requiredCredits: z
			.number()
			.int()
			.optional()
			.describe('Credits required to claim this reward'),
	})
	.describe('Input for updating a reward');
export type RewardsUpdateInput = z.infer<typeof RewardsUpdateInputSchema>;

export const RewardsRedeemInputSchema = z
	.object({
		contactUuid: z
			.string()
			.min(1)
			.describe('UUID of the contact claiming the reward'),
		rewardUuid: z.string().min(1).describe('UUID of the reward to claim'),
		shopUuid: z
			.string()
			.min(1)
			.describe('UUID of the business profile the claim is for'),
	})
	.describe('Input for redeeming a reward');
export type RewardsRedeemInput = z.infer<typeof RewardsRedeemInputSchema>;

export const RewardsRedeemedOutputSchema = envelope(
	RewardReceptionSchema.describe('The reward reception'),
	'The created reward reception',
);

export const RewardsReverseInputSchema = z
	.object({
		rewardReceptionUuid: z
			.string()
			.min(1)
			.describe('UUID of the reward reception to reverse'),
	})
	.describe('Input for reversing a reward redemption');
export type RewardsReverseInput = z.infer<typeof RewardsReverseInputSchema>;

export const RewardsReversedOutputSchema = envelope(
	CreditReceptionSchema.describe('The credit reception reissuing the credits'),
	'The credit reception created by the reversal',
);

// ── promotions ─────────────────────────────────────────────────────────────

export const PromotionsListInputSchema = z
	.object({})
	.describe('No query parameters are documented for listing promotions');
export type PromotionsListInput = z.infer<typeof PromotionsListInputSchema>;

export const PromotionsListOutputSchema = z
	.object({ data: z.array(PromotionSchema), meta: ListMetaSchema })
	.loose()
	.describe('The account promotions');

export const PromotionsGetInputSchema = z
	.object({ promotionUuid: z.string().min(1).describe('The promotion UUID') })
	.describe('Input for reading one promotion');
export type PromotionsGetInput = z.infer<typeof PromotionsGetInputSchema>;

export const PromotionsGetOutputSchema = envelope(
	PromotionSchema.describe('The promotion'),
	'The promotion',
);

// ── vouchers ───────────────────────────────────────────────────────────────

export const VouchersListInputSchema = z
	.object({
		promotionUuid: z.string().optional().describe('Promotion UUID filter'),
		contactUuid: z.string().optional().describe('Contact UUID filter'),
		status: z
			.enum([
				'ACTIVE',
				'REDEEMED',
				'EXPIRED',
				'DEACTIVATED',
				'INACTIVE',
				'LOCKED',
			])
			.optional()
			.describe('Voucher status filter'),
		limit: z
			.number()
			.int()
			.min(0)
			.max(500)
			.optional()
			.describe('Records per page (default 30, max 500)'),
		page: z.number().int().min(1).optional().describe('Page number'),
	})
	.describe('Query parameters for listing vouchers');
export type VouchersListInput = z.infer<typeof VouchersListInputSchema>;

export const VouchersListOutputSchema = z
	.object({ data: z.array(VoucherSchema), meta: ListMetaSchema })
	.loose()
	.describe('A page of vouchers');

export const VoucherOutputSchema = envelope(
	VoucherSchema.describe('The voucher'),
	'The voucher',
);

export const VouchersCreateInputSchema = z
	.object({
		promotionUuid: z
			.string()
			.min(1)
			.describe('UUID of the promotion to create the voucher for'),
		code: z
			.string()
			.optional()
			.describe('Unique voucher code; Piggy generates one when omitted'),
		contactUuid: z
			.string()
			.optional()
			.describe('Contact UUID to link the voucher to'),
		expirationDate: z
			.string()
			.optional()
			.describe('Expiration date in ISO 8601, stored in UTC'),
		activationDate: z
			.string()
			.optional()
			.describe('Activation date in ISO 8601, stored in UTC'),
		totalRedemptionsAllowed: z
			.number()
			.int()
			.optional()
			.describe('Times this voucher can be redeemed'),
		customAttributes: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional()
			.describe('Custom attribute values keyed by attribute name'),
	})
	.describe('Input for creating a voucher');
export type VouchersCreateInput = z.infer<typeof VouchersCreateInputSchema>;

export const VouchersFindInputSchema = z
	.object({ code: z.string().min(1).describe('The voucher code') })
	.describe('Input for finding a voucher by code');
export type VouchersFindInput = z.infer<typeof VouchersFindInputSchema>;

export const VouchersUpdateInputSchema = z
	.object({
		voucherUuid: z.string().min(1).describe('The voucher UUID'),
		status: z
			.enum(['ACTIVE', 'DEACTIVATED'])
			.describe('The new voucher status'),
		customAttributes: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional()
			.describe('Custom attribute values keyed by attribute name'),
		expirationDate: z
			.string()
			.optional()
			.describe(
				'New expiration date in ISO 8601; only for active and inactive vouchers',
			),
	})
	.describe('Input for updating a voucher');
export type VouchersUpdateInput = z.infer<typeof VouchersUpdateInputSchema>;

export const VouchersValidateInputSchema = z
	.object({
		voucherUuid: z.string().min(1).describe('The voucher UUID to check'),
		contactUuid: z
			.string()
			.optional()
			.describe(
				'UUID of the contact who would redeem; required when no contact is linked',
			),
		shopUuid: z
			.string()
			.min(1)
			.describe(
				'UUID of the business profile where the voucher would be redeemed',
			),
	})
	.describe('Input for checking voucher validity');
export type VouchersValidateInput = z.infer<typeof VouchersValidateInputSchema>;

/**
 * The docs give no response example for validate, so the answer parses as
 * an open object.
 */
export const VouchersValidateOutputSchema = z
	.object({})
	.loose()
	.describe('Validity answer; Piggy documents no response shape');

export const VouchersRedeemInputSchema = z
	.object({
		code: z.string().min(1).describe('The voucher code'),
		shopUuid: z
			.string()
			.min(1)
			.describe('UUID of the business profile the voucher is redeemed through'),
		contactUuid: z
			.string()
			.optional()
			.describe('Required when the voucher has no linked contact'),
		releaseKey: z
			.string()
			.optional()
			.describe('Release key from vouchers.lock, when the voucher is locked'),
	})
	.describe('Input for redeeming a voucher');
export type VouchersRedeemInput = z.infer<typeof VouchersRedeemInputSchema>;

export const VouchersRedeemedOutputSchema = envelope(
	VoucherSchema.describe('The redeemed voucher'),
	'The redeemed voucher',
);

export const VouchersLockInputSchema = z
	.object({
		voucherUuid: z.string().min(1).describe('The voucher UUID to lock'),
	})
	.describe('Input for locking a voucher');
export type VouchersLockInput = z.infer<typeof VouchersLockInputSchema>;

export const VouchersLockOutputSchema = envelope(
	VoucherLockSchema.describe('The lock with its release key'),
	'The voucher lock',
);

export const VouchersReleaseInputSchema = z
	.object({
		voucherUuid: z.string().min(1).describe('The voucher UUID to release'),
		releaseKey: z
			.string()
			.min(1)
			.describe('The release key returned when the voucher was locked'),
	})
	.describe('Input for releasing a locked voucher');
export type VouchersReleaseInput = z.infer<typeof VouchersReleaseInputSchema>;

export const VouchersReverseInputSchema = z
	.object({
		voucherUuid: z
			.string()
			.min(1)
			.describe('UUID of the voucher whose redemption is reversed'),
	})
	.describe('Input for reversing a voucher redemption');
export type VouchersReverseInput = z.infer<typeof VouchersReverseInputSchema>;

/**
 * The docs give no response example for reverse, so the answer parses as an
 * open object.
 */
export const VouchersReverseOutputSchema = z
	.object({})
	.loose()
	.describe('Reversal answer; Piggy documents no response shape');

// ── giftcards ──────────────────────────────────────────────────────────────

export const GiftcardsListInputSchema = z
	.object({
		giftcardProgramUuid: z
			.string()
			.optional()
			.describe('Giftcard program UUID filter'),
		page: z.number().int().min(1).optional().describe('Page number'),
		limit: z
			.number()
			.int()
			.min(1)
			.max(100)
			.optional()
			.describe('Records per page (default 30, max 100)'),
	})
	.describe('Query parameters for listing giftcards');
export type GiftcardsListInput = z.infer<typeof GiftcardsListInputSchema>;

export const GiftcardsListOutputSchema = z
	.object({ data: z.array(GiftcardSchema), meta: ListMetaSchema })
	.loose()
	.describe('A page of giftcards');

export const GiftcardOutputSchema = envelope(
	GiftcardSchema.describe('The giftcard'),
	'The giftcard',
);

export const GiftcardsGetInputSchema = z
	.object({ giftcardUuid: z.string().min(1).describe('The giftcard UUID') })
	.describe('Input for reading one giftcard');
export type GiftcardsGetInput = z.infer<typeof GiftcardsGetInputSchema>;

export const GiftcardsFindOneByHashInputSchema = z
	.object({
		hash: z.string().min(1).describe("The giftcard's unique hash or QR value"),
	})
	.describe('Input for finding a giftcard by hash');
export type GiftcardsFindOneByHashInput = z.infer<
	typeof GiftcardsFindOneByHashInputSchema
>;

export const GiftcardsCreateInputSchema = z
	.object({
		giftcardProgramUuid: z
			.string()
			.min(1)
			.describe('UUID of the giftcard program to link the card to'),
	})
	.describe('Input for creating a digital giftcard');
export type GiftcardsCreateInput = z.infer<typeof GiftcardsCreateInputSchema>;

export const GiftcardsSendByEmailInputSchema = z
	.object({
		giftcardUuid: z.string().min(1).describe('The giftcard UUID to send'),
		contactUuid: z.string().min(1).describe('UUID of the contact to email'),
		emailUuid: z
			.string()
			.optional()
			.describe('Email template UUID; must contain the giftcard.hash token'),
		mergeTags: z
			.record(z.string(), z.string())
			.optional()
			.describe('Custom merge tags; keys must start with custom.'),
	})
	.describe('Input for emailing a giftcard');
export type GiftcardsSendByEmailInput = z.infer<
	typeof GiftcardsSendByEmailInputSchema
>;

export const GiftcardsSentOutputSchema = envelope(
	z
		.object({
			message: z.string().nullish().describe('Piggy answers "success"'),
			data: z.string().nullish().describe('Human-readable result'),
		})
		.loose()
		.describe('The send result'),
	'The giftcard email send result',
);

export const GiftcardsListProgramsInputSchema = z
	.object({})
	.describe('No query parameters are documented for listing giftcard programs');
export type GiftcardsListProgramsInput = z.infer<
	typeof GiftcardsListProgramsInputSchema
>;

export const GiftcardsProgramsListOutputSchema = z
	.object({ data: z.array(GiftcardProgramSchema), meta: ListMetaSchema })
	.loose()
	.describe('The account giftcard programs');

// ── businesses ─────────────────────────────────────────────────────────────

export const BusinessesListProfilesInputSchema = z
	.object({})
	.describe('No query parameters are documented for listing business profiles');
export type BusinessesListProfilesInput = z.infer<
	typeof BusinessesListProfilesInputSchema
>;

export const BusinessesProfilesListOutputSchema = z
	.object({ data: z.array(BusinessProfileSchema), meta: ListMetaSchema })
	.loose()
	.describe('The account business profiles');

export const BusinessesGetProfileInputSchema = z
	.object({ uuid: z.string().min(1).describe('The business profile UUID') })
	.describe('Input for reading one business profile');
export type BusinessesGetProfileInput = z.infer<
	typeof BusinessesGetProfileInputSchema
>;

export const BusinessesProfileOutputSchema = envelope(
	BusinessProfileSchema.describe('The business profile'),
	'The business profile',
);

// ── webhooks ───────────────────────────────────────────────────────────────

export const WebhooksListInputSchema = z
	.object({
		eventType: z
			.string()
			.optional()
			.describe('Only subscriptions of this event type'),
		status: z
			.enum(['ACTIVE', 'INACTIVE'])
			.optional()
			.describe('Only subscriptions of this status'),
	})
	.describe('Query parameters for listing webhook subscriptions');
export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

export const WebhooksListOutputSchema = z
	.object({ data: z.array(WebhookSubscriptionSchema), meta: ListMetaSchema })
	.loose()
	.describe('The webhook subscriptions');

export const WebhooksCreateInputSchema = z
	.object({
		name: z.string().min(1).describe('A name for the subscription'),
		eventType: z
			.string()
			.min(1)
			.describe(
				'The event type to listen to (see the Piggy webhook event catalogue)',
			),
		url: z.string().min(1).describe('The endpoint deliveries are sent to'),
		secret: z
			.string()
			.optional()
			.describe(
				'Secret used to sign the Signature header; defaults to the account secret',
			),
		version: z
			.enum(['V1', 'V2'])
			.optional()
			.describe(
				'Delivery envelope; V2 batches events and is the recommended version',
			),
	})
	.describe('Input for creating a webhook subscription');
export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;

export const WebhooksGetInputSchema = z
	.object({
		webhookSubscriptionUuid: z
			.string()
			.min(1)
			.describe('The webhook subscription UUID'),
	})
	.describe('Input for reading one webhook subscription');
export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;

export const WebhooksUpdateInputSchema = z
	.object({
		webhookSubscriptionUuid: z
			.string()
			.min(1)
			.describe('The webhook subscription UUID'),
		name: z.string().optional().describe('A new subscription name'),
		url: z.string().optional().describe('A new delivery URL'),
		status: z
			.enum(['ACTIVE', 'INACTIVE'])
			.optional()
			.describe('The new status'),
	})
	.describe('Input for updating a webhook subscription');
export type WebhooksUpdateInput = z.infer<typeof WebhooksUpdateInputSchema>;

export const WebhooksDeleteInputSchema = z
	.object({
		webhookSubscriptionUuid: z
			.string()
			.min(1)
			.describe('The webhook subscription UUID'),
	})
	.describe('Input for deleting a webhook subscription');
export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;

export const WebhooksDeletedOutputSchema = envelope(
	z.unknown().optional().describe('Piggy answers with an empty data array'),
	'The webhook subscription was deleted',
);

export const WebhookSubscriptionOutputSchema = envelope(
	WebhookSubscriptionSchema.describe('The webhook subscription'),
	'The webhook subscription',
);

// ── Operation registry ─────────────────────────────────────────────────────

export const PiggyEndpointInputSchemas = {
	contactsList: ContactsListInputSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsCreateAnonymous: ContactsCreateAnonymousInputSchema,
	contactsFindOneByEmail: ContactsFindOneByEmailInputSchema,
	contactsFindOrCreate: ContactsFindOrCreateInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsDelete: ContactsDeleteInputSchema,
	contactsClaim: ContactsClaimInputSchema,
	contactsMerge: ContactsMergeInputSchema,
	contactsGetCreditBalance: ContactsGetInputSchema,
	contactsGetPrepaidBalance: ContactsGetInputSchema,
	contactsGetTier: ContactsGetInputSchema,
	loyaltyGetProgram: LoyaltyGetProgramInputSchema,
	loyaltyListTransactions: LoyaltyListTransactionsInputSchema,
	pointsCreate: PointsCreateInputSchema,
	pointsGet: PointsGetInputSchema,
	pointsReverse: PointsReverseInputSchema,
	rewardsList: RewardsListInputSchema,
	rewardsGet: RewardsGetInputSchema,
	rewardsUpdate: RewardsUpdateInputSchema,
	rewardsRedeem: RewardsRedeemInputSchema,
	rewardsReverseRedemption: RewardsReverseInputSchema,
	promotionsList: PromotionsListInputSchema,
	promotionsGet: PromotionsGetInputSchema,
	vouchersList: VouchersListInputSchema,
	vouchersCreate: VouchersCreateInputSchema,
	vouchersFind: VouchersFindInputSchema,
	vouchersUpdate: VouchersUpdateInputSchema,
	vouchersValidate: VouchersValidateInputSchema,
	vouchersRedeem: VouchersRedeemInputSchema,
	vouchersLock: VouchersLockInputSchema,
	vouchersRelease: VouchersReleaseInputSchema,
	vouchersReverseRedemption: VouchersReverseInputSchema,
	giftcardsList: GiftcardsListInputSchema,
	giftcardsGet: GiftcardsGetInputSchema,
	giftcardsFindOneByHash: GiftcardsFindOneByHashInputSchema,
	giftcardsCreate: GiftcardsCreateInputSchema,
	giftcardsSendByEmail: GiftcardsSendByEmailInputSchema,
	giftcardsListPrograms: GiftcardsListProgramsInputSchema,
	businessesListProfiles: BusinessesListProfilesInputSchema,
	businessesGetProfile: BusinessesGetProfileInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
};

export const PiggyEndpointOutputSchemas = {
	contactsList: ContactsListOutputSchema,
	contactsCreate: ContactsCreatedOutputSchema,
	contactsCreateAnonymous: ContactsCreatedOutputSchema,
	contactsFindOneByEmail: ContactOutputSchema,
	contactsFindOrCreate: ContactOutputSchema,
	contactsGet: ContactOutputSchema,
	contactsUpdate: ContactOutputSchema,
	contactsDelete: ContactsDeletedOutputSchema,
	contactsClaim: ContactOutputSchema,
	contactsMerge: ContactsMergeOutputSchema,
	contactsGetCreditBalance: ContactsCreditBalanceOutputSchema,
	contactsGetPrepaidBalance: ContactsPrepaidBalanceOutputSchema,
	contactsGetTier: ContactsTierOutputSchema,
	loyaltyGetProgram: LoyaltyProgramOutputSchema,
	loyaltyListTransactions: LoyaltyTransactionsListOutputSchema,
	pointsCreate: PointsTransactionOutputSchema,
	pointsGet: PointsTransactionOutputSchema,
	pointsReverse: PointsTransactionOutputSchema,
	rewardsList: RewardsListOutputSchema,
	rewardsGet: RewardOutputSchema,
	rewardsUpdate: RewardOutputSchema,
	rewardsRedeem: RewardsRedeemedOutputSchema,
	rewardsReverseRedemption: RewardsReversedOutputSchema,
	promotionsList: PromotionsListOutputSchema,
	promotionsGet: PromotionsGetOutputSchema,
	vouchersList: VouchersListOutputSchema,
	vouchersCreate: VoucherOutputSchema,
	vouchersFind: VoucherOutputSchema,
	vouchersUpdate: VoucherOutputSchema,
	vouchersValidate: VouchersValidateOutputSchema,
	vouchersRedeem: VouchersRedeemedOutputSchema,
	vouchersLock: VouchersLockOutputSchema,
	vouchersRelease: VouchersLockOutputSchema,
	vouchersReverseRedemption: VouchersReverseOutputSchema,
	giftcardsList: GiftcardsListOutputSchema,
	giftcardsGet: GiftcardOutputSchema,
	giftcardsFindOneByHash: GiftcardOutputSchema,
	giftcardsCreate: GiftcardOutputSchema,
	giftcardsSendByEmail: GiftcardsSentOutputSchema,
	giftcardsListPrograms: GiftcardsProgramsListOutputSchema,
	businessesListProfiles: BusinessesProfilesListOutputSchema,
	businessesGetProfile: BusinessesProfileOutputSchema,
	webhooksList: WebhooksListOutputSchema,
	webhooksCreate: WebhookSubscriptionOutputSchema,
	webhooksGet: WebhookSubscriptionOutputSchema,
	webhooksUpdate: WebhookSubscriptionOutputSchema,
	webhooksDelete: WebhooksDeletedOutputSchema,
};

export type PiggyEndpointInputs = {
	[K in keyof typeof PiggyEndpointInputSchemas]: z.input<
		(typeof PiggyEndpointInputSchemas)[K]
	>;
};

export type PiggyEndpointOutputs = {
	[K in keyof typeof PiggyEndpointOutputSchemas]: z.infer<
		(typeof PiggyEndpointOutputSchemas)[K]
	>;
};
