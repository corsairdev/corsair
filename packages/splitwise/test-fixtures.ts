/**
 * Bodies the live Splitwise API answers with, trimmed to the fields the plugin
 * reads. Amounts are strings because that is how Splitwise sends money.
 */

export const currentUser = {
	user: {
		id: 270896089,
		first_name: 'Ada',
		last_name: 'Lovelace',
		email: 'ada@example.com',
		registration_status: 'confirmed',
		picture: {
			small:
				'https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-blue6-50px.png',
			medium:
				'https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-blue6-100px.png',
			large:
				'https://s3.amazonaws.com/splitwise/uploads/user/default_avatars/avatar-blue6-200px.png',
		},
		custom_picture: false,
		notifications_read: '2026-05-01T20:21:57Z',
		notifications_count: 3,
		notifications: { added_as_friend: true, added_to_group: true },
		default_currency: 'USD',
		locale: 'en',
	},
};

export const otherUser = {
	user: {
		id: 491923,
		first_name: 'Grace',
		last_name: 'Hopper',
		email: 'grace@example.com',
		registration_status: 'confirmed',
		picture: { medium: null },
		custom_picture: false,
	},
};

export const group = {
	id: 321,
	name: 'Housemates 2026',
	group_type: 'home',
	updated_at: '2026-05-02T10:00:00Z',
	simplify_by_default: false,
	members: [
		{
			id: 270896089,
			first_name: 'Ada',
			last_name: 'Lovelace',
			email: 'ada@example.com',
			registration_status: 'confirmed',
			picture: { medium: null },
			custom_picture: false,
			balance: [{ currency_code: 'USD', amount: '-5.02' }],
		},
		{
			id: 491923,
			first_name: 'Grace',
			last_name: 'Hopper',
			email: 'grace@example.com',
			registration_status: 'confirmed',
			picture: { medium: null },
			custom_picture: false,
			balance: [{ currency_code: 'USD', amount: '5.02' }],
		},
	],
	original_debts: [
		{ from: 270896089, to: 491923, amount: '5.02', currency_code: 'USD' },
	],
	simplified_debts: [
		{ from: 270896089, to: 491923, amount: '5.02', currency_code: 'USD' },
	],
	avatar: {
		original: null,
		xxlarge:
			'https://s3.amazonaws.com/splitwise/uploads/group/default_avatars/avatar-ruby2-house-1000px.png',
		xlarge:
			'https://s3.amazonaws.com/splitwise/uploads/group/default_avatars/avatar-ruby2-house-500px.png',
		large:
			'https://s3.amazonaws.com/splitwise/uploads/group/default_avatars/avatar-ruby2-house-200px.png',
		medium:
			'https://s3.amazonaws.com/splitwise/uploads/group/default_avatars/avatar-ruby2-house-100px.png',
		small:
			'https://s3.amazonaws.com/splitwise/uploads/group/default_avatars/avatar-ruby2-house-50px.png',
	},
	custom_avatar: false,
	cover_photo: { original: null, xxlarge: null },
};

export const emptyGroup = {
	id: 322,
	name: 'Empty',
	group_type: null,
	updated_at: null,
	simplify_by_default: null,
	members: null,
	original_debts: null,
	simplified_debts: null,
	avatar: null,
	custom_avatar: null,
	cover_photo: null,
};

export const friend = {
	id: 491923,
	first_name: 'Grace',
	last_name: 'Hopper',
	email: 'grace@example.com',
	registration_status: 'confirmed',
	picture: { medium: null },
	custom_picture: false,
	groups: [
		{
			group_id: 321,
			balance: [{ currency_code: 'USD', amount: '5.02' }],
		},
	],
	balance: [{ currency_code: 'USD', amount: '5.02' }],
	updated_at: '2026-05-02T10:00:00Z',
};

/** An expense outside any group: `group_id` and `friendship_id` are null. */
export const expense = {
	id: 51023,
	group_id: null,
	friendship_id: 4818,
	expense_bundle_id: null,
	description: 'Brunch',
	details: null,
	cost: '25.0',
	currency_code: 'USD',
	date: '2026-05-02T13:00:00Z',
	created_at: '2026-05-02T13:01:00Z',
	created_by: { id: 270896089, first_name: 'Ada', last_name: 'Lovelace' },
	updated_at: '2026-05-02T13:01:00Z',
	updated_by: { id: 270896089, first_name: 'Ada', last_name: 'Lovelace' },
	deleted_at: null,
	deleted_by: null,
	category: { id: 15, name: 'Dining out' },
	receipt: { large: null, original: null },
	repeats: false,
	repeat_interval: 'never',
	email_reminder: false,
	email_reminder_in_advance: null,
	next_repeat: null,
	comments_count: 0,
	payment: false,
	transaction_confirmed: false,
	repayments: [{ from: 491923, to: 270896089, amount: '12.5' }],
	users: [
		{
			user: { id: 270896089, first_name: 'Ada', last_name: 'Lovelace' },
			user_id: 270896089,
			paid_share: '25.0',
			owed_share: '12.5',
			net_balance: '12.5',
		},
		{
			user: { id: 491923, first_name: 'Grace', last_name: 'Hopper' },
			user_id: 491923,
			paid_share: '0.0',
			owed_share: '12.5',
			net_balance: '-12.5',
		},
	],
	comments: [],
};

export const comment = {
	id: 79800950,
	content: 'Does this include the delivery fee?',
	comment_type: 'User',
	relation_type: 'ExpenseComment',
	relation_id: 51023,
	created_at: '2026-05-02T14:00:00Z',
	deleted_at: null,
	user: {
		id: 270896089,
		first_name: 'Ada',
		last_name: 'Lovelace',
		picture: { medium: null },
	},
};

export const notification = {
	id: 32514315,
	type: 0,
	created_at: '2026-05-02T14:00:00Z',
	created_by: 2,
	source: { type: 'Expense', id: 51023, url: null },
	image_url:
		'https://s3.amazonaws.com/splitwise/uploads/notifications/v2/0-venmo.png',
	image_shape: 'square',
	content: '<strong>You</strong> paid <strong>Grace H.</strong>.',
};

export const currency = { currency_code: 'USD', unit: '$' };

export const parentCategory = {
	id: 1,
	name: 'Utilities',
	icon: 'https://s3.amazonaws.com/splitwise/uploads/category/icon/square/utilities/other.png',
	icon_types: {
		slim: {
			small:
				'https://s3.amazonaws.com/splitwise/uploads/category/icon/slim/utilities/other-20px.png',
			large:
				'https://s3.amazonaws.com/splitwise/uploads/category/icon/slim/utilities/other-40px.png',
		},
		square: {
			large:
				'https://s3.amazonaws.com/splitwise/uploads/category/icon/square/utilities/other-100px.png',
			xlarge:
				'https://s3.amazonaws.com/splitwise/uploads/category/icon/square/utilities/other-200px.png',
		},
	},
	subcategories: [
		{
			id: 48,
			name: 'Cleaning',
			icon: 'https://s3.amazonaws.com/splitwise/uploads/category/icon/square/utilities/cleaning.png',
			icon_types: { slim: {}, square: {} },
		},
	],
};

/** A successful conditional write. */
export const success = { success: true };

/** A conditional write that answered 200 and did not apply. */
export const failure = {
	success: false,
	errors: { base: ['The user has a non-zero balance'] },
};

/** `create_expense` accepted, with the created expense in an array. */
export const expenseCreated = { expenses: [expense], errors: {} };

/** `create_expense` answered 200 with a populated errors map. */
export const expenseRejected = {
	expenses: [],
	errors: { base: ['Cost must be greater than 0'] },
};

/** A 401, the one error body Splitwise sends as `{ error }`. */
export const unauthorized = {
	error: 'Invalid API Request: you are not logged in',
};

/** A 403 or 404, sent as `{ errors: { base: [...] } }`. */
export const forbidden = {
	errors: {
		base: [
			'Invalid API request: you do not have permission to perform that action',
		],
	},
};

export const notFound = {
	errors: { base: ['Invalid API Request: record not found'] },
};
