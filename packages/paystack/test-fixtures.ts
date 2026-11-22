/**
 * Response fixtures shaped after the examples in the Paystack API docs
 * (paystack.com/docs/api) and webhook payloads.
 */

export const invalidKey = {
	status: false,
	message: 'Invalid key',
	meta: {
		nextStep:
			'Ensure that you provide the correct authorization key for the request',
	},
	type: 'validation_error',
	code: 'invalid_Key',
};

export const initializedTransaction = {
	status: true,
	message: 'Authorization URL created',
	data: {
		authorization_url: 'https://checkout.paystack.com/0peioxfhpn',
		access_code: '0peioxfhpn',
		reference: '7PVGX8MEk85tgeEpVDtD',
	},
};

export const LIST_META = {
	total: 1,
	page: 1,
	perPage: 50,
	pageCount: 1,
	next: null,
	previous: null,
};

export const transaction = {
	id: 30920911,
	reference: '7PVGX8MEk85tgeEpVDtD',
	amount: 10000,
	currency: 'NGN',
	status: 'success',
	gateway_response: 'Successful',
	channel: 'card',
	customer: { id: 8456302, email: 'john.doe@example.com' },
	authorization: { authorization_code: 'AUTH_xxx' },
	created_at: '2020-07-15T19:09:35.000Z',
};

export const customer = {
	id: 8456302,
	email: 'john.doe@example.com',
	customer_code: 'CUS_1idh4psjybv',
	first_name: 'John',
	last_name: 'Doe',
	phone: '+23481234567890',
	risk_action: 'default',
	created_at: '2020-07-15T19:09:35.000Z',
};

export const plan = {
	id: 130,
	plan_code: 'PLN_0peioxfhpn',
	name: 'Monthly Retainer',
	amount: 50000,
	interval: 'monthly',
	description: 'Monthly retainer for the design work',
	currency: 'NGN',
	created_at: '2020-07-15T19:09:35.000Z',
};

export const subscription = {
	id: 305,
	subscription_code: 'SUB_vsy260vl9vvrcv9',
	status: 'active',
	next_payment_date: '2020-08-15T00:30:13.000Z',
	email_token: 'uhslf0re31yqu1w2x21d',
	customer: { id: 8456302, email: 'john.doe@example.com' },
	plan,
};

export const refund = {
	id: 1088,
	transaction_reference: '7PVGX8MEk85tgeEpVDtD',
	amount: 10000,
	currency: 'NGN',
	status: 'pending',
	customer_note: 'Thank you for the refund',
	merchant_note: 'Refund for damaged goods',
	created_at: '2020-07-15T19:10:00.000Z',
};

export const successEnvelope = {
	status: true,
	message: 'Subscription enabled successfully',
};

/** A charge.success delivery body. */
export const webhookEvent = {
	event: 'charge.success',
	data: {
		reference: '7PVGX8MEk85tgeEpVDtD',
		amount: 10000,
		status: 'success',
	},
};
