// Shapes taken from Kraken's docs (https://kraken.io/docs) and its live error
// envelopes. Quota figures are bytes, and an optimization that fails per file
// answers `success: false` inside a 200.

// A `wait` call on one file answers flat, as in https://kraken.io/docs/wait-callback.
export const optimized = {
	success: true,
	file_name: 'header.jpg',
	original_size: 324520,
	kraked_size: 165358,
	saved_bytes: 159162,
	kraked_url:
		'https://dl.kraken.io/d1/aa/cd/2a2280c2ffc7b4906a09f78f46/header.jpg',
};

/** A request accepted for a callback answers only the job id. */
export const queued = {
	id: '18fede37617a787649c3f60b9f1f280d',
};

/** One size Kraken could not produce in a multi-size answer, keyed by its id. */
export const partiallyFailed = {
	success: true,
	id: 'c9d0e1f2',
	original_size: 124000,
	kraked_size: 0,
	saved_bytes: 0,
	results: {
		'header.jpg': {
			success: false,
			file_name: 'header.jpg',
			message: 'Unable to download the image',
		},
	},
};

export const accountStatus = {
	success: true,
	active: true,
	plan_name: 'Enterprise',
	quota_total: 64424509440,
	quota_used: 313271610,
	quota_remaining: 64111237830,
};

/** `/user_status` without auth, as the route probe saw it on 11-14 (400). */
export const userStatusNoAuth = {
	success: false,
	error:
		'Incoming request body does not contain a valid auth.api_key or auth.api_secret',
};

/** `/user_status` with a wrong secret or key, seen live on 11-14 (404). */
export const userNotFound = { success: false, error: 'User not found' };

/** The 401 body for a key Kraken does not know. */
export const unknownKey = {
	message: 'Unknown API Key. Please check your API key and try again.',
	success: false,
};

/** A request missing a required field. */
export const authRequired = { message: 'auth is required', success: false };

/** A request with neither `wait` nor a callback. */
export const waitRequired = {
	message: 'You need to specify one of callback_url or wait flags',
	success: false,
};

/** The 200 that still says the optimization failed. */
export const refusedOn200 = {
	success: false,
	message: 'This image format is not supported',
};

/** A spent quota or a plan that does not allow the request. */
export const quotaExceeded = {
	success: false,
	message: 'Your account quota has been exceeded',
};
