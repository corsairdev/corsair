// Payment bodies in the shape Ko-fi documents
// (https://help.ko-fi.com/hc/en-us/articles/360004162298) and its AsyncAPI
// description. `amount` is a decimal string, which is the detail most likely to
// be typed wrongly.

export const TOKEN = 'kofi-verification-token';

export const donation = {
	verification_token: TOKEN,
	message_id: '3a1fac0c-f960-4506-a60e-824979a74e74',
	timestamp: '2026-11-05T14:22:31Z',
	type: 'Donation',
	is_public: true,
	from_name: 'Jo Example',
	message: 'Great work!',
	amount: '5.00',
	url: 'https://ko-fi.com/Home/CoffeeShop?txid=00000000-1111-2222-3333-444444444444',
	email: 'jo@example.com',
	currency: 'USD',
	is_subscription_payment: false,
	is_first_subscription_payment: false,
	kofi_transaction_id: '00000000-1111-2222-3333-444444444444',
	tier_name: null,
	shop_items: null,
	shipping: null,
};

export const subscriptionPayment = {
	verification_token: TOKEN,
	message_id: '41d4a12e-9b3a-4b1e-8d0f-2c7e5b6a1234',
	timestamp: '2026-11-05T14:25:10Z',
	type: 'Subscription',
	is_public: true,
	from_name: 'Sam Member',
	message: null,
	amount: '6.00',
	url: 'https://ko-fi.com/Home/CoffeeShop?txid=55555555-6666-7777-8888-999999999999',
	email: 'sam@example.com',
	currency: 'USD',
	is_subscription_payment: true,
	is_first_subscription_payment: true,
	kofi_transaction_id: '55555555-6666-7777-8888-999999999999',
	tier_name: 'Gold Tier',
	shop_items: null,
	shipping: null,
};

export const shopOrder = {
	verification_token: TOKEN,
	message_id: '8f2b6c11-77aa-4c33-9b21-abcabcabcabc',
	timestamp: '2026-11-05T14:30:00Z',
	type: 'Shop Order',
	is_public: true,
	from_name: 'Pat Buyer',
	message: null,
	amount: '25.00',
	url: 'https://ko-fi.com/Home/CoffeeShop?txid=aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
	email: 'pat@example.com',
	currency: 'USD',
	is_subscription_payment: false,
	is_first_subscription_payment: false,
	kofi_transaction_id: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
	tier_name: null,
	shop_items: [
		{ direct_link_code: 'b1e2c3d4e5', variation_name: 'Large', quantity: 1 },
	],
	shipping: {
		full_name: 'Pat Buyer',
		street_address: '123 Example St',
		city: 'Anytown',
		state_or_province: 'CA',
		postal_code: '90000',
		country: 'United States',
		country_code: 'US',
		telephone: '+1-555-0100',
	},
};

export const commission = {
	verification_token: TOKEN,
	message_id: 'cccccccc-dddd-eeee-ffff-000000000000',
	timestamp: '2026-11-05T14:35:00Z',
	type: 'Commission',
	is_public: false,
	from_name: 'Robin Client',
	message: null,
	amount: '120.00',
	url: 'https://ko-fi.com/Home/CoffeeShop?txid=11111111-2222-3333-4444-555555555555',
	email: 'robin@example.com',
	currency: 'GBP',
	is_subscription_payment: false,
	is_first_subscription_payment: false,
	kofi_transaction_id: '11111111-2222-3333-4444-555555555555',
	tier_name: null,
	shop_items: null,
	shipping: null,
};

/**
 * The documented transport: one `data` form field whose value is the payment
 * JSON. This is what Ko-fi actually posts.
 */
export function formBody(payment: object): string {
	return new URLSearchParams({ data: JSON.stringify(payment) }).toString();
}

/** A delivery whose token does not match the stored one. */
export const wrongToken = { ...donation, verification_token: 'not-the-token' };
