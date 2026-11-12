// Shapes taken from Kraken's docs (https://kraken.io/docs) and its live error
// envelopes. Quota figures are bytes, and an optimization that fails per file
// answers `success: false` inside a 200.

export const optimized = {
	success: true,
	id: 'a1b2c3d4',
	original_size: 124000,
	kraked_size: 48210,
	saved_bytes: 75790,
	results: {
		'header.jpg': {
			success: true,
			file_name: 'header.jpg',
			original_size: 124000,
			kraked_size: 48210,
			saved_bytes: 75790,
			original_width: 1200,
			original_height: 630,
			kraked_width: 800,
			kraked_height: 420,
			kraked_url: 'https://dl.kraken.io/a1b2c3d4/header-4f2a1b.jpg',
			message: null,
		},
	},
};

/** A request accepted for a callback, which answers without a result yet. */
export const queued = {
	success: true,
	id: 'e5f6a7b8',
	message: 'Callback will be sent to the specified URL',
};

/** One file Kraken could not optimize, inside an otherwise successful answer. */
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
