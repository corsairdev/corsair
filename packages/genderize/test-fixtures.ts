// Shapes taken from Genderize's API reference (https://genderize.io/documentation/api)
// and live probes. A name it does not know answers 200 with `gender: null`, so
// a null prediction is a fixture rather than an error.

export const prediction = {
	name: 'Alice',
	gender: 'female',
	probability: 0.99,
	count: 399418,
};

export const predictionMale = {
	name: 'Bob',
	gender: 'male',
	probability: 0.99,
	count: 535081,
};

/** The echo when the request was scoped to a country: `Alice` is `Kim`-like here. */
export const localizedPrediction = {
	name: 'kim',
	gender: 'male',
	country_id: 'DK',
	probability: 0.97,
	count: 196601,
};

/** A name the data set does not know. This is a result, not a failure. */
export const unknownPrediction = {
	name: 'Xyzzyplugh',
	gender: null,
	probability: 0,
	count: 0,
};

export const batch = [
	prediction,
	predictionMale,
	{ name: 'Stewie', gender: 'male', probability: 0.94, count: 592 },
];

/** The `{ error }` envelope, which every failure carries. */
export const invalidKey = { error: 'Invalid API key' };
export const subscriptionInactive = { error: 'Subscription is not active' };
export const missingName = { error: "Missing 'name' parameter" };
export const invalidName = { error: "Invalid 'name' parameter" };
export const quotaReached = { error: 'Request limit reached' };
export const requestTooLow = {
	error: 'Request limit too low to process request',
};
