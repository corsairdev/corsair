// Shapes taken from Gender API's v1 reference (https://gender-api.com/en/api-docs)
// and live probes. Every answer, success or failure, carries `errno`; a good one
// carries 0, and a refused key arrives with HTTP 200.

export const alice = {
	name: 'alice',
	name_sanitized: 'Alice',
	gender: 'female',
	samples: 523,
	accuracy: 93,
	duration: '41ms',
	credits_used: 1,
};

/** `Andrea` is male in Italy and female in Germany, which is the point of `country`. */
export const andreaItaly = {
	name: 'andrea',
	name_sanitized: 'Andrea',
	country: 'IT',
	gender: 'male',
	samples: 1068,
	accuracy: 95,
	duration: '15ms',
	credits_used: 1,
};

export const andreaGermany = {
	name: 'andrea',
	name_sanitized: 'Andrea',
	country: 'DE',
	gender: 'female',
	samples: 4089,
	accuracy: 85,
	duration: '33ms',
	credits_used: 1,
};

/** A name with too little data still answers, with `unknown`. */
export const unknownGender = {
	name: 'xyzzyplugh',
	name_sanitized: 'Xyzzyplugh',
	gender: 'unknown',
	samples: 0,
	accuracy: 0,
	duration: '18ms',
	credits_used: 1,
};

export const multi = {
	name: 'lisa;jess;thomas',
	result: [
		{
			name: 'lisa',
			name_sanitized: 'Lisa',
			country: '',
			gender: 'female',
			samples: 806,
			accuracy: 98,
		},
		{
			name: 'jess',
			name_sanitized: 'Jess',
			country: '',
			gender: 'female',
			samples: 28,
			accuracy: 75,
		},
		{
			name: 'thomas',
			name_sanitized: 'Thomas',
			country: '',
			gender: 'male',
			samples: 2239,
			accuracy: 99,
		},
	],
	country: '',
	duration: '425ms',
	credits_used: 3,
};

export const emailLookup = {
	email: 'markus.johnson@gmail.com',
	last_name: 'Johnson',
	first_name: 'Markus',
	mail_provider: 'gmail',
	name: 'markus',
	name_sanitized: 'Markus',
	country: '',
	gender: 'male',
	samples: 150,
	accuracy: 99,
	duration: '669ms',
	credits_used: 1,
};

export const splitName = {
	last_name: 'Miller',
	first_name: 'Theresa',
	strict: false,
	name: 'theresa',
	name_sanitized: 'Theresa',
	country: '',
	gender: 'female',
	samples: 70,
	accuracy: 74,
	duration: '56ms',
	credits_used: 1,
};

/** Under `strict`, a last name that is not in the database comes back null. */
export const splitNameStrict = {
	last_name: null,
	first_name: 'Markus Stefan',
	strict: true,
	name: 'markus',
	name_sanitized: 'Markus',
	country: '',
	gender: 'male',
	samples: 0,
	accuracy: 0,
	duration: '42ms',
	credits_used: 1,
};

export const countryOfOrigin = {
	name: 'markus',
	country_of_origin: [
		{
			countryName: 'Finland',
			country: 'FI',
			probability: 0.74,
			continentalRegion: 'Europe',
			statisticalRegion: 'Northern Europe',
		},
		{
			countryName: 'Sweden',
			country: 'SE',
			probability: 0.22,
			continentalRegion: 'Europe',
			statisticalRegion: 'Northern Europe',
		},
		{
			countryName: 'Other',
			country: '--',
			probability: 0.04,
		},
	],
	name_sanitized: 'Markus',
	gender: 'male',
	samples: 150,
	accuracy: 99,
	country_of_origin_map_url:
		'https://gender-api.com/en/map/37/3da90b0fe64e5102',
	credits_used: 2,
	duration: '165ms',
};

/**
 * The live route (11-14) answers the entries in snake_case, not the camelCase
 * its documentation shows. Trimmed from a real response for "Markus".
 */
export const countryOfOriginLive = {
	name: 'markus',
	country_of_origin: [
		{
			country_name: 'Germany',
			country: 'DE',
			probability: 0.32,
			continental_region: 'Europe',
			statistical_region: 'Western Europe',
		},
		{
			country_name: 'Austria',
			country: 'AT',
			probability: 0.19,
			continental_region: 'Europe',
			statistical_region: 'Western Europe',
		},
	],
	name_sanitized: 'Markus',
	gender: 'male',
	samples: 30782,
	accuracy: 99,
	country_of_origin_map_url:
		'https://gender-api.com/en/map/203768901/2aa9ab16aa5d2edf',
	credits_used: 2,
	duration: '79ms',
};

/**
 * What the live route (11-14) answers under `strict` for a last name it does
 * not know: an empty string, as in the documented example, not null.
 */
export const splitNameStrictLive = {
	last_name: '',
	first_name: 'Markus',
	strict: true,
	name: 'markus',
	name_sanitized: 'Markus',
	country: '',
	gender: 'male',
	samples: 30782,
	accuracy: 99,
	duration: '83ms',
	credits_used: 1,
};

export const stats = {
	key: 'yourkey',
	is_limit_reached: false,
	remaining_requests: 43566,
	amount_month_start: 90000,
	amount_month_bought: 100000,
	duration: '37ms',
};

/** The failure envelope a live probe returned with HTTP 200. */
export const invalidKeyOn200 = {
	name: 'alice',
	errno: 40,
	errmsg: 'invalid or missing key',
	gender: 'unknown',
	samples: 0,
	accuracy: 0,
	duration: '30ms',
	credits_used: 1,
};

/** The stats route answers the same shape, without the name fields. */
export const invalidKeyOnStats = {
	errmsg: 'invalid or missing key',
	errno: 40,
	duration: '26ms',
};

export const limitReached = {
	name: 'markus',
	country_of_origin: [],
	errno: 30,
	errmsg: 'limit reached.',
	upgrade_url: 'https://gender-api.com/en/pricing?from=api-limit',
	duration: '121ms',
};

export const nameNotSet = {
	name: '',
	errno: 20,
	errmsg: 'name not set',
	gender: 'unknown',
	samples: 0,
	accuracy: 0,
	duration: '17ms',
	credits_used: 1,
};

export const invalidCountry = {
	name: 'kim',
	errno: 10,
	errmsg: 'invalid country code',
	gender: 'unknown',
	samples: 0,
	accuracy: 0,
};

export const tooManyNames = {
	name: '',
	errno: 21,
	errmsg: 'too many names',
	gender: 'unknown',
	samples: 0,
	accuracy: 0,
};

export const internalError = {
	name: 'alice',
	errno: 500,
	errmsg: 'unknown error',
	gender: 'unknown',
	samples: 0,
	accuracy: 0,
};
