// Sample Gumroad responses for offline tests, modeled on the examples in
// https://gumroad.com/api (Products, Sales, Subscribers, Licenses sections).

export const product = {
	id: 'A-m3CDDC5dlrSdKZp0RFhA==',
	name: 'Pencil Icon PSD',
	description: 'I made this for fun.',
	published: true,
	deleted: false,
	price: 100,
	currency: 'usd',
	short_url: 'https://sahil.gumroad.com/l/pencil',
	thumbnail_url:
		'https://public-files.gumroad.com/variants/72iaezqqthnj1350mdc618namqki/f2f9c6fc18a80b8bafa38f3562360c0e42507f1c0052dcb708593f7efa3bdab8',
	preview_url: null,
	custom_permalink: null,
	custom_receipt: null,
	custom_summary: "You'll get one PSD file.",
	custom_html: null,
	custom_fields: [],
	require_shipping: false,
	customizable_price: null,
	max_purchase_count: null,
	subscription_duration: null,
	tags: ['pencil', 'icon'],
	formatted_price: '$1',
	sales_count: 0,
	sales_usd_cents: 0,
	is_tiered_membership: true,
	recurrences: ['monthly'],
	purchasing_power_parity_prices: { US: 100, IN: 50, EC: 25 },
	taxonomy_id: 123,
	category: 'design/ui-and-web/figma',
	category_label: 'Figma',
};

export const sale = {
	id: 'B28UKN-dvxYabdavG97Y-Q==',
	email: 'calvin@gumroad.com',
	seller_id: 'kL0paVL2SdmJSYsNs-OCMg==',
	product_id: '32-nPainqpLj1B_WIwVlMw==',
	product_name: 'Pencil Icon PSD',
	product_permalink: 'XCBbJ',
	product_has_variants: true,
	created_at: '2021-01-05T19:38:56Z',
	timestamp: 'about 2 months ago',
	daystamp: ' 5 Jan 2021 11:38 AM',
	price: 1000,
	gumroad_fee: 60,
	tax_cents: 0,
	shipping_cents: 0,
	variants_price_cents: 0,
	currency: 'usd',
	order_id: 'FO8TXN-abc',
	license_key: '83DB262A-C19D3B06-A5235A6B-8C079166',
	access_revoked: false,
	partially_refunded: false,
	refunded: false,
	chargedback: false,
	disputed: false,
	sent_abandoned_cart_email: false,
	subscription_duration: 'monthly',
	formatted_display_price: '$10 a month',
	formatted_total_price: '$10 a month',
	utm_source: 'facebook',
};

export const subscriber = {
	id: 'P5ppE6H8XIjy2JSCgUhbAw==',
	email: 'calvin@gumroad.com',
	product_id: '0ssD7adjRklGBjS5cwlWPq==',
	product_name: 'Pencil Icon PSD',
	user_id: '3523953790232',
	user_email: 'calvin@gumroad.com',
	purchase_ids: ['O4pjE6H8XNjy2JSCgKhbAw=='],
	created_at: '2015-06-30T17:38:04Z',
	user_requested_cancellation_at: null,
	charge_occurrence_count: null,
	recurrence: 'monthly',
	cancelled_at: null,
	ended_at: null,
	failed_at: null,
	free_trial_ends_at: null,
	license_key: '85DB562A-C11D4B06-A2335A6B-8C079166',
	status: 'alive',
};

export const purchase = {
	id: 'FO8TXN-dvaYbBbahG97a-Q==',
	seller_id: 'kL0psVL2admJSYRNs-OCMg==',
	product_id: '32-nPAicqbLj8B_WswVlMw==',
	product_name: 'licenses demo product',
	permalink: 'QMGY',
	product_permalink: 'https://sahil.gumroad.com/l/pencil',
	email: 'customer@example.com',
	price: 0,
	gumroad_fee: 0,
	currency: 'usd',
	quantity: 1,
	discover_fee_charged: false,
	can_contact: true,
	referrer: 'direct',
	card: { visual: null, type: null },
	order_number: 524459935,
	sale_id: 'FO8TXN-dbxYaBdahG97Y-Q==',
	sale_timestamp: '2021-01-05T19:38:56Z',
	purchaser_id: '5550321502811',
	subscription_id: 'GDzW4_aBdQc-o7Gbjng7lw==',
	variants: '',
	license_key: '85DB562A-C11D4B06-A2335A6B-8C079166',
	is_multiseat_license: false,
	ip_country: 'United States',
	recurrence: 'monthly',
	is_gift_receiver_purchase: false,
	refunded: false,
	disputed: false,
	dispute_won: false,
	created_at: '2021-01-05T19:38:56Z',
	custom_fields: [],
	chargebacked: false,
	subscription_ended_at: null,
	subscription_cancelled_at: null,
	subscription_failed_at: null,
};

export function errorBody(message: string) {
	return { success: false, message };
}

export const offerCode = {
	id: 'mN7CdHiwHaR9FlxKvF-n-g==',
	name: '1OFF',
	amount_cents: 100,
	max_purchase_count: null,
	minimum_amount_cents: null,
	universal: false,
	currency_type: 'usd',
	auto_apply: false,
	sale_label: null,
	valid_at: null,
	expires_at: null,
	times_used: 1,
};

export const variantCategory = {
	id: 'mN7CdHiwHaR9FlxKvF-n-g==',
	title: 'colors',
};

export const variant = {
	id: 'lSC1XVfr2TC3WoCGY7YrUg==',
	max_purchase_count: null,
	name: 'red',
	price_difference_cents: 100,
};

export const customField = {
	name: 'phone number',
	required: 'false',
};

export const email = {
	id: 'bfi_30HLgGWL8H2wo_Gzlg==',
	subject: 'Launch update',
	message: '<p>Hello, world!</p>',
	audience_type: 'audience',
	product_id: null,
	state: 'draft',
	published_at: null,
	scheduled_at: null,
	send_emails: true,
	shown_on_profile: false,
	audience_count: null,
	recipients_count: null,
	url: null,
	created_at: '2026-06-17T12:00:00.000Z',
	updated_at: '2026-06-17T12:00:00.000Z',
};

export const workflowEmail = {
	...email,
	delay: { amount: 1, unit: 'day' },
	sent_count: 100,
	open_count: 42,
	open_rate: 42.0,
	click_count: 8,
	click_rate: 8.0,
};

export const workflow = {
	id: '0ssD7B0cF6B5XQd3J7lY2A==',
	name: 'Customer onboarding',
	audience_type: 'product',
	trigger: null,
	product_id: 'A-m3CDDC5dlrSdKZp0RFhA==',
	variant_id: null,
	state: 'published',
	published_at: '2026-07-10T12:00:00.000Z',
	first_published_at: '2026-07-10T12:00:00.000Z',
	send_to_past_customers: true,
	emails_count: 2,
	filters: { paid_more_than: '20' },
	created_at: '2026-07-10T11:45:00.000Z',
	updated_at: '2026-07-10T12:00:00.000Z',
	emails: [workflowEmail],
};

export const mediaFile = {
	id: 'k7m2q9x4tb1zn6dw',
	name: 'logo',
	extension: 'PNG',
	file_size: 18422,
	url: 'https://public-files.gumroad.com/abc123/logo.png',
	status: { type: 'saved' },
	file_group: 'image',
	created_at: '2026-03-01T12:00:00Z',
};

export const resourceSubscription = {
	id: 'G_-mnBf9b1j9A7a4ub4nFQ==',
	resource_name: 'sale',
	post_url: 'https://postatmebro.com',
};

export const payout = {
	id: 'fEGTaEpuKDsnDvf_MfecTA==',
	amount: '150.00',
	currency: 'USD',
	status: 'completed',
	created_at: '2021-01-15T19:38:56Z',
	processed_at: '2021-01-16T10:15:30Z',
	payment_processor: 'stripe',
	bank_account_visual: '******1234',
	paypal_email: null,
	sales: ['A-m3CDDC5dlrSdKZp0RFhA=='],
	refunded_sales: [],
	disputed_sales: [],
	transactions: [
		{
			type: 'Sale',
			date: '2021-01-04',
			purchase_id: 'A-m3CDDC5dlrSdKZp0RFhA==',
			item_name: 'Beautiful widget',
			buyer_name: 'Jane Doe',
			buyer_email: 'jane@example.com',
			taxes: 0.0,
			shipping: 0.0,
			sale_price: 200.0,
			gumroad_fees: 26.6,
			net_total: 173.4,
		},
	],
};

export const taxForm = {
	tax_year: 2025,
	tax_form_type: 'us_1099_k',
	filed_at: '2026-01-31T00:00:00Z',
};

export const category = {
	id: 123,
	name: 'figma',
	label: 'Figma',
	path: 'design/ui-and-web/figma',
	parent_id: 122,
};

export const review = {
	id: 'sJ8Yx3d6mUL1kQpVbHnZ2g==',
	rating: 5,
	message: 'Exactly what I needed for my workflow.',
	created_at: '2026-03-01T12:00:00Z',
	purchase_id: 'kL9nR2sTvW4xY7zA1bC3dE==',
	rater_name: 'Avery',
	response: { message: 'Thank you!', created_at: '2026-03-02T09:14:00Z' },
};

export const user = {
	bio: 'a sailor, a tailor',
	name: 'John Smith',
	twitter_handle: null,
	user_id: 'G_-mnBf9b1j9A7a4ub4nFQ==',
	email: 'johnsmith@gumroad.com',
	url: 'https://gumroad.com/sailorjohn',
	profile_picture_url: 'https://assets.gumroad.com/user/abc/avatar',
};

export const refundPolicy = {
	refund_period: '30',
	title: '30-day money back guarantee',
	fine_print: 'Refund requests are reviewed within 2 business days.',
	in_effect: true,
};

export const cover = {
	id: 'abc123',
	url: 'https://www.youtube.com/embed/qKebcV1jv3A?feature=oembed&enablejsapi=1',
	original_url:
		'https://www.youtube.com/embed/qKebcV1jv3A?feature=oembed&enablejsapi=1',
	thumbnail: 'https://i.ytimg.com/vi/qKebcV1jv3A/hqdefault.jpg',
	type: 'oembed',
	filetype: null,
	width: 670,
	height: 377,
	native_width: 1280,
	native_height: 720,
};

export const publicProduct = {
	api_version: 1,
	id: 'A-m3CDDC5dlrSdKZp0RFhA==',
	permalink: 'pencil',
	name: 'Pencil Icon PSD',
	native_type: 'digital',
	url: 'https://sahil.gumroad.com/l/pencil',
	thumbnail_url: 'https://public-files.gumroad.com/variants/abc/def',
	created_at: '2024-01-01T00:00:00Z',
	updated_at: '2024-02-01T00:00:00Z',
	seller: {
		id: 'G_-mnBf9b1j9A7a4ub4nFQ==',
		name: 'Sahil',
		avatar_url: 'https://public-files.gumroad.com/user/abc/avatar',
		profile_url: 'https://sahil.gumroad.com',
		is_verified: true,
	},
	price_cents: 100,
	currency_code: 'usd',
	price_formatted: '$1',
	is_pay_what_you_want: false,
	suggested_price_cents: null,
	is_recurring_billing: false,
	is_tiered_membership: false,
	recurrences: null,
	free_trial: null,
	description_html: '<p>I made this for fun.</p>',
	summary: "You'll get one PSD file.",
	covers: [],
	attributes: [{ name: 'Format', value: 'PSD' }],
	ratings: { count: 12, average: 4.5, percentages: [0, 0, 8, 34, 58] },
	reviews: [
		{
			id: 'rev_abc123',
			rating: 5,
			message: 'Exactly what I needed.',
			rater: {
				name: 'Alex',
				avatar_url: 'https://public-files.gumroad.com/user/xyz/avatar',
			},
			created_at: '2024-01-15T12:00:00Z',
			response: { message: 'Thanks Alex!' },
		},
	],
	sales_count: null,
	options: [],
	quantity_remaining: null,
	is_quantity_enabled: false,
	is_sales_limited: false,
	is_published: true,
	is_physical: false,
	refund_policy: {
		title: '30-day money back guarantee',
		fine_print: null,
		updated_at: '2024-01-01',
	},
};

export const publicProfile = {
	api_version: 1,
	id: 'G_-mnBf9b1j9A7a4ub4nFQ==',
	username: 'sahil',
	name: 'Sahil',
	bio: 'I make tools for creators.',
	avatar_url: 'https://public-files.gumroad.com/user/abc/avatar',
	profile_url: 'https://sahil.gumroad.com',
	subdomain: 'sahil.gumroad.com',
	twitter_handle: 'shl',
	is_verified: true,
	products: [publicProduct],
};
