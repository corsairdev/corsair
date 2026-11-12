/**
 * Response bodies for the tests, from the per-method pages under
 * https://www.unisender.com/ru/support/api/ and the live API at
 * https://api.unisender.com.
 */

export const LISTS = {
	result: [
		{ id: 55688, title: 'My list number 1' },
		{ id: 224589, title: 'My second list' },
	],
};

export const LIST_CREATED = { result: { id: 910011 } };

// The documented success is an empty acknowledgement, not a record.
/** Captured live 11-12: a delete answers an empty object, not an empty string. */
export const LIST_DELETED = { result: {} };

/** `email` is an object here, not a string, and carries the status. */
export const CONTACT = {
	result: {
		email: {
			email: 'test@example.org',
			added_at: '2026-05-01 10:00:00',
			status: 'active',
		},
		lists: [{ id: 55688, title: 'My list number 1' }],
		fields: [{ id: 21575, name: 'Name', type: 'string' }],
		details: { source: 'api' },
	},
};

// A new contact with the default double opt-in is invited, not active.
export const CONTACT_INVITED = {
	result: {
		email: { email: 'new@example.org', status: 'invited' },
		person: { id: 42 },
	},
};

export const SUBSCRIBED = {
	result: {
		person: { id: 42 },
		email: { email: 'test@example.org', status: 'active' },
	},
};

export const UNSUBSCRIBED = {
	result: {
		email: { email: 'test@example.org', status: 'unsubscribed' },
	},
};

export const EXCLUDED = { result: { excluded: 1 } };

/** An import answers a map keyed by list id, with counts per outcome. */
export const IMPORTED = {
	result: {
		'55688': {
			created: 3,
			updated: 1,
			skipped: 1,
			invalid: 0,
			errors: ['Contact sales@example.org skipped: role address'],
		},
	},
};

export const CONTACT_COUNT = {
	result: {
		listId: 55688,
		count: 1234,
		searchParams: { type: 'address' },
	},
};

export const EXPORT_REQUESTED = { result: { exported: 1 } };

export const FIELDS = {
	result: [
		{ id: 21575, name: 'Name', type: 'string', is_visible: 1, view_pos: 1 },
		{ id: 1255, name: 'Lastname', type: 'string', is_visible: 1, view_pos: 2 },
	],
};

export const FIELD_CREATED = { result: { id: 33110 } };

/** Captured live 11-12, same as deleteList. */
export const FIELD_DELETED = { result: {} };

export const TAGS = {
	result: [
		{ id: 123, name: 'important customers' },
		{ id: 456, name: 'very important customers' },
	],
};

/** `sendEmail` answers an array of per-recipient results. */
export const EMAIL_SENT = {
	result: [{ email_id: 8811223, email: 'test@example.org', message_id: 991 }],
};

export const EMAIL_STATUSES = {
	result: {
		statuses: [
			{ id: 8811223, status: 'ok_delivered' },
			{ id: 8811224, status: 'err_mailbox_do_not_exist' },
			{ id: 8811225, status: 'not_sent' },
		],
	},
};

export const EMAIL_CREATED = { result: { message_id: 7711223 } };

export const CAMPAIGN_CREATED = {
	result: { campaign_id: 665544, status: 'scheduled' },
};

export const CAMPAIGNS = {
	result: [
		{
			id: 665544,
			start_time: '2026-05-01 10:00:00',
			status: 'scheduled',
			subject: 'Spring news',
			sender_name: 'Example',
			sender_email: 'news@example.org',
			message_id: 7711223,
			lists: [55688],
		},
	],
};

/** `result` set to an empty object, which is a valid success for a void method. */
export const VOID_RESULT = { result: {} };

// Live: a wrong key.
export const INVALID_KEY = {
	error:
		"Error ID:8446F32E-DD8D-11F1-8290-667BEC9936B7. There is no user with api_key 'BADKEY'",
	code: 'invalid_api_key',
};

// Live: no key at all, which is 403 rather than 401.
export const ACCESS_DENIED = {
	error: 'Error ID:84998422-DD8D-11F1-A9CD-B250F0C8F006. Access Denied.',
	code: 'access_denied',
};

export const UNKNOWN_METHOD = {
	error: 'Error ID:abc. Unknown method.',
	code: 'unknown_method',
};

export const INVALID_ARG = {
	error: 'Error ID:def. Invalid email address.',
	code: 'invalid_arg',
};

export const NOT_ENOUGH_MONEY = {
	error: 'Error ID:ghi. Not enough money on the balance.',
	code: 'not_enough_money',
};

export const RATE_LIMITED = {
	error: 'Error ID:jkl. Too many calls.',
	code: 'api_call_limit_exceeded_for_api_key',
};

export const RETRY_LATER = {
	error: 'Error ID:mno. Temporary failure, try again later.',
	code: 'retry_later',
};

/** sendEmail with `cc`: an array whose entries carry a string `id`, not `email_id`. */
export const EMAIL_SENT_WITH_CC = {
	result: [
		{ index: 0, email: 'test@example.org', id: '1p5Ktm-0007Ab-3C' },
		{ index: 1, email: 'copy@example.org', id: '1p5Ktm-0007Ab-3D' },
	],
};
