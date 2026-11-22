/**
 * Response fixtures shaped after the Piggy (Leat) API docs
 * (docs.leat.com/v3).
 */

export const unauthenticated = { message: 'Unauthenticated.' };

export const notFound = {
	message: 'Object not found',
	code: 0,
	status_code: 404,
};

export const metaPage = {
	page: 1,
	limit: 10,
	viewing_from: 1,
	viewing_to: 1,
	last_page: 1,
	total: 1,
};

export const contact = {
	id: 22,
	uuid: '1b7e3c4a-5f2d-4e8b-9a6c-0d2f4e6a8b1c',
	email: 'patrick@bikinibottom.sea',
	attributes: [],
	tier: {
		uuid: 'ea77edd4-5a5e-4a6e-aeda-55038c43c839',
		name: 'Krusty Krew',
		description: 'Krusty Krew Members only',
		position: 1,
		media: null,
	},
	subscriptions: [
		{
			is_subscribed: true,
			status: 'SUBSCRIBED',
			subscription_type: {
				id: 1,
				uuid: '123123123',
				name: 'Marketing',
				active: true,
				description: 'Subscribe here for marketing purposes',
				strategy: 'DOUBLE_OPT_IN',
			},
		},
	],
	credit_balance: { id: 2625740, balance: 2895 },
	prepaid_balance: { balance_in_cents: 4000 },
	current_values: {
		id: 22,
		email: 'patrick@bikinibottom.sea',
		firstname: 'Patrick',
		lastname: 'Star',
		loyalty_balance: 2895,
	},
	current_display_values: {
		id: 22,
		email: 'patrick@bikinibottom.sea',
		firstname: 'Patrick',
	},
};

export const contactsList = { data: [contact], meta: metaPage };

export const contactAnswer = { data: contact, meta: [] };

export const createdContact = {
	data: { uuid: 'cd183615-d1cb-402a-b618-6472d5e13890' },
	meta: [],
};

export const creditBalance = { data: { balance: 49 }, meta: [] };

export const prepaidBalance = {
	data: { balance_in_cents: 5000, balance: '€50.00' },
	meta: [],
};

export const tier = {
	data: {
		uuid: '3f6c9a2e-8d41-4b7a-9e05-c1d2b7a84f60',
		name: 'Krusty Krew',
		description: 'Krusty Krew Members only',
		position: 1,
		media: null,
		perks: [
			{
				label: '10% off',
				value: '10_off',
				default: false,
				perk: {
					uuid: 'ea77edd4-5a5e-4a6e-aeda-55038c43c839',
					label: 'Discount',
					name: 'discount',
					data_type: 'single_select',
				},
			},
		],
	},
	meta: [],
};

export const loyaltyProgram = {
	data: {
		id: 3545,
		name: 'Squidward Test',
		max_amount: 50000,
		custom_credit_name: 'Credits',
		unit: { name: 'test', label: 'Calories', prefix: '' },
	},
	meta: {},
};

export const loyaltyTransaction = {
	uuid: 'daa78841-b321-4564-9dd3-91c6ccd9d600',
	credits: 1177,
	created_at: '2023-11-12T19:27:49+00:00',
	type: 'credit_reception',
	contact_identifier: null,
	contact: {
		uuid: '123',
		email: 'spongebob@bikinibottom.sea',
		credit_balance: { id: 2625740, balance: 2929 },
	},
	shop: {
		id: 15,
		uuid: '123abc-def789-qwerty-34567',
		type: 'physical',
		name: 'Krusty Krab',
		address: {
			street: 'Conch Street',
			city: 'Bikini Bottom',
			country: 'NL',
		},
	},
	unit_value: 1.15,
	unit: {
		id: 298,
		name: 'test2',
		label: 'Calories',
		prefix: 't',
		is_default: true,
	},
};

export const loyaltyTransactions = {
	data: [loyaltyTransaction],
	meta: metaPage,
};

export const directPointsTransaction = {
	data: {
		uuid: '8d1e4b7c-2a50-4f3e-b6c9-0e7a5d4c3b12',
		contact: {
			uuid: '12345-abcdefg-6789-yuiop',
			email: 'spongebob@bikinibottom.sea',
		},
		business_profile: { uuid: '12345-abcdefg-6789-yuiop', name: 'Krusty Krab' },
		points: 50,
		channel: 'OAUTH_API',
		custom_attributes: { reason: 'Employee of the month' },
		created_at: '2026-11-05T09:12:44+00:00',
	},
	meta: [],
};

export const reward = {
	uuid: '539483d0-fab4-40db-add5-2ec65ef12901',
	title: 'Krabby Patty',
	description: null,
	cost_price: null,
	required_credits: 2,
	media: { type: 'image', value: 'https://example.com/image.jpg' },
	is_active: true,
	active: true,
	reward_type: 'PHYSICAL',
	stock: null,
};

export const rewards = { data: [reward], meta: metaPage };

export const rewardReception = {
	data: {
		title: 'Krabby Patty',
		type: 'reward_reception',
		uuid: '55537e6c-23e8-4c0c-bbce-65f587fb543a',
		credits: -50,
		contact: {
			uuid: '123',
			email: 'spongebob@bikinibottom.sea',
			credit_balance: { id: 2625740, balance: 250 },
		},
		shop: {
			id: 15,
			uuid: '123123',
			type: 'physical',
			name: 'Krusty Krab',
			address: { city: 'Bikini Bottom' },
		},
		contact_identifier: null,
		created_at: '2023-11-23T15:27:26+00:00',
		reward: {
			id: 20002,
			uuid: '539483d0-fab4-40db-add5-2ec65ef12901',
			title: 'Krabby Patty',
			description: 'Kelp Juice or Sea Water',
			reward_type: 'PHYSICAL',
			media: { type: 'image', value: 'https://example.com/krabby.jpg' },
			required_credits: 50,
			pre_redeemable: true,
			expiration_duration: 6307200,
		},
	},
	meta: [],
};

export const creditReception = {
	data: {
		type: 'credit_reception',
		contact_identifier: null,
		contact: {
			uuid: '123',
			email: 'spongebob@bikinibottom.sea',
			credit_balance: { id: 2625740, balance: 1642 },
		},
		shop: {
			uuid: 'abc2-3456-ask03l-9dflas',
			type: 'physical',
			name: 'Krusty Krab',
			address: { city: 'Bikini Bottom' },
		},
		credits: 10,
		created_at: '2023-11-06T09:12:32+00:00',
		uuid: '294183c2-20f2-4f86-a5e5-17e71c4b0660',
		unit: {
			name: 'purchase_amount',
			label: 'Purchase amount',
			prefix: '€',
			is_default: true,
		},
		unit_value: null,
	},
	meta: {},
};

export const promotion = {
	attributes: { acme_promotion_id: 'ab123' },
	name: 'Free Krabby Patty',
	description: 'The freshest patty in the seven seas',
	voucher_limit: 5000,
	limit_per_contact: null,
	expiration_duration: null,
	uuid: '123',
	media: { type: 'image', value: 'https://example.com/image.jpg' },
};

export const promotions = { data: [promotion], meta: [] };

export const promotionAnswer = { data: promotion, meta: {} };

export const voucher = {
	uuid: '57d93a44-1c9d-4548-8c0e-e6cd71d6170a',
	code: 'ABC123',
	status: 'ACTIVE',
	name: 'Free Krabby Patty',
	description: 'Krabby Patty of your choice',
	expiration_date: null,
	activation_date: '2023-03-02T14:45:52+00:00',
	redeemed_at: null,
	is_redeemed: false,
	attributes: { shipping: null },
	contact: null,
	promotion: {
		uuid: '123',
		name: 'Free Krabby Patty',
		description: 'Krabby Patty of your choice',
		voucher_limit: 25012,
		limit_per_contact: null,
		expiration_duration: null,
		media: { type: 'image', value: 'https://example.com/image.jpg' },
	},
	total_redemptions_allowed: 1,
	times_redeemed: 0,
	redemptions_remaining: 1,
	add_to_wallet_url:
		'https://krustykrab.leat.com/add-to-wallet/vouchers?uuid=x',
};

export const vouchersList = { data: [voucher], meta: metaPage };

export const voucherAnswer = { data: voucher, meta: [] };

export const redeemedVoucher = {
	data: {
		...voucher,
		status: 'REDEEMED',
		redeemed_at: '2023-11-13T08:51:00+00:00',
		is_redeemed: true,
		redemptions_remaining: 0,
		times_redeemed: 1,
		voucher_redemption: {
			uuid: '8fsl298-oaisdf98-asdf923-afsdoij',
			created_at: '2023-11-13T08:51:00+00:00',
		},
	},
	meta: [],
};

export const voucherLock = {
	data: {
		voucher: { uuid: '11fe9574-800a-4832-ae64-e90d0192ca9a', status: 'LOCKED' },
		lock: {
			release_key: '5cc7e94a-7aa2-4f4a-8a8c-c20ab3a086ce',
			locked_at: '2023-11-13T09:01:46+00:00',
			unlocked_at: null,
			system_release_at: '2023-11-13T10:01:46+00:00',
		},
	},
	meta: [],
};

export const giftcardProgram = {
	id: 1,
	card_count: 29928,
	settles: 0,
	uuid: '123',
	name: 'Bikini Bottom Bucks',
	active: true,
	expiration_days: 394,
	max_amount_in_cents: 51000,
	min_amount_in_cents: null,
	calculator_flow: 'DEFAULT',
};

export const giftcardPrograms = { data: [giftcardProgram], meta: [] };

export const giftcard = {
	data: {
		id: 41654,
		uuid: '5b3dab1c-bdde-4313-a74d-67de815c751c',
		type: 'DIGITAL',
		hash: '41654',
		amount_in_cents: 0,
		upgradeable: true,
		active: true,
		expiration_date: '2024-12-10T16:26:20+00:00',
		amount: 0,
		url: 'https://leat.com/giftcard-balance?hash=41654',
		display_amount: '€0.00',
		formatted_expiration_date: '2024-12-10',
		giftcard_program: giftcardProgram,
		giftcard_recipients: [],
	},
	meta: [],
};

export const giftcardsList = { data: [giftcard.data], meta: metaPage };

export const giftcardSent = {
	data: { message: 'success', data: 'Email successfully sent' },
	meta: {},
};

export const businessProfile = {
	uuid: '123123',
	name: 'Krusty Krab',
	type: 'physical',
	reference: null,
};

export const businessProfiles = { data: [businessProfile], meta: {} };

export const businessProfileAnswer = { data: businessProfile, meta: {} };

export const webhookSubscription = {
	uuid: 'f1dc2d67-caa8-4919-a537-66491a94ed2f',
	name: 'New Krusty Krew Member',
	event_type: 'contact_created',
	url: 'https://api.example.com/piggy/webhooks',
	status: 'ACTIVE',
	version: 'V1',
	created_at: '2023-10-20T11:46:22+00:00',
};

export const webhookSubscriptions = {
	data: [webhookSubscription],
	meta: [],
};

// ── webhook deliveries ─────────────────────────────────────────────────────

export const webhookV1 = {
	uuid: 'd94e2b07-8f31-45c6-9a18-3e7b5d1c2f80',
	version: 'V1',
	type: 'voucher_created',
	data: {
		voucher: {
			uuid: '3a8d5c19-2b74-4e60-9f13-8c5a1d7e4b92',
			code: 'PATTY-2026',
			status: 'ACTIVE',
			name: 'Free Krabby Patty',
		},
	},
};

export const webhookV2 = {
	batch_uuid: '6c679213-2309-480d-8b6a-18c8cc8b90b2',
	version: 'V2',
	event_type: 'voucher_created',
	count: 2,
	events: [
		{
			event_uuid: '87754a6f-768c-4095-847b-09758e1b4840',
			event_type: 'voucher_created',
			data: { voucher: { uuid: '3a8d5c19-2b74-4e60-9f13-8c5a1d7e4b92' } },
		},
		{
			event_uuid: 'b1f4c0a8-5d21-4e77-9a3c-2fc02cb324d5',
			event_type: 'voucher_created',
			data: { voucher: { uuid: 'd5b21c08-4e7f-4a93-8c16-7b0e2a9d5f34' } },
		},
	],
};
